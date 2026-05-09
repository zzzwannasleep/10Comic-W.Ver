import { getStorage, setStorage } from '@/config/setup'
import { request } from '@/utils/index'
import { trimSpecial } from '@/utils/index'
import { getMetadataSettings } from '@/utils/metadata'

const BANGUMI_SEARCH_API = 'https://api.bgm.tv/v0/search/subjects'
const BANGUMI_SUBJECT_API = 'https://api.bgm.tv/v0/subjects'
const BANGUMI_WEB_URL = 'https://bgm.tv/subject'
const CACHE_KEY = 'bangumiMetadataCache'
const CACHE_TTL = 30 * 24 * 60 * 60 * 1000
const MAX_CANDIDATE_COUNT = 4
const pendingMetadataMap = new Map()

const normalizeText = (value) => {
  return trimSpecial(String(value || ''))
    .replace(/[【】\[\]()（）「」『』《》〈〉]/g, ' ')
    .replace(/[·•:：]/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

const normalizeCompareText = (value) => {
  return normalizeText(value)
    .toLowerCase()
    .replace(/\s+/g, '')
}

const normalizeKeyword = (value) => {
  return normalizeText(value)
    .replace(/(?:第?\s*\d+(?:\.\d+)?\s*(?:话|話|卷|章|冊|集)|单行本|單行本|漫画|漫畫|コミック|comics?)$/i, '')
    .trim()
}

const buildCacheKey = (downloadItem) => {
  return [
    normalizeCompareText(downloadItem.comicName),
    normalizeCompareText(downloadItem.authorName),
    normalizeCompareText(downloadItem.webName)
  ].join('::')
}

const cloneData = (value) => {
  return JSON.parse(JSON.stringify(value))
}

const getCacheMap = () => {
  return getStorage(CACHE_KEY) || {}
}

const getCachedMetadata = (cacheKey) => {
  const cacheMap = getCacheMap()
  const item = cacheMap[cacheKey]
  if (!item?.savedAt || !item.data) {
    return null
  }
  if (Date.now() - item.savedAt > CACHE_TTL) {
    return null
  }
  return cloneData(item.data)
}

const saveCachedMetadata = (cacheKey, data) => {
  const cacheMap = getCacheMap()
  cacheMap[cacheKey] = {
    savedAt: Date.now(),
    data
  }
  setStorage(CACHE_KEY, cacheMap)
  return data
}

const getBangumiHeaders = (settings) => {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': '10Comic Metadata Scraper'
  }
  if (settings.bangumiAccessToken) {
    headers.Authorization = `Bearer ${settings.bangumiAccessToken}`
  }
  return headers
}

const parseResponseJson = (response) => {
  const raw = response?.responseText || response?.response || ''
  if (!raw) {
    return null
  }
  if (typeof raw === 'object') {
    return raw
  }
  try {
    return JSON.parse(raw)
  } catch (error) {
    return null
  }
}

const toText = (value) => {
  if (value === undefined || value === null) {
    return ''
  }
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value).trim()
  }
  if (Array.isArray(value)) {
    return value.map(item => toText(item)).filter(Boolean).join(' / ')
  }
  if (typeof value === 'object') {
    return toText(value.v || value.value || value.k || value.name || '')
  }
  return ''
}

const getInfoboxEntries = (subject) => {
  return Array.isArray(subject?.infobox) ? subject.infobox : []
}

const matchInfoboxKey = (key = '', words = []) => {
  return words.some(word => key.toLowerCase().includes(word.toLowerCase()))
}

const pickInfoboxTexts = (subject, keyWords = []) => {
  return getInfoboxEntries(subject)
    .filter(item => matchInfoboxKey(item?.key || '', keyWords))
    .map(item => toText(item?.value))
    .filter(Boolean)
}

const pickFirstInfoboxText = (subject, keyWords = []) => {
  return pickInfoboxTexts(subject, keyWords)[0] || ''
}

const buildAliasList = (subject) => {
  const aliases = []
  ;['别名', '中文名', '英文名', '日文名', '罗马字', 'romanji', 'alias'].forEach((keyWord) => {
    pickInfoboxTexts(subject, [keyWord]).forEach((item) => aliases.push(item))
  })
  if (subject?.name_cn) {
    aliases.push(subject.name_cn)
  }
  if (subject?.name) {
    aliases.push(subject.name)
  }
  return [...new Set(aliases.map(item => normalizeText(item)).filter(Boolean))]
}

const parseCount = (value) => {
  const match = String(value || '').match(/(\d+)/)
  return match ? parseInt(match[1]) : undefined
}

const splitPersonNames = (value) => {
  return String(value || '')
    .split(/[\/／&＆,，、]/)
    .map(item => normalizeText(item))
    .filter(Boolean)
}

