/* eslint-disable no-undef */
import {
  AppName,
  AppVersion,
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

const updateCheckStateDefault = {
  lastCheckAt: 0,
  lastPromptVersion: '',
  latestVersion: '',
  latestDownloadUrl: '',
  latestUpdateUrl: ''
}

const normalizeString = (value) => typeof value === 'string' ? value.trim() : ''

const getUpdateSettings = () => ({
  ...updateSettingsDefault,
  ...(getStorage('updateSettings') || {})
})

const getUpdateCheckState = () => ({
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
    updateUrl: normalizeString(AppUpdateUrl) || normalizeString(scriptInfo.updateURL),
    downloadUrl: normalizeString(AppDownloadUrl) || normalizeString(scriptInfo.downloadURL),
    homepageUrl: normalizeString(AppHomepageUrl) || normalizeString(scriptInfo.homepageURL),
    supportUrl: normalizeString(AppSupportUrl) || normalizeString(scriptInfo.supportURL)
  }
}

const requestText = (url) => {
  if (!url) {
    return Promise.resolve('')
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
        resolve(response?.responseText || '')
      },
      onerror: () => resolve(''),
      ontimeout: () => resolve('')
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
    .map(part => {
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

const saveUpdateCheckState = (nextState) => {
  const currentState = getUpdateCheckState()
  setStorage('updateCheckState', {
    ...currentState,
    ...nextState
  })
}

const openUpdatePage = (url) => {
  if (!url) {
    return null
  }

  try {
    if (typeof GM_openInTab !== 'undefined') {
      return GM_openInTab(url, {
        active: true,
        insert: true,
        setParent: true
      })
    }
  } catch (error) {
    console.log('openUpdatePageError: ', error)
  }

  return window.open(url, '_blank')
}

export const fetchLatestScriptVersion = async() => {
  const scriptInfo = getScriptInfo()
  const requestUrl = scriptInfo.updateUrl || scriptInfo.downloadUrl

  if (!requestUrl) {
    return {
      ok: false,
      reason: 'missing-url',
      currentVersion: AppVersion
    }
  }

  const responseText = await requestText(requestUrl)
  if (!responseText) {
    return {
      ok: false,
      reason: 'empty-response',
      currentVersion: AppVersion,
      updateUrl: requestUrl
    }
  }

  const meta = parseUserscriptMeta(responseText)
  const latestVersion = normalizeString(meta.version)
  const updateUrl = normalizeString(meta.updateURL) || scriptInfo.updateUrl || requestUrl
  const downloadUrl = normalizeString(meta.downloadURL) || scriptInfo.downloadUrl || requestUrl
  const homepageUrl = normalizeString(meta.homepageURL) || scriptInfo.homepageUrl
  const supportUrl = normalizeString(meta.supportURL) || scriptInfo.supportUrl

  if (!latestVersion) {
    return {
      ok: false,
      reason: 'missing-version',
      currentVersion: AppVersion,
      updateUrl,
      downloadUrl,
      homepageUrl,
      supportUrl
    }
  }

  return {
    ok: true,
    currentVersion: AppVersion,
    latestVersion,
    hasUpdate: compareVersions(AppVersion, latestVersion) < 0,
    updateUrl,
    downloadUrl,
    homepageUrl,
    supportUrl
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

  const settings = getUpdateSettings()
  const state = getUpdateCheckState()
  const intervalHours = Math.max(1, Number(settings.checkIntervalHours) || updateSettingsDefault.checkIntervalHours)
  const intervalMs = intervalHours * 60 * 60 * 1000
  const lastCheckAt = Number(state.lastCheckAt || 0)

  if (!manual) {
    if (!settings.autoCheckOnLoad) {
      return {
        ok: false,
        skipped: true,
        reason: 'disabled'
      }
    }

    if (Date.now() - lastCheckAt < intervalMs) {
      return {
        ok: false,
        skipped: true,
        reason: 'cooldown'
      }
    }
  }

  const result = await fetchLatestScriptVersion()
  const nextState = {
    lastCheckAt: Date.now()
  }
  if (result.ok) {
    nextState.latestVersion = result.latestVersion || ''
    nextState.latestDownloadUrl = result.downloadUrl || ''
    nextState.latestUpdateUrl = result.updateUrl || ''
  }
  saveUpdateCheckState(nextState)

  if (!result.ok) {
    if (manual) {
      window.alert('检查更新失败，请稍后重试。')
    }
    return result
  }

  if (!result.hasUpdate) {
    if (manual) {
      notifyLatestVersion(result.currentVersion)
    }
    return result
  }

  if (!manual && state.lastPromptVersion === result.latestVersion) {
    return {
      ...result,
      skipped: true,
      reason: 'already-prompted'
    }
  }

  saveUpdateCheckState({
    lastPromptVersion: result.latestVersion
  })

  const accepted = confirmUpdate(result.currentVersion, result.latestVersion)
  if (accepted) {
    openUpdatePage(result.downloadUrl || result.updateUrl || result.homepageUrl || result.supportUrl)
  }

  return {
    ...result,
    accepted
  }
}
