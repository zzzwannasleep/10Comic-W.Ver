<template>
  <div class="follow-page">
    <div class="follow-toolbar">
      <van-button size="small" round type="primary" :loading="checking" @click="checkAll">检查全部</van-button>
      <van-button size="small" round :disabled="!hasPendingChapters" @click="downloadAllPending">下载全部更新</van-button>
    </div>

    <div class="follow-keyword-toolbar">
      <van-field
        v-model="keywordFollowName"
        size="small"
        placeholder="输入漫画名，按选中站点搜索追更"
        @keyup.enter.native="searchByKeyword"
      />
      <van-button size="small" round type="info" :loading="addingKeywordFollow" @click="searchByKeyword">开始搜索</van-button>
      <van-button size="small" round plain @click="toggleScanSitePanel">{{ showScanSitePanel ? '收起站点' : '扫描站点' }}</van-button>
    </div>

    <div v-if="showScanSitePanel" class="follow-site-panel">
      <div class="follow-panel-header">
        <span>扫描站点</span>
        <span>{{ selectedScanWebNames.length }}/{{ searchableWebOptions.length }}</span>
      </div>

      <div class="follow-site-actions">
        <van-button size="mini" @click="selectAllScanSites">全选</van-button>
        <van-button size="mini" @click="clearScanSites">清空</van-button>
      </div>

      <van-checkbox-group v-model="selectedScanWebNames" @change="saveScanSites">
        <div class="follow-site-grid">
          <van-checkbox
            v-for="item in searchableWebOptions"
            :key="item.webName"
            :name="item.webName"
            class="follow-site-check"
          >
            {{ item.webName }}
          </van-checkbox>
        </div>
      </van-checkbox-group>
    </div>

    <div v-if="searchCandidates.length > 0" class="follow-result-panel">
      <div class="follow-panel-header">
        <span>匹配结果</span>
        <span>{{ selectedCandidateKeys.length }}/{{ searchCandidates.length }}</span>
      </div>

      <div class="follow-site-actions">
        <van-button size="mini" @click="selectAllCandidates">全选</van-button>
        <van-button size="mini" @click="clearCandidateSelection">清空</van-button>
        <van-button size="mini" type="primary" @click="addSelectedCandidates">加入选中站点</van-button>
        <van-button size="mini" plain @click="clearSearchCandidates">取消结果</van-button>
      </div>

      <van-checkbox-group v-model="selectedCandidateKeys">
        <van-cell-group inset>
          <van-cell
            v-for="item in searchCandidates"
            :key="item.key"
            class="candidate-cell"
          >
            <template #title>
              <van-checkbox :name="item.key">{{ item.webName }}</van-checkbox>
            </template>
            <template #label>
              <div class="candidate-label">{{ item.comicName }}</div>
              <div class="candidate-label candidate-label--sub">
                {{ item.latestChapterName || `共 ${item.seriesChapterCount} 话` }}
              </div>
            </template>
            <template #right-icon>
              <van-button size="mini" plain @click.stop="openComic(item.comicPageUrl)">打开</van-button>
            </template>
          </van-cell>
        </van-cell-group>
      </van-checkbox-group>
    </div>

    <van-empty v-if="followList.length === 0" description="追更列表为空">
      <p class="follow-hint">在“加载”页点击“加入追更”即可收藏当前漫画。</p>
    </van-empty>

    <div v-else class="follow-list">
      <van-cell-group v-for="item in followList" :key="item.id" inset class="follow-card">
        <van-cell :title="item.comicName" :label="item.webName">
          <template #right-icon>
            <van-tag :type="item.pendingChapters.length > 0 ? 'danger' : 'primary'">
              {{ item.pendingChapters.length }} 更
            </van-tag>
          </template>
        </van-cell>

        <van-field
          v-model="item.authorName"
          label="作者"
          placeholder="可手动补充作者名"
          @blur="saveAuthor(item)"
        />

        <van-cell
          title="漫画页"
          is-link
          :value="formatCheckTime(item.lastCheckedAt)"
          @click="openComic(item.comicPageUrl)"
        />

        <van-cell v-if="item.lastError" :title="`检查失败: ${item.lastError}`" />

        <div v-if="item.pendingChapters.length > 0" class="pending-list">
          <div
            v-for="chapter in item.pendingChapters"
            :key="chapter.url"
            class="pending-item"
          >
            {{ chapter.chapterName }}
          </div>
        </div>

        <div class="follow-actions">
          <van-button size="mini" @click="checkOne(item)">检查</van-button>
          <van-button size="mini" type="primary" :disabled="item.pendingChapters.length === 0" @click="downloadPending(item)">下载更新</van-button>
          <van-button size="mini" :disabled="item.pendingChapters.length === 0" @click="markHandled(item)">标记已处理</van-button>
          <van-button size="mini" type="danger" plain @click="removeItem(item)">删除</van-button>
        </div>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant'

