import { getStorage } from '@/config/setup'
import { trimSpecial } from '@/utils/index'

const invalidFileNameReg = /[\\/:*?"<>|]/g

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

export const getMetadataSettings = () => {
  return getStorage('metadataSettings') || {}
}

export const getZipNameTemplate = () => {
  return getStorage('zipNameTemplate') || '[站点名字][作者名][漫画名称][章节名称][多少P]P'
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

export const buildComicInfoXml = (downloadItem, pageCount) => {
  const settings = getMetadataSettings()
  const lines = ['<?xml version="1.0" encoding="utf-8"?>', '<ComicInfo>']
  pushXmlTag(lines, 'Series', downloadItem.comicName)
  pushXmlTag(lines, 'Title', downloadItem.downChapterName || downloadItem.chapterName)
  pushXmlTag(lines, 'Number', getChapterNumber(downloadItem))
  pushXmlTag(lines, 'Writer', downloadItem.authorName)
  pushXmlTag(lines, 'PageCount', pageCount)
  pushXmlTag(lines, 'Web', downloadItem.url || downloadItem.comicPageUrl)
  pushXmlTag(lines, 'Publisher', settings.publisher)
  pushXmlTag(lines, 'LanguageISO', settings.languageISO || 'zh')
  pushXmlTag(lines, 'Notes', `${downloadItem.webName || ''}`.trim())
  lines.push('</ComicInfo>')
  return lines.join('\n')
}

export const buildSeriesJson = (downloadItem) => {
  const settings = getMetadataSettings()
  const seriesInfo = {
    name: downloadItem.comicName || '',
    publisher: settings.publisher || '',
    description_text: `${downloadItem.webName || ''}`.trim(),
    total_issues: downloadItem.seriesChapterCount || undefined
  }
  return JSON.stringify(seriesInfo, null, 2)
}

export const getMetadataFileFlags = () => {
  const settings = getMetadataSettings()
  return {
    enableComicInfoXml: settings.enableComicInfoXml !== false,
    enableSeriesJson: settings.enableSeriesJson === true
  }
}
