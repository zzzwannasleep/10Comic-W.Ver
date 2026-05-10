import { delay, request } from '@/utils'

const QUARK_HOSTS = {
  account: 'https://pan.quark.cn',
  drivePc: 'https://drive-pc.quark.cn',
  driveShare: 'https://drive-h.quark.cn'
}

const SHARE_PAGE_SIZE = 100
const SAVE_BATCH_SIZE = 100
const TASK_POLL_INTERVAL_SECONDS = 1.2
const TASK_MAX_ATTEMPTS = 60

const buildCommonParams = (params = {}) => {
  return {
    pr: 'ucpro',
    fr: 'pc',
    uc_param_str: '',
    __dt: Math.floor(Math.random() * 9000) + 1000,
    __t: Date.now(),
    ...params
  }
}

const buildUrl = (host, path, params = {}) => {
  const url = new URL(`${host}${path}`)
  const query = buildCommonParams(params)
  Object.keys(query).forEach((key) => {
    const value = query[key]
    if (value === undefined || value === null || value === '') {
      return
    }
    url.searchParams.set(key, String(value))
  })
  return url.toString()
}

const normalizeCookie = (cookie = '') => {
  return String(cookie || '')
    .replace(/\r?\n+/g, ' ')
    .trim()
}

const createBody = (payload = {}) => {
  const body = new URLSearchParams()
  Object.keys(payload).forEach((key) => {
    const value = payload[key]
    if (value === undefined || value === null || value === '') {
      return
    }
    if (Array.isArray(value) || typeof value === 'object') {
      body.set(key, JSON.stringify(value))
      return
    }
    body.set(key, String(value))
  })
  return body.toString()
}

