<template>
  <div class="metadata-page">
    <van-loading v-if="loading" size="24px" class="metadata-loading">
      正在解析网页并整理元数据...
    </van-loading>

    <van-empty v-else-if="pendingGroups.length === 0" description="暂无待确认的元数据">
      <p class="metadata-hint">开启“下载前预览并编辑元数据”后，开始下载时会先进入这里。</p>
    </van-empty>

    <template v-else>
      <div class="metadata-top">
        <div class="metadata-top__title">待确认系列 {{ pendingGroups.length }} 个</div>
        <div v-if="showComicInfoPreview" class="metadata-top__desc">
          `ComicInfo.xml` 中的 `PageCount` 会在实际下载图片后自动填充，这里先展示其它字段。
        </div>
      </div>

      <van-collapse v-model="activeNames">
        <van-collapse-item
          v-for="group in pendingGroups"
          :key="group.key"
          :name="group.key"
        >
          <template #title>
            <div class="metadata-group-title">
              <div class="metadata-group-title__main">{{ group.baseItem.comicName }}</div>
              <div class="metadata-group-title__side">
                <van-tag type="primary">{{ group.items.length }} 章</van-tag>
              </div>
            </div>
          </template>

          <van-cell-group inset>
            <van-cell title="站点" :value="group.baseItem.webName" />
            <van-cell title="样例章节" :value="group.baseItem.downChapterName || group.baseItem.chapterName" />
            <van-cell title="来源" :value="group.sourceText || '基础信息'" />
            <van-cell v-if="group.error" title="解析提示" :value="group.error" />
          </van-cell-group>

          <div class="metadata-card">
            <van-field
              v-model="group.form.seriesTitle"
              label="系列名"
              placeholder="系列名"
              @input="syncGroupPreview(group)"
            />
            <van-field
              v-model="group.form.originalTitle"
              label="原始标题"
              placeholder="可选"
              @input="syncGroupPreview(group)"
            />
            <van-field
              v-model="group.form.writersText"
              label="作者"
              placeholder="多个作者用逗号分隔"
              @input="syncGroupPreview(group)"
            />
            <van-field
              v-model="group.form.illustratorsText"
              label="画师"
              placeholder="多个画师用逗号分隔"
              @input="syncGroupPreview(group)"
            />
            <van-field
              v-model="group.form.tagsText"
              label="标签"
              placeholder="多个标签用逗号分隔"
              @input="syncGroupPreview(group)"
            />
            <van-field
              v-model="group.form.publisher"
              label="出版社"
              placeholder="可选"
              @input="syncGroupPreview(group)"
            />
            <van-field
              v-model="group.form.issueCount"
              type="number"
              label="总话数"
              placeholder="可选"
              @input="syncGroupPreview(group)"
            />
            <van-field
              v-model="group.form.releaseDate"
              label="发布日期"
              placeholder="例如 2024-05-01"
              @input="syncGroupPreview(group)"
            />
            <van-field
              v-model="group.form.status"
              label="状态"
              placeholder="例如 continuing / ended"
              @input="syncGroupPreview(group)"
            />
            <van-field
              v-model="group.form.ageRating"
              label="分级"
              placeholder="可选"
              @input="syncGroupPreview(group)"
            />
            <van-field
              v-model="group.form.languageISO"
              label="语言"
              placeholder="例如 zh"
              @input="syncGroupPreview(group)"
            />
            <van-field
              v-model="group.form.summary"
              type="textarea"
              rows="4"
              autosize
              label="简介"
              placeholder="可手动编辑简介"
              @input="syncGroupPreview(group)"
            />
          </div>

          <div class="metadata-preview-stack">
            <div v-if="showComicInfoPreview" class="metadata-card">
              <div class="metadata-preview-title">ComicInfo.xml 预览</div>
              <div class="metadata-preview-note">这里展示样例章节，章节名和章节序号仍会按各自下载项写入。</div>
              <pre class="metadata-preview">{{ group.preview.comicInfoXml }}</pre>
            </div>

            <div v-if="showSeriesJsonPreview" class="metadata-card">
              <div class="metadata-preview-title">series.json 预览</div>
              <pre class="metadata-preview">{{ group.preview.seriesJson }}</pre>
            </div>
          </div>
        </van-collapse-item>
      </van-collapse>

      <div class="metadata-bottom">
        <van-button round @click="cancelPreview">返回</van-button>
        <van-button round type="primary" :loading="submitting" @click="confirmPreview">继续下载</van-button>
      </div>
    </template>
  </div>
</template>

<script>
import { Toast } from 'vant'

import { getBangumiMetadata } from '@/utils/bangumi'
import {
  buildDefaultMetadataDraft,
  buildMetadataPreviewFiles,
  getMetadataFileFlags,
  mergeMetadataSources,
  normalizeMetadataDraft
} from '@/utils/metadata'
import { getWebMetadata } from '@/utils/siteMetadata'

const cloneData = (value) => {
  return JSON.parse(JSON.stringify(value))
}

