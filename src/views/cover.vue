<template>
  <div class="cover-page">
    <van-empty v-if="!pendingItem" description="暂无待设置封面的章节">
      <p class="cover-hint">单章压缩下载时会自动跳转到这里。</p>
    </van-empty>

    <template v-else>
      <van-cell-group inset>
        <van-cell title="漫画" :value="pendingItem.comicName" />
        <van-cell title="章节" :value="pendingItem.downChapterName || pendingItem.chapterName" />
        <van-cell title="输出" value=".cbz + 同名封面图(按需)" />
      </van-cell-group>

      <div class="cover-card">
        <div class="cover-title">封面来源</div>
        <van-radio-group v-model="coverMode" @change="handleModeChange">
          <van-cell clickable @click="coverMode = 'first'; handleModeChange('first')">
            <template #title>
              <van-radio name="first">使用章节第一张</van-radio>
            </template>
          </van-cell>
          <van-cell clickable @click="coverMode = 'upload'; handleModeChange('upload')">
            <template #title>
              <van-radio name="upload">导入自定义封面</van-radio>
            </template>
          </van-cell>
          <van-cell clickable @click="coverMode = 'chapter'; handleModeChange('chapter')">
            <template #title>
              <van-radio name="chapter">从章节图片里选择</van-radio>
            </template>
          </van-cell>
          <van-cell clickable @click="coverMode = 'bangumi'; handleModeChange('bangumi')">
            <template #title>
              <van-radio name="bangumi">使用 Bangumi 封面</van-radio>
            </template>
          </van-cell>
        </van-radio-group>
      </div>

      <div v-if="coverMode === 'first'" class="cover-card">
        <div class="cover-title">默认封面</div>
        <div class="cover-desc">Komga 会直接使用章节第一页作为这本 CBZ 的默认封面。</div>
        <img v-if="chapterImageUrls[0]" :src="chapterImageUrls[0]" class="cover-preview" alt="default cover">
        <van-loading v-else-if="chapterLoading" size="24px">加载章节图片中</van-loading>
      </div>

      <div v-if="coverMode === 'upload'" class="cover-card">
        <div class="cover-title">自定义封面</div>
        <input
          ref="coverUploadInput"
          type="file"
          accept="image/*"
          class="cover-file-input"
          @change="handleUploadChange"
        >
        <div class="cover-actions">
          <van-button size="small" type="primary" @click="triggerUpload">选择图片</van-button>
        </div>
        <img v-if="uploadedCoverDataUrl" :src="uploadedCoverDataUrl" class="cover-preview" alt="uploaded cover">
      </div>

      <div v-if="coverMode === 'chapter'" class="cover-card">
        <div class="cover-title">章节图片</div>
        <van-loading v-if="chapterLoading" size="24px">加载章节图片中</van-loading>
        <div v-else-if="chapterImageUrls.length === 0" class="cover-desc">当前没有可选图片。</div>
        <div v-else class="chapter-grid">
          <button
            v-for="(url, index) in chapterImageUrls"
            :key="`${index}_${url}`"
            type="button"
            class="chapter-thumb"
            :class="{ 'chapter-thumb--active': selectedChapterImageUrl === url }"
            @click="selectedChapterImageUrl = url"
          >
            <img :src="url" :alt="`chapter-${index + 1}`">
            <span>{{ index + 1 }}</span>
          </button>
        </div>
      </div>

      <div v-if="coverMode === 'bangumi'" class="cover-card">
        <div class="cover-title">Bangumi 封面</div>
        <div class="cover-actions">
          <van-button size="small" type="primary" :loading="bangumiLoading" @click="loadBangumiCover">
            {{ bangumiCoverUrl ? '重新获取' : '获取封面' }}
          </van-button>
        </div>
        <img v-if="bangumiCoverUrl" :src="bangumiCoverUrl" class="cover-preview" alt="bangumi cover">
        <div v-else-if="!bangumiLoading" class="cover-desc">未获取到 Bangumi 封面。</div>
      </div>

      <div class="cover-bottom">
        <van-button round @click="cancelSelection">返回</van-button>
        <van-button round type="primary" :loading="submitting" @click="confirmSelection">开始下载</van-button>
      </div>
    </template>
  </div>
</template>

<script>
import { Toast } from 'vant'

import { getBangumiMetadata } from '@/utils/bangumi'
import { getChapterImageUrls } from '@/utils/chapterImages'

const cloneData = (value) => {
  return JSON.parse(JSON.stringify(value))
}

