<template>
  <div class="pan-page">
    <div class="pan-card">
      <div class="pan-card__title">网盘类型</div>
      <div class="pan-card__hint">
        目前已支持夸克网盘与 UC 网盘。Cookie、目标目录和待转存链接都会分别保留，不会互相覆盖。
      </div>

      <van-radio-group v-model="panSettings.activeProvider" direction="horizontal" class="pan-provider-group" @change="handleProviderChange">
        <van-radio
          v-for="item in providerList"
          :key="item.key"
          :name="item.key"
          class="pan-provider-radio"
        >
          {{ item.label }}
        </van-radio>
      </van-radio-group>
    </div>

    <div class="pan-card">
      <div class="pan-card__title">{{ currentProvider.label }} 配置</div>
      <div class="pan-card__hint">
        {{ currentProvider.cookieHint }}
      </div>

      <van-field
        v-model="currentCookie"
        type="textarea"
        rows="4"
        autosize
        label="Cookie"
        :placeholder="currentProvider.cookiePlaceholder"
      />

      <van-field
        v-model="currentTargetDirId"
        label="目标 fid"
        placeholder="默认 0"
      />

      <div class="pan-actions">
        <van-button size="small" round type="primary" @click="saveSettings">{{ currentProvider.shortName }} 配置保存</van-button>
        <van-button size="small" round :loading="testingCookie" @click="testCookie">测试 Cookie</van-button>
        <van-button size="small" round plain @click="useRootFolder">使用根目录</van-button>
      </div>

      <div v-if="currentAccountLabel" class="pan-inline-note">
        当前 Cookie: {{ currentAccountLabel }}
      </div>
    </div>

    <div class="pan-card">
      <div class="pan-card__title">目录浏览</div>
      <div class="pan-card__hint">
        当前目标 fid: {{ currentTargetDirId }}。点“浏览当前目录”后，可直接点击下方文件夹把它设成新的目标目录。
      </div>

      <div class="pan-actions">
        <van-button size="small" round :loading="browsingFolder" @click="browseTargetFolder">浏览当前目录</van-button>
        <van-button size="small" round plain @click="clearFolderList">清空目录列表</van-button>
      </div>

      <div v-if="folderList.length > 0" class="pan-folder-list">
        <van-cell-group inset>
          <van-cell
            v-for="item in folderList"
            :key="item.fid"
            is-link
            :title="item.file_name || item.title || item.fid"
            :label="`fid: ${item.fid}`"
            @click="selectFolder(item)"
          />
        </van-cell-group>
      </div>
      <div v-else class="pan-empty-hint">
        暂无目录列表。可以先测试 Cookie，再浏览当前目标目录。
      </div>
    </div>

    <div class="pan-card">
      <div class="pan-card__title">手动转存</div>
      <div class="pan-card__hint">
        {{ currentProvider.shareHint }}
      </div>

      <van-field
        v-model="currentShareInput"
        type="textarea"
        rows="5"
        autosize
        label="分享链接"
        :placeholder="currentProvider.sharePlaceholder"
      />

      <div class="pan-actions">
        <van-button size="small" round type="primary" :loading="transferring" @click="startTransfer">开始转存</van-button>
        <van-button size="small" round plain @click="clearShareInput">清空链接</van-button>
      </div>

      <div v-if="transferSummary" class="pan-inline-note">
        {{ transferSummary }}
      </div>
    </div>

    <div class="pan-card pan-card--logs">
      <div class="pan-card__title">运行日志</div>

      <div class="pan-actions">
        <van-button size="small" round plain @click="clearLogs">清空日志</van-button>
      </div>

      <div v-if="logList.length === 0" class="pan-empty-hint">
        这里会显示 Cookie 校验、目录浏览和转存过程日志。
      </div>
      <div v-else class="pan-log-list">
        <div
          v-for="item in logList"
          :key="item.id"
          class="pan-log-item"
          :class="`pan-log-item--${item.type}`"
        >
          <span class="pan-log-time">{{ item.time }}</span>
          <span class="pan-log-text">{{ item.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'

import { defaultPanSettings, getStorage, setStorage } from '@/config/setup'
import {
  getPanProvider,
  normalizePanProviderKey,
  PAN_PROVIDER_LIST,
  listPanDirectoryFolders,
  parsePanShareInput,
  transferPanShare,
  verifyPanCookie
} from '@/utils/pan'

const createToast = (message) => {
  Toast({
    message,
    getContainer: () => document.querySelector('.card') || document.body,
    position: 'bottom'
  })
}

const normalizeCookieInput = (value) => {
  return String(value || '')
    .replace(/\r?\n+/g, ' ')
    .trim()
}

const normalizeTargetDirId = (value) => {
  return String(value || '0').trim() || '0'
}

const buildProviderStateMap = (initialValue = '') => {
  return PAN_PROVIDER_LIST.reduce((result, provider) => {
    result[provider.key] = initialValue
    return result
  }, {})
}

export default {
  name: 'Pan',
  data() {
    return {
      panSettings: { ...defaultPanSettings },
      shareInputMap: buildProviderStateMap(''),
      accountLabelMap: buildProviderStateMap(''),
      folderList: [],
      testingCookie: false,
      browsingFolder: false,
      transferring: false,
      transferSummary: '',
      logList: []
    }
  },
  computed: {
    providerList() {
      return PAN_PROVIDER_LIST
    },
    currentProviderKey() {
      return normalizePanProviderKey(this.panSettings.activeProvider)
    },
    currentProvider() {
      return getPanProvider(this.currentProviderKey)
    },
    currentCookie: {
      get() {
        return this.panSettings[this.currentProvider.cookieKey] || ''
      },
      set(value) {
        this.$set(this.panSettings, this.currentProvider.cookieKey, value)
      }
    },
    currentTargetDirId: {
      get() {
        return normalizeTargetDirId(this.panSettings[this.currentProvider.targetDirKey])
      },
      set(value) {
        this.$set(this.panSettings, this.currentProvider.targetDirKey, normalizeTargetDirId(value))
      }
    },
    currentShareInput: {
      get() {
        return this.shareInputMap[this.currentProviderKey] || ''
      },
      set(value) {
        this.$set(this.shareInputMap, this.currentProviderKey, value)
      }
    },
    currentAccountLabel() {
      return this.accountLabelMap[this.currentProviderKey] || ''
    }
  },
  mounted() {
    this.loadSettings()
  },
  methods: {
    loadSettings() {
      const storedSettings = getStorage('panSettings') || {}
      const panSettings = {
        ...defaultPanSettings,
        ...storedSettings
      }

      panSettings.activeProvider = normalizePanProviderKey(panSettings.activeProvider)
      this.providerList.forEach((provider) => {
        panSettings[provider.cookieKey] = normalizeCookieInput(panSettings[provider.cookieKey])
        panSettings[provider.targetDirKey] = normalizeTargetDirId(panSettings[provider.targetDirKey])
      })

      this.panSettings = panSettings
    },
    saveSettings(showToast = true) {
      const nextSettings = {
        ...this.panSettings,
        activeProvider: this.currentProviderKey
      }

      this.providerList.forEach((provider) => {
        nextSettings[provider.cookieKey] = normalizeCookieInput(nextSettings[provider.cookieKey])
        nextSettings[provider.targetDirKey] = normalizeTargetDirId(nextSettings[provider.targetDirKey])
      })

      this.panSettings = nextSettings
      setStorage('panSettings', nextSettings)
      if (showToast) {
        createToast(`${this.currentProvider.label} 配置已保存`)
      }
    },
    appendLog(message, type = 'info') {
      const now = new Date()
      const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
      this.logList.unshift({
        id: `${Date.now()}_${Math.random()}`,
        time,
        type,
        message
      })
      this.logList = this.logList.slice(0, 200)
    },
    handleProviderChange(value) {
      this.panSettings.activeProvider = normalizePanProviderKey(value)
      this.folderList = []
      this.transferSummary = ''
      this.saveSettings(false)
      this.appendLog(`已切换到 ${this.currentProvider.label}`, 'success')
    },
    ensureCookieReady() {
      this.saveSettings(false)
      if (!this.currentCookie) {
        createToast(`请先填写${this.currentProvider.shortName} Cookie`)
        return false
      }
      return true
    },
    useRootFolder() {
      this.currentTargetDirId = '0'
      this.saveSettings(false)
      this.appendLog(`已切换到 ${this.currentProvider.label} 根目录 fid: 0`)
    },
    clearFolderList() {
      this.folderList = []
    },
    clearShareInput() {
      this.currentShareInput = ''
    },
    clearLogs() {
      this.logList = []
    },
    async testCookie() {
      if (!this.ensureCookieReady()) {
        return
      }

      this.testingCookie = true
      this.appendLog(`开始校验 ${this.currentProvider.label} Cookie`)
      try {
        const data = await verifyPanCookie(this.currentProviderKey, this.currentCookie)
        const accountLabel = data.nickname || data.name || data.mobile || data.user_name || data.uid || '已登录用户'
        this.$set(this.accountLabelMap, this.currentProviderKey, accountLabel)
        this.appendLog(`Cookie 校验成功: ${accountLabel}`, 'success')
        createToast('Cookie 可用')
      } catch (error) {
        this.$set(this.accountLabelMap, this.currentProviderKey, '')
        this.appendLog(`Cookie 校验失败: ${error.message || error}`, 'error')
        createToast(error.message || 'Cookie 校验失败')
      } finally {
        this.testingCookie = false
      }
    },
    async browseTargetFolder() {
      if (!this.ensureCookieReady()) {
        return
      }

      this.browsingFolder = true
      this.appendLog(`开始读取 ${this.currentProvider.label} 目录 ${this.currentTargetDirId}`)
      try {
        const folderList = await listPanDirectoryFolders(this.currentProviderKey, this.currentCookie, this.currentTargetDirId)
        this.folderList = folderList
        this.appendLog(`目录 ${this.currentTargetDirId} 读取成功，找到 ${folderList.length} 个子文件夹`, 'success')
        if (folderList.length === 0) {
          createToast('读取成功，该目录下暂时无子文件夹')
        } else {
          createToast(`读取到 ${folderList.length} 个文件夹`)
        }
      } catch (error) {
        this.appendLog(`目录读取失败: ${error.message || error}`, 'error')
        createToast(error.message || '目录读取失败')
      } finally {
        this.browsingFolder = false
      }
    },
    selectFolder(item) {
      this.currentTargetDirId = String(item.fid)
      this.saveSettings(false)
      this.appendLog(`已选择目录: ${item.file_name || item.title || item.fid} (${item.fid})`, 'success')
    },
    async startTransfer() {
      if (!this.ensureCookieReady()) {
        return
      }

      let shareList = []
      try {
        shareList = parsePanShareInput(this.currentProviderKey, this.currentShareInput)
      } catch (error) {
        createToast(error.message || '分享链接格式不正确')
        return
      }

      this.transferring = true
      this.transferSummary = ''
      let successCount = 0
      let failedCount = 0

      this.appendLog(`准备开始转存 ${this.currentProvider.label} 链接，共 ${shareList.length} 条，目标目录 fid: ${this.currentTargetDirId}`)

      for (let index = 0; index < shareList.length; index += 1) {
        const share = shareList[index]
        const prefix = `[${index + 1}/${shareList.length}]`
        this.appendLog(`${prefix} 开始处理 ${share.url}`)
        try {
          const result = await transferPanShare({
            providerKey: this.currentProviderKey,
            cookie: this.currentCookie,
            shareInput: share,
            toPdirFid: this.currentTargetDirId,
            onProgress: (message) => {
              this.appendLog(`${prefix} ${message}`)
            }
          })
          successCount += 1
          this.appendLog(`${prefix} 转存完成: ${result.title}，共 ${result.itemCount} 项`, 'success')
        } catch (error) {
          failedCount += 1
          this.appendLog(`${prefix} 转存失败: ${error.message || error}`, 'error')
        }
      }

      this.transferSummary = `${this.currentProvider.label} 本次转存结束: 成功 ${successCount} 条，失败 ${failedCount} 条`
      this.appendLog(this.transferSummary, failedCount > 0 ? 'error' : 'success')
      createToast(this.transferSummary)
      this.transferring = false
    }
  }
}
</script>

<style lang="less" scoped>
.pan-page {
  margin: 15px;
  max-height: 680px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pan-card {
  padding: 12px;
  background: #fff;
  border-radius: 14px;
}

.pan-card__title {
  color: #333;
  font-size: 15px;
  font-weight: 600;
}

.pan-card__hint {
  margin-top: 6px;
  color: #666;
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
}

.pan-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.pan-provider-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
}

.pan-provider-radio {
  margin-right: 0;
}

.pan-inline-note {
  margin-top: 10px;
  color: #1989fa;
  font-size: 12px;
  line-height: 1.5;
  word-break: break-all;
}

.pan-empty-hint {
  margin-top: 10px;
  color: #999;
  font-size: 12px;
  line-height: 1.6;
}

.pan-folder-list {
  margin-top: 10px;
}

.pan-card--logs {
  min-height: 180px;
}

.pan-log-list {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pan-log-item {
  padding: 8px 10px;
  border-radius: 10px;
  background: #f6f7fb;
  color: #444;
  font-size: 12px;
  line-height: 1.5;
  word-break: break-word;
}

.pan-log-item--success {
  background: #eef8f2;
  color: #1f8a4c;
}

.pan-log-item--error {
  background: #fff1f0;
  color: #cf3d34;
}

.pan-log-time {
  margin-right: 8px;
  color: inherit;
  opacity: 0.75;
}

.pan-log-text {
  color: inherit;
}

.van-cell__title {
  text-align: left;
}

.van-cell-group__title--inset {
  text-align: left;
}

.van-button--default {
  color: #000000;
  background-color: #66ccff96 !important;
  border: 1px solid #ffffff6e;
}

.van-button--disabled {
  opacity: 1 !important;
}

.van-tag--default {
  background-color: #66ccff;
}

.van-checkbox__icon--checked .van-icon {
  color: #ee0000 !important;
  background-color: #66ccff55 !important;
  border-color: #66ccff88 !important;
}

.van-popover--light {
  font-size: 14px !important;
  color: #8d8de7 !important;
}

.van-popover--light .van-popover__arrow {
  color: #d9d9d9 !important;
}

.van-popover__content {
  border: 1px solid !important;
  padding: 2px 9px !important;
  margin-top: 3px !important;
}
</style>