export default {
  name: 'Metadata',
  data() {
    return {
      loading: false,
      submitting: false,
      pendingItems: [],
      pendingGroups: [],
      activeNames: [],
      returnTab: 3,
      showComicInfoPreview: false,
      showSeriesJsonPreview: false,
      enableBangumiScrape: false
    }
  },
  mounted() {
    this.$bus.$on('openMetadataPreview', this.openMetadataPreview)
  },
  methods: {
    buildGroupKey(item) {
      return `${item.webName || ''}__${item.comicPageUrl || item.comicName || ''}`
    },
    createFormFromDraft(draft) {
      return {
        seriesTitle: draft.seriesTitle || '',
        originalTitle: draft.originalTitle || '',
        summary: draft.summary || '',
        writersText: (draft.writers || []).join(', '),
        illustratorsText: (draft.illustrators || []).join(', '),
        tagsText: (draft.tags || []).join(', '),
        publisher: draft.publisher || '',
        issueCount: draft.issueCount ?? '',
        releaseDate: draft.releaseDate || '',
        status: draft.status || '',
        ageRating: draft.ageRating || '',
        languageISO: draft.languageISO || ''
      }
    },
    buildDraftFromForm(form, currentDraft = {}) {
      return normalizeMetadataDraft({
        seriesTitle: form.seriesTitle,
        originalTitle: form.originalTitle,
        summary: form.summary,
        writers: form.writersText,
        illustrators: form.illustratorsText,
        tags: form.tagsText,
        publisher: form.publisher,
        issueCount: form.issueCount,
        releaseDate: form.releaseDate,
        status: form.status,
        ageRating: form.ageRating,
        languageISO: form.languageISO,
        subjectUrl: currentDraft.subjectUrl || '',
        source: currentDraft.source || ''
      })
    },
    syncGroupPreview(group) {
      group.draft = this.buildDraftFromForm(group.form, group.draft || {})
      const previewItem = {
        ...cloneData(group.baseItem),
        metadataOverride: cloneData(group.draft)
      }
      group.preview = buildMetadataPreviewFiles(previewItem, 0)
    },
    buildGroups(items) {
      const groupMap = new Map()
      items.forEach((item) => {
        const key = this.buildGroupKey(item)
        if (!groupMap.has(key)) {
          groupMap.set(key, {
            key,
            items: [],
            baseItem: cloneData(item),
            draft: buildDefaultMetadataDraft(item),
            form: {},
            preview: {
              comicInfoXml: '',
              seriesJson: ''
            },
            sourceText: '',
            error: ''
          })
        }
        groupMap.get(key).items.push(cloneData(item))
      })
      return [...groupMap.values()]
    },
    async prepareGroup(group) {
      const sourceList = []
      const metadataSources = [buildDefaultMetadataDraft(group.baseItem)]

      try {
        const webMetadata = await getWebMetadata(group.baseItem)
        if (webMetadata) {
          metadataSources.push(webMetadata)
          sourceList.push('网页解析')
        }
      } catch (error) {
        group.error = '网页解析失败，可手动修正'
      }

      if (this.enableBangumiScrape) {
        try {
          const bangumiMetadata = await getBangumiMetadata(group.baseItem, { force: true })
          if (bangumiMetadata) {
            metadataSources.push(bangumiMetadata)
            sourceList.push('Bangumi')
          }
        } catch (error) {
          group.error = group.error || 'Bangumi 补全失败，可手动修正'
        }
      }

      group.draft = mergeMetadataSources(...metadataSources, group.baseItem.metadataOverride)
      if (!group.draft.issueCount && group.baseItem.seriesChapterCount) {
        group.draft.issueCount = group.baseItem.seriesChapterCount
      }
      group.sourceText = sourceList.length > 0 ? sourceList.join(' + ') : '基础信息'
      group.form = this.createFormFromDraft(group.draft)
      this.syncGroupPreview(group)
    },
    async openMetadataPreview(items = []) {
      const list = cloneData(items || [])
      const flags = getMetadataFileFlags()
      this.pendingItems = list
      this.pendingGroups = this.buildGroups(list)
      this.returnTab = list[0]?.originTab ?? 3
      this.showComicInfoPreview = flags.enableComicInfoXml && list.some(item => item.downType === 1)
      this.showSeriesJsonPreview = flags.enableSeriesJson === true
      this.enableBangumiScrape = flags.enableBangumiScrape === true
      this.activeNames = this.pendingGroups.length > 0 ? [this.pendingGroups[0].key] : []
      this.loading = true

      for (let i = 0; i < this.pendingGroups.length; i++) {
        await this.prepareGroup(this.pendingGroups[i])
      }

      this.loading = false
    },
    cancelPreview() {
      this.$bus.$emit('changTab', this.returnTab || 3)
    },
    confirmPreview() {
      if (this.pendingGroups.length === 0) {
        return
      }
      this.submitting = true
      const draftMap = new Map(this.pendingGroups.map(group => [group.key, cloneData(group.draft)]))
      const nextItems = this.pendingItems.map((item) => {
        const key = this.buildGroupKey(item)
        return {
          ...cloneData(item),
          metadataOverride: draftMap.get(key) || null,
          metadataConfirmed: true
        }
      })
      if (nextItems.length === 0) {
        Toast({
          message: '没有可下载的条目',
          getContainer: '.card',
          position: 'bottom'
        })
        this.submitting = false
        return
      }
      this.$bus.$emit('selectDown', nextItems)
      this.$bus.$emit('changTab', 3)
      this.submitting = false
    }
  }
}
</script>

<style lang="less" scoped>
.metadata-page {
  margin: 15px;
  max-height: 680px;
  overflow: auto;
}

.metadata-loading {
  display: flex;
  justify-content: center;
  margin-top: 100px;
}

.metadata-hint,
.metadata-top__desc,
.metadata-preview-note {
  color: #777;
  font-size: 12px;
  line-height: 1.6;
}

.metadata-top {
  margin-bottom: 12px;
}

.metadata-top__title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.metadata-group-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 10px;
}

.metadata-group-title__main {
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.metadata-card {
  margin-top: 12px;
  padding: 12px;
  background: #fff;
  border-radius: 12px;
}

.metadata-preview-stack {
  padding-bottom: 8px;
}

.metadata-preview-title {
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.metadata-preview {
  margin-top: 10px;
  padding: 10px;
  border-radius: 10px;
  background: #f5f7fa;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 12px;
  line-height: 1.5;
  color: #333;
}

.metadata-bottom {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 16px;
}
</style>
