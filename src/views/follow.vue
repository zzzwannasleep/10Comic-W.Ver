<template>
  <div class="follow-page">
    <div class="follow-toolbar">
      <van-button size="small" round type="primary" :loading="checking" @click="checkAll">检查全部</van-button>
      <van-button size="small" round :disabled="!hasPendingChapters" @click="downloadAllPending">下载全部更新</van-button>
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

import { getStorage } from '@/config/setup'
import { findWebByUrl } from '@/utils/comics'
import {
  canAutoCheckFollow,
  checkAllFollowItems,
  checkFollowItem,
  clearPendingChapters,
  getFollowList,
  removeFollowItem,
  updateFollowItem
} from '@/utils/follow'

export default {
  name: 'Follow',
  data() {
    return {
      followList: [],
      checking: false
    }
  },
  computed: {
    hasPendingChapters() {
      return this.followList.some(item => item.pendingChapters.length > 0)
    }
  },
  mounted() {
    this.refreshList()
    this.$bus.$on('refreshFollowList', this.refreshList)
    if (canAutoCheckFollow()) {
      this.autoCheckOnLoad()
    }
  },
  methods: {
    refreshList() {
      this.followList = getFollowList()
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
      this.$bus.$emit('changTab', 2)
    },
    downloadAllPending() {
      const allDownloads = this.followList.flatMap(item => this.buildDownloadItems(item))
      if (allDownloads.length === 0) {
        return
      }
      this.$bus.$emit('selectDown', allDownloads)
      this.$bus.$emit('changTab', 2)
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
