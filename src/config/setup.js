/* eslint-disable no-unused-vars */
/* eslint-disable no-eval */
/* eslint-disable no-undef */
import { AppVersion, isDev } from '@/config/index'

export const defaultPanSettings = {
  quarkCookie: '',
  quarkTargetDirId: '0'
}

const configDefault = {
  version: AppVersion,
  appLoadDefault: {
    isShowUI: false,
    loadHotKey: 'V',
    rightSize: 100,
    centerSize: 100
  },
  maxChapterNum: 2,
  maxPictureNum: 3,
  downType: 0,
  maxSplicingHeight: 20000,
  imgIndexBitNum: 3,
  imgSplicingFlag: true,
  imgDownRange: [1, -1],
  zipNameTemplate: '[站点名字][作者名][漫画名称][章节名称][多少P]',
  metadataSettings: {
    enableComicInfoXml: true,
    enableSeriesJson: false,
    enableSeriesCover: false,
    enableMetadataPreview: false,
    enableBangumiScrape: false,
    bangumiAccessToken: '',
    bangumiIncludeNsfw: false,
    languageISO: 'zh',
    publisher: ''
  },
  followSettings: {
    autoCheckOnLoad: true,
    checkCooldownMinutes: 30
  },
  followCheckState: {
    lastCheckAt: 0,
    lastUpdateCount: 0
  },
  followList: [],
  followSearchWebNames: [],
  bangumiMetadataCache: {},
  panSettings: { ...defaultPanSettings },
  userWebInfo: [],
  rootDir: '10Comic'
}

const localStorageDefault = {
  ylComicDownHistory: '[]'
}

const abandonDefault = ['downHistory']

export const appLoadinit = () => {
  if (isDev) {
    return
  }

  for (const key in localStorageDefault) {
    if (localStorage.getItem(key) == null) {
      localStorage.setItem(key, localStorageDefault[key])
    }
  }

  for (const key in configDefault) {
    if (GM_getValue(key) === undefined) {
      GM_setValue(key, configDefault[key])
    }
  }

  if (GM_getValue('version') !== undefined && GM_getValue('version') === AppVersion) {
    return
  }

  abandonDefault.forEach((word) => {
    if (GM_getValue(word) !== undefined) {
      GM_deleteValue(word)
    }
  })

  GM_setValue('version', AppVersion)
  GM_setValue('maxChapterNum', 2)

  return true
}

export const setinit = async() => {
  return new Promise((resolve) => {
    if (isDev) {
      resolve(false)
      return
    }
    for (const key in configDefault) {
      GM_setValue(key, configDefault[key])
    }
    resolve(true)
  })
}

export const setStorage = (key, value, key2 = null) => {
  if (key2) {
    const obj = GM_getValue(key) || {}
    obj[key2] = value
    value = obj
  }
  GM_setValue(key, value)
  return true
}

export const getStorage = (key) => {
  return GM_getValue(key)
}
