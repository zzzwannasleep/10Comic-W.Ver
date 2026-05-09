import { getStorage } from '@/config/setup'
import { getImage } from '@/utils/index'

const applyImageRange = (imgList) => {
  const imgDownRange = getStorage('imgDownRange') || [1, -1]
  const start = Math.max(parseInt(imgDownRange[0] || 1), 1)
  const end = parseInt(imgDownRange[1] || -1)
  if (end === -1) {
    return imgList.slice(start - 1)
  }
  return imgList.slice(start - 1, end + 1)
}

export const getChapterImageUrls = async(downloadItem) => {
  if (!downloadItem) {
    return []
  }

  if (downloadItem.readtype === 1) {
    const imgs = await getImage({
      url: downloadItem.url,
      isPay: downloadItem.isPay
    })
    return applyImageRange(Array.isArray(imgs) ? imgs : [])
  }

  const imageUrls = []
  const visitedPageUrls = new Set()
  const processData = {
    url: downloadItem.url,
    imgIndex: 0,
    totalNumber: 0,
    isPay: downloadItem.isPay,
    otherData: undefined
  }

  while (processData.url && !visitedPageUrls.has(processData.url)) {
    visitedPageUrls.add(processData.url)
    const result = await getImage(processData)
    const currentList = Array.isArray(result?.imgUrlArr) ? result.imgUrlArr : []
    imageUrls.push(...currentList)
    processData.otherData = result?.otherData
    processData.totalNumber = parseInt(result?.imgCount || imageUrls.length || 0)

    if (!result?.nextPageUrl || (processData.totalNumber > 0 && imageUrls.length >= processData.totalNumber)) {
      break
    }

    processData.imgIndex = imageUrls.length
    processData.url = result.nextPageUrl
  }

  return applyImageRange(imageUrls)
}
