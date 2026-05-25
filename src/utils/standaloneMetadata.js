import { normalizeStandaloneMetadataDraft } from '@/utils/metadata'
import { trimSpecial } from '@/utils/index'

const bangumiHostReg = /(^|\.)((bgm|bangumi)\.tv|chii\.in)$/i
const bookwalkerHostReg = /(^|\.)bookwalker\.com\.tw$/i
const bookwalkerProductPathReg = /^\/product\/\d+/i
const bookwalkerSearchPathReg = /^\/search/i

const modeMetaMap = {
  'bangumi-single': {
    value: 'bangumi-single',
    label: 'Bangumi 单本元数据',
    description: '生成 ComicInfo.xml',
    outputText: 'ComicInfo.xml'
  },
  'bookwalker-book': {
    value: 'bookwalker-book',
    label: 'BookWalker 单本元数据',
    description: '生成 ComicInfo.xml',
    outputText: 'ComicInfo.xml'
  },
  'bookwalker-series': {
    value: 'bookwalker-series',
    label: 'BookWalker 系列元数据',
    description: '生成 Komga `series.json`，并额外生成 `comic.xml`',
    outputText: 'series.json + comic.xml'
  }
}

const normalizeText = (value) => {
  return trimSpecial(String(value || ''))
    .replace(/\s{2,}/g, ' ')
    .trim()
}