import { getStorage, setStorage } from '@/config/setup'
import { findWebByUrl, getSearchableWebList } from '@/utils/comics'
import {
  addFollowCandidates,
  canAutoCheckFollow,
  checkAllFollowItems,
  checkFollowItem,
  clearPendingChapters,
  getFollowList,
  removeFollowItem,
  searchFollowCandidatesByKeyword,
  updateFollowItem
} from '@/utils/follow'

export default {
  name: 'Follow',
  data() {
    return {
      followList: [],
      checking: false,
      keywordFollowName: '',
      addingKeywordFollow: false,
      showScanSitePanel: false,
      searchableWebOptions: [],
      selectedScanWebNames: [],
      searchCandidates: [],
      selectedCandidateKeys: [],
      lastSkippedSiteCount: 0
    }
  },
  computed: {
    hasPendingChapters() {
      return this.followList.some(item => item.pendingChapters.length > 0)
    }
  },
  mounted() {
    this.refreshList()
    this.initSearchableWebOptions()
    this.$bus.$on('refreshFollowList', this.refreshList)
    this.$bus.$on('getComicName', (comicName) => {
      if (!this.keywordFollowName && comicName && comicName !== '------') {
        this.keywordFollowName = comicName
      }
    })
    if (canAutoCheckFollow()) {
      this.autoCheckOnLoad()
    }
  },
  methods: {
    refreshList() {
      this.followList = getFollowList()
    },
    initSearchableWebOptions() {
      this.searchableWebOptions = getSearchableWebList().map(item => ({
        webName: item.webName
      }))
      const savedWebNames = getStorage('followSearchWebNames') || []
      const defaultWebNames = this.searchableWebOptions.map(item => item.webName)
      const matchedWebNames = defaultWebNames.filter(webName => savedWebNames.includes(webName))
      this.selectedScanWebNames = matchedWebNames.length > 0 ? matchedWebNames : defaultWebNames
      this.saveScanSites()
    },
    saveScanSites() {
      setStorage('followSearchWebNames', this.selectedScanWebNames)
    },
    toggleScanSitePanel() {
      this.showScanSitePanel = !this.showScanSitePanel
    },
    selectAllScanSites() {
      this.selectedScanWebNames = this.searchableWebOptions.map(item => item.webName)
      this.saveScanSites()
    },
    clearScanSites() {
      this.selectedScanWebNames = []
      this.saveScanSites()
    },
    formatCheckTime(time) {
      if (!time) {
        return '未检查'
      }
      const date = new Date(time)
      const hour = String(date.getHours()).padStart(2, '0')
      const minute = String(date.getMinutes()).padStart(2, '0')
      return `${date.getMonth() + 1}/${date.getDate()} ${hour}:${minute}`
    },
    async autoCheckOnLoad() {
      await this.checkAll(true)
    },
    async searchByKeyword() {
      const keyword = (this.keywordFollowName || '').trim()
      if (keyword.length < 2) {
        Toast({
          message: '漫画名至少2个字符',
          getContainer: '.card',
          position: 'bottom'
        })
        return
      }
      if (this.selectedScanWebNames.length === 0) {
        Toast({
          message: '请先选择要扫描的站点',
          getContainer: '.card',
          position: 'bottom'
        })
        return
      }
      this.addingKeywordFollow = true
      try {
        const result = await searchFollowCandidatesByKeyword(keyword, this.selectedScanWebNames)
        this.searchCandidates = result.candidates
        this.selectedCandidateKeys = result.candidates.map(item => item.key)
        this.lastSkippedSiteCount = result.skippedSites.length
        const matchCount = result.candidates.length
        const skipCount = result.skippedSites.length
        Toast({
          message: matchCount > 0
            ? `找到 ${matchCount} 个候选站点${skipCount > 0 ? `，未命中 ${skipCount} 个站点` : ''}`
            : '没有找到可加入追更的站点',
          getContainer: '.card',
          position: 'bottom'
        })
      } finally {
        this.addingKeywordFollow = false
      }
    },
    selectAllCandidates() {
      this.selectedCandidateKeys = this.searchCandidates.map(item => item.key)
    },
    clearCandidateSelection() {
      this.selectedCandidateKeys = []
    },
    clearSearchCandidates() {
      this.searchCandidates = []
      this.selectedCandidateKeys = []
      this.lastSkippedSiteCount = 0
    },
    addSelectedCandidates() {
      const selectedCandidates = this.searchCandidates.filter(item => this.selectedCandidateKeys.includes(item.key))
      if (selectedCandidates.length === 0) {
        Toast({
          message: '请先勾选要保留的站点',
          getContainer: '.card',
          position: 'bottom'
        })
        return
      }
      const skippedSiteCount = this.lastSkippedSiteCount
      const addedItems = addFollowCandidates(selectedCandidates)
      this.refreshList()
      this.clearSearchCandidates()
      Toast({
        message: `已加入 ${addedItems.length} 个站点${skippedSiteCount > 0 ? `，未命中 ${skippedSiteCount} 个站点` : ''}`,
        getContainer: '.card',
        position: 'bottom'
      })
    },
    async checkAll(silent = false) {
      this.checking = true
      try {
        const list = await checkAllFollowItems()
        this.followList = list
        const updateCount = list.reduce((sum, item) => sum + item.pendingChapters.length, 0)
        if (!silent || updateCount > 0) {
          Toast({
            message: updateCount > 0 ? `发现 ${updateCount} 个待处理章节` : '追更检查完成',
            getContainer: '.card',
            position: 'bottom'
          })
        }
      } finally {
        this.checking = false
      }
    },
    async checkOne(item) {
      const nextItem = await checkFollowItem(item.id)
      this.followList = this.followList.map(current => current.id === item.id ? nextItem : current)
      Toast({
        message: nextItem.pendingChapters.length > 0 ? `发现 ${nextItem.pendingChapters.length} 个更新` : '暂无更新',
        getContainer: '.card',
        position: 'bottom'
      })
    },
    saveAuthor(item) {
      updateFollowItem(item.id, (current) => {
        current.authorName = item.authorName || ''
        return current
      })
      this.refreshList()
    },
    buildDownloadItems(item) {
      const downType = getStorage('downType')
      return item.pendingChapters.map((chapter) => {
        const webRule = findWebByUrl(chapter.url || item.comicPageUrl)
        const downChapterName = chapter.chapterNumStr
          ? `${chapter.chapterNumStr}${chapter.chapterName ? '-' + chapter.chapterName : ''}`
          : chapter.chapterName
        return {
          ...chapter,
          comicName: item.comicName,
          authorName: item.authorName || chapter.authorName || '',
          webName: item.webName,
          comicPageUrl: item.comicPageUrl,
          seriesChapterCount: item.seriesChapterCount,
          followItemId: item.id,
          downChapterName,
          downType,
          downHeaders: webRule?.downHeaders
        }
      })
    },
    downloadPending(item) {
      const downloadItems = this.buildDownloadItems(item)
      if (downloadItems.length === 0) {
        return
      }
      this.$bus.$emit('selectDown', downloadItems)
      this.$bus.$emit('changTab', 3)
    },
    downloadAllPending() {
      const allDownloads = this.followList.flatMap(item => this.buildDownloadItems(item))
      if (allDownloads.length === 0) {
        return
      }
      this.$bus.$emit('selectDown', allDownloads)
      this.$bus.$emit('changTab', 3)
    },
    markHandled(item) {
      clearPendingChapters(item.id)
      this.refreshList()
    },
    removeItem(item) {
      Dialog.confirm({
        getContainer: '.card',
        message: `确认删除 ${item.comicName} ？`
      }).then(() => {
        removeFollowItem(item.id)
        this.refreshList()
      }).catch(() => {})
    },
    openComic(url) {
      window.open(url, '_blank')
    }
  }
}
</script>