const dedupeList = (list = []) => {
  return [...new Set((list || []).map(item => normalizeText(item)).filter(Boolean))]
}

const buildSearchKeywords = (downloadItem) => {
  const keywords = []
  const title = normalizeKeyword(downloadItem.comicName)
  const authorName = normalizeText(downloadItem.authorName)
  if (title) {
    keywords.push(title)
  }
  if (title && authorName) {
    keywords.push(`${title} ${authorName}`)
  }
  if (downloadItem.comicName && downloadItem.comicName !== title) {
    keywords.push(normalizeText(downloadItem.comicName))
  }
  return [...new Set(keywords.filter(Boolean))]
}

const searchBangumiSubjects = async(keyword, settings) => {
  const query = `${BANGUMI_SEARCH_API}?limit=10&offset=0`
  const payload = {
    keyword,
    sort: 'rank',
    filter: {
      type: [1],
      nsfw: settings.bangumiIncludeNsfw === true
    }
  }
  const response = await request({
    method: 'post',
    url: query,
    data: JSON.stringify(payload),
    headers: getBangumiHeaders(settings)
  })
  const result = parseResponseJson(response)
  if (!result) {
    return []
  }
  if (Array.isArray(result)) {
    return result
  }
  if (Array.isArray(result.data)) {
    return result.data
  }
  if (Array.isArray(result.list)) {
    return result.list
  }
  return []
}

const getBangumiSubject = async(subjectId, settings) => {
  const response = await request({
    method: 'get',
    url: `${BANGUMI_SUBJECT_API}/${subjectId}`,
    headers: getBangumiHeaders(settings)
  })
  return parseResponseJson(response)
}

const getBangumiSubjectPersons = async(subjectId, settings) => {
  try {
    const response = await request({
      method: 'get',
      url: `${BANGUMI_SUBJECT_API}/${subjectId}/persons`,
      headers: getBangumiHeaders(settings)
    })
    const result = parseResponseJson(response)
    if (Array.isArray(result)) {
      return result
    }
    if (Array.isArray(result?.data)) {
      return result.data
    }
  } catch (error) {
    //
  }
  return []
}

const getPlatformPenalty = (subject) => {
  const platform = normalizeText(subject?.platform || pickFirstInfoboxText(subject, ['平台', '类型', '類型']))
  if (!platform) {
    return 0
  }
  if (/(小说|小説|novel)/i.test(platform)) {
    return -80
  }
  if (/(漫画|漫畫|コミック|manga)/i.test(platform)) {
    return 30
  }
  return 0
}

const hasAuthorMatch = (subject, downloadItem) => {
  const authorName = normalizeCompareText(downloadItem.authorName)
  if (!authorName) {
    return false
  }
  const authorFields = [
    ...pickInfoboxTexts(subject, ['作者', '作画', '作畫', '原作', '脚本', '脚本协力', '漫畫']),
    ...(subject._personNames || [])
  ]
  return authorFields.some(item => normalizeCompareText(item).includes(authorName) || authorName.includes(normalizeCompareText(item)))
}

const scoreBangumiSubject = (subject, downloadItem) => {
  const targetTitle = normalizeCompareText(downloadItem.comicName)
  const compareTitles = dedupeList([subject?.name_cn, subject?.name, ...buildAliasList(subject)])
  let score = 0

  compareTitles.forEach((title) => {
    const value = normalizeCompareText(title)
    if (!value) {
      return
    }
    if (value === targetTitle) {
      score += 140
      return
    }
    if (value.includes(targetTitle) || targetTitle.includes(value)) {
      score += 80
    }
  })

  if (hasAuthorMatch(subject, downloadItem)) {
    score += 70
  }

  score += getPlatformPenalty(subject)

  if (subject?.rating?.score) {
    score += Math.min(Math.round(subject.rating.score * 2), 20)
  }

  if (subject?.rank) {
    score += Math.max(0, 20 - Math.floor(subject.rank / 100))
  }

  if (subject?.date) {
    score += 5
  }

  return score
}

const enrichWithPersons = async(subject, settings) => {
  const persons = await getBangumiSubjectPersons(subject.id, settings)
  const writerList = []
  const illustratorList = []
  const personNames = []

  persons.forEach((person) => {
    const name = normalizeText(person?.name_cn || person?.name || '')
    const relation = normalizeText(person?.relation || person?.type || '')
    if (!name) {
      return
    }
    personNames.push(name)
    if (/(作者|原作|脚本|编剧|編劇)/i.test(relation)) {
      writerList.push(name)
    }
    if (/(作画|作畫|绘师|繪師|插画|插畫)/i.test(relation)) {
      illustratorList.push(name)
    }
  })

  return {
    ...subject,
    _personNames: personNames,
    _personWriters: dedupeList(writerList),
    _personIllustrators: dedupeList(illustratorList)
  }
}

