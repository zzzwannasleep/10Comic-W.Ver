/* eslint-disable no-undef */
import {
  AppName,
  AppVersion,
  AppReleaseVersion,
  AppBuildId,
  AppHomepageUrl,
  AppSupportUrl,
  AppUpdateUrl,
  AppDownloadUrl,
  isDev
} from '@/config'
import { getStorage, setStorage } from '@/config/setup'

const updateSettingsDefault = {
  autoCheckOnLoad: true,
  checkIntervalHours: 12
}

const updateRetryIntervalMinutes = 30

const updateCheckStateDefault = {
  lastCheckAt: 0,
  lastSuccessCheckAt: 0,
  lastFailureCheckAt: 0,
  lastPromptVersion: '',
  lastPromptReleaseKey: '',
  latestVersion: '',
  latestBuildId: '',
  latestDownloadUrl: '',
  latestUpdateUrl: '',
  lastResult: 'idle',
  lastReason: '',
  lastSourceUrl: ''
}

const normalizeString = (value) => typeof value === 'string' ? value.trim() : ''

const uniqueStrings = (values) => {
  const result = []
  const seen = new Set()

  values.forEach((value) => {
    const normalized = normalizeString(value)
    if (!normalized || seen.has(normalized)) {
      return
    }
    seen.add(normalized)
    result.push(normalized)
  })

  return result
}

export const getStoredUpdateSettings = () => ({
  ...updateSettingsDefault,
  ...(getStorage('updateSettings') || {})
})

export const getStoredUpdateCheckState = () => ({
  ...updateCheckStateDefault,
  ...(getStorage('updateCheckState') || {})
})

const withCacheBust = (url) => {
  if (!url) {
    return ''
  }
  const joiner = url.includes('?') ? '&' : '?'
  return `${url}${joiner}_=${Date.now()}`
}

const getScriptInfo = () => {
  let scriptInfo = {}
  try {
    scriptInfo = GM_info?.script || {}
  } catch (error) {
    scriptInfo = {}
  }

  return {
    version: normalizeString(scriptInfo.version) || normalizeString(AppReleaseVersion) || normalizeString(AppVersion),
    buildId: normalizeString(scriptInfo.build) || normalizeString(scriptInfo.buildId) || normalizeString(AppBuildId),
    updateUrl: normalizeString(scriptInfo.updateURL) || normalizeString(scriptInfo.updateUrl) || normalizeString(AppUpdateUrl),
    downloadUrl: normalizeString(scriptInfo.downloadURL) || normalizeString(scriptInfo.downloadUrl) || normalizeString(AppDownloadUrl),
    homepageUrl: normalizeString(scriptInfo.homepageURL) || normalizeString(scriptInfo.homepageUrl) || normalizeString(AppHomepageUrl),
    supportUrl: normalizeString(scriptInfo.supportURL) || normalizeString(scriptInfo.supportUrl) || normalizeString(AppSupportUrl)
  }
}

const requestText = (url) => {
  if (!url) {
    return Promise.resolve({
      responseText: '',
      finalUrl: ''
    })
  }

  return new Promise((resolve) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: withCacheBust(url),
      timeout: 10 * 1000,
      headers: {
        pragma: 'no-cache',
        'cache-control': 'no-cache'
      },
      onload: (response) => {
        resolve({
          responseText: response?.responseText || '',
          finalUrl: response?.finalUrl || response?.responseURL || url
        })
      },
      onerror: () => resolve({
        responseText: '',
        finalUrl: url
      }),
      ontimeout: () => resolve({
        responseText: '',
        finalUrl: url
      })
    })
  })
}

const parseUserscriptMeta = (content) => {
  const meta = {}
  const lines = String(content || '').split(/\r?\n/)

  for (const line of lines) {
    const matched = line.match(/^\/\/\s*@([^\s]+)\s+(.+?)\s*$/)
    if (matched) {
      meta[matched[1]] = matched[2]
    }
    if (line.includes('// ==/UserScript==')) {
      break
    }
  }

  return meta
}

const toVersionParts = (version) => {
  return normalizeString(version)
    .split(/[.-]/)
    .map((part) => {
      const num = parseInt(part, 10)
      return Number.isNaN(num) ? 0 : num
    })
}

