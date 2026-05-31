import JSZip from 'jszip'
import { getImage, downFile, addZeroForNum, request, openVerifyPage } from '@/utils/index'
import { getStorage } from '@/config/setup'
import { buildArchiveName, buildComicInfoXml, buildSeriesJson, getMetadataFileFlags } from '@/utils/metadata'
import { getBangumiMetadata } from '@/utils/bangumi'
import { clearPendingChapters } from '@/utils/follow'

const challengeResponseReg = /challenge-platform|cf-browser-verification|cf-chl-|cf-turnstile|cf-challenge|cf-wrapper|verify you are human|attention required|checking if the site connection is secure|security check to access|just a moment\.\.\.|why do i have to complete a captcha/i

// 多个任务并行执行的队列
// https://juejin.cn/post/6844903961728647181

export default class Queue {
  constructor(workerLen, maxPictureNum, imgIndexBitNum, vue) {
    this.workerLen = workerLen || 3 // 同时执行的任务数
    this.pictureNum = maxPictureNum || 2 // 章节最大下载图片数量
    this.list = [] // 任务队列
    this.worker = new Array(this.workerLen) // 正在执行的任务
    this.workerDownInfo = new Array(this.workerLen) // 存储下载信息
    this.imgIndexBitNum = imgIndexBitNum // 图片序号位数
    this.seriesJsonCache = new Set()
    this.seriesCoverCache = new Set()
    this.Vue = vue
  }

  // 压缩下载方式
  async downloadFile(fileName, content) {
    const url = window.URL.createObjectURL(content)
    await downFile(url, fileName)
    window.URL.revokeObjectURL(url)
  }

  async downloadRemoteFile(fileName, url) {
    if (!url) {
      return false
    }
    return downFile({ url, name: fileName })
  }