const escapeReg = (value = '') => {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const uniqList = (list = []) => {
  return [...new Set((list || []).filter(Boolean))]
}

const toTextList = (value) => {
  if (Array.isArray(value)) {
    return uniqList(value.map(item => normalizeText(item)).filter(Boolean))
  }
  return uniqList(String(value || '')
    .split(/[、,，/／|｜\n]+/g)
    .map(item => normalizeText(item))
    .filter(Boolean))
}

const parseOptionalNumber = (value) => {
  if (value === undefined || value === null || value === '') {
    return undefined
  }
  const match = String(value).match(/(\d+(?:\.\d+)?)/)
  if (!match) {
    return undefined
  }
  const numberValue = Number(match[1])
  return Number.isFinite(numberValue) ? numberValue : undefined
}

const normalizeDateText = (value) => {
  const text = normalizeText(value)
  if (!text) {
    return ''
  }
  const match = text.match(/(\d{4})(?:[-/.年](\d{1,2}))?(?:[-/.月](\d{1,2}))?/)
  if (!match) {
    return ''
  }
  const year = match[1]
  const month = match[2] ? String(parseInt(match[2], 10)).padStart(2, '0') : ''
  const day = match[3] ? String(parseInt(match[3], 10)).padStart(2, '0') : ''
  return [year, month, day].filter(Boolean).join('-')
}

const stripCountSuffix = (value) => {
  return normalizeText(String(value || '').replace(/\s*\(\d+\)\s*$/, ''))
}

const parseCountSuffix = (value) => {
  const match = String(value || '').match(/\((\d+)\)\s*$/)
  return match ? parseInt(match[1], 10) : undefined
}

const getText = (root, selector) => {
  try {
    const node = root?.querySelector(selector)
    return normalizeText(node?.innerText || node?.textContent || '')
  } catch (error) {
    return ''
  }
}

const getTextList = (root, selector) => {
  try {
    return uniqList([...root.querySelectorAll(selector)]
      .map(node => normalizeText(node?.innerText || node?.textContent || ''))
      .filter(Boolean))
  } catch (error) {
    return []
  }
}

const getCanonicalUrl = (root, pageUrl) => {
  const canonicalUrl = root?.querySelector?.('link[rel="canonical"]')?.getAttribute('href') || ''
  return canonicalUrl || pageUrl || window.location.href
}

const getHostname = (pageUrl = '') => {
  try {
    return new URL(pageUrl || window.location.href).hostname
  } catch (error) {
    return window.location.hostname
  }
}

const getPathname = (pageUrl = '') => {
  try {
    return new URL(pageUrl || window.location.href).pathname
  } catch (error) {
    return window.location.pathname
  }
}

const getSearchParam = (pageUrl = '', key = '') => {
  try {
    return new URL(pageUrl || window.location.href).searchParams.get(key) || ''
  } catch (error) {
    return ''
  }
}

const getBookwalkerEntryNumber = (entryTitle = '', seriesTitle = '') => {
  const titleText = normalizeText(entryTitle)
  const seriesText = normalizeText(seriesTitle)
  const shortTitle = seriesText ? titleText.replace(seriesText, '').trim() : titleText
  const regList = [
    /(?:\(|（|第)\s*(\d+(?:\.\d+)?)\s*(?:\)|）|冊|卷|巻|集)/,
    /(\d+(?:\.\d+)?)(?!.*\d)/
  ]

  for (let i = 0; i < regList.length; i++) {
    const match = shortTitle.match(regList[i]) || titleText.match(regList[i])
    if (match?.[1]) {
      return match[1]
    }
  }
  return ''
}

const getBookwalkerFieldMap = (root) => {
  const map = {}
  root.querySelectorAll('.product-detail-info-item, .product-basic-info-item').forEach((item) => {
    const key = normalizeText(
      item.querySelector('.product-detail-info-item-title, .product-basic-info-item-title')?.textContent || ''
    )
    if (!key) {
      return
    }

    let value = ''
    if (/標籤/.test(key)) {
      value = getTextList(item, '.label-text').join(', ')
    } else {
      value = normalizeText(
        item.querySelector('.product-detail-info-item-value, .product-basic-info-item-string, .product-basic-info-item-label')?.innerText ||
        item.querySelector('.product-detail-info-item-value, .product-basic-info-item-string, .product-basic-info-item-label')?.textContent ||
        ''
      )
    }

    if (value && !map[key]) {
      map[key] = value
    }
  })
  return map
}

const getBookwalkerSeriesCount = (root) => {
  const subtitleText = getText(root, '.product-series-subtitle')
  const subtitleCount = parseOptionalNumber(subtitleText)
  if (subtitleCount) {
    return subtitleCount
  }

  const cardCount = getTextList(root, '.product-card-name').length
  if (cardCount > 0) {
    return cardCount
  }

  return undefined
}

const getBookwalkerSeriesTitles = (root) => {
  return getTextList(root, '.product-card-name')
}

const getBookwalkerSeriesSubjectUrl = (root, pageUrl) => {
  const breadcrumbUrl = root.querySelector('.breadcrumb a[href*="series="]')?.getAttribute('href') || ''
  return breadcrumbUrl || getCanonicalUrl(root, pageUrl)
}

const buildBookwalkerProductBookDraft = (root, pageUrl) => {
  const fieldMap = getBookwalkerFieldMap(root)
  const entryTitle = getText(root, '.product-basic-info-name') || normalizeText(document.title)
  const seriesTitle = fieldMap['系列'] || entryTitle
  const summary = getText(root, '#product-content .product-content-introduction')

  return normalizeStandaloneMetadataDraft({
    source: 'BookWalker',
    seriesTitle,
    originalTitle: seriesTitle,
    entryTitle,
    entryNumber: getBookwalkerEntryNumber(entryTitle, seriesTitle),
    summary,
    writers: toTextList(fieldMap['作者']),
    illustrators: toTextList(fieldMap['插畫']),
    tags: getTextList(root, '.product-basic-info-item-label .label-text'),
    publisher: fieldMap['出版社'] || '',
    issueCount: getBookwalkerSeriesCount(root),
    releaseDate: normalizeDateText(fieldMap['發售日']),
    languageISO: 'zh',
    subjectUrl: getCanonicalUrl(root, pageUrl),
    pageCount: parseOptionalNumber(fieldMap['頁數']),
    isbn: fieldMap.ISBN || ''
  })
}

const buildBookwalkerProductSeriesDraft = (root, pageUrl) => {
  const fieldMap = getBookwalkerFieldMap(root)
  const seriesTitle = fieldMap['系列'] || getText(root, '.product-series-title') || getText(root, '.product-basic-info-name')
  const summary = getText(root, '#product-content .product-content-introduction')

  return normalizeStandaloneMetadataDraft({
    source: 'BookWalker',
    seriesTitle,
    originalTitle: seriesTitle,
    summary,
    writers: toTextList(fieldMap['作者']),
    illustrators: toTextList(fieldMap['插畫']),
    tags: getTextList(root, '.product-basic-info-item-label .label-text'),
    publisher: fieldMap['出版社'] || '',
    issueCount: getBookwalkerSeriesCount(root) || getBookwalkerSeriesTitles(root).length,
    releaseDate: normalizeDateText(fieldMap['發售日']),
    languageISO: 'zh',
    subjectUrl: getBookwalkerSeriesSubjectUrl(root, pageUrl)
  })
}

const getBookwalkerSearchSeriesAnchor = (root, pageUrl) => {
  const currentSeriesId = getSearchParam(pageUrl, 'series')
  const anchorList = [...root.querySelectorAll('#search_series_ten a[href*="series="], #series_get_more a[href*="series="]')]
  if (currentSeriesId) {
    const matchedAnchor = anchorList.find(anchor => String(anchor.getAttribute('href') || '').includes(`series=${currentSeriesId}`))
    if (matchedAnchor) {
      return matchedAnchor
    }
  }
  return anchorList[0] || null
}

const buildBookwalkerSearchSeriesDraft = (root, pageUrl) => {
  const seriesAnchor = getBookwalkerSearchSeriesAnchor(root, pageUrl)
  const seriesText = normalizeText(seriesAnchor?.innerText || '')
  const seriesTitle = stripCountSuffix(seriesText) || normalizeText(getSearchParam(pageUrl, 'w'))
  const firstAuthorText = getText(root, '.booknamesub')
  const categoryList = getTextList(root, '.cat-label')

  return normalizeStandaloneMetadataDraft({
    source: 'BookWalker Search',
    seriesTitle,
    originalTitle: seriesTitle,
    summary: '',
    writers: getTextList(root, '#search_author_ten a, #author_get_more a').map(stripCountSuffix).filter(Boolean).length > 0
      ? getTextList(root, '#search_author_ten a, #author_get_more a').map(stripCountSuffix).filter(Boolean)
      : toTextList(firstAuthorText),
    illustrators: [],
    tags: categoryList,
    publisher: stripCountSuffix(getText(root, '#search_vendor_ten a, #vendor_get_more a')),
    issueCount: parseCountSuffix(seriesText) || getTextList(root, '.bookitem .bookname').length || undefined,
    releaseDate: '',
    languageISO: 'zh',
    subjectUrl: seriesAnchor?.getAttribute('href') || getCanonicalUrl(root, pageUrl)
  })
}

const getBangumiInfoboxMap = (root) => {
  const map = {}
  root.querySelectorAll('#infobox li').forEach((item) => {
    const keyText = normalizeText(item.querySelector('.tip')?.textContent || '').replace(/[:：]\s*$/, '')
    if (!keyText) {
      return
    }
    const rawText = normalizeText(item.innerText || item.textContent || '')
    const valueText = normalizeText(rawText.replace(new RegExp(`^${escapeReg(keyText)}\\s*[:：]?\\s*`), ''))
    if (!valueText) {
      return
    }
    if (!map[keyText]) {
      map[keyText] = []
    }
    map[keyText].push(valueText)
  })
  return map
}

const getBangumiInfoboxValue = (infoboxMap, keys = []) => {
  for (let i = 0; i < keys.length; i++) {
    const list = infoboxMap[keys[i]]
    if (Array.isArray(list) && list.length > 0) {
      return list[0]
    }
  }
  return ''
}

const getBangumiReleaseDate = (infoboxMap) => {
  const keyList = ['发售日', '發售日', '其他发售日', '其他發售日']
  for (let i = 0; i < keyList.length; i++) {
    const valueList = infoboxMap[keyList[i]] || []
    for (let j = 0; j < valueList.length; j++) {
      const dateText = normalizeDateText(valueList[j])
      if (dateText) {
        return dateText
      }
    }
  }
  return ''
}

const buildBangumiSingleDraft = (root, pageUrl) => {
  const infoboxMap = getBangumiInfoboxMap(root)
  const originalTitle = getText(root, '#headerSubject h1 a') || getText(root, '.nameSingle a') || normalizeText(document.title)
  const seriesTitle = getBangumiInfoboxValue(infoboxMap, ['中文名']) || originalTitle
  const tagList = uniqList(
    [...root.querySelectorAll('.subject_tag_section .inner a')]
      .map(item => normalizeText(item.querySelector('span')?.textContent || item.textContent || ''))
      .filter(Boolean)
  )

  return normalizeStandaloneMetadataDraft({
    source: 'Bangumi',
    seriesTitle,
    originalTitle,
    entryTitle: originalTitle || seriesTitle,
    summary: getText(root, '#subject_summary'),
    writers: toTextList(getBangumiInfoboxValue(infoboxMap, ['作者'])),
    illustrators: toTextList(getBangumiInfoboxValue(infoboxMap, ['作画', '作畫', '绘师', '繪師'])),
    tags: tagList,
    publisher: getBangumiInfoboxValue(infoboxMap, ['出版社']),
    issueCount: parseOptionalNumber(getBangumiInfoboxValue(infoboxMap, ['话数', '話數'])),
    releaseDate: getBangumiReleaseDate(infoboxMap),
    status: tagList.includes('已完结') ? 'ended' : '',
    languageISO: '',
    subjectUrl: getCanonicalUrl(root, pageUrl)
  })
}

export const getStandaloneMetadataModeMeta = (mode) => {
  return modeMetaMap[mode] || null
}

export const getStandaloneMetadataContext = (root = document, pageUrl = window.location.href) => {
  const hostname = getHostname(pageUrl)
  const pathname = getPathname(pageUrl)

  if (bangumiHostReg.test(hostname) && /\/subject\/\d+/i.test(pathname)) {
    const draft = buildBangumiSingleDraft(root, pageUrl)
    return {
      site: 'bangumi',
      siteName: 'Bangumi',
      pageType: 'subject',
      pageTitle: draft.seriesTitle || draft.entryTitle || 'Bangumi',
      pageUrl: getCanonicalUrl(root, pageUrl),
      modeOptions: [modeMetaMap['bangumi-single']],
      defaultMode: 'bangumi-single'
    }
  }

  if (bookwalkerHostReg.test(hostname) && bookwalkerProductPathReg.test(pathname)) {
    const bookDraft = buildBookwalkerProductBookDraft(root, pageUrl)
    return {
      site: 'bookwalker',
      siteName: 'BookWalker',
      pageType: 'product',
      pageTitle: bookDraft.entryTitle || bookDraft.seriesTitle || 'BookWalker',
      pageUrl: getCanonicalUrl(root, pageUrl),
      modeOptions: [modeMetaMap['bookwalker-book'], modeMetaMap['bookwalker-series']],
      defaultMode: 'bookwalker-book'
    }
  }

  if (bookwalkerHostReg.test(hostname) && bookwalkerSearchPathReg.test(pathname) && getBookwalkerSearchSeriesAnchor(root, pageUrl)) {
    const seriesDraft = buildBookwalkerSearchSeriesDraft(root, pageUrl)
    return {
      site: 'bookwalker',
      siteName: 'BookWalker',
      pageType: 'series-search',
      pageTitle: seriesDraft.seriesTitle || 'BookWalker',
      pageUrl: getCanonicalUrl(root, pageUrl),
      modeOptions: [modeMetaMap['bookwalker-series']],
      defaultMode: 'bookwalker-series'
    }
  }

  return null
}

export const buildStandaloneMetadataDraft = (mode, root = document, pageUrl = window.location.href) => {
  switch (mode) {
    case 'bangumi-single':
      return buildBangumiSingleDraft(root, pageUrl)
    case 'bookwalker-book':
      return buildBookwalkerProductBookDraft(root, pageUrl)
    case 'bookwalker-series':
      if (bookwalkerProductPathReg.test(getPathname(pageUrl))) {
        return buildBookwalkerProductSeriesDraft(root, pageUrl)
      }
      return buildBookwalkerSearchSeriesDraft(root, pageUrl)
    default:
      return normalizeStandaloneMetadataDraft()
  }
}