export const compareVersions = (currentVersion, nextVersion) => {
  const currentParts = toVersionParts(currentVersion)
  const nextParts = toVersionParts(nextVersion)
  const maxLength = Math.max(currentParts.length, nextParts.length)

  for (let index = 0; index < maxLength; index += 1) {
    const currentPart = currentParts[index] || 0
    const nextPart = nextParts[index] || 0

    if (currentPart < nextPart) {
      return -1
    }
    if (currentPart > nextPart) {
      return 1
    }
  }

  return 0
}

const compareReleaseVersions = (currentVersion, nextVersion, currentBuildId = '', nextBuildId = '') => {
  const versionCompareResult = compareVersions(currentVersion, nextVersion)
  if (versionCompareResult !== 0) {
    return versionCompareResult
  }

  const normalizedCurrentBuildId = normalizeString(currentBuildId)
  const normalizedNextBuildId = normalizeString(nextBuildId)

  if (!normalizedCurrentBuildId || !normalizedNextBuildId) {
    return 0
  }

  return compareVersions(normalizedCurrentBuildId, normalizedNextBuildId)
}

const buildReleaseKey = (version, buildId = '') => {
  const parts = [normalizeString(version), normalizeString(buildId)].filter(Boolean)
  return parts.join('#')
}

const formatReleaseVersion = (version, buildId = '') => {
  const normalizedVersion = normalizeString(version)
  const normalizedBuildId = normalizeString(buildId)

  if (!normalizedVersion) {
    return ''
  }

  if (!normalizedBuildId || normalizedVersion.endsWith(`.${normalizedBuildId}`)) {
    return normalizedVersion
  }

  return `${normalizedVersion}.${normalizedBuildId}`
}

const saveUpdateCheckState = (nextState) => {
  const currentState = getStoredUpdateCheckState()
  setStorage('updateCheckState', {
    ...currentState,
    ...nextState
  })
}

const rawGithubToJsdelivr = (url) => {
  const matched = normalizeString(url).match(/^https:\/\/raw\.githubusercontent\.com\/([^/]+)\/([^/]+)\/([^/]+)\/(.+)$/i)
  if (!matched) {
    return ''
  }

  const [, owner, repo, branch, filePath] = matched
  return `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/${filePath}`
}