  getCoverFileName(url) {
    const match = String(url || '').match(/\.(jpg|jpeg|webp|png|gif|bmp)(?:$|[?#])/i)
    const suffix = match ? match[1].toLowerCase() : 'jpg'
    return `cover.${suffix === 'jpeg' ? 'jpg' : suffix}`
  }

  normalizeImageExtension(suffix) {
    if (!suffix) {
      return 'jpg'
    }
    return suffix.toLowerCase() === 'jpeg' ? 'jpg' : suffix.toLowerCase()
  }

  getCoverExtensionByMimeType(mimeType) {
    if (!mimeType) {
      return 'jpg'
    }
    if (mimeType.includes('png')) return 'png'
    if (mimeType.includes('webp')) return 'webp'
    if (mimeType.includes('gif')) return 'gif'
    if (mimeType.includes('bmp')) return 'bmp'
    return 'jpg'
  }

  dataUrlToBlob(dataUrl) {
    const group = String(dataUrl || '').split(',')
    if (group.length < 2) {
      return null
    }
    const mimeType = (group[0].match(/data:(.*?);base64/) || [])[1] || 'image/jpeg'
    const binary = atob(group[1])
    const len = binary.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    return {
      blob: new Blob([bytes], { type: mimeType }),
      extension: this.getCoverExtensionByMimeType(mimeType)
    }
  }

  buildImageHeaders(workerId, headers) {
    const defaultHeaders = {
      referer: this.worker[workerId].url
    }
    if (!headers || typeof headers !== 'object' || Array.isArray(headers)) {
      return defaultHeaders
    }
    const nextHeaders = {
      ...defaultHeaders,
      ...headers
    }
    if (!nextHeaders.referer) {
      nextHeaders.referer = defaultHeaders.referer
    }
    return nextHeaders
  }

  updateProgress(workerId, isSuccess = false) {
    if (isSuccess) {
      this.worker[workerId].successNum = this.worker[workerId].successNum + 1
    }
    this.worker[workerId].progress = parseInt(this.worker[workerId].imgIndex / this.worker[workerId].totalNumber * 100)
    this.refresh()
  }

  getResponseHeaderValue(responseHeaders = '', headerName = '') {
    const reg = new RegExp(`^${String(headerName || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*:\\s*(.+)$`, 'im')
    return String(responseHeaders || '').match(reg)?.[1]?.trim() || ''
  }

  async blobToText(blob) {
    if (!blob) {
      return ''
    }
    if (typeof blob.text === 'function') {
      try {
        return await blob.text()
      } catch (error) {
        return ''
      }
    }
    return new Promise((resolve) => {
      try {
        const reader = new FileReader()
        reader.onload = function() {
          resolve(String(reader.result || ''))
        }
        reader.onerror = function() {
          resolve('')
        }
        reader.readAsText(blob)
      } catch (error) {
        resolve('')
      }
    })
  }

  openVerifyPageOnce(workerId, url) {
    if (!this.worker[workerId] || this.worker[workerId].verifyPromptShown) {
      return
    }
    this.worker[workerId].verifyPromptShown = true
    openVerifyPage(url || this.worker[workerId].url)
  }

  createChallengeError() {
    return new Error('检测到 Cloudflare 验证，已打开验证页面，请手动通过后重试下载')
  }

  async isChallengeResponse(workerId, requestUrl, response) {
    if (!response || response === 'onerror' || response === 'timeout' || !response.response) {
      return false
    }

    const finalUrl = String(response.finalUrl || requestUrl || '')
    const responseHeaders = String(response.responseHeaders || '')
    const contentType = (this.getResponseHeaderValue(responseHeaders, 'content-type') || response.response?.type || '').toLowerCase()
    const maybeChallengeUrl = challengeResponseReg.test(finalUrl) || /\/cdn-cgi\//i.test(finalUrl)
    const shouldReadText = maybeChallengeUrl || !contentType.includes('image/')

    if (!shouldReadText) {
      return false
    }

    let responseText = ''
    if (typeof response.responseText === 'string' && response.responseText) {
      responseText = response.responseText
    } else if (typeof response.response === 'string') {
      responseText = response.response
    } else if (response.response instanceof Blob) {
      responseText = await this.blobToText(response.response)
    }

    if (!maybeChallengeUrl && !challengeResponseReg.test(String(responseText || ''))) {
      return false
    }

    this.openVerifyPageOnce(workerId, requestUrl)
    return true
  }

  async fetchImageBlob(workerId, url) {
    if (!url) {
      return null
    }
    const headers = this.buildImageHeaders(workerId, this.worker[workerId].downHeaders)
    const response = await request({
      method: 'get',
      url,
      responseType: 'blob',
      headers,
      timeout: 60 * 1000
    })
    if (!response || response === 'onerror' || response === 'timeout' || !response.response) {
      return null
    }
    if (await this.isChallengeResponse(workerId, url, response)) {
      return null
    }
    return {
      blob: response.response,
      suffix: this.getSuffix(response.finalUrl || url)
    }
  }

  async writeBookCoverFile(workerId, archiveBasePath) {
    const coverOption = this.worker[workerId].coverOption
    if (!coverOption || coverOption.type === 'first') {
      return
    }

    if (coverOption.type === 'upload' && coverOption.dataUrl) {
      const result = this.dataUrlToBlob(coverOption.dataUrl)
      if (result?.blob) {
        await this.downloadFile(`${archiveBasePath}.${result.extension}`, result.blob)
      }
      return
    }

    if (coverOption.type === 'chapter' && coverOption.imageUrl) {
      let coverData = this.workerDownInfo[workerId].find(item => item.imgurl === coverOption.imageUrl && item.blob !== 1 && item.blob !== 0)
      if (!coverData) {
        coverData = await this.fetchImageBlob(workerId, coverOption.imageUrl)
      }
      if (coverData?.blob) {
        const coverExt = this.normalizeImageExtension(coverData.suffix)
        await this.downloadFile(`${archiveBasePath}.${coverExt}`, coverData.blob)
      }
      return
    }

    if (coverOption.type === 'bangumi' && coverOption.imageUrl) {
      const coverExt = this.normalizeImageExtension(this.getSuffix(coverOption.imageUrl))
      await this.downloadRemoteFile(`${archiveBasePath}.${coverExt}`, coverOption.imageUrl)
    }
  }

  getSeriesCacheKey(worker) {
    return `${worker.webName || ''}_${worker.comicName || ''}`
  }

  shouldPrepareMetadata(worker) {
    const { enableBangumiScrape, enableComicInfoXml, enableSeriesJson, enableSeriesCover } = getMetadataFileFlags()
    if (!enableBangumiScrape) {
      return false
    }
    if (worker.downType === 1 && enableComicInfoXml) {
      return true
    }
    return enableSeriesJson || enableSeriesCover
  }

  prepareWorkerMetadata(worker) {
    if (!this.shouldPrepareMetadata(worker)) {
      return Promise.resolve(null)
    }
    return getBangumiMetadata(worker).catch((error) => {
      console.log('bangumiMetadataError: ', error)
      return null
    })
  }

  async getWorkerMetadata(worker) {
    if (!worker) {
      return null
    }
    if (!worker.metadataPromise) {
      worker.metadataPromise = this.prepareWorkerMetadata(worker)
    }
    return worker.metadataPromise
  }

  async writeSeriesMetadata(worker) {
    const { enableSeriesJson, enableSeriesCover } = getMetadataFileFlags()
    const metadataKey = this.getSeriesCacheKey(worker)
    if (!enableSeriesJson && !enableSeriesCover) {
      return
    }
    const externalMetadata = await this.getWorkerMetadata(worker)

    if (enableSeriesJson && !this.seriesJsonCache.has(metadataKey)) {
      const seriesJson = buildSeriesJson(worker, externalMetadata)
      const jsonBlob = new Blob([seriesJson], { type: 'application/json' })
      await this.downloadFile(this.getComicFolderPath(worker) + '\\series.json', jsonBlob)
      this.seriesJsonCache.add(metadataKey)
    }

    if (enableSeriesCover && externalMetadata?.coverUrl && !this.seriesCoverCache.has(metadataKey)) {
      const coverFileName = this.getCoverFileName(externalMetadata.coverUrl)
      const result = await this.downloadRemoteFile(this.getComicFolderPath(worker) + '\\' + coverFileName, externalMetadata.coverUrl)
      if (result) {
        this.seriesCoverCache.add(metadataKey)
      }
    }
  }

  /**
     * 执行一个任务
     * @param { number } index
     */
  async * exeDown(index) {
    const { readtype, downChapterName } = this.worker[index]
    const _this = this

    async function afterDown(index) {
      const { comicName, hasError, comicPageUrl, followItemId, url } = _this.worker[index]
      await _this.writeSeriesMetadata(_this.worker[index])
      if (followItemId && !hasError) {
        clearPendingChapters(followItemId, [url])
      }
      let historyData = localStorage.getItem('ylComicDownHistory') || '[]'
      historyData = JSON.parse(historyData)
      const id = (new Date()).getTime()
      historyData.unshift({ id, comicName, downChapterName, comicPageUrl: comicPageUrl || window.location.href, hasError })
      historyData = JSON.stringify(historyData)
      localStorage.setItem('ylComicDownHistory', historyData)
      _this.Vue.getHistoryData()
      _this.Vue.$bus.$emit('refreshFollowList')
      _this.worker[index] = undefined
      // 休息下？
      setTimeout(() => {
        _this.run()
      }, 2000)
    }

    if (readtype === 1) {
      const { url, isPay, imageSource } = this.worker[index]
      const processData = { url, isPay, imageSource }
      let imgs = []
      try {
        imgs = await getImage(processData)
        const imgDownRange = getStorage('imgDownRange') || [1, -1]
        const start = parseInt(imgDownRange[0])
        const end = parseInt(imgDownRange[1])
        if (end === -1) {
          imgs = imgs.slice(start - 1)
        } else {
          imgs = imgs.slice(start - 1, end + 1)
        }
        if (!Array.isArray(imgs) || imgs.length === 0) {
          this.worker[index].hasError = true
          await afterDown(index)
          return
        }
        this.worker[index].imgs = imgs
        this.worker[index].totalNumber = imgs.length
      } catch (error) {
        this.worker[index].hasError = true
        console.log('getImageError: ', error)
        await afterDown(index)
        return
      }
      yield this.down(index)
        .then(function() {
          afterDown(index)
        })
        .catch(function(error) {
          _this.worker[index].hasError = true
          console.log('down-e: ', error)
          return afterDown(index)
        })
        //
    } else {
      yield this.down2(index)
        .then(function() {
          afterDown(index)
        })
        .catch(function(error) {
          _this.worker[index].hasError = true
          console.log('down2-e: ', error)
          return afterDown(index)
        })
    }
  }

  /**
     * 添加到任务队列
     * @param { Array<Array<any>> } list: 任务队列
     */
  addList(list) {
    for (const item of list) {
      this.list.unshift(item)
    }
  }

  refresh() {
    this.worker.splice(0, 0)
  }

  isArchiveDownloadType(downType) {
    return downType === 1
  }

  isSpliceDownloadType(downType) {
    return downType === 2
  }

  isBufferDownloadType(downType) {
    return this.isArchiveDownloadType(downType) || this.isSpliceDownloadType(downType)
  }

  sanitizePathSegment(value, fallback = 'untitled') {
    const text = String(value || '')
      .replace(/[\\/:*?"<>|]/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .replace(/[. ]+$/g, '')
      .trim()
    return text || fallback
  }

  getBatchFolderPrefix() {
    const value = getStorage('batchFolderPrefix')
    if (value === undefined || value === null) {
      return '#'
    }
    return String(value)
  }

  getBatchFolderIndex(worker = {}) {
    const batchFolderIndex = parseInt(worker.batchFolderIndex, 10)
    if (Number.isInteger(batchFolderIndex) && batchFolderIndex > 0) {
      return batchFolderIndex
    }
    const chapterIndex = parseInt(worker.chapterIndex, 10)
    if (Number.isInteger(chapterIndex) && chapterIndex > 0) {
      return chapterIndex
    }
    return 1
  }

  getChapterFolderName(worker) {
    if (worker.downType === 3) {
      const folderNum = addZeroForNum(this.getBatchFolderIndex(worker), this.imgIndexBitNum)
      return this.sanitizePathSegment(`${this.getBatchFolderPrefix()}${folderNum}`, `chapter-${folderNum}`)
    }
    return this.sanitizePathSegment(worker.downChapterName, 'chapter')
  }

  getComicFolderPath(worker) {
    return this.sanitizePathSegment(worker.comicName, 'comic')
  }

  getChapterFolderPath(worker) {
    return this.getComicFolderPath(worker) + '\\' + this.getChapterFolderName(worker)
  }

  // 直接下载图片 Promise
  addImgDownPromise(index, imgurl, imgIndex, newHeaders, retryTimes) {
    const headers = this.buildImageHeaders(index, newHeaders)
    return new Promise((resolve, reject) => {
      const _this = this
      if (!imgurl) {
        _this.updateProgress(index)
        resolve(false)
        return
      }

      request({
        method: 'get',
        url: imgurl,
        responseType: 'blob',
        headers,
        timeout: 60 * 1000
      }).then(async(res) => {
        const name = this.getChapterFolderPath(this.worker[index]) + '\\' + addZeroForNum(imgIndex, this.imgIndexBitNum) + '.'
        let suffix = this.getSuffix(res?.finalUrl || imgurl)

        let newurl = ''
        if (res === 'onerror' || res === 'timeout') {
          if (retryTimes !== 2) {
            if (retryTimes === undefined) retryTimes = 0
            return resolve(_this.addImgDownPromise(index, imgurl, imgIndex, newHeaders, ++retryTimes))
          }

          _this.worker[index].hasError = true
          suffix = 'txt'
          const newBlob = new Blob([imgurl], { type: 'text/plain' })
          newurl = window.URL.createObjectURL(newBlob)
        } else {
          if (await _this.isChallengeResponse(index, imgurl, res)) {
            _this.worker[index].hasError = true
            reject(_this.createChallengeError())
            return
          }
          _this.updateProgress(index, true)
          newurl = window.URL.createObjectURL(res.response)
        }
        if (res === 'onerror' || res === 'timeout') {
          _this.updateProgress(index)
        }
        downFile(newurl, name + suffix).then((downRes) => {
          if (downRes) {
            resolve(true)
          } else {
            _this.worker[index].hasError = true
            resolve(false)
          }
        })
      })
    })
  }

  // 请求图片Blob Promise (后用于压缩)
  addImgPromise(index, imgurl, newHeaders, retryTimes) {
    const headers = this.buildImageHeaders(index, newHeaders)
    return new Promise((resolve, reject) => {
      const _this = this
      if (imgurl === '' || imgurl === undefined) {
        _this.worker[index].hasError = true
        _this.updateProgress(index)
        return resolve({
          blob: 1,
          imgurl,
          suffix: '' })
      }

      const suffix = this.getSuffix(imgurl)
      request({
        method: 'get',
        url: imgurl,
        responseType: 'blob',
        headers,
        timeout: 60 * 1000,
        onload: async function(gmRes) {
          if (await _this.isChallengeResponse(index, imgurl, gmRes)) {
            _this.worker[index].hasError = true
            reject(_this.createChallengeError())
            return
          }
          _this.updateProgress(index, true)
          resolve({
            blob: gmRes.response,
            imgurl,
            suffix: suffix })
        },
        onerror: function(e) {
          if (retryTimes !== 2) {
            if (retryTimes === undefined) retryTimes = 0
            return resolve(_this.addImgPromise(index, imgurl, newHeaders, ++retryTimes))
          }
          _this.worker[index].hasError = true
          _this.updateProgress(index)
          resolve({
            blob: 1,
            imgurl,
            suffix: '' })
        },
        ontimeout: function() {
          if (retryTimes !== 2) {
            if (retryTimes === undefined) retryTimes = 0
            return resolve(_this.addImgPromise(index, imgurl, newHeaders, ++retryTimes))
          }
          _this.worker[index].hasError = true
          _this.updateProgress(index)
          resolve({
            blob: 0,
            imgurl,
            suffix: '' })
        }
      })
    })
  }

  /**
     * 下载图片
     * @param { workerId } workerId: 任务id
     */

  // 网站翻页阅读
  async down2(workerId) {
    const { url, downType, totalNumber, isPay, imgIndex, downHeaders, imageSource } = this.worker[workerId]

    const processData = { url, imgIndex, totalNumber, isPay, imageSource }
    processData.otherData = this.worker[workerId].otherData

    const { imgUrlArr, nextPageUrl, imgCount, otherData } = await getImage(processData)
    this.worker[workerId].otherData = otherData

    this.worker[workerId].totalNumber = parseInt(imgCount)
    const beforeDownLen = imgUrlArr.length
    // console.log('下载前', beforeDownLen, imgIndex, totalNumber)

    while (imgUrlArr.length > 0) {
      // eslint-disable-next-line prefer-const
      let promise = []
      for (let index = this.pictureNum; index > 0; index--) {
        if (imgUrlArr[0] === undefined) {
          break
        }
        const imgIndex = ++this.worker[workerId].imgIndex
        if (this.isBufferDownloadType(downType)) {
          promise.push(this.addImgPromise(workerId, imgUrlArr[0], downHeaders))
        } else {
          promise.push(this.addImgDownPromise(workerId, imgUrlArr[0], imgIndex, downHeaders))
        }
        imgUrlArr.shift()
      }

      const res = await Promise.all(promise)
      res.forEach(element => {
        this.workerDownInfo[workerId].push(element)
      })
    }

    const newImgIndex = this.worker[workerId].imgIndex
    if (beforeDownLen !== 0 && nextPageUrl !== '' && newImgIndex < parseInt(imgCount)) {
      this.worker[workerId].url = nextPageUrl
      return new Promise((resolve, reject) => {
        // 休息一下？
        setTimeout(() => {
          resolve(this.down2(workerId))
        }, 1000)
      })
    } else {
      // 压缩
      if (this.isArchiveDownloadType(downType)) {
        const result = await this.makeZip(workerId)
        return new Promise((resolve, reject) => {
          resolve(result)
        })
      } else if (this.isSpliceDownloadType(downType)) { // 拼接
        await this.combineImages(workerId)
        return new Promise((resolve, reject) => {
          resolve()
        })
      } else {
        return new Promise((resolve, reject) => {
          resolve(1)
        })
      }
    }
  }

  // 网站卷轴阅读
  async down(workerId) {
    const { imgs, downType, downHeaders } = this.worker[workerId]
    const promise = []
    let len = imgs.length
    let pictureNum = this.pictureNum

    while (pictureNum-- && len > 0) {
      // 是否压缩
      const imgIndex = ++this.worker[workerId].imgIndex
      if (this.isBufferDownloadType(downType)) {
        promise.push(this.addImgPromise(workerId, imgs[0], downHeaders))
      } else {
        promise.push(this.addImgDownPromise(workerId, imgs[0], imgIndex, downHeaders))
      }
      this.worker[workerId].imgs.shift()
      len--
    }

    const res = await Promise.all(promise)

    res.forEach(element => {
      this.workerDownInfo[workerId].push(element)
    })

    if (this.worker[workerId].imgs.length > 0) {
      return new Promise((resolve, reject) => {
        // 休息一下？
        setTimeout(() => {
          resolve(this.down(workerId))
        }, 1000)
      })
    }

    // 压缩
    if (this.isArchiveDownloadType(downType)) {
      const result = await this.makeZip(workerId)
      return new Promise((resolve, reject) => {
        resolve(result)
      })
    } else if (this.isSpliceDownloadType(downType)) { // 拼接
      await this.combineImages(workerId)
      return new Promise((resolve, reject) => {
        resolve()
      })
    } else {
      return new Promise((resolve, reject) => {
        resolve(1)
      })
    }
  }

  // 分配并执行任务
  async run() {
    const runIndex = []
    for (let i = 0; i < this.workerLen; i++) {
      const len = this.list.length
      if (!this.worker[i] && len > 0) {
        // 需要执行的任务
        const item = this.list[len - 1]

        const worker = {
          comicName: item.comicName,
          authorName: item.authorName,
          webName: item.webName,
          comicPageUrl: item.comicPageUrl,
          chapterIndex: item.chapterIndex,
          chapterName: item.chapterName,
          chapterNumStr: item.chapterNumStr,
          downChapterName: item.downChapterName,
          batchFolderIndex: item.batchFolderIndex,
          url: item.url,
          isPay: item.isPay, // 是否付费章节
          imgIndex: 0, // 图片序号
          successNum: 0, // 下载成功数量
          totalNumber: 0, // 图片总数
          imgs: [],
          progress: 0, // 进度百分比
          readtype: item.readtype, // 阅读(下载)方式类型
          func: this.exeDown(i),
          downType: item.downType, // 下载方式 0：直接  1：压缩  2：拼接  3：批量
          hasError: false,
          verifyPromptShown: false,
          imageSource: item.imageSource,
          downHeaders: item.downHeaders,
          otherData: undefined, // 自定义存储其他下载数据
          seriesChapterCount: item.seriesChapterCount,
          followItemId: item.followItemId,
          coverOption: item.coverOption,
          metadataOverride: item.metadataOverride,
          metadataPromise: undefined
        }
        worker.metadataPromise = this.prepareWorkerMetadata(worker)
        this.worker[i] = worker
        this.workerDownInfo[i] = []
        this.list.pop()
        runIndex.push(i)
      }
    }
    // 执行任务
    for (const index of runIndex) {
      this.worker[index].func.next()
    }
  }

  getSuffix(url) {
    if (url) {
      const testurl = url.toLowerCase()
      const imgtype = ['jpg', 'jpeg', 'webp', 'png', 'gif', 'bmp', 'tiff', 'svg', 'ico']
      for (let i = 0; i < imgtype.length; i++) {
        const a = testurl.search(imgtype[i])
        if (a !== -1) {
          return imgtype[i]
        }
      }
      // 可能网址没有图片后缀
      return 'jpg'
    }
    return false
  }

  // 压缩
  async makeZip(workerId) {
    const { comicName } = this.worker[workerId]
    const zip = new JSZip()
    const { enableComicInfoXml } = getMetadataFileFlags()
    const externalMetadata = await this.getWorkerMetadata(this.worker[workerId])
    this.workerDownInfo[workerId].forEach((item, index) => {
      const imgblob = item.blob
      const suffix = item.suffix
      if (imgblob === 1 || imgblob === 0) {
        const txtBlob = new Blob([item.imgurl], { type: 'text/plain' })
        zip.file(addZeroForNum(index + 1, this.imgIndexBitNum) + '.txt', txtBlob, { blob: true })
        return
      }
      zip.file(addZeroForNum(index + 1, this.imgIndexBitNum) + '.' + suffix, imgblob, { blob: true })
    })
    if (enableComicInfoXml) {
      zip.file('ComicInfo.xml', buildComicInfoXml(this.worker[workerId], this.worker[workerId].totalNumber, externalMetadata))
    }

    const zipblob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 9
      }
    })
    const archiveName = buildArchiveName(this.worker[workerId], this.worker[workerId].totalNumber)
    const archiveBasePath = this.getComicFolderPath(this.worker[workerId]) + '\\' + archiveName
    await this.downloadFile(archiveBasePath + '.cbz', zipblob)
    await this.writeBookCoverFile(workerId, archiveBasePath)
    return true
  }

  async combineImages(workerId) {
    const maxSplicingHeight = getStorage('maxSplicingHeight')
    const chapterFolderPath = this.getChapterFolderPath(this.worker[workerId])
    let imgNum = 0
    let curHeight = 0
    let totalHeight = 0
    const saveImg = []
    const _this = this

    async function asyncLoadImg(src) {
      return new Promise((resolve, reject) => {
        const img = document.createElement('img')
        img.onload = () => {
          resolve(img)
        }
        img.onerror = () => {
          const error = new Error(`图片加载失败，url：${src}`)
          console.log('combineImages-e: ', error)
          reject('')
        }
        img.src = src
      })
    }

    async function asyncCanvas(canvas, name) {
      return new Promise((resolve, reject) => {
        canvas.toBlob(async function(imgblob) {
          await _this.downloadFile(name, imgblob)
          resolve()
        }, 'image/jpeg', 0.8)
      })
    }

    for (let index = 0; index < this.workerDownInfo[workerId].length; index++) {
      const data = this.workerDownInfo[workerId][index]
      // 去除不是图片类型
      if (data.blob === 1 || data.blob === 0 || !data.blob.type.includes('image')) {
        this.worker[workerId].hasError = true
        const error_name = chapterFolderPath + '\\error_' + addZeroForNum(index + 1, this.imgIndexBitNum) + '.txt'
        const imgurl = this.workerDownInfo[workerId][index].imgurl
        const newBlob = new Blob([imgurl], { type: 'text/plain' })
        _this.downloadFile(error_name, newBlob)
        continue
      }

      const newurl = window.URL.createObjectURL(data.blob)
      const image = await asyncLoadImg(newurl)
      if (image === '') {
        continue
      }
      if (totalHeight === 0) {
        const obj = { num: imgNum, width: image.width, height: image.height, img: [image] }
        curHeight = image.height
        totalHeight += image.height
        saveImg.push(obj)
        continue
      }
      if (curHeight + image.height > maxSplicingHeight) {
        const newobj = { num: ++imgNum, width: image.width, height: image.height, img: [image] }
        curHeight = image.height
        saveImg.push(newobj)
      } else {
        curHeight += image.height
        saveImg[imgNum].height += image.height
        saveImg[imgNum].img.push(image)
      }
      totalHeight += image.height
    }

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    let offsetY = 0
    for (let i = 0; i < saveImg.length; i++) {
      const item = saveImg[i]
      canvas.width = item.width
      canvas.height = item.height
      offsetY = 0

      for (let len = 0; len < item.img.length; len++) {
        const element = item.img[len]
        context.drawImage(element, 0, offsetY, element.width, element.height)
        offsetY = offsetY + parseInt(element.height)
      }
      const name = chapterFolderPath + '\\' + addZeroForNum(item.num + 1, this.imgIndexBitNum) + '.jpg'
      await asyncCanvas(canvas, name)
    }

    return new Promise((resolve, reject) => {
      resolve(true)
    })
  }
}
