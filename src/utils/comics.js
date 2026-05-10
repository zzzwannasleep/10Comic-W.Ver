/* eslint-disable no-undef */
/* eslint-disable no-empty */
/* eslint-disable no-eval */

// eslint-disable-next-line no-unused-vars
import { request, parseToDOM, funstrToData, getType, trimSpecial, getdomain, addZeroForNum, delay, doThingsEachSecond, startScroll, openVerifyPage } from '@/utils/index'
import iconv from 'iconv-lite'

import { getStorage } from '@/config/setup'

const challengePageReg = /challenge-platform|cf-browser-verification|cf-chl-|cf-turnstile|cf-challenge|cf-wrapper|verify you are human|attention required|checking if the site connection is secure|security check to access|just a moment\.\.\.|why do i have to complete a captcha/i

const getResponseText = (response) => {
  if (!response) {
    return ''
  }
  if (typeof response === 'string') {
    return response
  }
  return response.responseText || response.response || ''
}

const resolveUrl = (url, baseUrl) => {
  if (!url) {
    return ''
  }
  try {
    return new URL(url, baseUrl).href
  } catch (error) {
    return url
  }
}

const getSearchResultAnchor = (element, namelinkIndex = 0) => {
  const preferredAnchor = element.querySelector('h1 a, h2 a, h3 a, h4 a, dt a, .title a, .comic-title a, .comic__title a, .book-title a')
  if (preferredAnchor) {
    return preferredAnchor
  }
  const anchorList = [...element.querySelectorAll('a')]
  const targetAnchor = anchorList.find(anchor => trimSpecial(anchor?.getAttribute('title') || anchor?.innerText || anchor?.textContent || ''))
  return targetAnchor || anchorList[namelinkIndex] || anchorList[0] || null
}

const toUint8Array = (value) => {
  if (!value) {
    return new Uint8Array()
  }
  if (value instanceof ArrayBuffer) {
    return new Uint8Array(value)
  }
  if (ArrayBuffer.isView(value)) {
    return new Uint8Array(value.buffer, value.byteOffset, value.byteLength)
  }
  return new Uint8Array()
}

const encodeTextByCharset = (text, charset = 'utf-8') => {
  const encoded = iconv.encode(String(text || ''), charset)
  const bytes = toUint8Array(encoded)
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
}

const decodeBinaryByCharset = (value, charset = 'utf-8') => {
  return iconv.decode(toUint8Array(value), charset)
}

export const isChallengePage = (html) => {
  return challengePageReg.test(String(html || ''))
}

export const requestTextWithGuard = async({ method = 'get', url, data = '', headers = '', useCookie = false, purpose = '页面', openVerifyOnChallenge = true, verifyUrl = '' }) => {
  const response = await request({ method, url, data, headers, useCookie })
  const responseText = getResponseText(response)
  if (!responseText) {
    throw new Error(`未获取到${purpose}`)
  }
  if (isChallengePage(responseText)) {
    if (openVerifyOnChallenge) {
      openVerifyPage(verifyUrl || url)
    }
    throw new Error(`检测到 Cloudflare 验证，已打开${purpose}，请手动通过后重试`)
  }
  return responseText
}

