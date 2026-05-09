import { getStorage } from '@/config/setup'
import { trimSpecial } from '@/utils/index'

const invalidFileNameReg = /[\\/:*?"<>|]/g
export const defaultZipNameTemplate = '[站点名字][作者名][漫画名称][章节名称][多少P]'
const legacyDefaultZipNameTemplate = '[站点名字][作者名][漫画名称][章节名称][多少P]P'

export const metadataSettingsDefault = {
  enableComicInfoXml: true,
  enableSeriesJson: false,
  enableSeriesCover: false,
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

const uniqList = (list = []) => {
  return [...new Set((list || []).filter(Boolean))]
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

const buildNotes = (downloadItem, externalMetadata) => {
  const notes = []
  if (downloadItem.webName) {
    notes.push(`来源站点: ${downloadItem.webName}`)
  }
  if (externalMetadata?.originalTitle && externalMetadata.originalTitle !== externalMetadata.seriesTitle) {
    notes.push(`原始标题: ${externalMetadata.originalTitle}`)
  }
  if (externalMetadata?.subjectUrl) {
    notes.push(`Bangumi: ${externalMetadata.subjectUrl}`)
  }
  return notes.join('\n')
}

const getSeriesName = (downloadItem, externalMetadata) => {
  return externalMetadata?.seriesTitle || downloadItem.comicName
}

const getPublisher = (settings, externalMetadata) => {
  return externalMetadata?.publisher || settings.publisher || ''
}

const getIssueCount = (downloadItem, externalMetadata) => {
  return downloadItem.seriesChapterCount || externalMetadata?.issueCount || externalMetadata?.volumeCount || undefined
}

const getWriter = (downloadItem, externalMetadata) => {
  const writerList = uniqList([...(externalMetadata?.writers || []), downloadItem.authorName])
  return writerList.join(', ')
}

const getPenciller = (externalMetadata) => {
  return uniqList(externalMetadata?.illustrators || []).join(', ')
}

const getGenre = (externalMetadata) => {
  return uniqList(externalMetadata?.tags || []).join(', ')
}

export const getMetadataSettings = () => {
  return {
    ...metadataSettingsDefault,
    ...(getStorage('metadataSettings') || {})
  }
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
  const lines = ['<?xml version="1.0" encoding="utf-8"?>', '<ComicInfo>']
  const seriesName = getSeriesName(downloadItem, externalMetadata)
  const dateParts = splitDateParts(externalMetadata?.releaseDate)

  pushXmlTag(lines, 'Series', seriesName)
  pushXmlTag(lines, 'Title', downloadItem.downChapterName || downloadItem.chapterName)
  pushXmlTag(lines, 'Number', getChapterNumber(downloadItem))
  pushXmlTag(lines, 'Count', getIssueCount(downloadItem, externalMetadata))
  pushXmlTag(lines, 'Summary', externalMetadata?.summary || '')
  pushXmlTag(lines, 'Writer', getWriter(downloadItem, externalMetadata))
  pushXmlTag(lines, 'Penciller', getPenciller(externalMetadata))
  pushXmlTag(lines, 'Genre', getGenre(externalMetadata))
  pushXmlTag(lines, 'Tags', getGenre(externalMetadata))
  pushXmlTag(lines, 'PageCount', pageCount)
  pushXmlTag(lines, 'Web', downloadItem.url || downloadItem.comicPageUrl)
  pushXmlTag(lines, 'Publisher', getPublisher(settings, externalMetadata))
  pushXmlTag(lines, 'LanguageISO', settings.languageISO || externalMetadata?.languageISO || 'zh')
  pushXmlTag(lines, 'Year', dateParts.year)
  pushXmlTag(lines, 'Month', dateParts.month)
  pushXmlTag(lines, 'Day', dateParts.day)
  pushXmlTag(lines, 'Notes', buildNotes(downloadItem, externalMetadata))
  lines.push('</ComicInfo>')
  return lines.join('\n')
}

export const buildSeriesJson = (downloadItem, externalMetadata = null) => {
  const settings = getMetadataSettings()
  const dateParts = splitDateParts(externalMetadata?.releaseDate)
  const seriesInfo = {
    name: getSeriesName(downloadItem, externalMetadata) || '',
    publisher: getPublisher(settings, externalMetadata),
    description_text: externalMetadata?.summary || `${downloadItem.webName || ''}`.trim(),
    total_issues: getIssueCount(downloadItem, externalMetadata),
    status: externalMetadata?.status || undefined,
    age_rating: externalMetadata?.ageRating || undefined,
    year: dateParts.year || undefined
  }
  return JSON.stringify(seriesInfo, null, 2)
}

export const getMetadataFileFlags = () => {
  const settings = getMetadataSettings()
  return {
    enableComicInfoXml: settings.enableComicInfoXml !== false,
    enableSeriesJson: settings.enableSeriesJson === true,
    enableSeriesCover: settings.enableSeriesCover === true,
    enableBangumiScrape: settings.enableBangumiScrape === true
  }
}
