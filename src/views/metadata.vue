<template>
  <div class="metadata-page">
    <template v-if="viewMode === 'preview'">
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
                label="原标题"
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
    </template>

    <template v-else>
      <van-loading v-if="standaloneLoading" size="24px" class="metadata-loading">
        正在识别当前页面并生成元数据草稿...
      </van-loading>

      <van-empty v-else-if="!standaloneContext" :description="standaloneError || '当前页面暂不支持独立生成元数据'">
        <p class="metadata-hint">目前支持 Bangumi 漫画页、BookWalker 单本页，以及 BookWalker 系列页。</p>
        <van-button size="small" round type="primary" class="metadata-empty-btn" @click="refreshStandaloneContext">
          重新识别
        </van-button>
      </van-empty>

      <template v-else>
        <div class="metadata-top">
          <div class="metadata-top__title">独立生成元数据</div>
          <div class="metadata-top__desc">{{ standaloneContext.siteName }} / {{ getStandalonePageTypeText() }}</div>
        </div>

        <van-cell-group inset>
          <van-cell title="站点" :value="standaloneContext.siteName" />
          <van-cell title="页面" :value="standaloneContext.pageTitle" />
          <van-cell title="链接" :value="standaloneContext.pageUrl" />
        </van-cell-group>

        <template v-if="!standalonePrepared">
          <div class="metadata-card">
            <div class="metadata-preview-title">生成模式</div>
            <van-radio-group v-model="standaloneSelectedMode">
              <van-cell
                v-for="option in standaloneContext.modeOptions"
                :key="option.value"
                clickable
                :title="option.label"
                :label="option.description"
                @click="standaloneSelectedMode = option.value"
              >
                <template #right-icon>
                  <van-radio :name="option.value" />
                </template>
              </van-cell>
            </van-radio-group>
          </div>

          <div class="metadata-bottom">
            <van-button round @click="refreshStandaloneContext">刷新页面</van-button>
            <van-button round type="primary" @click="prepareStandalonePreview">预览生成</van-button>
          </div>
        </template>

        <template v-else>
          <div class="metadata-card">
            <van-field
              v-if="showStandaloneEntryFields"
              v-model="standaloneForm.entryTitle"
              label="条目名"
              placeholder="单本标题"
              @input="syncStandalonePreview"
            />
            <van-field
              v-if="showStandaloneEntryFields"
              v-model="standaloneForm.entryNumber"
              label="册号"
              placeholder="例如 06"
              @input="syncStandalonePreview"
            />
            <van-field
              v-model="standaloneForm.seriesTitle"
              label="系列名"
              placeholder="系列名"
              @input="syncStandalonePreview"
            />
            <van-field
              v-model="standaloneForm.originalTitle"
              label="原标题"
              placeholder="可选"
              @input="syncStandalonePreview"
            />
            <van-field
              v-model="standaloneForm.writersText"
              label="作者"
              placeholder="多个作者用逗号分隔"
              @input="syncStandalonePreview"
            />
            <van-field
              v-model="standaloneForm.illustratorsText"
              label="画师"
              placeholder="多个画师用逗号分隔"
              @input="syncStandalonePreview"
            />
            <van-field
              v-model="standaloneForm.tagsText"
              label="标签"
              placeholder="多个标签用逗号分隔"
              @input="syncStandalonePreview"
            />
            <van-field
              v-model="standaloneForm.publisher"
              label="出版社"
              placeholder="可选"
              @input="syncStandalonePreview"
            />
            <van-field
              v-model="standaloneForm.issueCount"
              type="number"
              label="总册数"
              placeholder="可选"
              @input="syncStandalonePreview"
            />
            <van-field
              v-if="showStandalonePageCountField"
              v-model="standaloneForm.pageCount"
              type="number"
              label="页数"
              placeholder="可选"
              @input="syncStandalonePreview"
            />
            <van-field
              v-if="showStandaloneIsbnField"
              v-model="standaloneForm.isbn"
              label="ISBN"
              placeholder="可选"
              @input="syncStandalonePreview"
            />
            <van-field
              v-model="standaloneForm.releaseDate"
              label="发布日期"
              placeholder="例如 2026-05-07"
              @input="syncStandalonePreview"
            />
            <van-field
              v-model="standaloneForm.status"
              label="状态"
              placeholder="例如 continuing / ended"
              @input="syncStandalonePreview"
            />
            <van-field
              v-model="standaloneForm.ageRating"
              label="分级"
              placeholder="可选"
              @input="syncStandalonePreview"
            />
            <van-field
              v-model="standaloneForm.languageISO"
              label="语言"
              placeholder="例如 zh"
              @input="syncStandalonePreview"
            />
            <van-field
              v-model="standaloneForm.summary"
              type="textarea"
              rows="5"
              autosize
              label="简介"
              placeholder="可手动编辑简介"
              @input="syncStandalonePreview"
            />
          </div>

          <div class="metadata-preview-stack">
            <div
              v-for="file in standalonePreviewFiles"
              :key="file.key"
              class="metadata-card"
            >
              <div class="metadata-preview-title">{{ file.name }} 预览</div>
              <pre class="metadata-preview">{{ file.content }}</pre>
            </div>
          </div>

          <div class="metadata-bottom">
            <van-button round @click="standalonePrepared = false">返回</van-button>
            <van-button round type="primary" :loading="standaloneSubmitting" @click="generateStandaloneFiles">生成文件</van-button>
          </div>
        </template>
      </template>
    </template>
  </div>