export const searchFunTemplate_1 = async(data, keyword) => {
  // eslint-disable-next-line prefer-const
  let { search_add_url, search_pre, alllist_dom_css, minlist_dom_css, namelink_index, img_src, use_background, img_reg, match_reg_num } = data.searchTemplate_1
  namelink_index ? namelink_index-- : namelink_index = 0
  const searchPathList = Array.isArray(search_add_url) ? search_add_url : [search_add_url]
  let headers = ''
  data.headers ? headers = data.headers : ''
  const currentKeyword = encodeURIComponent(String(keyword || '').trim())
  let lastError = null

  for (let i = 0; i < searchPathList.length; i++) {
    const searchUrl = (search_pre || data.homepage) + searchPathList[i] + currentKeyword
    try {
      const responseText = await requestTextWithGuard({
        method: 'get',
        url: searchUrl,
        data: '',
        headers,
        purpose: `${data.webName} 搜索页`
      })
      const dom = parseToDOM(responseText).querySelector(alllist_dom_css)
      if (!dom) {
        continue
      }

      const domList = dom.querySelectorAll(minlist_dom_css)
      const searchList = []
      domList.forEach(element => {
        const obj = {}
        try {
          const anchorDom = getSearchResultAnchor(element, namelink_index)
          obj.name = trimSpecial(anchorDom?.getAttribute('title') || anchorDom?.innerText || anchorDom?.textContent || '')
          obj.url = resolveUrl(anchorDom?.getAttribute('href') || '', searchUrl)

          if (!use_background) {
            if (!img_reg) {
              const imgDom = element.querySelector('img')
              const rawImageUrl = imgDom?.getAttribute(img_src || 'src') ||
                imgDom?.getAttribute('data-src') ||
                imgDom?.getAttribute('data-original') ||
                imgDom?.getAttribute('data-lazy-src') ||
                imgDom?.getAttribute('src') ||
                ''
              if (rawImageUrl) {
                obj.imageUrl = resolveUrl(rawImageUrl, searchUrl)
              } else if (img_src) {
                const reg2 = eval('/' + img_src + `=('|")(.*?)('|")` + '/')
                obj.imageUrl = resolveUrl(element.innerHTML.match(reg2)?.[2] || '', searchUrl)
              } else {
                obj.imageUrl = ''
              }
            } else {
              obj.imageUrl = resolveUrl(element.innerHTML.match(img_reg)?.[match_reg_num] || '', searchUrl)
            }
          } else {
            obj.imageUrl = resolveUrl(element.innerHTML.match(/background.*?(url)\('?(.*?)'?\)/)?.[2] || '', searchUrl)
          }

          if (obj.name === '') {
            let titleArr = element.innerHTML.match(/title=('|")(.*?)('|")/)
            ;(titleArr && titleArr.length >= 2) ? (obj.name = titleArr[2])
              : (titleArr = element.innerHTML.match(/alt=('|")(.*?)('|")/),
              (titleArr && titleArr.length >= 2) ? obj.name = titleArr[2] : '')
            obj.name === '' ? obj.name = trimSpecial(element.querySelectorAll('a')[namelink_index]?.innerText || '') : ''
          }
        } catch (error) {
          console.log('error: ', data.webName, error)
        }
        if (obj.name || obj.url) {
          searchList.push(obj)
        }
      })

      if (searchList.length > 0 || domList.length === 0) {
        return searchList
      }
    } catch (error) {
      lastError = error
      if (String(error?.message || '').includes('Cloudflare')) {
        throw error
      }
    }
  }

  if (lastError) {
    throw lastError
  }
  return []
}

export const searchComicOnWeb = async(webRule, keyword) => {
  const currentWebRule = normalizeWebRule(webRule)
  if (!currentWebRule?.searchTemplate_1 && !currentWebRule?.searchFun) {
    return []
  }

  if (currentWebRule.searchTemplate_1) {
    return searchFunTemplate_1(currentWebRule, keyword)
  }

  if (currentWebRule.searchFun) {
    return currentWebRule.searchFun(keyword)
  }

  return []
}

const NHENTAI_API_ROOT = 'https://nhentai.net/api/v2'
const NHENTAI_API_HEADERS = {
  Accept: 'application/json',
  'User-Agent': '10Comic-W.Ver/nhentai (https://github.com/zzzwannasleep/10Comic-W.Ver)'
}
const NHENTAI_DOWNLOAD_SOURCE_API = 'api'
const NHENTAI_DOWNLOAD_SOURCE_WEB = 'web'
const NHENTAI_DOWNLOAD_SOURCE_OPTIONS = [
  { text: 'API', value: NHENTAI_DOWNLOAD_SOURCE_API },
  { text: '网页', value: NHENTAI_DOWNLOAD_SOURCE_WEB }
]

let nhentaiCdnConfigPromise = null

const getJsonByGuard = async(url, purpose, headers = '') => {
  const responseText = await requestTextWithGuard({
    method: 'get',
    url,
    headers,
    purpose,
    verifyUrl: 'https://nhentai.net/'
  })
  try {
    return JSON.parse(responseText)
  } catch (error) {
    throw new Error(`${purpose} response is not valid JSON`)
  }
}

const getNhentaiGalleryId = (url = '') => {
  const match = String(url || '').match(/\/g\/(\d+)(?:\/\d+)?\/?/i)
  return match?.[1] || ''
}

const normalizeNhentaiGalleryUrl = (url = '') => {
  const galleryId = getNhentaiGalleryId(url)
  if (!galleryId) {
    return url
  }
  return `https://nhentai.net/g/${galleryId}/`
}

const getNhentaiApiJson = async(path, purpose) => {
  return getJsonByGuard(`${NHENTAI_API_ROOT}${path}`, purpose, NHENTAI_API_HEADERS)
}

const getNhentaiCdnConfig = async() => {
  if (!nhentaiCdnConfigPromise) {
    nhentaiCdnConfigPromise = getNhentaiApiJson('/cdn', 'nhentai CDN config').catch((error) => {
      nhentaiCdnConfigPromise = null
      throw error
    })
  }
  return nhentaiCdnConfigPromise
}

const getNhentaiGallery = async(galleryId) => {
  if (!galleryId) {
    throw new Error('Failed to parse nhentai gallery id')
  }
  return getNhentaiApiJson(`/galleries/${galleryId}`, `nhentai gallery ${galleryId}`)
}

const getNhentaiTitleText = (title = {}) => {
  return trimSpecial(title.pretty || title.english || title.japanese || '')
}

const getNhentaiTitleFromPageTitle = (rawTitle = '') => {
  const title = String(rawTitle || '')
    .replace(/\s*[»禄]\s*nhentai.*$/i, '')
    .replace(/\s*-\s*Page\s+\d+\s*$/i, '')
    .trim()
  return trimSpecial(title)
}

const getNhentaiRootTitle = (root) => {
  const selectorList = ['h1 .pretty', 'h1.title', 'h1', 'title']
  for (let i = 0; i < selectorList.length; i++) {
    try {
      const dom = root?.querySelector(selectorList[i])
      const text = trimSpecial(dom?.innerText || dom?.textContent || '')
      if (text) {
        return getNhentaiTitleFromPageTitle(text)
      }
    } catch (error) {
      //
    }
  }

  try {
    const docTitle = trimSpecial(root?.title || '')
    if (docTitle) {
      return getNhentaiTitleFromPageTitle(docTitle)
    }
  } catch (error) {
    //
  }

  return getNhentaiTitleFromPageTitle(document?.title || '')
}

const getNhentaiTagNames = (tags = [], tagType = '') => {
  return (tags || [])
    .filter(item => !tagType || item?.type === tagType)
    .map(item => trimSpecial(item?.name || ''))
    .filter(Boolean)
}

const getNhentaiLanguageIso = (tags = []) => {
  const languageNameList = getNhentaiTagNames(tags, 'language').map(item => item.toLowerCase())
  const languageMap = {
    english: 'en',
    chinese: 'zh',
    japanese: 'ja',
    korean: 'ko',
    spanish: 'es',
    french: 'fr',
    german: 'de',
    russian: 'ru',
    portuguese: 'pt',
    italian: 'it',
    thai: 'th',
    vietnamese: 'vi'
  }

  for (let i = 0; i < languageNameList.length; i++) {
    if (languageMap[languageNameList[i]]) {
      return languageMap[languageNameList[i]]
    }
  }
  return ''
}

const getNhentaiDownloadSource = (context = {}) => {
  const source = String(context?.imageSource || context?.downloadSource || '').trim().toLowerCase()
  return source === NHENTAI_DOWNLOAD_SOURCE_WEB ? NHENTAI_DOWNLOAD_SOURCE_WEB : NHENTAI_DOWNLOAD_SOURCE_API
}

const getNhentaiReaderPageUrl = (galleryId, pageNumber) => {
  if (!galleryId || !pageNumber) {
    return ''
  }
  return `https://nhentai.net/g/${galleryId}/${pageNumber}/`
}

const uniqUrlList = (list = []) => {
  return [...new Set((list || []).filter(Boolean))]
}

const getNhentaiNumberText = (value = '') => {
  const match = String(value || '').match(/\d+/)
  return match ? parseInt(match[0]) : 0
}

const getNhentaiGalleryPageUrlsFromRoot = (root, pageUrl = '') => {
  const pageUrlList = []
  try {
    root?.querySelectorAll('a.gallerythumb[href*="/g/"]').forEach((item) => {
      const href = item?.getAttribute('href') || ''
      if (href) {
        pageUrlList.push(resolveUrl(href, pageUrl))
      }
    })
  } catch (error) {
    //
  }

  const uniquePageUrlList = uniqUrlList(pageUrlList)
  if (uniquePageUrlList.length > 0) {
    return uniquePageUrlList
  }

  const galleryId = getNhentaiGalleryId(pageUrl) ||
    getNhentaiGalleryId(root?.querySelector('.go-back[href*="/g/"]')?.getAttribute('href') || '')
  const numPages = getNhentaiNumberText(
    root?.querySelector('.reader-pagination .num-pages, .page-number .num-pages')?.textContent || ''
  )
  if (!galleryId || !numPages) {
    return []
  }

  return Array.from({ length: numPages }, (_, index) => getNhentaiReaderPageUrl(galleryId, index + 1)).filter(Boolean)
}

const getNhentaiReaderImageUrlFromRoot = (root, pageUrl = '') => {
  const selectorList = [
    '#image-container img',
    'section#image-container img',
    'img[alt^="Page "]'
  ]

  for (let i = 0; i < selectorList.length; i++) {
    try {
      const dom = root?.querySelector(selectorList[i])
      const rawUrl = dom?.getAttribute('data-src') ||
        dom?.getAttribute('data-lazy-src') ||
        dom?.getAttribute('src') ||
        ''
      if (rawUrl) {
        return resolveUrl(rawUrl, pageUrl)
      }
    } catch (error) {
      //
    }
  }

  return ''
}

const getNhentaiGalleryPageUrls = async(pageUrl, responseText = '') => {
  const currentPageUrl = pageUrl || window.location.href
  const currentRoot = responseText ? parseToDOM(responseText) : null
  let pageUrlList = getNhentaiGalleryPageUrlsFromRoot(currentRoot, currentPageUrl)
  if (pageUrlList.length > 0) {
    return pageUrlList
  }

  const galleryUrl = normalizeNhentaiGalleryUrl(currentPageUrl)
  if (!galleryUrl || galleryUrl === currentPageUrl) {
    return pageUrlList
  }

  const galleryText = await requestTextWithGuard({
    method: 'get',
    url: galleryUrl,
    purpose: 'nhentai gallery page',
    verifyUrl: galleryUrl
  })
  const galleryRoot = parseToDOM(galleryText)
  pageUrlList = getNhentaiGalleryPageUrlsFromRoot(galleryRoot, galleryUrl)
  return pageUrlList
}

const getNhentaiWebImageList = async(pageUrl, responseText = '') => {
  const currentPageUrl = pageUrl || window.location.href
  const currentRoot = responseText ? parseToDOM(responseText) : null
  const directImageUrl = getNhentaiReaderImageUrlFromRoot(currentRoot, currentPageUrl)
  const pageUrlList = await getNhentaiGalleryPageUrls(currentPageUrl, responseText)

  if (pageUrlList.length === 0) {
    return directImageUrl ? [directImageUrl] : []
  }

  const imageUrlList = []
  const batchSize = 4
  for (let i = 0; i < pageUrlList.length; i += batchSize) {
    const batchList = pageUrlList.slice(i, i + batchSize)
    const batchResult = await Promise.all(batchList.map(async(currentReaderPageUrl) => {
      if (currentReaderPageUrl === currentPageUrl && directImageUrl) {
        return directImageUrl
      }

      const readerText = await requestTextWithGuard({
        method: 'get',
        url: currentReaderPageUrl,
        purpose: `nhentai reader page ${i + 1}`,
        verifyUrl: normalizeNhentaiGalleryUrl(currentReaderPageUrl)
      })
      const readerRoot = parseToDOM(readerText)
      return getNhentaiReaderImageUrlFromRoot(readerRoot, currentReaderPageUrl)
    }))
    imageUrlList.push(...batchResult.filter(Boolean))
  }

  return imageUrlList
}

const buildNhentaiChapterName = (pageCount = 0) => {
  return pageCount > 0 ? `Full Gallery (${pageCount}P)` : 'Full Gallery'
}

const buildNhentaiChapterList = ({ galleryId, comicName = '', authorName = '', pageUrl = '', numPages = 0 }) => {
  if (!galleryId) {
    return []
  }

  const normalizedPageUrl = normalizeNhentaiGalleryUrl(pageUrl || `https://nhentai.net/g/${galleryId}/`)
  return [{
    comicName: trimSpecial(comicName),
    authorName: trimSpecial(authorName),
    comicPageUrl: normalizedPageUrl,
    webName: 'nhentai',
    chapterNumStr: '',
    chapterName: buildNhentaiChapterName(numPages),
    downChapterName: '',
    url: normalizedPageUrl,
    characterType: 'one',
    readtype: 1,
    isPay: false,
    isSelect: false
  }]
}

const getNhentaiChapterListFromRoot = (root, pageUrl, comicName = '', authorName = '') => {
  const normalizedPageUrl = normalizeNhentaiGalleryUrl(pageUrl || window.location.href)
  const galleryId = getNhentaiGalleryId(normalizedPageUrl)
  if (!galleryId) {
    return []
  }

  const resolvedComicName = trimSpecial(comicName || getNhentaiRootTitle(root) || `nhentai ${galleryId}`)
  const numPages = getNhentaiGalleryPageUrlsFromRoot(root, normalizedPageUrl).length
  return buildNhentaiChapterList({
    galleryId,
    comicName: resolvedComicName,
    authorName,
    pageUrl: normalizedPageUrl,
    numPages
  })
}

const getNhentaiSearchResultName = (item = {}) => {
  return trimSpecial(item.english_title || item.japanese_title || `nhentai ${item.id || ''}`)
}

const getNhentaiSearchList = async(keyword) => {
  const currentKeyword = String(keyword || '').trim()
  if (!currentKeyword) {
    return []
  }

  const [searchResult, cdnConfig] = await Promise.all([
    getNhentaiApiJson(`/search?query=${encodeURIComponent(currentKeyword)}`, 'nhentai search'),
    getNhentaiCdnConfig()
  ])
  const thumbBaseUrl = `${cdnConfig?.thumb_servers?.[0] || 'https://t1.nhentai.net'}/`

  return (searchResult?.result || []).map((item) => {
    return {
      name: getNhentaiSearchResultName(item),
      url: `https://nhentai.net/g/${item.id}/`,
      imageUrl: resolveUrl(item.thumbnail, thumbBaseUrl)
    }
  })
}

const getNhentaiApiImageList = async(pageUrl) => {
  const galleryId = getNhentaiGalleryId(pageUrl)
  const [gallery, cdnConfig] = await Promise.all([
    getNhentaiGallery(galleryId),
    getNhentaiCdnConfig()
  ])
  const imageBaseUrl = `${cdnConfig?.image_servers?.[0] || 'https://i1.nhentai.net'}/`
  return (gallery?.pages || []).map(item => resolveUrl(item.path, imageBaseUrl))
}

const getNhentaiImageList = async(pageUrl, responseText = '', processData = {}) => {
  if (getNhentaiDownloadSource(processData) === NHENTAI_DOWNLOAD_SOURCE_WEB) {
    return getNhentaiWebImageList(pageUrl, responseText)
  }
  return getNhentaiApiImageList(pageUrl)
}

const getNhentaiMetadata = async(downloadItem = {}) => {
  if (getNhentaiDownloadSource(downloadItem) === NHENTAI_DOWNLOAD_SOURCE_WEB) {
    return null
  }

  const pageUrl = downloadItem?.comicPageUrl || downloadItem?.url || window.location.href
  const galleryId = getNhentaiGalleryId(pageUrl)
  if (!galleryId) {
    return null
  }

  const [gallery, cdnConfig] = await Promise.all([
    getNhentaiGallery(galleryId),
    getNhentaiCdnConfig()
  ])
  const artistList = getNhentaiTagNames(gallery?.tags, 'artist')
  const groupList = getNhentaiTagNames(gallery?.tags, 'group')
  const tagList = (gallery?.tags || [])
    .filter(item => !['artist', 'group', 'language', 'category'].includes(item?.type))
    .map(item => trimSpecial(item?.name || ''))
    .filter(Boolean)
  const coverBaseUrl = `${cdnConfig?.image_servers?.[0] || 'https://i1.nhentai.net'}/`

  return {
    source: 'nhentai API',
    seriesTitle: getNhentaiTitleText(gallery?.title) || downloadItem?.comicName || '',
    originalTitle: trimSpecial(gallery?.title?.japanese || '') || getNhentaiTitleText(gallery?.title) || downloadItem?.comicName || '',
    summary: '',
    writers: artistList.length > 0 ? artistList : groupList,
    illustrators: artistList,
    tags: tagList,
    publisher: groupList[0] || '',
    issueCount: downloadItem?.seriesChapterCount || undefined,
    releaseDate: gallery?.upload_date ? new Date(gallery.upload_date * 1000).toISOString().slice(0, 10) : '',
    status: 'ended',
    ageRating: 'R18+',
    languageISO: getNhentaiLanguageIso(gallery?.tags),
    subjectUrl: normalizeNhentaiGalleryUrl(pageUrl),
    coverUrl: gallery?.cover?.path ? resolveUrl(gallery.cover.path, coverBaseUrl) : ''
  }
}

export const comicsWebInfo = [
  {
    domain: ['nhentai.net', 'www.nhentai.net'],
    homepage: 'https://nhentai.net/',
    webName: 'nhentai',
    comicNameCss: 'h1 .pretty, h1.title, h1, title',
    authorCss: '#tags a[href*="/artist/"] .name, #tags a[href*="/group/"] .name, a[href*="/artist/"] .name, a[href*="/group/"] .name',
    chapterCss: '.__nhentai_single_gallery__',
    normalizeDownloadUrl: normalizeNhentaiGalleryUrl,
    defaultImageSource: NHENTAI_DOWNLOAD_SOURCE_API,
    downloadSourceOptions: NHENTAI_DOWNLOAD_SOURCE_OPTIONS,
    readtype: 1,
    searchFun: async function(keyword) {
      return getNhentaiSearchList(keyword)
    },
    getChaptersFromRoot: function(root, pageUrl, comicName, authorName) {
      return getNhentaiChapterListFromRoot(root, pageUrl, comicName, authorName)
    },
    getImgs: async function(context, processData) {
      return getNhentaiImageList(processData?.url || window.location.href, context, processData)
    },
    getMetadata: async function(downloadItem) {
      return getNhentaiMetadata(downloadItem)
    }
  },
  {
    domain: ['mangabz.com', 'www.mangabz.com'],
    homepage: 'https://mangabz.com/',
    webName: 'Mangabz',
    comicNameCss: 'p.detail-info-title',
    chapterCss: '#chapterlistload',
    headers: {
      referer: 'https://mangabz.com/'
    },
    downHeaders: {
      referer: 'https://mangabz.com/'
    },
    readtype: 0,
    searchTemplate_1: {
      search_add_url: 'search?title=',
      alllist_dom_css: '.container .mh-list',
      minlist_dom_css: 'li',
      img_src: 'src'
    },
    getImgs: async function(context, processData) {
      let group; let page = 1
      if (processData.otherData) {
        group = processData.otherData.group
      } else {
        group = context.match(/MANGABZ_MID=(\d+?);.*MANGABZ_CID=(\d+?);.*MANGABZ_IMAGE_COUNT=(\d+?);.*MANGABZ_VIEWSIGN="(.*?)".*MANGABZ_VIEWSIGN_DT="(.*?)"/)
      }
      if (processData.imgIndex !== undefined) {
        page = processData.imgIndex + 1
      }
      const reqUrl = `https://mangabz.com/m${group[2]}/chapterimage.ashx?cid=${group[2]}&page=${page}&key=&_cid=${group[2]}&_mid=${group[1]}&_dt=${group[5]}&_sign=${group[4]}`

      const { responseText } = await request('get', reqUrl)
      const codeText = funstrToData(responseText, /(function.*return .*?})(\(.*?{}\))/g)
      const imgUrlArr = funstrToData(codeText, /(function.*return .*?})/g)

      const otherData = { group }
      return { imgUrlArr, nextPageUrl: null, imgCount: group[3], otherData }
    }
  },
  {
    domain: 'manhua.zaimanhua.com',
    homepage: 'https://manhua.zaimanhua.com/',
    webName: '再漫画',
    comicNameCss: '.wrap_intro_l_comic h1 a',
    chapterCss: '.tab-content-selected',
    readtype: 1,
    useFrame: true,
    getImgs: async function(context, processData) {
      const iframeWindow = document.getElementById(processData.frameId).contentWindow
      await delay(1.5)
      const page_url = iframeWindow.__NUXT__.data.getChapters.data.chapterInfo.page_url
      document.getElementById(processData.frameId).remove()
      return page_url
    }
  },
  {
    domain: 'www.dm5.com',
    homepage: 'https://www.dm5.com/',
    webName: '动漫屋',
    comicNameCss: '.banner_detail_form > .info > p.title',
    chapterCss: '#detail-list-select-1',
    hasSpend: true,
    payKey: '-lock',
    readtype: 0,
    headers: {
      referer: 'https://www.dm5.com/'
    },
    downHeaders: {
      referer: ''
    },
    searchTemplate_1: {
      search_add_url: 'search?title=',
      alllist_dom_css: '.mh-list',
      minlist_dom_css: 'li',
      use_background: true
    },
    getImgs: async function(context, processData) {
      let group; let page = 1
      if (processData.otherData) {
        group = processData.otherData.group
      } else {
        group = context.match(/DM5_MID=(\d+?);.*DM5_CID=(\d+?);.*DM5_IMAGE_COUNT=(\d+?);.*DM5_VIEWSIGN="(.*?)".*DM5_VIEWSIGN_DT="(.*?)"/)
      }
      if (processData.imgIndex !== undefined) {
        page = processData.imgIndex + 1
      }
      const reqUrl = `https://www.dm5.com/ch1-${group[2]}/chapterfun.ashx?cid=${group[2]}&page=${page}&key=&language=1&gtk=6&_cid=${group[2]}&_mid=${group[1]}&_dt=${group[5].replaceAll(' ', '+').replaceAll(':', '%3A')}&_sign=${group[4]}`
      const { responseText } = await request({ method: 'get', url: reqUrl, useCookie: processData.isPay })

      const codeText = funstrToData(responseText, /(function.*return .*?})(\(.*?{}\))/g)
      const imgUrlArr = funstrToData(codeText, /(function.*return .*?})/g)
      const otherData = { group }
      return { imgUrlArr, nextPageUrl: null, imgCount: group[3], otherData }
    }
  },
  {
    domain: 'tel.dm5.com',
    homepage: 'https://tel.dm5.com/',
    webName: '动漫屋2',
    comicNameCss: '.banner_detail_form > .info > p.title',
    chapterCss: '#detail-list-select-1',
    hasSpend: true,
    payKey: '-lock',
    readtype: 0,
    headers: {
      referer: 'https://tel.dm5.com/'
    },
    downHeaders: {
      referer: ''
    },
    searchTemplate_1: {
      search_add_url: 'search?title=',
      alllist_dom_css: '.mh-list',
      minlist_dom_css: 'li',
      use_background: true
    },
    getImgs: async function(context, processData) {
      let group; let page = 1
      if (processData.otherData) {
        group = processData.otherData.group
      } else {
        group = context.match(/DM5_MID=(\d+?);.*DM5_CID=(\d+?);.*DM5_IMAGE_COUNT=(\d+?);.*DM5_VIEWSIGN="(.*?)".*DM5_VIEWSIGN_DT="(.*?)"/)
      }
      if (processData.imgIndex !== undefined) {
        page = processData.imgIndex + 1
      }
      const reqUrl = `https://tel.dm5.com/ch1-${group[2]}/chapterfun.ashx?cid=${group[2]}&page=${page}&key=&language=1&gtk=6&_cid=${group[2]}&_mid=${group[1]}&_dt=${group[5].replaceAll(' ', '+').replaceAll(':', '%3A')}&_sign=${group[4]}`
      const { responseText } = await request({ method: 'get', url: reqUrl, useCookie: processData.isPay })
      const codeText = funstrToData(responseText, /(function.*return .*?})(\(.*?{}\))/g)
      const imgUrlArr = funstrToData(codeText, /(function.*return .*?})/g)
      const otherData = { group }
      return { imgUrlArr, nextPageUrl: null, imgCount: group[3], otherData }
    }
  },
  {
    domain: 'godamh.com',
    homepage: 'https://godamh.com/',
    webName: 'GoDa',
    comicNameCss: '.container nav > ol > li:nth-child(3) a',
    chapterCss: '.chapterlists',
    chapterNameReg: /data-ct="(.*?)"/,
    readtype: 1,
    headers: {
      referer: 'https://godamh.com/'
    },
    getImgs: async function(context) {
      const ms = context.match(/data-ms="(\d+)".*data-cs="(\d+)"/)[1]
      const cs = context.match(/data-ms="(\d+)".*data-cs="(\d+)"/)[2]

      const url = `https://api-get-v2.mgsearcher.com/api/chapter/getinfo?m=${ms}&c=${cs}`
      const { responseText } = await request('GET', url)

      const info = JSON.parse(responseText).data.info
      const domain = info.images.line === 2 ? 'https://f40-1-4.g-mh.online' : 'https://t40-1-4.g-mh.online'
      const images = info.images.images.map(element => {
        return domain + element.url
      })
      return images
    }
  },
  {
    domain: 'www.comemh8.com',
    homepage: 'https://www.comemh8.com/',
    webName: '来漫画',
    comicNameCss: '.title h1',
    chapterCss: '#play_0 ul ',
    readtype: 1,
    searchFun: async function(keyword) {
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded; charset=gb2312',
        referer: this.homepage
      }
      const data = encodeTextByCharset(`key=${keyword}`, 'gb2312')
      const response = await request({
        method: 'post',
        url: this.homepage + 'e/search/',
        headers,
        data,
        responseType: 'arraybuffer'
      })
      const responseText = decodeBinaryByCharset(response?.response || response, 'gb2312')

      if (!responseText) {
        throw new Error(`未获取到${this.webName} 搜索页`)
      }
      if (isChallengePage(responseText)) {
        openVerifyPage(this.homepage)
        throw new Error(`检测到 Cloudflare 验证，已打开${this.webName} 搜索页，请手动通过后重试`)
      }

      const root = parseToDOM(responseText)
      if (root.querySelector('.noresult')) {
        return []
      }

      const searchList = []
      root.querySelectorAll('#dmList li').forEach((item) => {
        const titleAnchor = item.querySelector('dt a')
        const imgDom = item.querySelector('.pic img')
        const name = trimSpecial(titleAnchor?.getAttribute('title') || titleAnchor?.innerText || titleAnchor?.textContent || '')
        const url = resolveUrl(titleAnchor?.getAttribute('href') || '', this.homepage)
        const imageUrl = resolveUrl(imgDom?.getAttribute('src') || '', this.homepage)
        if (name && url) {
          searchList.push({
            name,
            url,
            imageUrl
          })
        }
      })
      return searchList
    },
    useFrame: true,
    getImgs: async function(context, processData) {
      const iframeWindow = document.getElementById(processData.frameId).contentWindow
      const arr = iframeWindow.getUrlpics()
      const host = iframeWindow.gethost()
      const image = arr.map(element => host + element)
      console.log('image: ', image)
      document.getElementById(processData.frameId).remove()
      return image
    }
  },
  {
    domain: 'www.rumanhua1.com',
    homepage: 'http://www.rumanhua1.com/',
    webName: 'R如漫画',
    comicNameCss: 'h1.name_mh',
    chapterCss: '.chapterList .chapterlistload ul',
    readtype: 1,
    useFrame: true,
    getImgs: async function(context, processData) {
      const iframeDom = document.getElementById(processData.frameId).contentDocument
      await delay(1.5)
      const image = [...iframeDom.querySelectorAll('.main_img img')].map(img => img.dataset.src ?? img.src)
      document.getElementById(processData.frameId).remove()
      return image
    }
  },

  {
    domain: 'www.dongmanmanhua.cn',
    homepage: 'https://www.dongmanmanhua.cn/',
    webName: '咚漫',
    comicNameCss: 'h1.subj',
    chapterCss: '#_listUl',
    chapterNameReg: /alt="(.*?)"/,
    readtype: 1,
    searchFun: async function(keyword) {
      const searchUrl = `${this.homepage}search?keyword=${encodeURIComponent(String(keyword || '').trim())}`
      const responseText = await requestTextWithGuard({
        method: 'get',
        url: searchUrl,
        headers: this.headers,
        purpose: `${this.webName} search page`
      })
      const root = parseToDOM(responseText)
      const searchList = []
      root.querySelectorAll('.card_wrap.search ul.card_lst > li').forEach((item) => {
        const anchor = item.querySelector('a.card_item')
        const titleDom = item.querySelector('.subj')
        const imgDom = item.querySelector('img')
        const name = trimSpecial(titleDom?.innerText || titleDom?.textContent || '')
        const url = resolveUrl(anchor?.getAttribute('href') || '', this.homepage)
        const imageUrl = resolveUrl(imgDom?.getAttribute('src') || '', this.homepage)
        if (name && url) {
          searchList.push({
            name,
            url,
            imageUrl
          })
        }
      })
      return searchList
    },
    headers: {
      referer: 'https://www.dongmanmanhua.cn/'
    },
    getImgs: async function(context) {
      const str = context.match(/class="viewer_lst[\s\S]*?input/)[0]
      const imgobj = str.matchAll(/img src[\s\S]*?data-url="(.*?)"/g)
      const imgUrlArr = []
      for (const item of imgobj) {
        imgUrlArr.push(item[1])
      }
      return imgUrlArr
    }
  },
  {
    domain: 'www.gaonaojin.com',
    homepage: 'https://www.gaonaojin.com/',
    webName: '仙漫网',
    comicNameCss: 'h1',
    chapterCss: '#detail-list-select-1',
    readtype: 1,
    getImgs: function(context) {
      const imgDomain = context.match(/imgDomain = '(.*?)'/)[1]
      let imgStr = funstrToData(context, /(function.*?return \S})(\(.*?{}\))/g)
      imgStr = imgStr.match(/\[[\s\S]+?\]/)[0]
      const imgArray = JSON.parse(imgStr)
      const imgarr = []
      imgArray.forEach(element => {
        imgarr.push(imgDomain + element)
      })
      return imgarr
    }
  },
  {
    domain: 'www.webtoons.com',
    homepage: 'https://www.webtoons.com/',
    webName: 'webtoons',
    comicNameCss: 'h1.subj',
    chapterCss: '#_listUl',
    chapterNameReg: /alt="(.*?)"/,
    readtype: 1,
    searchFun: async function(keyword) {
      const searchUrl = `${this.homepage}en/search?keyword=${encodeURIComponent(String(keyword || '').trim())}`
      const responseText = await requestTextWithGuard({
        method: 'get',
        url: searchUrl,
        headers: this.headers,
        purpose: `${this.webName} search page`
      })
      const root = parseToDOM(responseText)
      const searchList = []
      root.querySelectorAll('.webtoon_list_wrap ul.webtoon_list > li').forEach((item) => {
        const anchor = item.querySelector('a._card_item')
        const titleDom = item.querySelector('.info_text .title')
        const imgDom = item.querySelector('img')
        const name = trimSpecial(titleDom?.innerText || titleDom?.textContent || '')
        const url = resolveUrl(anchor?.getAttribute('href') || '', this.homepage)
        const imageUrl = resolveUrl(imgDom?.getAttribute('src') || '', this.homepage)
        if (name && url) {
          searchList.push({
            name,
            url,
            imageUrl
          })
        }
      })
      return searchList
    },
    webDesc: '？需要魔法？',
    headers: {
      referer: 'https://www.webtoons.com/'
    },
    getImgs: async function(context) {
      const str = context.match(/class="viewer_lst[\s\S]*?class="viewer_ad_area"/)[0]
      const imgobj = str.matchAll(/img src[\s\S]*?data-url="(.*?)"/g)
      const imgUrlArr = []
      for (const item of imgobj) {
        imgUrlArr.push(item[1])
      }
      return imgUrlArr
    }
  },
  {
    domain: 'www.manshiduo.net',
    homepage: 'https://www.manshiduo.net/',
    webName: '漫士多',
    comicNameCss: '.comic-title',
    chapterCss: 'ul.chapter__list-box',
    readtype: 1,
    getImgs: async function(context) {
      const imgobj = context.matchAll(/data-original="(.*?)"/g)
      const imgUrlArr = []
      for (const item of imgobj) {
        imgUrlArr.push(item[1])
      }
      return imgUrlArr
    }
  },
  {
    domain: 'comic.naver.com',
    homepage: 'https://comic.naver.com/',
    webName: 'comic.naver',
    comicNameCss: '#content > div.EpisodeListInfo__comic_info--yRAu0 > div > h2',
    chapterCss: '#content ul',
    chapterNameReg: /span.*?>(.*?)<\/span>/,
    webDesc: '找到漫画目录页再使用, 新打开页面需“重载列表”',
    readtype: 1,
    headers: {
      referer: 'https://comic.naver.com/'
    },
    getImgs: async function(context) {
      const str = context.match(/class="wt_viewer"[\s\S]*?(<\/div>)/)[0]
      const imgobj = str.matchAll(/img src="(.*?)"/g)
      const imgUrlArr = []
      for (const item of imgobj) {
        imgUrlArr.push(item[1])
      }
      return imgUrlArr
    }
  },
  {
    domain: 'komiic.com',
    homepage: 'https://komiic.com/',
    webName: 'Komiic漫画',
    comicNameCss: '.ComicMain__info .text-h6',
    chapterCss: '.v-card-text .v-container .v-row',
    chapterNameReg: / class="serial">(.*?)<\/span>/,
    webDesc: 'SPA页面, 新页面需“重载列表”重新匹配新名称',
    headers: {
      referer: 'https://komiic.com/'
    },
    readtype: 1,
    getImgs: async function(context, processData) {
      const { url } = processData
      const chapter_id = url.match(/chapter\/(\d*)\/images/)[1]
      const postUrl = 'https://komiic.com/api/query'
      const data = {
        'operationName': 'imagesByChapterId',
        'variables': {
          'chapterId': chapter_id
        },
        'query': 'query imagesByChapterId($chapterId: ID!) {\n  imagesByChapterId(chapterId: $chapterId) {\n    id\n    kid\n    height\n    width\n    __typename\n  }\n}\n'
      }
      const headers = { 'Content-Type': 'application/json' }
      const { responseText } = await request({ method: 'post', url: postUrl, headers, data: JSON.stringify(data) })
      const img_data = JSON.parse(responseText).data.imagesByChapterId
      const saveImg = []
      img_data.forEach(element => {
        saveImg.push('https://komiic.com/api/image/' + element.kid)
      })
      return saveImg
    }
  },
  {
    domain: ['www.darpou.com', 'darpou.com'],
    homepage: 'https://www.darpou.com/',
    webName: '百漫谷',
    comicNameCss: '.fed-part-eone.fed-font-xvi a',
    chapterCss: '.fed-play-item.fed-drop-item.fed-visible .fed-part-rows:nth-child(2)',
    readtype: 1,
    getImgs: async function(context) {
      const txtUrl = context.match(/http(\S*).txt/gi)[0]
      const txtRes = await request('get', txtUrl)
      let txtContext = txtRes.responseText
      txtContext = txtContext.replace(/img2.manga8.xyz/g, 'img4.manga8.xyz')
      txtContext = txtContext.replace(/img.manga8.xyz/g, 'img3.manga8.xyz')
      const imgReg = /http(\S*)jpg/g
      return txtContext.match(imgReg)
    }
  },
  {
    domain: ['www.copymanga.tv', 'www.mangacopy.com'],
    homepage: 'https://www.mangacopy.com/',
    webName: '拷贝漫画',
    comicNameCss: 'div.container .comicParticulars-title-right h6',
    chapterCss: '.tab-content > div.active > ul:nth-child(1)',
    readtype: 1,
    useFrame: true,
    getImgs: async function(context, processData) {
      const iframeDom = document.getElementById(processData.frameId).contentDocument
      const iframeWindow = document.getElementById(processData.frameId).contentWindow

      // 存在加载慢的可能性，10秒内持续检测是否存在数据
      await doThingsEachSecond(10, () => parseInt(iframeDom.querySelector('.comicCount')?.innerText))
      const totalNum = parseInt(iframeDom.querySelector('.comicCount')?.innerText)
      console.log('totalNum: ', totalNum)
      const contentEle = iframeDom.querySelector('ul.comicContent-list')

      // 结束滚动条件
      const end_condition_1 = () => {
        const curHeight = iframeWindow.innerHeight + iframeWindow.scrollY
        return curHeight >= contentEle.offsetHeight
      }
      const end_condition_2 = () => contentEle.childElementCount === totalNum

      // 等待滚动结果
      const result = await startScroll(iframeWindow, [end_condition_1, end_condition_2])
      console.log('result: ', result)
      clearInterval(result[0])

      document.getElementById(processData.frameId).remove()

      return [...contentEle.querySelectorAll('img')].map(img => img.dataset.src ?? img.src)
    }
  },
  {
    domain: 'www.fengchemh.com',
    homepage: 'https://www.fengchemh.com/',
    webName: '风车漫画',
    comicNameCss: 'h1',
    chapterCss: '#ewave-playlist-1',
    readtype: 1,
    useFrame: true,
    getImgs: async function(context, processData) {
      const iframeWindow = document.getElementById(processData.frameId).contentWindow
      const images = iframeWindow.params.images
      document.getElementById(processData.frameId).remove()
      return images
    }
  },
  {
    domain: ['manhuagui.com'],
    homepage: 'https://www.manhuagui.com/',
    webName: '漫画柜',
    comicNameCss: '.book-title h1',
    chapterCss: '.chapter-list',
    readtype: 1,
    // context 章节请求正文
    getImgs: function(context) {
      // 获取到 html请求正文 context 的一段js代码字符 并执行这代码获取到 图片地址信息
      // window["\x65\x76\x61\x6c"]  => eval
      // (function[\s\S]+?return \S*?}) 匿名函数部分
      // (\([\s\S]+?{}\)) 需要的参数
      const dataStr = funstrToData(context, /window\["\\x65\\x76\\x61\\x6c"\]\((function[\s\S]+?return \S*?})(\([\s\S]+?{}\))/g)
      const matchObj = /"files":(?<files>.*?),"finished".*"path":"(?<path>.*?)".*"e":(?<e>\d*),"m":"(?<m>.*)"}/g.exec(dataStr)
      var { files, path, e, m } = matchObj.groups
      files = JSON.parse(files)
      const image = files.map(ele => {
        return 'https://i.hamreus.com' + path + ele + '?e=' + e + '&m=' + m
      })
      return image
    }
  },
  {
    domain: 'www.gufengmh9.com',
    homepage: 'https://www.gufengmh9.com/',
    webName: '古风漫画网',
    comicNameCss: '.book-title h1 span',
    chapterCss: '.chapter-body',
    readtype: 1,
    readCssText: '.img_info {display: none;}.tbCenter img {border: 0px;}',
    searchTemplate_1: {
      search_add_url: 'search/?keywords=',
      alllist_dom_css: '.book-list',
      minlist_dom_css: 'li',
      img_src: 'src'
    },
    getImgs: async function(context) {
      const group = context.matchAll(/chapterImages = (.*?);var chapterPath = "(.*?)"/g)
      const strArr = []
      for (const item of group) {
        strArr.push(item[1])
        strArr.push(item[2])
      }
      const josnRes = await request('get', this.homepage + 'js/config.js')
      const josnContext = josnRes.responseText
      const imageDomian = josnContext.match(/"domain":\["(.*?)"]/)[1]
      let imgarr = JSON.parse(strArr[0])
      imgarr = imgarr.map((item) => {
        if (imgarr[0].search('http') === -1) {
          return imageDomian + '/' + strArr[1] + item
        }
        return item
      })
      return imgarr
    }
  },
  {
    domain: 'comic.acgn.cc',
    homepage: 'https://comic.acgn.cc/',
    webName: '动漫戏说',
    comicNameCss: '.list_navbox h3 a',
    chapterCss: '#comic_chapter > ul',
    readtype: 1,
    getImgs: async function(context) {
      const group = context.matchAll(/_src="(.*?)"/g)
      const imgArray = []
      for (const item of group) {
        imgArray.push(item[1])
      }
      return imgArray
    }
  },
  {
    domain: 'www.77mh.xyz',
    homepage: 'https://www.77mh.xyz/',
    webName: '新新漫画',
    comicNameCss: '.ar_list_coc h1',
    chapterCss: '.ar_list_coc .ar_rlos_bor',
    readtype: 1,
    downHeaders: {
      Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
    },
    searchTemplate_1: {
      search_add_url: 'k.php?k=',
      search_pre: 'https://so.77mh.xyz/',
      alllist_dom_css: '.ar_list_co ul',
      minlist_dom_css: 'dl',
      img_src: 'src'
    },
    getImgs: async function(context, processData) {
      const imgStr = funstrToData(context, /(function[\s\S]+?return \S})(\([\s\S]+?{}\))/g)
      const params = imgStr.match(/var atsvr="(.*?)";var msg='(.*?)'.*img_s=(.*?);.*colist_(.*?).htm/)
      let imgArray = params[2].split('|')

      const coid = window.location.href.match(/colist_(\d*?).html/)[1]
      const reqUrl = `https://css.gdbyhtl.net:5443/img_v1/cnlo_svr.asp?z=${params[1]}&s=${params[3]}&cid=${params[4]}&coid=${coid}`

      const { responseText } = await request('get', reqUrl)
      const getImgPre = responseText.match(/= "(.*?)"/)[1]

      if (imgArray[0].search('http') === -1) {
        imgArray = imgArray.map((item) => {
          return getImgPre + item
        })
      }
      return imgArray
    }
  },
  {
    domain: 'www.mhua5.com',
    homepage: 'https://www.mhua5.com/',
    webName: '漫画屋',
    comicNameCss: '.comic-title.j-comic-title',
    chapterCss: '.chapter__list-box.clearfix',
    readtype: 1,
    searchTemplate_1: {
      search_add_url: 'index.php/search?key=',
      alllist_dom_css: '.cate-comic-list',
      minlist_dom_css: '.common-comic-item',
      img_src: 'data-original'
    },
    getImgs: function(context) {
      const group = context.matchAll(/data-original="(.*?)"/g)
      const imgArray = []
      for (const item of group) {
        imgArray.push(item[1])
      }
      return imgArray
    }
  },
  {
    domain: 'www.yymanhua.com',
    homepage: 'https://www.yymanhua.com/',
    webName: 'yymanhua',
    comicNameCss: 'p.detail-info-title',
    chapterCss: '.detail-list-form-con',
    readtype: 1,
    headers: {
      referer: 'https://www.yymanhua.com/'
    },
    searchTemplate_1: {
      search_add_url: 'search?title=',
      alllist_dom_css: '.mh-list',
      minlist_dom_css: 'li',
      img_src: 'src'
    },
    useFrame: true,
    getImgs: async function(context, processData) {
      const iframe = document.getElementById(processData.frameId).contentWindow
      const cid = iframe.YYMANHUA_CID
      let page
      const _cid = iframe.YYMANHUA_CID
      const _mid = iframe.COMIC_MID
      const _dt = iframe.YYMANHUA_VIEWSIGN_DT
      const _sign = iframe.YYMANHUA_VIEWSIGN

      const imageArray = []
      const count = iframe.YYMANHUA_IMAGE_COUNT

      let currentCount = 0
      while (currentCount < count) {
        page = currentCount + 1
        console.log('page: ', page)
        const url = `https://www.yymanhua.com/m${cid}/chapterimage.ashx?cid=${cid}&page=${page}&key=&_cid=${_cid}&_mid=${_mid}&_dt=${_dt}&_sign=${_sign}`
        const { response } = await request({ method: 'get', url })
        console.log('response: ', response)
        const funStr = funstrToData(response, /(function.*?return \S;})(\(.*?{}\))/g)
        const newImgs = funstrToData(funStr, /(function.*?return .*?})()/g)
        imageArray.push(...newImgs)
        currentCount = imageArray.length
        await delay(0.5)
      }
      document.getElementById(processData.frameId).remove()
      return imageArray
    }
  },
  {
    domain: ['www.xmanhua.com', 'xmanhua.com'],
    homepage: 'https://xmanhua.com/',
    webName: 'xmanhua',
    comicNameCss: 'p.detail-info-title',
    chapterCss: '.detail-list-form-con',
    readtype: 1,
    headers: {
      referer: 'https://xmanhua.com/'
    },
    searchTemplate_1: {
      search_add_url: 'search?title=',
      alllist_dom_css: '.mh-list',
      minlist_dom_css: 'li',
      img_src: 'src'
    },
    useFrame: true,
    getImgs: async function(context, processData) {
      const iframe = document.getElementById(processData.frameId).contentWindow

      const cid = iframe.XMANHUA_CID
      let page
      const _cid = iframe.XMANHUA_CID
      const _mid = iframe.COMIC_MID
      const _dt = iframe.XMANHUA_VIEWSIGN_DT
      const _sign = iframe.XMANHUA_VIEWSIGN

      const imageArray = []
      const count = iframe.XMANHUA_IMAGE_COUNT
      let currentCount = 0
      while (currentCount < count) {
        page = currentCount + 1
        console.log('page: ', page)
        const url = `https://xmanhua.com/m${cid}/chapterimage.ashx?cid=${cid}&page=${page}&key=&_cid=${_cid}&_mid=${_mid}&_dt=${_dt}&_sign=${_sign}`
        const { response } = await request({ method: 'get', url })
        const funStr = funstrToData(response, /(function.*?return \S;})(\(.*?{}\))/g)
        const newImgs = funstrToData(funStr, /(function.*?return .*?})()/g)
        imageArray.push(...newImgs)
        currentCount = imageArray.length
        await delay(0.5)
      }
      document.getElementById(processData.frameId).remove()
      return imageArray
    }
  },
  {
    domain: 'www.cartoonmad.com',
    homepage: 'https://www.cartoonmad.com/',
    webName: '动漫狂',
    comicNameCss: 'table > tbody > tr:nth-child(3) > td:nth-child(2) > a:nth-child(6)',
    chapterCss: '#info',
    readtype: 1,
    downHeaders: {
      referer: 'https://www.cartoonmad.com/'
    },
    getImgs: function(context) {
      const preImgUrl = 'https:' + context.match(/<img src="(.*?)001.*?"/)[1]
      const suffix = context.match(/<img src="(.*?)001\.(.*?)"/)[2]
      const pageTotalNum = context.match(/<\/option>.*html">.*?(\d+).*?<\/select>/)[1]
      const imgArray = []
      for (let i = 0; i < pageTotalNum; i++) {
        const imgUrl = preImgUrl + addZeroForNum(i + 1, 3) + '.' + suffix
        imgArray.push(imgUrl)
      }
      return imgArray
    }
  },
  {
    domain: 'www.6mh1.com',
    homepage: 'http://www.6mh1.com/',
    webName: '六漫画',
    comicNameCss: 'h1.name_mh',
    chapterCss: '#chapter-list1',
    readtype: 1,
    useFrame: true,
    getImgs: async function(context, processData) {
      const iframe = document.getElementById(processData.frameId).contentWindow
      const newImgs = JSON.parse(JSON.stringify(iframe.newImgs))
      document.getElementById(processData.frameId).remove()
      return newImgs
    }
  },
  {
    domain: ['www.baozimhcn.com', 'www.baozimh.com', 'cn.baozimhcn.com'],
    homepage: 'https://www.baozimh.com/',
    webName: '包子漫画',
    comicNameCss: 'h1.comics-detail__title',
    chapterCss: '.comics-detail > .l-content:nth-of-type(3) #chapter-items',
    chapterCss_2: '.comics-detail > .l-content:nth-of-type(3) .pure-g',
    readtype: 1,
    searchTemplate_1: {
      search_add_url: 'search/?keyword=',
      alllist_dom_css: '.pure-g.classify-items',
      minlist_dom_css: 'div.comics-card',
      img_reg: /src=('|")(.*?)\?/,
      match_reg_num: 2
    },
    getImgs: async function(context, processData) {
      const imgArray = []
      const nextReg = /next_chapter"><a href="(.*)?"[\s\S]{1,10}点击进入下一页/
      let hasNext = false
      let nextHtml = ''
      do {
        const group = context.matchAll(/<img.*src="(.*?)"/g)
        for (const item of group) {
          if (!imgArray.includes(item[1])) {
            imgArray.push(item[1])
          }
        }
        hasNext = nextReg.test(context)
        if (hasNext) {
          nextHtml = context.match(nextReg)[1]
          const { responseText } = await request('get', nextHtml)
          context = responseText
        }
      } while (hasNext)
      return imgArray
    }
  },
  {
    domain: ['bakamh.com', 'www.bakamh.com'],
    homepage: 'https://bakamh.com/',
    webName: 'bakamh巴卡漫画',
    comicNameCss: '#manga-title h1',
    authorCss: '.author-content',
    chapterCss: '.listing-chapters_main',
    readtype: 1,
    useFrame: true,
    headers: {
      referer: 'https://bakamh.com/'
    },
    downHeaders: {
      referer: 'https://bakamh.com/'
    },
    searchFun: async function(keyword) {
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        referer: this.homepage
      }
      const data = `action=wp-manga-search-manga&title=${encodeURIComponent(keyword)}`
      const responseText = await requestTextWithGuard({
        method: 'post',
        url: this.homepage + 'wp-admin/admin-ajax.php',
        headers,
        data,
        purpose: `${this.webName} 搜索页`,
        verifyUrl: this.homepage
      })

      let searchData = []
      try {
        const jsonData = JSON.parse(responseText || '{}')
        searchData = Array.isArray(jsonData.data) ? jsonData.data : []
      } catch (error) {
        searchData = []
      }

      const searchList = []
      for (let i = 0; i < searchData.length; i++) {
        const item = searchData[i]
        const name = trimSpecial(item?.title || item?.label || '')
        const url = item?.url ? new URL(item.url, this.homepage).href : ''
        if (!name || !url) {
          continue
        }

        let imageUrl = ''
        try {
          const detailText = await requestTextWithGuard({
            method: 'get',
            url,
            headers: this.headers || '',
            purpose: `${this.webName} 详情页`
          })
          const root = parseToDOM(detailText || '')
          const imgDom = root.querySelector('.summary_image img')
          const rawImageUrl = imgDom?.getAttribute('data-src') || imgDom?.getAttribute('data-lazy-src') || imgDom?.getAttribute('src') || ''
          imageUrl = rawImageUrl ? new URL(rawImageUrl, url).href : ''
        } catch (error) {
          imageUrl = ''
        }

        searchList.push({
          name,
          url,
          imageUrl
        })
      }

      return searchList
    },
    getImgs: async function(context, processData) {
      const iframeDom = document.getElementById(processData.frameId).contentDocument
      await delay(0.5)
      const imgArray = [...iframeDom.querySelectorAll('img.wp-manga-chapter-img')]
        .map(img => (img.getAttribute('data-manga-src') || img.dataset.mangaSrc || img.getAttribute('src') || '').trim())
        .filter(Boolean)

      if (imgArray.length === 0) {
        const pageHtml = String(iframeDom.documentElement?.outerHTML || '').toLowerCase()
        document.getElementById(processData.frameId).remove()

        if (isChallengePage(pageHtml)) {
          openVerifyPage(processData.url)
          throw new Error('检测到 Cloudflare 验证，已打开章节页，请手动通过后重试下载')
        }

        throw new Error('未获取到章节图片，页面结构可能已变化')
      }

      document.getElementById(processData.frameId).remove()
      return [...new Set(imgArray)]
    }
  },
  {
    domain: 'www.guoman.net',
    homepage: 'https://www.guoman.net/',
    webName: '爱国漫',
    comicNameCss: '.detail-info > .detail-info-title',
    chapterCss: '#chapterlistload',
    readtype: 1,
    searchTemplate_1: {
      search_add_url: 'search?key=',
      alllist_dom_css: '.mh-list',
      minlist_dom_css: 'li',
      img_src: 'src'
    },
    getImgs: async function(context) {
      const group = context.matchAll(/<img.*src="(.*?)"/g)
      const imgArray = []
      for (const item of group) {
        imgArray.push(item[1])
      }
      return imgArray
    }
  },
  {
    domain: ['zcymh.com', 'www.zcymh.com'],
    homepage: 'https://zcymh.com/',
    webName: '最次元',
    comicNameCss: 'h1',
    chapterCss: '#detail-chapter .bd',
    readtype: 1,
    getImgs: async function(context) {
      const group = context.matchAll(/chapter-pid="[\s\S]*?<img src="(.*?)"/g)
      const imgArray = []
      for (const item of group) {
        imgArray.push(item[1])
      }
      return imgArray
    }
  },
  {
    domain: 'www.kanman.com',
    homepage: 'https://www.kanman.com/',
    webName: '看漫画',
    comicNameCss: 'h1.title',
    chapterCss: '#j_chapter_list',
    readtype: 1,
    searchFun: async function(keyword) {
      const searchUrl = `${this.homepage}api/getsortlist/?search_key=${encodeURIComponent(String(keyword || '').trim())}`
      const responseText = await requestTextWithGuard({
        method: 'get',
        url: searchUrl,
        purpose: `${this.webName} search api`
      })
      const result = JSON.parse(responseText)
      const dataList = Array.isArray(result?.data) ? result.data : []
      return dataList.map((item) => {
        const comicId = item?.comic_id || item?.comic_newid
        return {
          name: trimSpecial(item?.comic_name || ''),
          url: resolveUrl(`/${comicId}/`, this.homepage),
          imageUrl: resolveUrl(item?.cover_img || '', this.homepage)
        }
      }).filter(item => item.name && item.url && !item.url.endsWith('/undefined/'))
    },
    getImgs: async function(context) {
      const imgStr = context.match(/chapter_img_list:(\[.*?\])/)[1]
      let imgArray = eval(imgStr)
      imgArray = imgArray.map(element => {
        element = element.replace('hw-chapter2', 'hw-chapter3')
        return element
      })
      return imgArray
    }
  },
  {
    domain: 'www.manhua88888.com',
    homepage: 'https://www.manhua88888.com/',
    webName: '好漫8',
    comicNameCss: '.content .title',
    chapterCss: '#j_chapter_list',
    readtype: 1,
    getImgs: function(context) {
      const group = context.matchAll(/data-echo="(.*?)"/g)
      const imgArray = []
      for (const item of group) {
        imgArray.push(item[1])
      }
      return imgArray
    }
  }
]

const getUserStorageList = (key) => {
  const data = getStorage(key) || []
  if (getType(data) === 'Array') {
    return data
  }
  if (getType(data) === 'String') {
    return eval(data || '[]')
  }
  return []
}

export const getWebList = () => {
  const userWebInfo = getUserStorageList('userWebInfo')
  const originalInfo = comicsWebInfo
  return { originalInfo, userWebInfo }
}

const getUserWebList = () => {
  return getUserStorageList('userWebInfo')
}

const normalizeWebRule = (webRule) => {
  if (webRule && typeof webRule.getImgs === 'string') {
    window.request = request
    webRule.getImgs = funSplicing(webRule.getImgs)
  }
  if (webRule && typeof webRule.searchFun === 'string') {
    window.request = request
    webRule.searchFun = funSplicing(webRule.searchFun)
  }
  return webRule
}

const getAllWebList = () => {
  return comicsWebInfo.concat(getUserWebList()).map(item => normalizeWebRule(item))
}

export const getSearchableWebList = () => {
  return getAllWebList().filter(item => item.searchTemplate_1 || item.searchFun)
}

export const searchComicsAcrossWebs = async(keyword, selectedWebNames = []) => {
  const result = []
  const selectedWebNameSet = new Set((selectedWebNames || []).filter(Boolean))
  const webList = getSearchableWebList().filter((item) => {
    if (selectedWebNameSet.size === 0) {
      return true
    }
    return selectedWebNameSet.has(item.webName)
  })
  for (let i = 0; i < webList.length; i++) {
    const webRule = webList[i]
    try {
      const findres = await searchComicOnWeb(webRule, keyword)
      result.push({
        webName: webRule.webName,
        webRule,
        findres: Array.isArray(findres) ? findres : []
      })
    } catch (error) {
      result.push({
        webName: webRule.webName,
        webRule,
        findres: [],
        error
      })
    }
  }
  return result
}

export const findWebByUrl = (url) => {
  const hname = getdomain(url)
  const allWebList = getAllWebList()

  for (let i = 0; i < allWebList.length; i++) {
    const webRule = allWebList[i]
    if (getType(webRule.domain) === 'Array') {
      if (webRule.domain.some(domain => hname.includes(domain) || domain.includes(hname))) {
        return normalizeWebRule(webRule)
      }
    } else if (hname.includes(webRule.domain)) {
      return normalizeWebRule(webRule)
    }
  }
  return null
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

const authorPrefixReg = /^(作者|作者名|作者\/作画|作者\/作畫|作画|作畫|漫畫|漫画|原著|原作|编剧|編劇|脚本|腳本|著者|繪者|绘者|畫師|画师|原案|author(?:\(s\))?|writer(?:\(s\))?|artist(?:\(s\))?|illustrator(?:\(s\))?|creator(?:\(s\))?|story|story by|written by|script|script by|art by|illustrated by)\s*[：:：-]?\s*/i
const authorHintReg = /(作者|作者名|作画|作畫|原著|原作|编剧|編劇|脚本|腳本|著者|繪者|绘者|畫師|画师|原案|\bauthor\b|\bwriter\b|\bartist\b|\billustrator\b|\bcreator\b|\bstory\b|\bscript\b|\bwritten by\b|\bart by\b|\billustrated by\b)/i
const authorNoiseReg = /(状态|狀態|连载中|連載中|已完结|已完結|完结|完結|题材|題材|标签|標籤|类型|類型|分类|分類|更新|最新|人气|人氣|地区|地區|年份|别名|別名|简介|簡介|评分|評分|收藏|点击|點擊|进度|進度|\bstatus\b|\bongoing\b|\bcompleted\b|\bcomplete\b|\bgenre\b|\btag(?:s)?\b|\btype\b|\bcategory\b|\bcategories\b|\bupdate(?:d)?\b|\blatest\b|\bpopular(?:ity)?\b|\bregion\b|\byear\b|\balias(?:es)?\b|\bsummary\b|\bdescription\b|\brating\b|\bscore\b|\bfavorite(?:s)?\b|\bviews?\b|\bprogress\b)/i
const authorStopPatterns = [
  /状态/i, /狀態/i, /连载中/i, /連載中/i, /已完结/i, /已完結/i, /完结/i, /完結/i,
  /题材/i, /題材/i, /标签/i, /標籤/i, /类型/i, /類型/i, /分类/i, /分類/i,
  /更新/i, /最新/i, /人气/i, /人氣/i, /地区/i, /地區/i, /年份/i, /别名/i, /別名/i,
  /简介/i, /簡介/i, /评分/i, /評分/i, /收藏/i, /点击/i, /點擊/i, /进度/i, /進度/i,
  /\bstatus\b/i, /\bongoing\b/i, /\bcompleted\b/i, /\bcomplete\b/i,
  /\bgenre\b/i, /\btag\b/i, /\btags\b/i, /\btype\b/i, /\bcategory\b/i, /\bcategories\b/i,
  /\bupdate\b/i, /\bupdated\b/i, /\blatest\b/i, /\bpopularity\b/i, /\bpopular\b/i,
  /\bregion\b/i, /\byear\b/i, /\balias\b/i, /\baliases\b/i, /\bsummary\b/i, /\bdescription\b/i,
  /\brating\b/i, /\bscore\b/i, /\bfavorites\b/i, /\bfavorite\b/i, /\bview\b/i, /\bviews\b/i, /\bprogress\b/i
]

const splitAuthorTextSegments = (text) => {
  return String(text || '')
    .replace(/\r/g, '\n')
    .split(/\n|[|｜;；]/)
    .map(item => item.trim())
    .filter(Boolean)
}

const stripAuthorNoise = (text) => {
  let value = String(text || '').trim()
  let stopIndex = value.length
  authorStopPatterns.forEach((pattern) => {
    const match = value.match(pattern)
    if (match && match.index > 0 && match.index < stopIndex) {
      stopIndex = match.index
    }
  })
  if (stopIndex !== value.length) {
    value = value.slice(0, stopIndex)
  }
  value = value
    .replace(/^[\s:：/／|｜,，;；·•\-()[\]{}<>]+/, '')
    .replace(/[\s:：/／|｜,，;；·•\-()[\]{}<>]+$/, '')
    .replace(/\b(?:by)\b\s*$/i, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
  return value
}

const normalizeAuthorName = (text, allowLoose = false) => {
  if (!text) {
    return ''
  }

  const segments = splitAuthorTextSegments(text)
  const candidateList = segments.length > 0 ? segments : [String(text)]
  const preferredSegments = candidateList.filter(item => authorHintReg.test(item))
  const targetSegments = preferredSegments.length > 0 ? preferredSegments : (allowLoose ? candidateList : [])

  for (let i = 0; i < targetSegments.length; i++) {
    let authorName = targetSegments[i]
    const hasPrefix = authorPrefixReg.test(authorName)
    authorName = authorName.replace(authorPrefixReg, '')
    authorName = stripAuthorNoise(authorName)
    if (!authorName) {
      continue
    }
    if (authorNoiseReg.test(authorName)) {
      continue
    }
    if (!allowLoose && !hasPrefix) {
      continue
    }
    if (authorName.length > 40) {
      continue
    }
    return trimSpecial(authorName)
  }
  return ''
}

export const getAuthorNameFromDom = (root, webConfig) => {
  const selectors = []
  if (webConfig?.authorCss) {
    if (getType(webConfig.authorCss) === 'Array') {
      selectors.push(...webConfig.authorCss)
    } else {
      selectors.push(webConfig.authorCss)
    }
  }
  selectors.push(
    '[itemprop="author"]',
    '[itemprop="creator"]',
    '[class*=author i]',
    '[id*=author i]',
    '[class*=writer i]',
    '[class*=artist i]',
    '[class*=creator i]',
    '[class*=illustrator i]',
    '[id*=writer i]',
    '[id*=artist i]',
    '[id*=creator i]',
    '[id*=illustrator i]',
    '[data-testid*=author i]'
  )

  for (let i = 0; i < selectors.length; i++) {
    const authorName = normalizeAuthorName(getDomText(root, selectors[i]), true)
    if (authorName) {
      return authorName
    }
  }

  try {
    const textDomList = root.querySelectorAll('p, span, div, li, dd, dt, a, strong')
    for (let i = 0; i < textDomList.length; i++) {
      const text = (textDomList[i].innerText || textDomList[i].textContent || '').trim()
      if (text.length === 0 || text.length > 120) {
        continue
      }
      if (authorHintReg.test(text)) {
        const authorName = normalizeAuthorName(text)
        if (authorName) {
          return authorName
        }
      }
    }
  } catch (error) {
    //
  }
  return ''
}

export const getCurrentComicMeta = (webConfig, root = document) => {
  const comicName = webConfig?.comicNameCss ? getDomText(root, webConfig.comicNameCss).split('\n')[0] : ''
  const authorName = getAuthorNameFromDom(root, webConfig)
  return {
    comicName: trimSpecial(comicName),
    authorName
  }
}

const getChapterNameByElement = (element, chapterNameReg) => {
  let chapterName = ''
  try {
    if (!chapterNameReg) {
      chapterName = element.innerText || element.textContent || ''
    } else {
      chapterName = element.outerHTML.match(chapterNameReg)[1]
    }
  } catch (error) {
    chapterName = ''
  }
  return trimSpecial(chapterName)
}

const getElementUrl = (element, baseUrl) => {
  const href = element.getAttribute('href')
  if (!href || href.startsWith('javascript:')) {
    return 'javascript:void();'
  }
  try {
    return new URL(href, baseUrl).href
  } catch (error) {
    return href
  }
}

const pushChapterData = (list, nodeList, currentWeb, type, pageUrl, comicName, authorName) => {
  const hasSpend = currentWeb.hasSpend
  const chapterNameReg = currentWeb.chapterNameReg
  nodeList.forEach(dom => {
    const urls = dom.querySelectorAll('a')
    const readtype = currentWeb.readtype

    urls.forEach((element) => {
      const chapterName = getChapterNameByElement(element, chapterNameReg)
      let currentIsPay = false
      if (hasSpend) {
        const payKey = currentWeb.payKey
        const parent = element.parentElement
        if (parent && parent.outerHTML.indexOf(payKey) > 0) {
          currentIsPay = true
        }
      }

      const data = {
        comicName: trimSpecial(comicName),
        authorName: trimSpecial(authorName || ''),
        comicPageUrl: pageUrl,
        webName: currentWeb.webName,
        chapterNumStr: '',
        chapterName,
        downChapterName: '',
        url: getElementUrl(element, pageUrl),
        characterType: type,
        readtype,
        isPay: currentIsPay,
        isSelect: false
      }

      if (data.chapterName !== '') {
        list.push(data)
      }
    })
  })
}

export const getChapterListFromRoot = (root, currentWeb, pageUrl, comicName, authorName = '') => {
  if (typeof currentWeb?.getChaptersFromRoot === 'function') {
    const customList = currentWeb.getChaptersFromRoot(root, pageUrl, comicName, authorName)
    if (Array.isArray(customList)) {
      return customList
    }
  }

  const list = []
  const nodeList = root.querySelectorAll(currentWeb.chapterCss)
  pushChapterData(list, nodeList, currentWeb, 'one', pageUrl, comicName, authorName)

  if (currentWeb.chapterCss_2) {
    const nodeList2 = root.querySelectorAll(currentWeb.chapterCss_2)
    pushChapterData(list, nodeList2, currentWeb, 'many', pageUrl, comicName, authorName)
  }
  return list
}

export const getComicInfoFromHtml = (html, currentWeb, pageUrl) => {
  const root = parseToDOM(html)
  const { comicName, authorName } = getCurrentComicMeta(currentWeb, root)
  const chapters = getChapterListFromRoot(root, currentWeb, pageUrl, comicName, authorName)
  return {
    comicName,
    authorName,
    chapters
  }
}

export let currentComics = null

// 网站匹配
export const matchWeb = (url) => {
  currentComics = findWebByUrl(url)
}

function funSplicing(funStr) {
  const getImgsGroup = funStr.match(/((async )?function\(.*{)([\s\S]*)/)
  const funHead = getImgsGroup[1]
  const funTail = getImgsGroup[3]
  let insertCode = ''
  if (funStr.includes('funstrToData')) {
    insertCode = insertCode + funstrToData.toString() + '\n'
  }
  if (funStr.includes('request')) {
    insertCode = insertCode + 'const request = window.request' + '\n'
  }
  const code = `
  (function(){
    return ${funHead}
  // 注入开始
  ${insertCode}
  // 注入结束
  ${funTail}
  })()`
  const fun = eval(code)
  // console.log('fun: ', fun.toString())
  return fun
}

