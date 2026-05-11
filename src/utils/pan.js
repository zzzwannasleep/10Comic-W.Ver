import { delay, request } from '@/utils'

export const DEFAULT_PAN_PROVIDER = 'quark'

const createQuarkFamilyProvider = ({
  key,
  label,
  shortName,
  cookieKey,
  targetDirKey,
  hosts,
  origin,
  homeReferer,
  sharePageBaseUrl,
  shareUrlPattern,
  shareIdPattern,
  commonParams,
  cookieHint,
  cookiePlaceholder,
  shareHint,
  sharePlaceholder,
  shareExample
}) => ({
  family: 'quark',
  key,
  label,
  shortName,
  cookieKey,
  targetDirKey,
  hosts,
  origin,
  homeReferer,
  sharePageBaseUrl,
  shareUrlPattern,
  shareIdPattern,
  shareDirPattern: /#\/list\/share\/([^/?#]+)/i,
  commonParams,
  accountInfoPath: '/account/info',
  accountInfoParams: {
    platform: 'pc',
    fr: 'pc'
  },
  cookieHint,
  cookiePlaceholder,
  shareHint,
  sharePlaceholder,
  shareExample
})

export const PAN_PROVIDER_MAP = {
  quark: createQuarkFamilyProvider({
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
    commonParams: {
      pr: 'ucpro',
      fr: 'pc',
      uc_param_str: ''
    },
    cookieHint: '建议从夸克网页请求头里复制完整 Cookie。根目录 fid 为 `0`，不填时默认转存到根目录。',
    cookiePlaceholder: '粘贴夸克请求头里的完整 Cookie',
    shareHint: '每行一个夸克分享链接，支持在同一行附带提取码，例如 `https://pan.quark.cn/s/xxxx 提取码: abcd`。',
    sharePlaceholder: '每行一个夸克分享链接',
    shareExample: 'https://pan.quark.cn/s/xxxx 提取码: abcd'
  }),
  uc: createQuarkFamilyProvider({
    key: 'uc',
    label: 'UC 网盘',
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
    commonParams: {
      pr: 'UCBrowser',
      fr: 'pc'
    },
    cookieHint: '建议从 UC 网盘网页请求头里复制完整 Cookie。根目录 fid 为 `0`，不填时默认转存到根目录。',
    cookiePlaceholder: '粘贴 UC 网盘请求头里的完整 Cookie',
    shareHint: '每行一个 UC 网盘分享链接，支持在同一行附带提取码，例如 `https://drive.uc.cn/s/xxxx 提取码: abcd`。',
    sharePlaceholder: '每行一个 UC 网盘分享链接',
    shareExample: 'https://drive.uc.cn/s/xxxx 提取码: abcd'
  }),
  pan123: {
    family: 'pan123',
    key: 'pan123',
    label: '123 云盘',
    shortName: '123',
    cookieKey: 'pan123Cookie',
    targetDirKey: 'pan123TargetDirId',
    hosts: {
      account: 'https://www.123pan.com',
      drivePc: 'https://www.123pan.com',
      driveShare: 'https://www.123pan.com'
    },
    origin: 'https://www.123pan.com',
    homeReferer: 'https://www.123pan.com/',
    sharePageBaseUrl: 'https://www.123pan.com/s/',
    shareUrlPattern: /https?:\/\/(?:www\.)?123pan\.com\/s\/[A-Za-z0-9_-]+(?:\.html)?(?:[^\s]*)?/i,
    shareIdPattern: /123pan\.com\/s\/([A-Za-z0-9_-]+)(?:\.html)?/i,
    shareDirPattern: /[?&](?:parentFileId|ParentFileId)=([^&#]+)/i,
    cookieHint: '建议从 123 云盘网页请求头里复制完整 Cookie。脚本会自动从其中提取 `sso-token` 作为鉴权令牌。',
    cookiePlaceholder: '粘贴 123 云盘请求头里的完整 Cookie',
    shareHint: '每行一个 123 云盘分享链接，支持同一行附带提取码，例如 `https://www.123pan.com/s/xxxx-xxxx.html 提取码: abcd`。',
    sharePlaceholder: '每行一个 123 云盘分享链接',
    shareExample: 'https://www.123pan.com/s/xxxx-xxxx.html 提取码: abcd'
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

const PAN123_SERVER_TIME_TTL = 55 * 1000
const PAN123_DYKEY_ERROR = 'dykey illegality 1001'
const PAN123_DATE_LETTER_MAP = ['a', 'd', 'e', 'f', 'g', 'h', 'l', 'm', 'y', 'i']

const pan123RuntimeState = {
  loginUuid: '',
  serverTimestamp: '',
  serverFetchedAt: 0,
  serverPromise: null
}

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
  if (provider.family === 'pan123') {
    return {
      ...params
    }
  }

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

const getCookieValue = (cookie = '', name = '') => {
  const normalizedCookie = normalizeCookie(cookie)
  if (!normalizedCookie || !name) {
    return ''
  }

  const pair = normalizedCookie
    .split(';')
    .map(item => item.trim())
    .find(item => item.startsWith(`${name}=`))

  return pair ? pair.slice(name.length + 1).trim() : ''
}

const createFormBody = (payload = {}) => {
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

const requestWithCookie = async({
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
    data: upperMethod === 'GET' || !data ? null : createFormBody(data),
    headers: createHeaders(normalizedProvider, referer || normalizedProvider.homeReferer, upperMethod !== 'GET'),
    cookie: normalizedCookie,
    timeout: 60 * 1000
  })
  return unwrapResponseData(normalizedProvider, parseJsonResponse(normalizedProvider, response))
}

const createUuid = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = Math.floor(Math.random() * 16)
    const value = char === 'x' ? random : ((random & 0x3) | 0x8)
    return value.toString(16)
  })
}

const getPan123LoginUuid = () => {
  if (!pan123RuntimeState.loginUuid) {
    pan123RuntimeState.loginUuid = createUuid()
  }
  return pan123RuntimeState.loginUuid
}

const getPan123Token = (cookie = '') => {
  return getCookieValue(cookie, 'sso-token') || getCookieValue(cookie, 'authorToken')
}

const createPan123Headers = (provider, referer, cookie, contentType = '') => {
  const token = getPan123Token(cookie)
  if (!token) {
    throw new Error('123 云盘 Cookie 中未找到 sso-token，请从网页请求头复制完整 Cookie')
  }

  const headers = {
    accept: 'application/json, text/plain, */*',
    origin: provider.origin,
    referer: referer || provider.homeReferer,
    platform: 'web',
    'App-Version': '3',
    LoginUuid: getPan123LoginUuid(),
    Authorization: `Bearer ${token}`
  }

  if (contentType === 'json') {
    headers['Content-Type'] = 'application/json;charset=UTF-8'
  } else if (contentType === 'form') {
    headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
  }

  return headers
}

const crc32 = (text, radix = 10) => {
  const table = new Array(256).fill(0).map((_, index) => {
    let value = index
    for (let bit = 0; bit < 8; bit += 1) {
      value = (value & 1) ? (0xedb88320 ^ (value >>> 1)) : (value >>> 1)
    }
    return value >>> 0
  })

  const utf8Text = String(text || '')
    .replace(/\r\n/g, '\n')
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0)
      if (code < 128) {
        return String.fromCharCode(code)
      }
      if (code < 2048) {
        return `${String.fromCharCode((code >> 6) | 192)}${String.fromCharCode((code & 63) | 128)}`
      }
      return `${String.fromCharCode((code >> 12) | 224)}${String.fromCharCode(((code >> 6) & 63) | 128)}${String.fromCharCode((code & 63) | 128)}`
    })
    .join('')

  let result = -1
  for (let index = 0; index < utf8Text.length; index += 1) {
    result = (result >>> 8) ^ table[(result ^ utf8Text.charCodeAt(index)) & 255]
  }

  return ((-1 ^ result) >>> 0).toString(radix)
}

