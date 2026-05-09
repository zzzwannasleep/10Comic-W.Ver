/* eslint-disable no-undef */
import Vue from 'vue'
import App from './app.vue'

import './styles/global_scss.less'
import './styles/global.less'

import { isDev } from './config'
import { loadStyle2, getType } from './utils'
import { getStorage, appLoadinit, setinit } from '@/config/setup'
import { canAutoCheckFollow, checkAllFollowItems } from '@/utils/follow'
import { findWebByUrl } from '@/utils/comics'

var id = null
var appVm = null
var appLoadDefault = null
var tryLoadTimes = 0
var hasStartedFollowCheck = false
loadMenu(tryLoadTimes)

function loadMenu() {
  tryLoadTimes += 1
  try {
    if (!isDev) {
      appLoadinit()
    }
    appLoadDefault = getStorage('appLoadDefault')
    GM_registerMenuCommand(`加载UI (Alt + ${appLoadDefault.loadHotKey})`, openUI)
    GM_registerMenuCommand(`重置所有数据`, setinit)
    document.addEventListener('keydown', (e) => {
      if (e.altKey && e.key.toUpperCase() === appLoadDefault.loadHotKey.toUpperCase()) {
        openUI(0)
      }
    })
    if (appLoadDefault.isShowUI) {
      openUI(0)
    }
    setTimeout(() => {
      runFollowCheck()
    }, 0)
  } catch (error) {
    console.log('loadError: ', error)
    openUI(tryLoadTimes)
  }
}

async function runFollowCheck() {
  if (hasStartedFollowCheck || isDev) {
    return
  }
  if (!findWebByUrl(window.location.href)) {
    return
  }
  if (!canAutoCheckFollow()) {
    return
  }
  hasStartedFollowCheck = true
  try {
    await checkAllFollowItems()
  } catch (error) {
    console.log('followCheckError: ', error)
  }
}

async function openUI(times = 0) {
  if (appVm !== null) {
    appVm.isHide = false
    return appVm
  }
  const vm = await loadUI(times)
  if (vm) {
    vm.isHide = false
    appVm = vm
  }
  return vm
}

async function loadUI(times) {
  if (appVm !== null) {
    return appVm
  }

  if (!isDev) {
    // 首次运行脚本无存储数据，无加载菜单， 重新载入
    if (times === 1) {
      loadMenu()
      return null
    }
  }

  var Vant = await import('vant')
  // import ('vant/lib/index.css')
  Vue.use(Vant)

  id = `app_vue_${Date.now()}`
  const root = document.createElement('div')
  root.id = id
  document.body.appendChild(root)
  Vue.prototype.$bus = new Vue()
  Vue.prototype.$getType = getType

  if (isDev) {
    await loadStyle2('https://unpkg.com/vant@2.12/lib/index.css')
    return new Vue({
      el: `#${id}`,
      render: h => h(App)
    })
  } else {
  // eslint-disable-next-line no-undef
    GM_addStyle(GM_getResourceText('vantcss'))
    return new Vue({
      el: `#${id}`,
      render: h => h(App)
    })
  }
}
