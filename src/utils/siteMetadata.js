import { findWebByUrl, getCurrentComicMeta, requestTextWithGuard } from '@/utils/comics'
import { parseToDOM, trimSpecial } from '@/utils/index'

const multiValueSplitReg = /[,\uff0c/\u3001|]/g
const statusFinishedReg = /(完结|完結|已完结|已完結|finished|completed|complete)/i
const statusOngoingReg = /(连载|連載|连载中|連載中|ongoing|seriali[sz]ing)/i

const uniqList = (list = []) => {
  return [...new Set((list || []).filter(Boolean))]
}

const toText = (value) => {
  if (value === undefined || value === null) {
    return ''
  }
  if (typeof value === 'string' || typeof value === 'number') {
    return trimSpecial(String(value)).trim()
  }
  if (Array.isArray(value)) {
    return value.map(item => toText(item)).filter(Boolean).join(' / ')
  }
  if (typeof value === 'object') {
    return toText(value.name || value.text || value.value || value['@value'] || '')
  }
  return ''
}

const getDomText = (root, selector) => {
  try {
    const dom = root.querySelector(selector)
    if (!dom) {
      return ''
    }
    return trimSpecial((dom.innerText || dom.textContent || '').trim())
  } catch (error) {
    return ''
  }
}

const getMetaContent = (root, selectors = []) => {
  for (let i = 0; i < selectors.length; i++) {
    const value = getDomText(root, selectors[i])
    if (value) {
      return value
    }
    try {
      const dom = root.querySelector(selectors[i])
      const content = trimSpecial(dom?.getAttribute('content') || '').trim()
      if (content) {
        return content
      }
    } catch (error) {
      //
    }
  }
  return ''
}

const safeParseJson = (text) => {
  try {
    return JSON.parse(text)
  } catch (error) {
    return null
  }
}

const flattenJsonLd = (value) => {
  if (!value) {
    return []
  }
  if (Array.isArray(value)) {
    return value.flatMap(item => flattenJsonLd(item))
  }
  if (typeof value === 'object' && Array.isArray(value['@graph'])) {
    return flattenJsonLd(value['@graph'])
  }
  if (typeof value === 'object') {
    return [value]
  }
  return []
}

const getJsonLdNodes = (root) => {
  const nodeList = []
  try {
    root.querySelectorAll('script[type="application/ld+json"]').forEach((item) => {
      const parsed = safeParseJson(item.textContent || item.innerText || '')
      nodeList.push(...flattenJsonLd(parsed))
    })
  } catch (error) {
    //
  }
  return nodeList
}

const pickJsonLdField = (root, fieldNames = []) => {
  const nodeList = getJsonLdNodes(root)
  for (let i = 0; i < nodeList.length; i++) {
    const item = nodeList[i]
    for (let j = 0; j < fieldNames.length; j++) {
      const value = toText(item?.[fieldNames[j]])
      if (value) {
        return value
      }
    }
  }
  return ''
}

const parseListText = (value) => {
  if (Array.isArray(value)) {
    return uniqList(value.map(item => trimSpecial(String(item || '')).trim()).filter(Boolean))
  }
  return uniqList(String(value || '')
    .split(multiValueSplitReg)
    .map(item => trimSpecial(item).trim())
    .filter(Boolean))
}

const stripLabelPrefix = (value, labels = []) => {
  let text = trimSpecial(String(value || '')).trim()
  labels.forEach((label) => {
    const reg = new RegExp(`^${label}\\s*[：:|/-]?\\s*`, 'i')
    text = text.replace(reg, '')
  })
  return text.trim()
}

const getCandidateTextList = (root) => {
  const result = []
  try {
    root.querySelectorAll('p, div, span, li, dd, dt, td, th, strong').forEach((item) => {
      const text = trimSpecial((item.innerText || item.textContent || '').trim())
      if (!text || text.length < 2 || text.length > 300) {
        return
      }
      result.push(text)
    })
  } catch (error) {
    //
  }
  return uniqList(result)
}

