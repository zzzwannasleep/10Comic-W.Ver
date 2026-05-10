import { getStorage, setStorage } from '@/config/setup'
import { getComicInfoFromHtml, findWebByUrl, searchComicsAcrossWebs } from '@/utils/comics'
import { request } from '@/utils/index'
import { trimSpecial } from '@/utils/index'

const cloneData = (value) => {
  return JSON.parse(JSON.stringify(value || []))
}

const dedupeChapters = (chapterList) => {
  const urlSet = new Set()
  const result = []
  chapterList.forEach((item) => {
    if (!item?.url || item.url === 'javascript:void();' || urlSet.has(item.url)) {
      return
    }
    urlSet.add(item.url)
    result.push(item)
  })
  return result
}

const normalizeCompareText = (value) => {
  return trimSpecial(String(value || ''))
    .toLowerCase()
    .replace(/[【】\[\]()（）「」『』《》〈〉]/g, '')
    .replace(/[·•:：]/g, '')
    .replace(/\s+/g, '')
}

const scoreSearchResultName = (keyword, resultName) => {
  const target = normalizeCompareText(keyword)
  const current = normalizeCompareText(resultName)
  if (!target || !current) {
    return 0
  }
  if (target === current) {
    return 120
  }
  if (current.includes(target) || target.includes(current)) {
    return 80
  }
  let prefixLen = 0
  while (prefixLen < target.length && prefixLen < current.length && target[prefixLen] === current[prefixLen]) {
    prefixLen++
  }
  if (prefixLen >= 2) {
    return 30 + prefixLen
  }
  return 0
}

const pickBestSearchResult = (keyword, resultList = []) => {
  const candidates = (resultList || [])
    .map(item => ({
      ...item,
      _score: scoreSearchResultName(keyword, item.name)
    }))
    .filter(item => item._score > 0)
    .sort((a, b) => b._score - a._score)

  if (candidates.length === 0 || candidates[0]._score < 60) {
    return null
  }
  return candidates[0]
}

const mergeKnownUrl = (item, chapterUrls) => {
  const urlSet = new Set(item.knownChapterUrls || [])
  chapterUrls.forEach(url => urlSet.add(url))
  item.knownChapterUrls = [...urlSet]
}

const getFollowInfoByRequest = async(webRule, comicPageUrl) => {
  const { responseText } = await request({ method: 'get', url: comicPageUrl, headers: webRule.headers || '' })
  return getComicInfoFromHtml(responseText, webRule, comicPageUrl)
}

export const searchFollowCandidatesByKeyword = async(keyword, selectedWebNames = []) => {
  const currentKeyword = trimSpecial(keyword || '')
  if (!currentKeyword) {
    return {
      candidates: [],
      skippedSites: []
    }
  }

  const searchResultList = await searchComicsAcrossWebs(currentKeyword, selectedWebNames)
  const candidates = []
  const skippedSites = []

  for (let i = 0; i < searchResultList.length; i++) {
    const item = searchResultList[i]
    const bestResult = pickBestSearchResult(currentKeyword, item.findres || [])
    if (!bestResult?.url) {
      skippedSites.push({
        webName: item.webName,
        reason: item.error ? 'search-error' : 'no-match'
      })
      continue
    }

    try {
      const info = await getFollowInfoByRequest(item.webRule || findWebByUrl(bestResult.url), bestResult.url)
      const chapterList = dedupeChapters(info.chapters || [])
      if (chapterList.length === 0) {
        skippedSites.push({
          webName: item.webName,
          reason: 'no-chapters'
        })
        continue
      }
      candidates.push({
        key: `${item.webName}__${bestResult.url}`,
        comicName: info.comicName || bestResult.name || currentKeyword,
        authorName: info.authorName || '',
        webName: item.webName,
        comicPageUrl: bestResult.url,
        chapters: chapterList,
        seriesChapterCount: chapterList.length,
        latestChapterName: chapterList[0]?.chapterName || '',
        latestChapterUrl: chapterList[0]?.url || '',
        matchedName: bestResult.name || ''
      })
    } catch (error) {
      skippedSites.push({
        webName: item.webName,
        reason: 'fetch-error',
        error
      })
    }
  }

  return {
    candidates,
    skippedSites
  }
}

export const addFollowCandidates = (candidateList = []) => {
  const addedItems = []
  candidateList.forEach((candidate) => {
    const followItem = upsertFollowItem({
      comicName: candidate.comicName,
      authorName: candidate.authorName,
      webName: candidate.webName,
      comicPageUrl: candidate.comicPageUrl,
      chapters: candidate.chapters || []
    })
    addedItems.push(followItem)
  })
  return addedItems
}

export const addFollowItemsByKeyword = async(keyword, selectedWebNames = []) => {
  const result = await searchFollowCandidatesByKeyword(keyword, selectedWebNames)
  const matchedItems = addFollowCandidates(result.candidates)
  return {
    matchedItems,
    skippedSites: result.skippedSites
  }
}

export const getFollowList = () => {
  return cloneData(getStorage('followList') || [])
}

export const saveFollowList = (followList) => {
  setStorage('followList', followList)
  return true
}

export const getFollowSettings = () => {
  return getStorage('followSettings') || {}
}

export const getFollowCheckState = () => {
  return getStorage('followCheckState') || { lastCheckAt: 0, lastUpdateCount: 0 }
}

export const setFollowCheckState = (state) => {
  setStorage('followCheckState', state)
}

export const canAutoCheckFollow = () => {
  const settings = getFollowSettings()
  if (settings.autoCheckOnLoad === false) {
    return false
  }
  const state = getFollowCheckState()
  const cooldownMinutes = parseInt(settings.checkCooldownMinutes || 30)
  return Date.now() - (state.lastCheckAt || 0) >= cooldownMinutes * 60 * 1000
}

