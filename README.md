# 10图漫

基于 [journey3510/10Comic](https://github.com/journey3510/10Comic) 持续维护的 Tampermonkey 漫画脚本，支持多站点搜索、章节下载、追更，以及面向本地漫画库的元数据整理。

[![GitHub](https://img.shields.io/badge/GitHub-10Comic--W.Ver-181717?style=flat&logo=github)](https://github.com/zzzwannasleep/10Comic-W.Ver)
[![GitHub commit activity](https://img.shields.io/github/commit-activity/y/zzzwannasleep/10Comic-W.Ver?logo=github)](https://github.com/zzzwannasleep/10Comic-W.Ver)
[![GreasyFork](https://img.shields.io/badge/GreasyFork-10图漫-2d8cf0?style=flat)](https://greasyfork.org/zh-CN/scripts/447819)

## 功能概览

- 多站点漫画匹配、跨站搜索、章节列表加载
- 批量下载章节，支持 `直接下载`、`压缩下载（.cbz）`、`拼接下载`
- 单章 `CBZ` 下载前可自选封面：首页第一张、章节图片、自定义上传、Bangumi 封面
- 追更管理：收藏漫画、检查更新、下载待更章节
- 元数据输出：`ComicInfo.xml`、`series.json`、系列封面、压缩包命名模板
- 下载前元数据预览与编辑，支持 Bangumi 刮削补全
- 支持导入自定义站点规则

## 安装

先安装 [Tampermonkey](https://tampermonkey.net/) 或兼容的用户脚本管理器。

可通过以下任一方式安装脚本：

GitHub 自动构建：
<!-- AUTO_USERSCRIPT_LINK:start -->
[安装到 Tampermonkey / ScriptCat](https://raw.githubusercontent.com/zzzwannasleep/10Comic-W.Ver/main/release/10comic.user.js)
<!-- AUTO_USERSCRIPT_LINK:end -->

GitHub 发布文件：
<!-- AUTO_USERSCRIPT_FILE:start -->
[release/10comic.user.js](https://github.com/zzzwannasleep/10Comic-W.Ver/blob/main/release/10comic.user.js)
<!-- AUTO_USERSCRIPT_FILE:end -->

GreasyFork：
[10图漫](https://greasyfork.org/zh-CN/scripts/447819)

安装后在任意页面按 `Alt + V` 打开界面，或从油猴菜单点击“加载UI”。

默认情况下脚本不会随页面直接展开 UI，这样能尽量减少对原网站样式的影响。

## 快速上手

1. 打开支持的漫画目录页。
2. 按 `Alt + V` 唤起脚本界面。
3. 在“加载”页点击“加载”，勾选章节后开始下载。
4. 如果想长期跟踪某部作品，可在“加载”页点击“加入追更”。
5. 如果需要整理本地漫画库，可在“设置”中启用元数据选项，并在“元数据”页预览后再下载。

## 页面说明

- `漫画网站`：查看内置站点与导入规则站点，并从这里发起搜索。
- `加载`：加载章节、批量勾选、`Shift` 区间选择、排序、改名、加入追更。
- `封面`：单章 `CBZ` 下载时选择封面来源。
- `下载`：查看下载中、待下载、下载历史和错误记录。
- `追更`：管理收藏列表、跨站搜索候选作品、批量检查更新、下载待更章节。
- `设置`：调整快捷键、缩放、下载并发、图片范围、命名模板、元数据与自定义规则。
- `元数据`：下载前预览并编辑 `ComicInfo.xml` / `series.json` 内容。

## 支持站点

当前内置支持三十多个站点，常见包括：

- `Mangabz`
- 再漫画
- 极速漫画
- 动漫屋
- GoDa
- Komiic 漫画
- 拷贝漫画
- 风车漫画
- 包子漫画
- 看漫画
- 好漫 8

完整站点列表请以脚本内“漫画网站”页显示为准；站点域名或页面结构变动时，也会优先以最新脚本规则为准。

## 自定义规则

高级用法已经从 README 主体拆出，避免首页过长。

- 导入入口：`设置 -> 导入规则`
- 完整字段说明与示例：
  [docs/custom-rules.md](docs/custom-rules.md)

## 开发

安装依赖：

```bash
npm install
```

常用命令：

- `npm run dev`：本地 UI 调试，不依赖 Tampermonkey。
- `npm run test`：监听构建，配合 `testTemplate.js` 在 Tampermonkey 中调试脚本。
- `npm run build`：生成 `dist/10comic.js` 和 `release/10comic.user.js`。

项目内置 `.env`、`.env.dev`、`.env.test` 三套配置，打包版本号来自 `package.json`。

如果推送到 GitHub 的 `main` 或 `master` 分支，Actions 会自动：

1. 构建最新 userscript
2. 更新 README 中的安装链接
3. 提交 `release/10comic.user.js`

## 常见问题

- `UI 没有弹出`：脚本依赖外部 CDN 资源，网络波动时可能导致资源未加载成功，可稍后重试，或检查脚本外部资源缓存是否正常。
- `想把文件保存到文件夹`：建议在 Tampermonkey 设置里启用“浏览器 API”下载模式。
- `站点突然失效`：漫画站点常有换域名或改版情况，更新脚本后再试，必要时可导入自定义规则。
- `付费章节无法下载`：需先在原站登录并确认该章节已具备访问权限。

## 声明

本项目及其产生的数据仅限个人学习与研究使用，请勿用于任何非法用途。

## 致谢

- [journey3510/10Comic](https://github.com/journey3510/10Comic)
- [Tampermonkey-Vue](https://github.com/huangxubo23/tampermonkey-vue)
- [用 JS 实现多个任务并行执行的队列](https://juejin.cn/post/6844903961728647181)