</template>

<script>
import { Toast } from 'vant'

import { getBangumiMetadata } from '@/utils/bangumi'
import { downFile } from '@/utils/index'
import {
  buildDefaultMetadataDraft,
  buildMetadataPreviewFiles,
  buildStandaloneMetadataFiles,
  getMetadataFileFlags,
  mergeMetadataSources,
  normalizeMetadataDraft,
  normalizeStandaloneMetadataDraft
} from '@/utils/metadata'
import { getWebMetadata } from '@/utils/siteMetadata'
import { buildStandaloneMetadataDraft, getStandaloneMetadataContext } from '@/utils/standaloneMetadata'

const cloneData = (value) => {
  return JSON.parse(JSON.stringify(value))
}

export default {
  name: 'Metadata',
  data() {
    return {
      viewMode: 'standalone',
      loading: false,
      submitting: false,
      pendingItems: [],
      pendingGroups: [],
      activeNames: [],
      returnTab: 3,
      showComicInfoPreview: false,
      showSeriesJsonPreview: false,
      enableBangumiScrape: false,
      standaloneLoading: false,
      standaloneSubmitting: false,
      standaloneContext: null,
      standaloneSelectedMode: '',
      standalonePrepared: false,
      standaloneDraft: normalizeStandaloneMetadataDraft(),
      standaloneForm: {},
      standalonePreviewFiles: [],
      standaloneError: ''
    }
  },
  computed: {
    showStandaloneEntryFields() {
      return ['bangumi-single', 'bookwalker-book'].includes(this.standaloneSelectedMode)
    },
    showStandalonePageCountField() {
      return this.standaloneSelectedMode === 'bookwalker-book'
    },
    showStandaloneIsbnField() {
      return this.standaloneSelectedMode === 'bookwalker-book'
    }
  },
  mounted() {
    this.$bus.$on('openMetadataPreview', this.openMetadataPreview)
    this.refreshStandaloneContext()
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
      this.viewMode = 'preview'
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
    resetPreviewState() {
      this.viewMode = 'standalone'
      this.loading = false
      this.submitting = false
      this.pendingItems = []
      this.pendingGroups = []
      this.activeNames = []
      this.showComicInfoPreview = false
      this.showSeriesJsonPreview = false
      this.refreshStandaloneContext(true)
    },
    cancelPreview() {
      this.resetPreviewState()
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
      this.resetPreviewState()
    },
    createStandaloneFormFromDraft(draft) {
      return {
        entryTitle: draft.entryTitle || '',
        entryNumber: draft.entryNumber || '',
        seriesTitle: draft.seriesTitle || '',
        originalTitle: draft.originalTitle || '',
        summary: draft.summary || '',
        writersText: (draft.writers || []).join(', '),
        illustratorsText: (draft.illustrators || []).join(', '),
        tagsText: (draft.tags || []).join(', '),
        publisher: draft.publisher || '',
        issueCount: draft.issueCount ?? '',
        pageCount: draft.pageCount ?? '',
        isbn: draft.isbn || '',
        releaseDate: draft.releaseDate || '',
        status: draft.status || '',
        ageRating: draft.ageRating || '',
        languageISO: draft.languageISO || ''
      }
    },
    buildStandaloneDraftFromForm(form, currentDraft = {}) {
      return normalizeStandaloneMetadataDraft({
        ...currentDraft,
        entryTitle: form.entryTitle,
        entryNumber: form.entryNumber,
        seriesTitle: form.seriesTitle,
        originalTitle: form.originalTitle,
        summary: form.summary,
        writers: form.writersText,
        illustrators: form.illustratorsText,
        tags: form.tagsText,
        publisher: form.publisher,
        issueCount: form.issueCount,
        pageCount: form.pageCount,
        isbn: form.isbn,
        releaseDate: form.releaseDate,
        status: form.status,
        ageRating: form.ageRating,
        languageISO: form.languageISO,
        subjectUrl: currentDraft.subjectUrl || '',
        source: currentDraft.source || ''
      })
    },
    async refreshStandaloneContext(preserveSelection = false) {
      if (this.viewMode === 'preview') {
        return
      }
      this.standaloneLoading = true
      this.standaloneError = ''
      try {
        const context = getStandaloneMetadataContext(document, window.location.href)
        this.standaloneContext = context
        if (context?.modeOptions?.length) {
          const currentSelectionValid = preserveSelection && context.modeOptions.some(item => item.value === this.standaloneSelectedMode)
          this.standaloneSelectedMode = currentSelectionValid
            ? this.standaloneSelectedMode
            : (context.defaultMode || context.modeOptions[0].value)
        } else {
          this.standaloneSelectedMode = ''
        }
        this.standalonePrepared = false
        this.standaloneDraft = normalizeStandaloneMetadataDraft()
        this.standaloneForm = this.createStandaloneFormFromDraft(this.standaloneDraft)
        this.standalonePreviewFiles = []
      } catch (error) {
        this.standaloneContext = null
        this.standaloneSelectedMode = ''
        this.standalonePrepared = false
        this.standalonePreviewFiles = []
        this.standaloneError = '当前页面识别失败，请刷新页面后重试'
      } finally {
        this.standaloneLoading = false
      }
    },
    getStandalonePageTypeText() {
      switch (this.standaloneContext?.pageType) {
        case 'subject':
          return '漫画条目页'
        case 'product':
          return '单本详情页'
        case 'series-search':
          return '系列检索页'
        default:
          return '当前页面'
      }
    },
    prepareStandalonePreview() {
      if (!this.standaloneSelectedMode) {
        return
      }
      try {
        const draft = buildStandaloneMetadataDraft(this.standaloneSelectedMode, document, window.location.href)
        this.standaloneDraft = normalizeStandaloneMetadataDraft(draft)
        this.standaloneForm = this.createStandaloneFormFromDraft(this.standaloneDraft)
        this.standalonePrepared = true
        this.syncStandalonePreview()
      } catch (error) {
        Toast({
          message: '当前页面元数据解析失败',
          getContainer: '.card',
          position: 'bottom'
        })
      }
    },
    syncStandalonePreview() {
      this.standaloneDraft = this.buildStandaloneDraftFromForm(this.standaloneForm, this.standaloneDraft || {})
      this.standalonePreviewFiles = buildStandaloneMetadataFiles(this.standaloneSelectedMode, this.standaloneDraft)
    },
    async downloadStandaloneFile(file) {
      const blob = new Blob([file.content], {
        type: `${file.type || 'text/plain'};charset=utf-8`
      })
      const url = window.URL.createObjectURL(blob)
      const result = await downFile(url, file.name)
      window.URL.revokeObjectURL(url)
      return result
    },
    async generateStandaloneFiles() {
      if (!this.standalonePrepared) {
        return
      }
      this.standaloneSubmitting = true
      this.syncStandalonePreview()
      const files = cloneData(this.standalonePreviewFiles)
      if (files.length === 0) {
        this.standaloneSubmitting = false
        return
      }

      let successCount = 0
      for (let i = 0; i < files.length; i++) {
        const result = await this.downloadStandaloneFile(files[i])
        if (result) {
          successCount += 1
        }
      }

      Toast({
        message: successCount === files.length ? `已生成 ${successCount} 个文件` : `成功 ${successCount} 个，失败 ${files.length - successCount} 个`,
        getContainer: '.card',
        position: 'bottom'
      })
      this.standaloneSubmitting = false
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

.metadata-empty-btn {
  margin-top: 12px;
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