export const findFollowItem = (comicPageUrl, webName, comicName) => {
  const followList = getFollowList()
  return followList.find(item => {
    return (comicPageUrl && item.comicPageUrl === comicPageUrl) ||
      (item.webName === webName && item.comicName === comicName)
  }) || null
}

export const buildFollowItem = ({ comicName, authorName, webName, comicPageUrl, chapters }) => {
  const latestChapter = chapters[0] || null
  return {
    id: `${Date.now()}_${Math.random().toString(16).slice(2, 8)}`,
    comicName,
    authorName: authorName || '',
    webName,
    comicPageUrl,
    knownChapterUrls: chapters.map(item => item.url),
    pendingChapters: [],
    latestChapterName: latestChapter?.chapterName || '',
    latestChapterUrl: latestChapter?.url || '',
    seriesChapterCount: chapters.length,
    lastCheckedAt: Date.now(),
    lastError: '',
    autoDownload: false
  }
}

export const upsertFollowItem = (followPayload) => {
  const followList = getFollowList()
  const index = followList.findIndex(item => item.comicPageUrl === followPayload.comicPageUrl)
  if (index === -1) {
        const followItem = buildFollowItem(followPayload)
    followList.unshift(followItem)
    saveFollowList(followList)
    return followItem
  }

  const currentItem = followList[index]
  currentItem.comicName = followPayload.comicName
  currentItem.authorName = followPayload.authorName || currentItem.authorName || ''
  currentItem.webName = followPayload.webName
  currentItem.seriesChapterCount = followPayload.chapters.length
  currentItem.latestChapterName = followPayload.chapters[0]?.chapterName || currentItem.latestChapterName
  currentItem.latestChapterUrl = followPayload.chapters[0]?.url || currentItem.latestChapterUrl
  currentItem.lastCheckedAt = Date.now()
  currentItem.lastError = ''
  followList.splice(index, 1, currentItem)
  saveFollowList(followList)
  return currentItem
}

export const updateFollowItem = (followItemId, updater) => {
  const followList = getFollowList()
  const index = followList.findIndex(item => item.id === followItemId)
  if (index === -1) {
    return null
  }
  const nextItem = updater(cloneData(followList[index]))
  followList.splice(index, 1, nextItem)
  saveFollowList(followList)
  return nextItem
}

export const removeFollowItem = (followItemId) => {
  const followList = getFollowList().filter(item => item.id !== followItemId)
  saveFollowList(followList)
  return followList
}

export const clearPendingChapters = (followItemId, chapterUrls = []) => {
  return updateFollowItem(followItemId, (item) => {
    const clearSet = new Set(chapterUrls)
    if (chapterUrls.length > 0) {
      mergeKnownUrl(item, chapterUrls)
      item.pendingChapters = (item.pendingChapters || []).filter(chapter => !clearSet.has(chapter.url))
    } else {
      mergeKnownUrl(item, (item.pendingChapters || []).map(chapter => chapter.url))
      item.pendingChapters = []
    }
    return item
  })
}

export const syncFollowItem = async(followItem) => {
  const webRule = findWebByUrl(followItem.comicPageUrl)
  if (!webRule) {
    return {
      ...followItem,
      lastCheckedAt: Date.now(),
      lastError: '未找到站点规则'
    }
  }

  const info = await getFollowInfoByRequest(webRule, followItem.comicPageUrl)
  const chapterList = dedupeChapters(info.chapters || [])
  const knownUrlSet = new Set([...(followItem.knownChapterUrls || []), ...((followItem.pendingChapters || []).map(item => item.url))])
  const newChapters = chapterList.filter(item => !knownUrlSet.has(item.url))

  const nextItem = cloneData(followItem)
  nextItem.comicName = info.comicName || followItem.comicName
  nextItem.authorName = followItem.authorName || info.authorName || ''
  nextItem.latestChapterName = chapterList[0]?.chapterName || followItem.latestChapterName
  nextItem.latestChapterUrl = chapterList[0]?.url || followItem.latestChapterUrl
  nextItem.seriesChapterCount = chapterList.length
  nextItem.lastCheckedAt = Date.now()
  nextItem.lastError = ''
  nextItem.pendingChapters = dedupeChapters([...(followItem.pendingChapters || []), ...newChapters])
  return nextItem
}

export const checkFollowItem = async(followItemId) => {
  const followList = getFollowList()
  const index = followList.findIndex(item => item.id === followItemId)
  if (index === -1) {
    return null
  }

  try {
    const nextItem = await syncFollowItem(followList[index])
    followList.splice(index, 1, nextItem)
    saveFollowList(followList)
    return nextItem
  } catch (error) {
    followList[index].lastCheckedAt = Date.now()
    followList[index].lastError = error.message || String(error)
    saveFollowList(followList)
    return followList[index]
  }
}

export const checkAllFollowItems = async() => {
  const followList = getFollowList()
  const result = []

  for (let i = 0; i < followList.length; i++) {
    try {
      const nextItem = await syncFollowItem(followList[i])
      followList.splice(i, 1, nextItem)
      result.push(nextItem)
    } catch (error) {
      followList[i].lastCheckedAt = Date.now()
      followList[i].lastError = error.message || String(error)
      result.push(followList[i])
    }
  }
  saveFollowList(followList)
  const updateCount = followList.reduce((sum, item) => sum + ((item.pendingChapters || []).length > 0 ? 1 : 0), 0)
  setFollowCheckState({
    lastCheckAt: Date.now(),
    lastUpdateCount: updateCount
  })
  return followList
}
