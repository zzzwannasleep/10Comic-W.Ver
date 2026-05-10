import { getStorage } from '@/config/setup'
import { trimSpecial } from '@/utils/index'

const invalidFileNameReg = /[\\/:*?"<>|]/g
const metadataListSplitReg = /[\n,，/、|]+/g

export const defaultZipNameTemplate = '[站点名字][作者名][漫画名称][章节名称][多少P]'
const legacyDefaultZipNameTemplate = '[站点名字][作者名][漫画名称][章节名称][多少P]P'

export const metadataSettingsDefault = {
  enableComicInfoXml: true,
  enableSeriesJson: false,
  enableSeriesCover: false,
  enableMetadataPreview: false,
  enableBangumiScrape: false,
  bangumiAccessToken: '',
  bangumiIncludeNsfw: false,
  languageISO: 'zh',
  publisher: ''
}

const escapeXml = (value) => {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

const cleanFileName = (value) => {
  return trimSpecial(String(value || ''))
    .replace(invalidFileNameReg, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

const uniqList = (list = []) => {
  return [...new Set((list || []).filter(Boolean))]
}

const toMetadataText = (value) => {
  if (value === undefined || value === null) {
    return ''
  }
  return trimSpecial(String(value)).trim()
}

const toMetadataList = (value) => {
  if (Array.isArray(value)) {
    return uniqList(value.map(item => toMetadataText(item)).filter(Boolean))
  }
  return uniqList(String(value || '')
    .split(metadataListSplitReg)
    .map(item => toMetadataText(item))
    .filter(Boolean))
}

const parseOptionalNumber = (value) => {
  if (value === undefined || value === null || value === '') {
    return undefined
  }
  const match = String(value).match(/(\d+)/)
  return match ? parseInt(match[1]) : undefined
}

export const normalizeMetadataDraft = (metadata = {}) => {
  return {
    seriesTitle: toMetadataText(metadata.seriesTitle || metadata.name || ''),
    originalTitle: toMetadataText(metadata.originalTitle || ''),
    summary: toMetadataText(metadata.summary || metadata.description_text || ''),
    writers: toMetadataList(metadata.writers || metadata.writer || metadata.authorName || ''),
    illustrators: toMetadataList(metadata.illustrators || metadata.penciller || ''),
    tags: toMetadataList(metadata.tags || metadata.genre || ''),
    publisher: toMetadataText(metadata.publisher || ''),
    issueCount: parseOptionalNumber(metadata.issueCount || metadata.total_issues),
    volumeCount: parseOptionalNumber(metadata.volumeCount),
    releaseDate: toMetadataText(metadata.releaseDate || metadata.date || ''),
    status: toMetadataText(metadata.status || ''),
    ageRating: toMetadataText(metadata.ageRating || metadata.age_rating || ''),
    languageISO: toMetadataText(metadata.languageISO || metadata.language || ''),
    subjectUrl: toMetadataText(metadata.subjectUrl || ''),
    source: toMetadataText(metadata.source || '')
  }
}

export const mergeMetadataSources = (...sources) => {
  const merged = normalizeMetadataDraft()
  sources.forEach((source) => {
    if (!source) {
      return
    }
    const current = normalizeMetadataDraft(source)
    if (current.seriesTitle) merged.seriesTitle = current.seriesTitle
    if (current.originalTitle) merged.originalTitle = current.originalTitle
    if (current.summary) merged.summary = current.summary
    if (current.publisher) merged.publisher = current.publisher
    if (current.issueCount !== undefined) merged.issueCount = current.issueCount
    if (current.volumeCount !== undefined) merged.volumeCount = current.volumeCount
    if (current.releaseDate) merged.releaseDate = current.releaseDate
    if (current.status) merged.status = current.status
    if (current.ageRating) merged.ageRating = current.ageRating
    if (current.languageISO) merged.languageISO = current.languageISO
    if (current.subjectUrl) merged.subjectUrl = current.subjectUrl
    if (current.source) merged.source = current.source
    merged.writers = uniqList([...merged.writers, ...current.writers])
    merged.illustrators = uniqList([...merged.illustrators, ...current.illustrators])
    merged.tags = uniqList([...merged.tags, ...current.tags])
  })
  return merged
}

const getTokenMap = (downloadItem, pageCount) => {
  return {
    '[站点名字]': cleanFileName(downloadItem.webName),
    '[作者名]': cleanFileName(downloadItem.authorName),
    '[漫画名称]': cleanFileName(downloadItem.comicName),
    '[章节名称]': cleanFileName(downloadItem.downChapterName || downloadItem.chapterName),
    '[章节序号]': cleanFileName(downloadItem.chapterNumStr),
    '[多少P]': String(pageCount || 0)
  }
}

const pushXmlTag = (arr, name, value) => {
  if (value === undefined || value === null || value === '') {
    return
  }
  arr.push(`  <${name}>${escapeXml(value)}</${name}>`)
}

const getChapterNumber = (downloadItem) => {
  if (downloadItem.chapterNumStr) {
    return downloadItem.chapterNumStr
  }
  const match = String(downloadItem.chapterName || '').match(/(\d+(\.\d+)?)/)
  return match ? match[1] : ''
}

const splitDateParts = (dateValue) => {
  if (!dateValue) {
    return {}
  }
  const match = String(dateValue).match(/(\d{4})(?:[-/.年](\d{1,2}))?(?:[-/.月](\d{1,2}))?/)
  if (!match) {
    return {}
  }
  return {
    year: match[1],
    month: match[2] ? String(parseInt(match[2])) : '',
    day: match[3] ? String(parseInt(match[3])) : ''
  }
}

export const getMetadataSettings = () => {
  return {
    ...metadataSettingsDefault,
    ...(getStorage('metadataSettings') || {})
  }
}

export const buildDefaultMetadataDraft = (downloadItem = {}) => {
  const settings = getMetadataSettings()
  return normalizeMetadataDraft({
    seriesTitle: downloadItem.comicName || '',
    originalTitle: downloadItem.comicName || '',
    writers: downloadItem.authorName ? [downloadItem.authorName] : [],
    issueCount: downloadItem.seriesChapterCount,
    languageISO: settings.languageISO || 'zh'
  })
}

const getResolvedMetadata = (downloadItem, externalMetadata = null) => {
  const settings = getMetadataSettings()
  const metadata = mergeMetadataSources(
    buildDefaultMetadataDraft(downloadItem),
    externalMetadata
  )
  if (downloadItem?.metadataOverride) {
    const override = normalizeMetadataDraft(downloadItem.metadataOverride)
    metadata.seriesTitle = override.seriesTitle
    metadata.originalTitle = override.originalTitle
    metadata.summary = override.summary
    metadata.writers = override.writers
    metadata.illustrators = override.illustrators
    metadata.tags = override.tags
    metadata.publisher = override.publisher
    metadata.issueCount = override.issueCount
    metadata.volumeCount = override.volumeCount
    metadata.releaseDate = override.releaseDate
    metadata.status = override.status
    metadata.ageRating = override.ageRating
    metadata.languageISO = override.languageISO
    metadata.subjectUrl = override.subjectUrl || metadata.subjectUrl
    metadata.source = override.source || metadata.source
  }
  if (!metadata.seriesTitle) {
    metadata.seriesTitle = toMetadataText(downloadItem?.comicName || '')
  }
  if (!metadata.originalTitle) {
    metadata.originalTitle = metadata.seriesTitle
  }
  if (!metadata.issueCount && downloadItem?.seriesChapterCount) {
    metadata.issueCount = downloadItem.seriesChapterCount
  }
  if (!metadata.languageISO) {
    metadata.languageISO = settings.languageISO || 'zh'
  }
  return metadata
}

const buildNotes = (downloadItem, metadata) => {
  const notes = []
  if (downloadItem.webName) {
    notes.push(`来源站点: ${downloadItem.webName}`)
  }
  if (metadata?.originalTitle && metadata.originalTitle !== metadata.seriesTitle) {
    notes.push(`原始标题: ${metadata.originalTitle}`)
  }
  if (metadata?.subjectUrl) {
    notes.push(`Metadata: ${metadata.subjectUrl}`)
  }
  return notes.join('\n')
}

const getSeriesName = (downloadItem, metadata) => {
  return metadata?.seriesTitle || downloadItem.comicName
}

const getPublisher = (settings, metadata) => {
  return metadata?.publisher || settings.publisher || ''
}

const getIssueCount = (downloadItem, metadata) => {
  return metadata?.issueCount || metadata?.volumeCount || downloadItem.seriesChapterCount || undefined
}

const getWriter = (downloadItem, metadata) => {
  const writerList = uniqList(metadata?.writers || [])
  return writerList.join(', ')
}

const getPenciller = (metadata) => {
  return uniqList(metadata?.illustrators || []).join(', ')
}

const getGenre = (metadata) => {
  return uniqList(metadata?.tags || []).join(', ')
}

export const getZipNameTemplate = () => {
  const currentTemplate = getStorage('zipNameTemplate')
  if (!currentTemplate || currentTemplate === legacyDefaultZipNameTemplate) {
    return defaultZipNameTemplate
  }
  return currentTemplate
}

export const buildArchiveName = (downloadItem, pageCount) => {
  let result = getZipNameTemplate()
  const tokenMap = getTokenMap(downloadItem, pageCount)
  Object.keys(tokenMap).forEach((key) => {
    result = result.replaceAll(key, tokenMap[key] || '')
  })
  result = cleanFileName(result).replace(/\[\]/g, '')
  return result || cleanFileName(downloadItem.downChapterName || downloadItem.chapterName || downloadItem.comicName || 'chapter')
}

export const buildComicInfoXml = (downloadItem, pageCount, externalMetadata = null) => {
  const settings = getMetadataSettings()
  const metadata = getResolvedMetadata(downloadItem, externalMetadata)
  const lines = ['<?xml version="1.0" encoding="utf-8"?>', '<ComicInfo>']
  const seriesName = getSeriesName(downloadItem, metadata)
  const dateParts = splitDateParts(metadata?.releaseDate)

  pushXmlTag(lines, 'Series', seriesName)
  pushXmlTag(lines, 'Title', downloadItem.downChapterName || downloadItem.chapterName)
  pushXmlTag(lines, 'Number', getChapterNumber(downloadItem))
  pushXmlTag(lines, 'Count', getIssueCount(downloadItem, metadata))
  pushXmlTag(lines, 'Summary', metadata?.summary || '')
  pushXmlTag(lines, 'Writer', getWriter(downloadItem, metadata))
  pushXmlTag(lines, 'Penciller', getPenciller(metadata))
  pushXmlTag(lines, 'Genre', getGenre(metadata))
  pushXmlTag(lines, 'Tags', getGenre(metadata))
  pushXmlTag(lines, 'PageCount', pageCount)
  pushXmlTag(lines, 'Web', downloadItem.url || downloadItem.comicPageUrl)
  pushXmlTag(lines, 'Publisher', getPublisher(settings, metadata))
  pushXmlTag(lines, 'LanguageISO', metadata?.languageISO || settings.languageISO || 'zh')
  pushXmlTag(lines, 'Year', dateParts.year)
  pushXmlTag(lines, 'Month', dateParts.month)
  pushXmlTag(lines, 'Day', dateParts.day)
  pushXmlTag(lines, 'Notes', buildNotes(downloadItem, metadata))
  lines.push('</ComicInfo>')
  return lines.join('\n')
}

export const buildSeriesJson = (downloadItem, externalMetadata = null) => {
  const settings = getMetadataSettings()
  const metadata = getResolvedMetadata(downloadItem, externalMetadata)
  const dateParts = splitDateParts(metadata?.releaseDate)
  const seriesInfo = {
    name: getSeriesName(downloadItem, metadata) || '',
    publisher: getPublisher(settings, metadata),
    description_text: metadata?.summary || `${downloadItem.webName || ''}`.trim(),
    total_issues: getIssueCount(downloadItem, metadata),
    status: metadata?.status || undefined,
    age_rating: metadata?.ageRating || undefined,
    year: dateParts.year || undefined
  }
  return JSON.stringify(seriesInfo, null, 2)
}

export const buildMetadataPreviewFiles = (downloadItem, pageCount = 0, externalMetadata = null) => {
  return {
    comicInfoXml: buildComicInfoXml(downloadItem, pageCount, externalMetadata),
    seriesJson: buildSeriesJson(downloadItem, externalMetadata)
  }
}

export const getMetadataFileFlags = () => {
  const settings = getMetadataSettings()
  return {
    enableComicInfoXml: settings.enableComicInfoXml !== false,
    enableSeriesJson: settings.enableSeriesJson === true,
    enableSeriesCover: settings.enableSeriesCover === true,
    enableMetadataPreview: settings.enableMetadataPreview === true,
    enableBangumiScrape: settings.enableBangumiScrape === true
  }
}

export const shouldPreviewMetadataForItems = (downloadItems = []) => {
  const { enableComicInfoXml, enableSeriesJson, enableMetadataPreview } = getMetadataFileFlags()
  if (!enableMetadataPreview || !Array.isArray(downloadItems) || downloadItems.length === 0) {
    return false
  }
  const hasUnconfirmedItem = downloadItems.some(item => item?.metadataConfirmed !== true)
  if (!hasUnconfirmedItem) {
    return false
  }
  if (enableSeriesJson) {
    return true
  }
  return enableComicInfoXml && downloadItems.some(item => item?.downType === 1)
}