const createHeaders = (referer, isPost = false) => {
  const headers = {
    accept: 'application/json, text/plain, */*',
    origin: 'https://pan.quark.cn',
    referer
  }

  if (isPost) {
    headers['content-type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
  }

  return headers
}

const parseJsonResponse = (response) => {
  if (!response || response === 'onerror' || response === 'timeout') {
    throw new Error('夸克请求失败，请稍后重试')
  }

  if (response.status && response.status >= 400) {
    throw new Error(`夸克请求失败 (${response.status})`)
  }

  const payload = response.response ?? response.responseText ?? response
  if (typeof payload === 'string') {
    return JSON.parse(payload)
  }
  return payload
}

const unwrapResponseData = (payload) => {
  if (!payload || typeof payload !== 'object') {
    throw new Error('夸克返回了无效数据')
  }

  const status = payload.status
  if (typeof status === 'number' && status !== 200) {
    throw new Error(payload.message || `夸克请求失败 (${status})`)
  }

  const code = payload.code
  if (typeof code === 'number' && code !== 0) {
    throw new Error(payload.message || `夸克接口返回错误 (${code})`)
  }

  return payload.data ?? payload
}

const quarkRequest = async({
  method = 'GET',
  host = QUARK_HOSTS.drivePc,
  path,
  params = {},
  data = null,
  cookie = '',
  referer = 'https://pan.quark.cn/'
}) => {
  const normalizedCookie = normalizeCookie(cookie)
  if (!normalizedCookie) {
    throw new Error('请先填写夸克 Cookie')
  }

  const upperMethod = method.toUpperCase()
  const response = await request({
    method: upperMethod,
    url: buildUrl(host, path, params),
    data: upperMethod === 'GET' || !data ? null : createBody(data),
    headers: createHeaders(referer, upperMethod !== 'GET'),
    cookie: normalizedCookie,
    timeout: 60 * 1000
  })
  return unwrapResponseData(parseJsonResponse(response))
}

const isFolderItem = (item) => {
  return item?.dir === true || item?.file_type === 0 || item?.obj_category === 'dir'
}

const getShareToken = async(cookie, shareId, passcode = '') => {
  const data = await quarkRequest({
    method: 'POST',
    host: QUARK_HOSTS.driveShare,
    path: '/1/clouddrive/share/sharepage/token',
    data: {
      pwd_id: shareId,
      passcode
    },
    cookie,
    referer: `https://pan.quark.cn/s/${shareId}`
  })

  const stoken = data.stoken || data.share_token || data.token
  if (!stoken) {
    throw new Error('未拿到分享令牌，Cookie 可能失效或分享链接需要验证')
  }

  return {
    ...data,
    stoken
  }
}

const getShareDetailPage = async(cookie, share, stoken, page = 1) => {
  return quarkRequest({
    method: 'GET',
    host: QUARK_HOSTS.driveShare,
    path: '/1/clouddrive/share/sharepage/detail',
    params: {
      pwd_id: share.shareId,
      stoken,
      pdir_fid: share.pdirFid || '0',
      _page: page,
      _size: SHARE_PAGE_SIZE,
      _fetch_total: 1,
      _fetch_banner: 0,
      _fetch_share: 1,
      _sort: 'file_type:asc,file_name:asc'
    },
    cookie,
    referer: `https://pan.quark.cn/s/${share.shareId}`
  })
}

const getTaskResult = async(cookie, taskId, retryIndex = 0) => {
  return quarkRequest({
    method: 'GET',
    host: QUARK_HOSTS.drivePc,
    path: '/1/clouddrive/task',
    params: {
      task_id: taskId,
      retry_index: retryIndex
    },
    cookie,
    referer: 'https://pan.quark.cn/'
  })
}

const waitForTask = async(cookie, taskId) => {
  for (let retryIndex = 0; retryIndex < TASK_MAX_ATTEMPTS; retryIndex += 1) {
    const task = await getTaskResult(cookie, taskId, retryIndex)
    const status = Number(task?.status)

    if (status === 2) {
      return task
    }

    if ([3, 4, -1].includes(status)) {
      throw new Error(task?.message || task?.title || '夸克转存任务失败')
    }

    await delay(TASK_POLL_INTERVAL_SECONDS)
  }

  throw new Error('夸克转存任务超时，请稍后去网盘确认结果')
}

const chunkItems = (items, size) => {
  const list = []
  for (let index = 0; index < items.length; index += size) {
    list.push(items.slice(index, index + size))
  }
  return list
}

const extractShareUrl = (text = '') => {
  const match = String(text).match(/https?:\/\/pan\.quark\.cn\/s\/[A-Za-z0-9]+(?:[^\s]*)?/i)
  return match ? match[0] : ''
}

const extractPasscode = (text = '', url = '') => {
  if (url) {
    try {
      const parsedUrl = new URL(url)
      const urlPasscode = parsedUrl.searchParams.get('pwd') || parsedUrl.searchParams.get('passcode')
      if (urlPasscode) {
        return urlPasscode.trim()
      }
    } catch (error) {
      //
    }
  }

  const match = String(text).match(/(?:提取码|密码|passcode|pwd)[：:\s=]*([A-Za-z0-9]{2,8})/i)
  return match ? match[1] : ''
}

export const parseQuarkShareLine = (line = '') => {
  const raw = String(line || '').trim()
  if (!raw) {
    return null
  }

  const shareUrl = extractShareUrl(raw)
  const url = shareUrl || raw
  const urlMatch = url.match(/pan\.quark\.cn\/s\/([A-Za-z0-9]+)/i)
  if (!urlMatch) {
    throw new Error(`未识别到夸克分享链接: ${raw}`)
  }

  const hashMatch = url.match(/#\/list\/share\/([^/?#]+)/i)
  return {
    raw,
    url,
    shareId: urlMatch[1],
    passcode: extractPasscode(raw, shareUrl),
    pdirFid: hashMatch?.[1] || '0'
  }
}

export const parseQuarkShareInput = (text = '') => {
  const lineList = String(text || '')
    .split(/\r?\n/)
    .map(item => item.trim())
    .filter(Boolean)

  if (lineList.length === 0) {
    throw new Error('请先输入夸克分享链接')
  }

  return lineList
    .map(parseQuarkShareLine)
    .filter(Boolean)
}

export const verifyQuarkCookie = async(cookie) => {
  return quarkRequest({
    method: 'GET',
    host: QUARK_HOSTS.account,
    path: '/account/info',
    params: {
      platform: 'pc',
      fr: 'pc'
    },
    cookie,
    referer: 'https://pan.quark.cn/'
  })
}

export const listQuarkDirectoryFolders = async(cookie, pdirFid = '0') => {
  let page = 1
  const folderList = []

  while (true) {
    const data = await quarkRequest({
      method: 'GET',
      host: QUARK_HOSTS.drivePc,
      path: '/1/clouddrive/file/sort',
      params: {
        pdir_fid: String(pdirFid || '0'),
        _page: page,
        _size: SHARE_PAGE_SIZE,
        _fetch_total: 1,
        _fetch_sub_dirs: 0,
        _sort: 'file_type:asc,updated_at:desc'
      },
      cookie,
      referer: 'https://pan.quark.cn/'
    })

    const currentList = Array.isArray(data?.list) ? data.list : []
    folderList.push(...currentList.filter(isFolderItem))

    if (currentList.length < SHARE_PAGE_SIZE) {
      break
    }
    page += 1
  }

  return folderList
}

const getShareItems = async(cookie, share, onProgress = null) => {
  const tokenData = await getShareToken(cookie, share.shareId, share.passcode)
  const stoken = tokenData.stoken
  const itemList = []
  let page = 1
  let shareInfo = tokenData.share || null

  while (true) {
    const detailData = await getShareDetailPage(cookie, share, stoken, page)
    const currentList = Array.isArray(detailData?.list) ? detailData.list : []
    if (detailData?.share) {
      shareInfo = detailData.share
    }
    itemList.push(...currentList)

    if (typeof onProgress === 'function') {
      onProgress(`已读取分享目录，第 ${page} 页，共累计 ${itemList.length} 项`)
    }

    if (currentList.length < SHARE_PAGE_SIZE) {
      break
    }
    page += 1
  }

  if (itemList.length === 0) {
    throw new Error('分享目录为空，或当前子目录下没有可转存的项目')
  }

  return {
    shareInfo,
    stoken,
    items: itemList
  }
}

export const transferQuarkShare = async({
  cookie,
  shareInput,
  toPdirFid = '0',
  onProgress = null
}) => {
  const share = typeof shareInput === 'string' ? parseQuarkShareLine(shareInput) : shareInput
  if (!share) {
    throw new Error('请先输入夸克分享链接')
  }

  if (typeof onProgress === 'function') {
    onProgress(`开始处理分享 ${share.shareId}`)
  }

  const { shareInfo, stoken, items } = await getShareItems(cookie, share, onProgress)
  const batches = chunkItems(items, SAVE_BATCH_SIZE)

  for (let index = 0; index < batches.length; index += 1) {
    const batch = batches[index]
    const fidList = batch.map(item => item.fid).filter(Boolean)
    const fidTokenList = batch.map(item => item.share_fid_token || item.fid_token).filter(Boolean)

    if (fidList.length === 0 || fidList.length !== fidTokenList.length) {
      throw new Error('分享目录缺少必要的 fid_token，暂时无法转存')
    }

    if (typeof onProgress === 'function') {
      onProgress(`正在转存第 ${index + 1}/${batches.length} 批，共 ${batch.length} 项`)
    }

    const saveData = await quarkRequest({
      method: 'POST',
      host: QUARK_HOSTS.drivePc,
      path: '/1/clouddrive/share/sharepage/save',
      data: {
        pwd_id: share.shareId,
        stoken,
        pdir_fid: share.pdirFid || '0',
        to_pdir_fid: String(toPdirFid || '0'),
        scene: 'link',
        fid_list: fidList,
        fid_token_list: fidTokenList
      },
      cookie,
      referer: `https://pan.quark.cn/s/${share.shareId}`
    })

    const taskId = saveData?.task_id
    if (taskId) {
      await waitForTask(cookie, taskId)
    }
  }

  return {
    share,
    shareInfo,
    itemCount: items.length,
    batchCount: batches.length,
    title: shareInfo?.title || shareInfo?.share_title || shareInfo?.file_name || share.url
  }
}