const buildStatus = (subject) => {
  const statusText = pickFirstInfoboxText(subject, ['连载状态', '連載狀態', '状态', '狀態'])
  if (/(完结|完結|已完|finished|completed)/i.test(statusText)) {
    return 'ended'
  }
  if (/(连载|連載|ongoing|连载中|連載中)/i.test(statusText)) {
    return 'ongoing'
  }
  if (pickFirstInfoboxText(subject, ['结束', '完结', '完結'])) {
    return 'ended'
  }
  return undefined
}

const normalizeScrapedMetadata = (subject) => {
  const writers = dedupeList([
    ...splitPersonNames(pickFirstInfoboxText(subject, ['作者', '原作', '脚本', '编剧', '編劇'])),
    ...(subject?._personWriters || [])
  ])
  const illustrators = dedupeList([
    ...splitPersonNames(pickFirstInfoboxText(subject, ['作画', '作畫', '绘师', '繪師', '插画', '插畫'])),
    ...(subject?._personIllustrators || [])
  ])
  const tags = dedupeList((subject?.tags || []).slice(0, 8).map(item => item?.name || item))
  const publisher = pickFirstInfoboxText(subject, ['出版社', '连载杂志', '連載雜誌', 'レーベル', 'label'])
  const issueCount = parseCount(pickFirstInfoboxText(subject, ['话数', '話數', '章节数', '章數', '总话数', '總話數']))
  const volumeCount = parseCount(pickFirstInfoboxText(subject, ['册数', '冊數', '卷数', '卷數', '单行本', '單行本']))
  const subjectUrl = `${BANGUMI_WEB_URL}/${subject.id}`
  const seriesTitle = normalizeText(subject?.name_cn || subject?.name)

  return {
    source: 'Bangumi',
    subjectId: subject.id,
    subjectUrl,
    seriesTitle,
    originalTitle: normalizeText(subject?.name),
    aliases: buildAliasList(subject),
    summary: trimSpecial(subject?.summary || ''),
    publisher,
    writers,
    illustrators,
    tags,
    issueCount,
    volumeCount,
    releaseDate: subject?.date || '',
    status: buildStatus(subject),
    coverUrl: subject?.images?.large || subject?.images?.common || subject?.images?.medium || subject?.images?.small || '',
    languageISO: '',
    confidence: subject?._matchScore || 0
  }
}

const pickBestSubject = async(searchResults, downloadItem, settings) => {
  const detailCandidates = await Promise.all(
    searchResults
      .slice(0, MAX_CANDIDATE_COUNT)
      .map(async(item) => {
        const subject = await getBangumiSubject(item.id, settings)
        if (!subject) {
          return null
        }
        const enrichedSubject = await enrichWithPersons(subject, settings)
        enrichedSubject._matchScore = scoreBangumiSubject(enrichedSubject, downloadItem)
        return enrichedSubject
      })
  )

  const validCandidates = detailCandidates.filter(Boolean).sort((a, b) => b._matchScore - a._matchScore)
  if (validCandidates.length === 0) {
    return null
  }
  if (validCandidates[0]._matchScore < 60) {
    return null
  }
  return validCandidates[0]
}

const fetchBangumiMetadata = async(downloadItem, settings) => {
  const keywords = buildSearchKeywords(downloadItem)
  for (let i = 0; i < keywords.length; i++) {
    const searchResults = await searchBangumiSubjects(keywords[i], settings)
    if (searchResults.length === 0) {
      continue
    }
    const bestSubject = await pickBestSubject(searchResults, downloadItem, settings)
    if (bestSubject) {
      return normalizeScrapedMetadata(bestSubject)
    }
  }
  return null
}

export const getBangumiMetadata = async(downloadItem) => {
  const settings = getMetadataSettings()
  if (settings.enableBangumiScrape !== true) {
    return null
  }

  const cacheKey = buildCacheKey(downloadItem)
  const cachedData = getCachedMetadata(cacheKey)
  if (cachedData) {
    return cachedData
  }

  if (pendingMetadataMap.has(cacheKey)) {
    return pendingMetadataMap.get(cacheKey)
  }

  const promise = fetchBangumiMetadata(downloadItem, settings)
    .then((data) => {
      if (!data) {
        return null
      }
      return saveCachedMetadata(cacheKey, data)
    })
    .finally(() => {
      pendingMetadataMap.delete(cacheKey)
    })

  pendingMetadataMap.set(cacheKey, promise)
  return promise
}
