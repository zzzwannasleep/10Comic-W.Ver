import { delay, request } from '@/utils'

export const DEFAULT_PAN_PROVIDER = 'quark'

export const PAN_PROVIDER_MAP = {
  quark: {
    key: 'quark',
    label: '夸克网盘',
    shortName: '夸克',
    cookieKey: 'quarkCookie',
    targetDirKey: 'quarkTargetDirId',
    hosts: {
      account: 'https://pan.quark.cn',
      drivePc: 'https://drive-pc.quark.cn',
      driveShare: 'https://drive-h.quark.cn'
    },
    origin: 'https://pan.quark.cn',
    homeReferer: 'https://pan.quark.cn/',
    sharePageBaseUrl: 'https://pan.quark.cn/s/',
    shareUrlPattern: /https?:\/\/pan\.quark\.cn\/s\/[A-Za-z0-9]+(?:[^\s]*)?/i,
    shareIdPattern: /pan\.quark\.cn\/s\/([A-Za-z0-9]+)/i,
    shareDirPattern: /#\/list\/share\/([^/?#]+)/i,
    commonParams: {
      pr: 'ucpro',
      fr: 'pc',
      uc_param_str: ''
    },
    accountInfoPath: '/account/info',
    accountInfoParams: {
      platform: 'pc',
      fr: 'pc'
    },
    cookieHint: '建议从夸克网页请求头里复制完整 Cookie。根目录 fid 为 `0`，不填时默认转存到根目录。',
    cookiePlaceholder: '粘贴夸克请求头里的完整 Cookie',
    shareHint: '每行一个夸克分享链接，支持在同一行附带提取码，例如 `https://pan.quark.cn/s/xxxx 提取码: abcd`。',
    sharePlaceholder: '每行一个夸克分享链接',
    shareExample: 'https://pan.quark.cn/s/xxxx 提取码: abcd'
  },
  uc: {
    key: 'uc',
    label: 'UC网盘',
    shortName: 'UC',
    cookieKey: 'ucCookie',
    targetDirKey: 'ucTargetDirId',
    hosts: {
      account: 'https://drive.uc.cn',
      drivePc: 'https://pc-api.uc.cn',
      driveShare: 'https://pc-api.uc.cn'
    },
    origin: 'https://drive.uc.cn',
    homeReferer: 'https://drive.uc.cn/',
    sharePageBaseUrl: 'https://drive.uc.cn/s/',
    shareUrlPattern: /https?:\/\/drive\.uc\.cn\/s\/[A-Za-z0-9]+(?:[^\s]*)?/i,
    shareIdPattern: /drive\.uc\.cn\/s\/([A-Za-z0-9]+)/i,
    shareDirPattern: /#\/list\/share\/([^/?#]+)/i,
    commonParams: {
      pr: 'UCBrowser',
      fr: 'pc'
    },
    accountInfoPath: '/account/info',
    accountInfoParams: {
      platform: 'pc',
      fr: 'pc'
    },
    cookieHint: '建议从 UC 网盘网页请求头里复制完整 Cookie。根目录 fid 为 `0`，不填时默认转存到根目录。',
    cookiePlaceholder: '粘贴 UC 网盘请求头里的完整 Cookie',
    shareHint: '每行一个 UC 网盘分享链接，支持在同一行附带提取码，例如 `https://drive.uc.cn/s/xxxx 提取码: abcd`。',
    sharePlaceholder: '每行一个 UC 网盘分享链接',
    shareExample: 'https://drive.uc.cn/s/xxxx 提取码: abcd'
  }
}

export const PAN_PROVIDER_LIST = Object.values(PAN_PROVIDER_MAP).map((provider) => ({
  key: provider.key,
  label: provider.label,
  shortName: provider.shortName,
  cookieKey: provider.cookieKey,
  targetDirKey: provider.targetDirKey,
  cookieHint: provider.cookieHint,
  cookiePlaceholder: provider.cookiePlaceholder,
  shareHint: provider.shareHint,
  sharePlaceholder: provider.sharePlaceholder,
  shareExample: provider.shareExample
}))

const SHARE_PAGE_SIZE = 100
const SAVE_BATCH_SIZE = 100
const TASK_POLL_INTERVAL_SECONDS = 1.2
const TASK_MAX_ATTEMPTS = 60

export const normalizePanProviderKey = (providerKey = '') => {
  return PAN_PROVIDER_MAP[providerKey] ? providerKey : DEFAULT_PAN_PROVIDER
}