const findLabeledValue = (root, labels = []) => {
  const textList = getCandidateTextList(root)
  for (let i = 0; i < textList.length; i++) {
    const line = textList[i]
    for (let j = 0; j < labels.length; j++) {
      const label = labels[j]
      const exactReg = new RegExp(`^${label}\\s*[：:|/-]?\\s*(.+)$`, 'i')
      const match = line.match(exactReg)
      if (match?.[1]) {
        return trimSpecial(match[1]).trim()
      }
    }
  }
  return ''
}

const pickLongText = (root, selectors = []) => {
  for (let i = 0; i < selectors.length; i++) {
    const text = getDomText(root, selectors[i])
    if (text && text.length >= 12) {
      return text
    }
  }
  return ''
}

const normalizeStatus = (value) => {
  const text = trimSpecial(String(value || '')).trim()
  if (!text) {
    return ''
  }
  if (statusFinishedReg.test(text)) {
    return 'ended'
  }
  if (statusOngoingReg.test(text)) {
    return 'continuing'
  }
  return text
}

const normalizeDateText = (value) => {
  const text = trimSpecial(String(value || '')).trim()
  if (!text) {
    return ''
  }
  const match = text.match(/(\d{4})(?:[-/.年](\d{1,2}))?(?:[-/.月](\d{1,2}))?/)
  if (!match) {
    return ''
  }
  const year = match[1]
  const month = match[2] ? String(parseInt(match[2])) : ''
  const day = match[3] ? String(parseInt(match[3])) : ''
  return [year, month, day].filter(Boolean).join('-')
}

const guessLanguageISO = (root) => {
  const langText = trimSpecial(root?.documentElement?.lang || root?.lang || '').trim().toLowerCase()
  if (!langText) {
    return ''
  }
  const match = langText.match(/[a-z]{2,3}/)
  return match ? match[0] : ''
}

const getSummary = (root) => {
  const selectorValue = pickLongText(root, [
    '[itemprop="description"]',
    '[property="og:description"]',
    '[name="description"]',
    '[name="twitter:description"]',
    '[class*="summary" i]',
    '[id*="summary" i]',
    '[class*="intro" i]',
    '[id*="intro" i]',
    '[class*="description" i]',
    '[id*="description" i]'
  ])
  if (selectorValue) {
    return stripLabelPrefix(selectorValue, ['简介', '簡介', 'description', 'summary', 'intro'])
  }
  const metaValue = getMetaContent(root, [
    'meta[name="description"]',
    'meta[property="og:description"]',
    'meta[name="twitter:description"]'
  ])
  if (metaValue) {
    return metaValue
  }
  const labeledValue = findLabeledValue(root, ['简介', '簡介', 'description', 'summary', 'intro'])
  return stripLabelPrefix(labeledValue, ['简介', '簡介', 'description', 'summary', 'intro'])
}

const getTags = (root) => {
  const keywordText = getMetaContent(root, [
    'meta[name="keywords"]',
    'meta[property="book:tag"]'
  ])
  if (keywordText) {
    const list = parseListText(keywordText).filter(item => item.length <= 20)
    if (list.length > 0) {
      return list
    }
  }

  const taggedValue = findLabeledValue(root, ['标签', '標籤', '题材', '題材', '类型', '類型', '分类', '分類', 'genre', 'tag'])
  if (taggedValue) {
    return parseListText(taggedValue)
  }

  const jsonLdGenre = pickJsonLdField(root, ['genre', 'keywords'])
  return parseListText(jsonLdGenre)
}

const getPublisher = (root) => {
  return findLabeledValue(root, ['出版社', '连载杂志', '連載雜誌', 'label', 'publisher']) ||
    pickJsonLdField(root, ['publisher'])
}