<style lang="less" scoped>
.follow-page {
  margin: 15px;
  max-height: 680px;
  overflow: auto;

  .follow-toolbar {
    display: flex;
    gap: 10px;
    margin-bottom: 12px;
  }

  .follow-keyword-toolbar {
    display: flex;
    gap: 10px;
    margin-bottom: 12px;
    align-items: center;
  }

  .follow-site-panel,
  .follow-result-panel {
    padding: 12px;
    margin-bottom: 12px;
    background: #fff;
    border-radius: 12px;
  }

  .follow-panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    color: #333;
    font-size: 14px;
    font-weight: 600;
  }

  .follow-site-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 10px;
  }

  .follow-site-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px 12px;
  }

  .follow-site-check {
    margin: 0;
  }

  .candidate-cell {
    /deep/ .van-cell__title {
      flex: 1;
      min-width: 0;
    }
  }

  .candidate-label {
    margin-top: 4px;
    color: #666;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .candidate-label--sub {
    font-size: 12px;
  }

  .follow-hint {
    color: #999;
    font-size: 13px;
  }

  .follow-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .follow-card {
    overflow: hidden;
  }

  .pending-list {
    padding: 0 16px 8px;
    color: #666;
    font-size: 13px;
  }

  .pending-item {
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .follow-actions {
    display: flex;
    gap: 8px;
    padding: 0 16px 12px;
    flex-wrap: wrap;
  }
}
</style>