export default {
  name: 'Cover',
  data() {
    return {
      pendingItem: null,
      coverMode: 'first',
      chapterImageUrls: [],
      selectedChapterImageUrl: '',
      chapterLoading: false,
      bangumiLoading: false,
      bangumiCoverUrl: '',
      uploadedCoverDataUrl: '',
      uploadedCoverMimeType: 'image/jpeg',
      submitting: false
    }
  },
  mounted() {
    this.$bus.$on('openCoverSelector', this.openCoverSelector)
  },
  methods: {
    resetCoverState() {
      this.coverMode = 'first'
      this.chapterImageUrls = []
      this.selectedChapterImageUrl = ''
      this.chapterLoading = false
      this.bangumiLoading = false
      this.bangumiCoverUrl = ''
      this.uploadedCoverDataUrl = ''
      this.uploadedCoverMimeType = 'image/jpeg'
      this.submitting = false
      if (this.$refs.coverUploadInput) {
        this.$refs.coverUploadInput.value = ''
      }
    },
    async openCoverSelector(item) {
      this.pendingItem = cloneData(item)
      this.resetCoverState()
      await this.loadChapterImages()
    },
    async loadChapterImages() {
      if (!this.pendingItem || this.chapterLoading || this.chapterImageUrls.length > 0) {
        return
      }
      this.chapterLoading = true
      try {
        const imageUrls = await getChapterImageUrls(this.pendingItem)
        this.chapterImageUrls = imageUrls
        this.selectedChapterImageUrl = imageUrls[0] || ''
      } catch (error) {
        Toast({
          message: '章节图片加载失败',
          getContainer: '.card',
          position: 'bottom'
        })
      } finally {
        this.chapterLoading = false
      }
    },
    async loadBangumiCover() {
      if (!this.pendingItem || this.bangumiLoading) {
        return
      }
      this.bangumiLoading = true
      try {
        const metadata = await getBangumiMetadata(this.pendingItem, { force: true })
        this.bangumiCoverUrl = metadata?.coverUrl || ''
        if (!this.bangumiCoverUrl) {
          Toast({
            message: '未匹配到 Bangumi 封面',
            getContainer: '.card',
            position: 'bottom'
          })
        }
      } finally {
        this.bangumiLoading = false
      }
    },
    handleModeChange(mode) {
      if (mode === 'chapter' || mode === 'first') {
        this.loadChapterImages()
      }
      if (mode === 'bangumi' && !this.bangumiCoverUrl) {
        this.loadBangumiCover()
      }
    },
    triggerUpload() {
      this.$refs.coverUploadInput?.click()
    },
    handleUploadChange(event) {
      const file = event.target.files?.[0]
      if (!file) {
        return
      }
      const reader = new FileReader()
      reader.onload = () => {
        this.uploadedCoverDataUrl = reader.result
        this.uploadedCoverMimeType = file.type || 'image/jpeg'
        this.coverMode = 'upload'
      }
      reader.readAsDataURL(file)
    },
    cancelSelection() {
      this.$bus.$emit('changTab', 1)
    },
    async confirmSelection() {
      if (!this.pendingItem) {
        return
      }
      if (this.coverMode === 'upload' && !this.uploadedCoverDataUrl) {
        Toast({
          message: '请先导入封面',
          getContainer: '.card',
          position: 'bottom'
        })
        return
      }
      if (this.coverMode === 'chapter' && !this.selectedChapterImageUrl) {
        Toast({
          message: '请选择章节图片',
          getContainer: '.card',
          position: 'bottom'
        })
        return
      }
      if (this.coverMode === 'bangumi' && !this.bangumiCoverUrl) {
        await this.loadBangumiCover()
        if (!this.bangumiCoverUrl) {
          return
        }
      }

      this.submitting = true
      const nextItem = {
        ...cloneData(this.pendingItem),
        coverOption: this.buildCoverOption()
      }
      this.$bus.$emit('selectDown', [nextItem])
      this.$bus.$emit('changTab', 3)
      this.submitting = false
    },
    buildCoverOption() {
      switch (this.coverMode) {
        case 'upload':
          return {
            type: 'upload',
            dataUrl: this.uploadedCoverDataUrl,
            mimeType: this.uploadedCoverMimeType
          }
        case 'chapter':
          return {
            type: 'chapter',
            imageUrl: this.selectedChapterImageUrl
          }
        case 'bangumi':
          return {
            type: 'bangumi',
            imageUrl: this.bangumiCoverUrl
          }
        default:
          return {
            type: 'first'
          }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cover-page {
  margin: 15px;
  max-height: 680px;
  overflow: auto;
}

.cover-hint {
  color: #999;
  font-size: 13px;
}

.cover-card {
  margin-top: 12px;
  padding: 12px;
  background: #fff;
  border-radius: 14px;
}

.cover-title {
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.cover-desc {
  color: #666;
  font-size: 13px;
  line-height: 1.6;
}

.cover-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.cover-preview {
  display: block;
  max-width: 220px;
  max-height: 280px;
  width: auto;
  height: auto;
  margin-top: 10px;
  border-radius: 10px;
  border: 1px solid #eee;
}

.cover-file-input {
  display: none;
}

.chapter-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.chapter-thumb {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 6px;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  background: #fff;
  cursor: pointer;

  img {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-radius: 8px;
  }

  span {
    color: #666;
    font-size: 12px;
  }
}

.chapter-thumb--active {
  border-color: #1989fa;
  box-shadow: 0 0 0 1px #1989fa inset;
}

.cover-bottom {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 16px;
}
</style>