const getStatus = (root) => {
  const labeledStatus = findLabeledValue(root, ['状态', '狀態', '连载状态', '連載狀態', 'status'])
  if (labeledStatus) {
    return normalizeStatus(labeledStatus)
  }
  const textList = getCandidateTextList(root)
  const joinedText = textList.slice(0, 80).join(' ')
  const inferredStatus = normalizeStatus(joinedText)
  if (inferredStatus === 'ended' || inferredStatus === 'continuing') {
    return inferredStatus
  }
  return ''
}

const getReleaseDate = (root) => {
  const metaDate = getMetaContent(root, [
    'meta[property="article:published_time"]',
    'meta[property="og:novel:update_time"]',
    'meta[itemprop="datePublished"]'
  ])
  if (metaDate) {
    return normalizeDateText(metaDate)
  }

  const labeledValue = findLabeledValue(root, ['年份', '出版日期', '发布时间', '發佈時間', 'date', 'year'])
  if (labeledValue) {
    return normalizeDateText(labeledValue)
  }

  const jsonLdDate = pickJsonLdField(root, ['datePublished', 'dateCreated', 'dateModified'])
  return normalizeDateText(jsonLdDate)
}

export const extractWebMetadataFromRoot = (root, webRule, pageUrl, downloadItem = {}) => {
  const { comicName, authorName } = getCurrentComicMeta(webRule, root)
  const jsonLdAuthor = pickJsonLdField(root, ['author', 'creator'])
  const summary = getSummary(root)
  const tags = getTags(root)
  const publisher = getPublisher(root)
  const status = getStatus(root)
  const releaseDate = getReleaseDate(root)
  const languageISO = guessLanguageISO(root)

  return {
    source: 'WebPage',
    seriesTitle: comicName || downloadItem.comicName || '',
    originalTitle: comicName || downloadItem.comicName || '',
    summary,
    writers: uniqList([authorName, jsonLdAuthor].filter(Boolean)),
    illustrators: [],
    tags,
    publisher,
    issueCount: downloadItem.seriesChapterCount || undefined,
    releaseDate,
    status,
    ageRating: '',
    languageISO,
    subjectUrl: pageUrl || downloadItem.comicPageUrl || downloadItem.url || ''
  }
}

export const getWebMetadata = async(downloadItem) => {
  const pageUrl = downloadItem?.comicPageUrl || downloadItem?.url || window.location.href
  const webRule = findWebByUrl(pageUrl)
  if (!pageUrl || !webRule) {
    return null
  }

  if (typeof webRule.getMetadata === 'function') {
    try {
      const metadata = await webRule.getMetadata(downloadItem)
      if (metadata) {
        return metadata
      }
    } catch (error) {
      console.log('getWebMetadata-custom-e: ', error)
    }
  }

  if (window.location.href === pageUrl) {
    return extractWebMetadataFromRoot(document, webRule, pageUrl, downloadItem)
  }

  /*
  /*
  /*
  const responseText = await requestTextWithGuard({
    method: 'get',
    url: pageUrl,
    headers: webRule.headers || '',
    purpose: `${webRule.webName || 'Web'} 页面元数据`
  })
  const root = parseToDOM(responseText)
  return extractWebMetadataFromRoot(root, webRule, pageUrl, downloadItem)
  */
  /*
  const responseText = await requestTextWithGuard({
    method: 'get',
    url: pageUrl,
    headers: webRule.headers || '',
    purpose: `${webRule.webName || 'Web'} 页面元数据`
  })
  const root = parseToDOM(responseText)
  return extractWebMetadataFromRoot(root, webRule, pageUrl, downloadItem)
  */
  const responseText = await requestTextWithGuard({
    method: 'get',
    url: pageUrl,
    headers: webRule.headers || '',
    purpose: `${webRule.webName || 'Web'} metadata`
  })
  const root = parseToDOM(responseText)
  return extractWebMetadataFromRoot(root, webRule, pageUrl, downloadItem)
}