const jsdelivrToRawGithub = (url) => {
  const matched = normalizeString(url).match(/^https:\/\/(?:cdn|fastly)\.jsdelivr\.net\/gh\/([^/]+)\/([^@/]+)@([^/]+)\/(.+)$/i)
  if (!matched) {
    return ''
  }

  const [, owner, repo, branch, filePath] = matched
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`
}

const swapMetaToUserScriptUrl = (url) => {
  const normalized = normalizeString(url)
  if (!normalized) {
    return ''
  }

  if (/\.meta\.js(?:[?#].*)?$/i.test(normalized)) {
    return normalized.replace(/\.meta\.js(?=($|[?#]))/i, '.user.js')
  }

  return normalized
}

const buildUrlVariants = (url) => uniqueStrings([
  normalizeString(url),
  rawGithubToJsdelivr(url),
  jsdelivrToRawGithub(url)
])

const buildRequestUrlCandidates = (scriptInfo) => uniqueStrings([
  ...buildUrlVariants(scriptInfo.updateUrl),
  ...buildUrlVariants(scriptInfo.downloadUrl)
])

const buildInstallUrlCandidates = (downloadUrl, updateUrl, sourceUrl, homepageUrl) => uniqueStrings([
  ...buildUrlVariants(downloadUrl),
  ...buildUrlVariants(swapMetaToUserScriptUrl(updateUrl)),
  ...buildUrlVariants(swapMetaToUserScriptUrl(sourceUrl)),
  normalizeString(homepageUrl)
])

const fetchMetaFromCandidates = async(candidates) => {
  const triedUrls = []
  let lastReason = 'missing-url'

  for (const candidate of candidates) {
    triedUrls.push(candidate)
    const response = await requestText(candidate)
    const content = normalizeString(response.responseText)

    if (!content) {
      lastReason = 'empty-response'
      continue
    }

    const meta = parseUserscriptMeta(content)
    const latestVersion = normalizeString(meta.version)
    if (!latestVersion) {
      lastReason = 'missing-version'
      continue
    }

    return {
      ok: true,
      meta,
      sourceUrl: candidate,
      finalUrl: response.finalUrl,
      triedUrls
    }
  }

  return {
    ok: false,
    reason: lastReason,
    triedUrls
  }
}

const getMetaField = (meta, fieldName) => {
  const aliasFieldName = fieldName.replace(/URL$/, 'Url')
  return normalizeString(meta[fieldName]) || normalizeString(meta[aliasFieldName])
}

const getPrimaryInstallUrl = (installUrlCandidates, fallbackUrl) => installUrlCandidates[0] || normalizeString(fallbackUrl) || ''

const getRequestFailureMessage = (reason) => {
  const reasonMap = {
    'missing-url': '未配置更新地址',
    'empty-response': '更新源没有返回内容',
    'missing-version': '更新源里没有解析到版本号'
  }

  return reasonMap[reason] || '未知错误'
}

const getAutoCheckSkipReason = (state, intervalMs, retryIntervalMs) => {
  const rawLastCheckAt = Number(state.lastCheckAt || 0)
  const lastFailureCheckAt = Number(state.lastFailureCheckAt || (state.lastResult === 'error' ? rawLastCheckAt : 0))
  const lastSuccessCheckAt = Number(state.lastSuccessCheckAt || (lastFailureCheckAt > 0 ? 0 : rawLastCheckAt))
  const now = Date.now()

  if (lastFailureCheckAt > lastSuccessCheckAt && now - lastFailureCheckAt < retryIntervalMs) {
    return 'retry-cooldown'
  }

  if (lastSuccessCheckAt > 0 && now - lastSuccessCheckAt < intervalMs) {
    return 'cooldown'
  }

  return ''
}

const openUpdatePage = (urls) => {
  const candidates = Array.isArray(urls) ? urls : [urls]
  const targetUrl = candidates.find(url => normalizeString(url))

  if (!targetUrl) {
    return null
  }

  try {
    if (typeof GM_openInTab !== 'undefined') {
      return GM_openInTab(targetUrl, {
        active: true,
        insert: true,
        setParent: true
      })
    }
  } catch (error) {
    console.log('openUpdatePageError: ', error)
  }

  return window.open(targetUrl, '_blank')
}

export const fetchLatestScriptVersion = async() => {
  const scriptInfo = getScriptInfo()
  const requestCandidates = buildRequestUrlCandidates(scriptInfo)
  const currentVersion = scriptInfo.version || AppReleaseVersion || AppVersion
  const currentBuildId = scriptInfo.buildId || AppBuildId

  if (requestCandidates.length === 0) {
    return {
      ok: false,
      reason: 'missing-url',
      currentVersion,
      currentBuildId,
      triedUrls: []
    }
  }

  const metaResult = await fetchMetaFromCandidates(requestCandidates)
  if (!metaResult.ok) {
    return {
      ok: false,
      reason: metaResult.reason,
      currentVersion,
      currentBuildId,
      triedUrls: metaResult.triedUrls || []
    }
  }

  const meta = metaResult.meta
  const latestVersion = normalizeString(meta.version)
  const latestBuildId = getMetaField(meta, 'build') || getMetaField(meta, 'buildId')
  const updateUrl = getMetaField(meta, 'updateURL') || scriptInfo.updateUrl || metaResult.sourceUrl
  const downloadUrl = getMetaField(meta, 'downloadURL') || scriptInfo.downloadUrl || swapMetaToUserScriptUrl(updateUrl) || metaResult.sourceUrl
  const homepageUrl = getMetaField(meta, 'homepageURL') || scriptInfo.homepageUrl
  const supportUrl = getMetaField(meta, 'supportURL') || scriptInfo.supportUrl
  const installUrlCandidates = buildInstallUrlCandidates(downloadUrl, updateUrl, metaResult.sourceUrl, homepageUrl)
  const releaseCompareResult = compareReleaseVersions(currentVersion, latestVersion, currentBuildId, latestBuildId)

  return {
    ok: true,
    currentVersion,
    currentBuildId,
    currentDisplayVersion: formatReleaseVersion(currentVersion, currentBuildId),
    latestVersion,
    latestBuildId,
    latestDisplayVersion: formatReleaseVersion(latestVersion, latestBuildId),
    hasUpdate: releaseCompareResult < 0,
    releaseKey: buildReleaseKey(latestVersion, latestBuildId),
    updateUrl,
    downloadUrl,
    homepageUrl,
    supportUrl,
    sourceUrl: metaResult.sourceUrl || metaResult.finalUrl || '',
    triedUrls: metaResult.triedUrls || requestCandidates,
    installUrlCandidates,
    installUrl: getPrimaryInstallUrl(installUrlCandidates, downloadUrl || updateUrl || homepageUrl || supportUrl)
  }
}

const notifyLatestVersion = (currentVersion) => {
  window.alert(`${AppName} 当前已是最新版本（${currentVersion}）。`)
}

const confirmUpdate = (currentVersion, latestVersion) => {
  return window.confirm(
    `${AppName} 检测到新版本。\n\n当前版本：${currentVersion}\n最新版本：${latestVersion}\n\n是否现在前往更新？`
  )
}

export const runScriptUpdateCheck = async({ manual = false } = {}) => {
  if (isDev) {
    if (manual) {
      window.alert('开发环境下不检查更新。')
    }
    return {
      ok: false,
      skipped: true,
      reason: 'development'
    }
  }

  const settings = getStoredUpdateSettings()
  const state = getStoredUpdateCheckState()
  const intervalHours = Math.max(1, Number(settings.checkIntervalHours) || updateSettingsDefault.checkIntervalHours)
  const intervalMs = intervalHours * 60 * 60 * 1000
  const retryIntervalMs = updateRetryIntervalMinutes * 60 * 1000

  if (!manual) {
    if (!settings.autoCheckOnLoad) {
      return {
        ok: false,
        skipped: true,
        reason: 'disabled'
      }
    }

    const skipReason = getAutoCheckSkipReason(state, intervalMs, retryIntervalMs)
    if (skipReason) {
      return {
        ok: false,
        skipped: true,
        reason: skipReason
      }
    }
  }

  const checkedAt = Date.now()
  const result = await fetchLatestScriptVersion()

  if (!result.ok) {
    saveUpdateCheckState({
      lastCheckAt: checkedAt,
      lastFailureCheckAt: checkedAt,
      lastResult: 'error',
      lastReason: result.reason || '',
      lastSourceUrl: (result.triedUrls && result.triedUrls[0]) || ''
    })

    if (manual) {
      const triedUrlsText = (result.triedUrls || []).slice(0, 3).join('\n')
      const triedSuffix = triedUrlsText ? `\n\n已尝试：\n${triedUrlsText}` : ''
      window.alert(`检查更新失败：${getRequestFailureMessage(result.reason)}。${triedSuffix}`)
    }
    return result
  }

  saveUpdateCheckState({
    lastCheckAt: checkedAt,
    lastSuccessCheckAt: checkedAt,
    lastFailureCheckAt: 0,
    latestVersion: result.latestDisplayVersion || result.latestVersion || '',
    latestBuildId: result.latestBuildId || '',
    latestDownloadUrl: result.downloadUrl || '',
    latestUpdateUrl: result.updateUrl || '',
    lastResult: result.hasUpdate ? 'update-available' : 'up-to-date',
    lastReason: '',
    lastSourceUrl: result.sourceUrl || ''
  })

  if (!result.hasUpdate) {
    if (manual) {
      notifyLatestVersion(result.currentDisplayVersion || result.currentVersion)
    }
    return result
  }

  const latestReleaseKey = result.releaseKey || buildReleaseKey(result.latestVersion, result.latestBuildId)
  const lastPromptReleaseKey = state.lastPromptReleaseKey || state.lastPromptVersion

  if (!manual && lastPromptReleaseKey === latestReleaseKey) {
    return {
      ...result,
      skipped: true,
      reason: 'already-prompted'
    }
  }

  saveUpdateCheckState({
    lastPromptVersion: result.latestVersion,
    lastPromptReleaseKey: latestReleaseKey
  })

  const accepted = confirmUpdate(
    result.currentDisplayVersion || result.currentVersion,
    result.latestDisplayVersion || result.latestVersion
  )
  if (accepted) {
    openUpdatePage(result.installUrlCandidates || [result.installUrl || result.downloadUrl || result.updateUrl || result.homepageUrl || result.supportUrl])
  }

  return {
    ...result,
    accepted
  }
}

export {
  updateSettingsDefault,
  updateCheckStateDefault,
  updateRetryIntervalMinutes
}