const getPan123MinuteDiff = (currentSeconds, serverSeconds) => {
  return Math.abs((Number(currentSeconds) * 1000) - (Number(serverSeconds) * 1000)) / 1000 / 60
}

const getPan123BeijingSeconds = () => {
  return Math.round((Date.now() + (60 * new Date().getTimezoneOffset() * 1000) + 28800000) / 1000)
}

const formatPan123BeijingParts = (timestampSeconds) => {
  const rawValue = String(timestampSeconds || '').length === 10
    ? Number.parseInt(timestampSeconds, 10) * 1000
    : Number(timestampSeconds)

  const date = new Date(rawValue + (new Date(rawValue).getTimezoneOffset() * 60000) + 28800000)

  return {
    y: String(date.getFullYear()),
    m: String(date.getMonth() + 1).padStart(2, '0'),
    d: String(date.getDate()).padStart(2, '0'),
    h: String(date.getHours()).padStart(2, '0'),
    f: String(date.getMinutes()).padStart(2, '0')
  }
}

const buildPan123DyKey = (pathWithQuery = '') => {
  const randomValue = Math.round(10000000 * Math.random())
  const localSeconds = String(getPan123BeijingSeconds())
  const timestamp = pan123RuntimeState.serverTimestamp &&
    getPan123MinuteDiff(localSeconds, pan123RuntimeState.serverTimestamp) >= 20
    ? String(pan123RuntimeState.serverTimestamp)
    : localSeconds

  const timeParts = formatPan123BeijingParts(timestamp)
  const timeText = [timeParts.y, timeParts.m, timeParts.d, timeParts.h, timeParts.f].join('')
  const mappedText = timeText
    .split('')
    .map(digit => PAN123_DATE_LETTER_MAP[Number(digit)] || digit)
    .join('')

  const dynamicKey = crc32(mappedText)
  const dynamicValueCrc = crc32(`${timestamp}|${randomValue}|${pathWithQuery}|web|3|${dynamicKey}`)

  return [dynamicKey, `${timestamp}-${randomValue}-${dynamicValueCrc}`]
}