export const getPanProvider = (providerKey = '') => {
  if (providerKey && typeof providerKey === 'object' && providerKey.key && PAN_PROVIDER_MAP[providerKey.key]) {
    return PAN_PROVIDER_MAP[providerKey.key]
  }
  return PAN_PROVIDER_MAP[normalizePanProviderKey(providerKey)]
}

const buildCommonParams = (provider, params = {}) => {
  return {
    ...provider.commonParams,
    __dt: Math.floor(Math.random() * 9000) + 1000,
    __t: Date.now(),
    ...params
  }
}

const buildUrl = (provider, host, path, params = {}) => {
  const url = new URL(`${host}${path}`)
  const query = buildCommonParams(provider, params)
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

const createHeaders = (provider, referer, isPost = false) => {
  const headers = {
    accept: 'application/json, text/plain, */*',
    origin: provider.origin,
    referer
  }

  if (isPost) {
    headers['content-type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
  }

  return headers
}

const parseJsonResponse = (provider, response) => {
  if (!response || response === 'onerror' || response === 'timeout') {
    throw new Error(`${provider.shortName} 请求失败，请稍后重试`)
  }

  if (response.status && response.status >= 400) {
    throw new Error(`${provider.shortName} 请求失败 (${response.status})`)
  }

  const payload = response.response ?? response.responseText ?? response
  if (typeof payload === 'string') {
    return JSON.parse(payload)
  }
  return payload
}

const unwrapResponseData = (provider, payload) => {
  if (!payload || typeof payload !== 'object') {
    throw new Error(`${provider.shortName} 返回了无效数据`)
  }

  const status = payload.status
  if (typeof status === 'number' && status !== 200) {
    throw new Error(payload.message || `${provider.shortName} 请求失败 (${status})`)
  }

  const code = payload.code
  if (typeof code === 'number' && code !== 0) {
    throw new Error(payload.message || `${provider.shortName} 接口返回错误 (${code})`)
  }

  return payload.data ?? payload
}

const panRequest = async({
  provider,
  method = 'GET',
  host,
  path,
  params = {},
  data = null,
  cookie = '',
  referer
}) => {
  const normalizedProvider = getPanProvider(provider)
  const normalizedCookie = normalizeCookie(cookie)
  if (!normalizedCookie) {
    throw new Error(`请先填写${normalizedProvider.shortName} Cookie`)
  }

  const upperMethod = method.toUpperCase()
  const response = await request({
    method: upperMethod,
    url: buildUrl(normalizedProvider, host || normalizedProvider.hosts.drivePc, path, params),
    data: upperMethod === 'GET' || !data ? null : createBody(data),
    headers: createHeaders(normalizedProvider, referer || normalizedProvider.homeReferer, upperMethod !== 'GET'),
    cookie: normalizedCookie,
    timeout: 60 * 1000
  })
  return unwrapResponseData(normalizedProvider, parseJsonResponse(normalizedProvider, response))
}

const isFolderItem = (item) => {
  return item?.dir === true || item?.file_type === 0 || item?.obj_category === 'dir'
}

const getShareToken = async(provider, cookie, shareId, passcode = '') => {
  const data = await panRequest({
    provider,
    method: 'POST',
    host: provider.hosts.driveShare,
    path: '/1/clouddrive/share/sharepage/token',
    data: {
      pwd_id: shareId,
      passcode
    },
    cookie,
    referer: `${provider.sharePageBaseUrl}${shareId}`
  })

  const stoken = data.stoken || data.share_token || data.token
  if (!stoken) {
    throw new Error(`未拿到${provider.shortName}分享令牌，Cookie 可能失效或分享链接需要验证`)
  }

  return {
    ...data,
    stoken
  }
}

const getShareDetailPage = async(provider, cookie, share, stoken, page = 1) => {
  return panRequest({
    provider,
    method: 'GET',
    host: provider.hosts.driveShare,
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
    referer: `${provider.sharePageBaseUrl}${share.shareId}`
  })
}

const getTaskResult = async(provider, cookie, taskId, retryIndex = 0) => {
  return panRequest({
    provider,
    method: 'GET',
    host: provider.hosts.drivePc,
    path: '/1/clouddrive/task',
    params: {
      task_id: taskId,
      retry_index: retryIndex
    },
    cookie,
    referer: provider.homeReferer
  })
}

const waitForTask = async(provider, cookie, taskId) => {
  for (let retryIndex = 0; retryIndex < TASK_MAX_ATTEMPTS; retryIndex += 1) {
    const task = await getTaskResult(provider, cookie, taskId, retryIndex)
    const status = Number(task?.status)

    if (status === 2) {
      return task
    }

    if ([3, 4, -1].includes(status)) {
      throw new Error(task?.message || task?.title || `${provider.shortName} 转存任务失败`)
    }

    await delay(TASK_POLL_INTERVAL_SECONDS)
  }

  throw new Error(`${provider.shortName} 转存任务超时，请稍后去网盘确认结果`)
}

const chunkItems = (items, size) => {
  const list = []
  for (let index = 0; index < items.length; index += size) {
    list.push(items.slice(index, index + size))
  }
  return list
}

const extractShareUrl = (provider, text = '') => {
  const match = String(text).match(provider.shareUrlPattern)
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

export const parsePanShareLine = (providerKey = DEFAULT_PAN_PROVIDER, line = '') => {
  const provider = getPanProvider(providerKey)
  const raw = String(line || '').trim()
  if (!raw) {
    return null
  }

  const shareUrl = extractShareUrl(provider, raw)
  const url = shareUrl || raw
  const urlMatch = url.match(provider.shareIdPattern)
  if (!urlMatch) {
    throw new Error(`未识别到${provider.shortName}分享链接: ${raw}`)
  }

  const hashMatch = url.match(provider.shareDirPattern)
  return {
    raw,
    url,
    shareId: urlMatch[1],
    passcode: extractPasscode(raw, shareUrl),
    pdirFid: hashMatch?.[1] || '0'
  }
}

export const parsePanShareInput = (providerKey = DEFAULT_PAN_PROVIDER, text = '') => {
  const provider = getPanProvider(providerKey)
  const lineList = String(text || '')
    .split(/\r?\n/)
    .map(item => item.trim())
    .filter(Boolean)

  if (lineList.length === 0) {
    throw new Error(`请先输入${provider.shortName}分享链接`)
  }

  return lineList
    .map(line => parsePanShareLine(provider.key, line))
    .filter(Boolean)
}

export const verifyPanCookie = async(providerKey = DEFAULT_PAN_PROVIDER, cookie = '') => {
  const provider = getPanProvider(providerKey)
  return panRequest({
    provider,
    method: 'GET',
    host: provider.hosts.account,
    path: provider.accountInfoPath,
    params: provider.accountInfoParams,
    cookie,
    referer: provider.homeReferer
  })
}

export const listPanDirectoryFolders = async(providerKey = DEFAULT_PAN_PROVIDER, cookie = '', pdirFid = '0') => {
  const provider = getPanProvider(providerKey)
  let page = 1
  const folderList = []

  while (true) {
    const data = await panRequest({
      provider,
      method: 'GET',
      host: provider.hosts.drivePc,
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
      referer: provider.homeReferer
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

const getShareItems = async(provider, cookie, share, onProgress = null) => {
  const tokenData = await getShareToken(provider, cookie, share.shareId, share.passcode)
  const stoken = tokenData.stoken
  const itemList = []
  let page = 1
  let shareInfo = tokenData.share || null

  while (true) {
    const detailData = await getShareDetailPage(provider, cookie, share, stoken, page)
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

export const transferPanShare = async({
  providerKey = DEFAULT_PAN_PROVIDER,
  cookie,
  shareInput,
  toPdirFid = '0',
  onProgress = null
}) => {
  const provider = getPanProvider(providerKey)
  const share = typeof shareInput === 'string' ? parsePanShareLine(provider.key, shareInput) : shareInput
  if (!share) {
    throw new Error(`请先输入${provider.shortName}分享链接`)
  }

  if (typeof onProgress === 'function') {
    onProgress(`开始处理分享: ${share.shareId}`)
  }

  const { shareInfo, stoken, items } = await getShareItems(provider, cookie, share, onProgress)
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

    const saveData = await panRequest({
      provider,
      method: 'POST',
      host: provider.hosts.drivePc,
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
      referer: `${provider.sharePageBaseUrl}${share.shareId}`
    })

    const taskId = saveData?.task_id
    if (taskId) {
      await waitForTask(provider, cookie, taskId)
    }
  }

  return {
    providerKey: provider.key,
    share,
    shareInfo,
    itemCount: items.length,
    batchCount: batches.length,
    title: shareInfo?.title || shareInfo?.share_title || shareInfo?.file_name || share.url
  }
}