const buildPan123Path = (path = '') => {
  if (/^https?:\/\//i.test(path) || path.startsWith('/b/api')) {
    return path
  }
  return `/b/api${path}`
}

const buildPan123Url = (provider, host, path, params = {}, skipDyKey = false) => {
  const normalizedPath = buildPan123Path(path)
  const url = new URL(/^https?:\/\//i.test(normalizedPath) ? normalizedPath : `${host || provider.hosts.drivePc}${normalizedPath}`)

  Object.keys(params).forEach((key) => {
    const value = params[key]
    if (value === undefined || value === null || value === '') {
      return
    }
    url.searchParams.set(key, String(value))
  })

  if (!skipDyKey && !url.pathname.includes('/get/server/time')) {
    const [dynamicKey, dynamicValue] = buildPan123DyKey(`${url.pathname}${url.search}`)
    url.searchParams.set(dynamicKey, dynamicValue)
  }

  return url.toString()
}

const createPan123RequestBody = (data = null, contentType = 'json') => {
  if (!data) {
    return null
  }
  if (contentType === 'json') {
    return JSON.stringify(data)
  }
  if (contentType === 'form') {
    return createFormBody(data)
  }
  return data
}

const fetchPan123ServerTimestamp = async(provider, cookie) => {
  if (pan123RuntimeState.serverPromise) {
    return pan123RuntimeState.serverPromise
  }

  pan123RuntimeState.serverPromise = (async() => {
    const response = await request({
      method: 'GET',
      url: buildPan123Url(provider, provider.hosts.drivePc, '/get/server/time', {}, true),
      headers: createPan123Headers(provider, provider.homeReferer, cookie),
      cookie: normalizeCookie(cookie),
      timeout: 60 * 1000
    })

    const payload = parseJsonResponse(provider, response)
    const data = unwrapResponseData(provider, payload)
    const timestamp = data?.timestamp
    if (!timestamp) {
      throw new Error('123 云盘时间接口未返回有效时间戳')
    }

    pan123RuntimeState.serverTimestamp = String(timestamp)
    pan123RuntimeState.serverFetchedAt = Date.now()
    return pan123RuntimeState.serverTimestamp
  })()

  try {
    return await pan123RuntimeState.serverPromise
  } finally {
    pan123RuntimeState.serverPromise = null
  }
}

const ensurePan123ServerTimestamp = async(provider, cookie, force = false) => {
  const cacheValid = pan123RuntimeState.serverTimestamp &&
    (Date.now() - pan123RuntimeState.serverFetchedAt) < PAN123_SERVER_TIME_TTL

  if (!force && cacheValid) {
    return pan123RuntimeState.serverTimestamp
  }

  try {
    return await fetchPan123ServerTimestamp(provider, cookie)
  } catch (error) {
    return pan123RuntimeState.serverTimestamp || ''
  }
}

const isPan123DyKeyError = (payload) => {
  return payload?.code === -3 && String(payload?.message || '').includes(PAN123_DYKEY_ERROR)
}

const pan123Request = async({
  provider,
  method = 'GET',
  host,
  path,
  params = {},
  data = null,
  cookie = '',
  referer,
  contentType = 'json',
  skipDyKey = false,
  retryCount = 0
}) => {
  const normalizedProvider = getPanProvider(provider)
  const normalizedCookie = normalizeCookie(cookie)
  if (!normalizedCookie) {
    throw new Error(`请先填写${normalizedProvider.shortName} Cookie`)
  }

  if (!skipDyKey && !String(path).includes('/get/server/time')) {
    await ensurePan123ServerTimestamp(normalizedProvider, normalizedCookie)
  }

  const upperMethod = method.toUpperCase()
  const response = await request({
    method: upperMethod,
    url: buildPan123Url(
      normalizedProvider,
      host || normalizedProvider.hosts.drivePc,
      path,
      params,
      skipDyKey
    ),
    data: upperMethod === 'GET' || !data ? null : createPan123RequestBody(data, contentType),
    headers: createPan123Headers(
      normalizedProvider,
      referer || normalizedProvider.homeReferer,
      normalizedCookie,
      upperMethod === 'GET' ? '' : contentType
    ),
    cookie: normalizedCookie,
    timeout: 60 * 1000
  })

  const payload = parseJsonResponse(normalizedProvider, response)
  if (isPan123DyKeyError(payload) && retryCount < 1) {
    await ensurePan123ServerTimestamp(normalizedProvider, normalizedCookie, true)
    return pan123Request({
      provider: normalizedProvider,
      method,
      host,
      path,
      params,
      data,
      cookie: normalizedCookie,
      referer,
      contentType,
      skipDyKey,
      retryCount: retryCount + 1
    })
  }

  return unwrapResponseData(normalizedProvider, payload)
}

const panRequest = async(options) => {
  const provider = getPanProvider(options.provider)
  if (provider.family === 'pan123') {
    return pan123Request({
      ...options,
      provider
    })
  }
  return requestWithCookie({
    ...options,
    provider
  })
}

const isQuarkFamilyFolderItem = (item) => {
  return item?.dir === true || item?.file_type === 0 || item?.obj_category === 'dir'
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

  const hashMatch = provider.shareDirPattern ? url.match(provider.shareDirPattern) : null
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

const getQuarkFamilyShareToken = async(provider, cookie, shareId, passcode = '') => {
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

const getQuarkFamilyShareDetailPage = async(provider, cookie, share, stoken, page = 1) => {
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

const getQuarkFamilyTaskResult = async(provider, cookie, taskId, retryIndex = 0) => {
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

const waitForQuarkFamilyTask = async(provider, cookie, taskId) => {
  for (let retryIndex = 0; retryIndex < TASK_MAX_ATTEMPTS; retryIndex += 1) {
    const task = await getQuarkFamilyTaskResult(provider, cookie, taskId, retryIndex)
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

const getQuarkFamilyShareItems = async(provider, cookie, share, onProgress = null) => {
  const tokenData = await getQuarkFamilyShareToken(provider, cookie, share.shareId, share.passcode)
  const stoken = tokenData.stoken
  const itemList = []
  let page = 1
  let shareInfo = tokenData.share || null

  while (true) {
    const detailData = await getQuarkFamilyShareDetailPage(provider, cookie, share, stoken, page)
    const currentList = Array.isArray(detailData?.list) ? detailData.list : []
    if (detailData?.share) {
      shareInfo = detailData.share
    }
    itemList.push(...currentList)

    if (typeof onProgress === 'function') {
      onProgress(`已读取分享目录，第 ${page} 页，累计 ${itemList.length} 项`)
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

const normalizePan123ListItem = (item = {}) => {
  return {
    ...item,
    fid: String(item.FileId ?? item.fid ?? ''),
    file_name: item.FileName || item.file_name || item.title || ''
  }
}

const listPan123DirectoryPage = async(provider, cookie, pdirFid = '0', page = 1, next = '0') => {
  return panRequest({
    provider,
    method: 'GET',
    host: provider.hosts.drivePc,
    path: '/file/list/new',
    params: {
      driveId: 0,
      limit: SHARE_PAGE_SIZE,
      next,
      parentFileId: String(pdirFid || '0'),
      parentFileName: '0',
      trashed: false,
      Page: page,
      FileType: 1,
      orderBy: 'file_name',
      orderDirection: 'asc'
    },
    cookie,
    referer: provider.homeReferer
  })
}

const listPan123DirectoryFolders = async(provider, cookie, pdirFid = '0') => {
  let page = 1
  let next = '0'
  const folderList = []

  while (true) {
    const data = await listPan123DirectoryPage(provider, cookie, pdirFid, page, next)
    const currentList = Array.isArray(data?.InfoList) ? data.InfoList : []
    folderList.push(
      ...currentList
        .filter(item => Number(item?.Type) === 1)
        .map(normalizePan123ListItem)
    )

    const nextValue = String(data?.Next ?? '-1')
    if (nextValue === '-1' || currentList.length < SHARE_PAGE_SIZE) {
      break
    }

    next = nextValue
    page += 1
  }

  return folderList
}

const getPan123ShareItems = async(provider, cookie, share, onProgress = null) => {
  let page = 1
  let next = '0'
  const itemList = []

  while (true) {
    const data = await panRequest({
      provider,
      method: 'GET',
      host: provider.hosts.driveShare,
      path: '/share/get',
      params: {
        shareKey: share.shareId,
        limit: SHARE_PAGE_SIZE,
        next,
        ParentFileId: String(share.pdirFid || '0'),
        Page: page,
        orderBy: 'file_name',
        orderDirection: 'asc',
        SharePwd: share.passcode || undefined
      },
      cookie,
      referer: `${provider.sharePageBaseUrl}${share.shareId}.html`
    })

    const currentList = Array.isArray(data?.InfoList) ? data.InfoList : []
    itemList.push(...currentList)

    if (typeof onProgress === 'function') {
      onProgress(`已读取分享目录，第 ${page} 页，累计 ${itemList.length} 项`)
    }

    const nextValue = String(data?.Next ?? '-1')
    if (nextValue === '-1' || currentList.length < SHARE_PAGE_SIZE) {
      break
    }

    next = nextValue
    page += 1
  }

  if (itemList.length === 0) {
    throw new Error('分享目录为空，或当前子目录下没有可转存的项目')
  }

  return {
    shareInfo: null,
    items: itemList
  }
}

const buildPan123SaveFile = (item, parentFileId) => {
  return {
    fileID: Number(item?.FileId ?? item?.fid ?? 0),
    size: Number(item?.Size ?? item?.size ?? 0),
    etag: item?.Etag ?? item?.etag ?? '',
    type: Number(item?.Type ?? item?.type ?? 0),
    parentFileID: Number(parentFileId || 0),
    fileName: item?.FileName || item?.file_name || '',
    driveID: 0
  }
}

const getPan123TaskResult = async(provider, cookie, taskId) => {
  return panRequest({
    provider,
    method: 'GET',
    host: provider.hosts.drivePc,
    path: '/restful/goapi/v1/file/copy/save/get',
    params: {
      taskID: taskId
    },
    cookie,
    referer: provider.homeReferer
  })
}

const waitForPan123Task = async(provider, cookie, taskId) => {
  for (let retryIndex = 0; retryIndex < TASK_MAX_ATTEMPTS; retryIndex += 1) {
    const task = await getPan123TaskResult(provider, cookie, taskId)
    const status = Number(task?.status)

    if (status === 2) {
      return task
    }

    if (status !== 0 && status !== 1) {
      throw new Error(task?.reason || task?.message || `${provider.shortName} 转存任务失败`)
    }

    await delay(TASK_POLL_INTERVAL_SECONDS)
  }

  throw new Error(`${provider.shortName} 转存任务超时，请稍后去网盘确认结果`)
}

const verifyPan123Cookie = async(provider, cookie) => {
  try {
    const visitorData = await panRequest({
      provider,
      method: 'GET',
      host: provider.hosts.account,
      path: '/share/visitor/info',
      cookie,
      referer: provider.homeReferer
    })

    if (visitorData && typeof visitorData === 'object') {
      return visitorData
    }
  } catch (firstError) {
    await listPan123DirectoryPage(provider, cookie, '0', 1, '0')
    return {
      user_name: '已登录用户'
    }
  }

  return {
    user_name: '已登录用户'
  }
}

export const verifyPanCookie = async(providerKey = DEFAULT_PAN_PROVIDER, cookie = '') => {
  const provider = getPanProvider(providerKey)

  if (provider.family === 'pan123') {
    return verifyPan123Cookie(provider, cookie)
  }

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

  if (provider.family === 'pan123') {
    return listPan123DirectoryFolders(provider, cookie, pdirFid)
  }

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
    folderList.push(...currentList.filter(isQuarkFamilyFolderItem))

    if (currentList.length < SHARE_PAGE_SIZE) {
      break
    }
    page += 1
  }

  return folderList
}

const transferQuarkFamilyShare = async({
  provider,
  cookie,
  share,
  toPdirFid = '0',
  onProgress = null
}) => {
  const { shareInfo, stoken, items } = await getQuarkFamilyShareItems(provider, cookie, share, onProgress)
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
      await waitForQuarkFamilyTask(provider, cookie, taskId)
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

const transferPan123Share = async({
  provider,
  cookie,
  share,
  toPdirFid = '0',
  onProgress = null
}) => {
  const { shareInfo, items } = await getPan123ShareItems(provider, cookie, share, onProgress)
  const batches = chunkItems(items, SAVE_BATCH_SIZE)
  const currentLevel = share.pdirFid && share.pdirFid !== '0' ? 1 : 0

  for (let index = 0; index < batches.length; index += 1) {
    const batch = batches[index]
    if (typeof onProgress === 'function') {
      onProgress(`正在转存第 ${index + 1}/${batches.length} 批，共 ${batch.length} 项`)
    }

    const saveData = await panRequest({
      provider,
      method: 'POST',
      host: provider.hosts.drivePc,
      path: '/restful/goapi/v1/file/copy/save',
      data: {
        fileList: batch.map(item => buildPan123SaveFile(item, share.pdirFid || '0')),
        shareKey: share.shareId,
        sharePwd: share.passcode || null,
        currentLevel,
        superAdmin: null
      },
      cookie,
      referer: `${provider.sharePageBaseUrl}${share.shareId}.html`,
      contentType: 'json'
    })

    const taskId = saveData?.taskID || saveData?.taskId
    if (taskId) {
      await waitForPan123Task(provider, cookie, taskId)
    }
  }

  const firstItem = items[0] || {}

  return {
    providerKey: provider.key,
    share,
    shareInfo,
    itemCount: items.length,
    batchCount: batches.length,
    title: shareInfo?.ShareName || shareInfo?.title || firstItem.FileName || share.url
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
    onProgress(`开始处理分享 ${share.shareId}`)
  }

  if (provider.family === 'pan123') {
    return transferPan123Share({
      provider,
      cookie,
      share,
      toPdirFid,
      onProgress
    })
  }

  return transferQuarkFamilyShare({
    provider,
    cookie,
    share,
    toPdirFid,
    onProgress
  })
}
