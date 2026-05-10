# 自定义规则说明

通过 `设置 -> 导入规则` 可以扩展新的漫画站点规则。导入内容建议写成 JS 对象数组文本，每一项代表一个站点规则。

## 最小字段

```js
[
  {
    domain: 'xx.xx.com',
    homepage: 'https://xx.xx.com/',
    webName: '示例站点',
    comicNameCss: '.comic-title',
    chapterCss: '.chapter-list',
    readtype: 1,
    getImgs: `function(context) {
      const imgStr = context.match(/xx正则xx/g)
      const imgs = eval(imgStr)
      return imgs
    }`
  }
]
```

## 字段说明

- `domain`：站点域名，支持 `String` 或 `Array`
- `homepage`：站点首页
- `webName`：站点名称
- `comicNameCss`：漫画名 CSS 选择器
- `chapterCss`：章节列表容器 CSS 选择器
- `readtype`：
  - `1` 表示卷轴阅读或 SPA 页面，可一次拿到整章图片
  - `0` 表示翻页阅读，需要逐页请求
- `useFrame`：当值为 `true` 时，脚本会使用隐藏 `iframe` 打开章节页再取图
- `webDesc`：可选，站点备注
- `getImgs`：以字符串形式写入的函数，用于解析章节图片

## `getImgs` 返回约定

### `readtype: 1`

```js
getImgs: `function(context) {
  return ['https://example.com/1.jpg', 'https://example.com/2.jpg']
}`
```

- `context`：章节页面请求返回的正文
- 返回值：当前章节所有图片地址数组

### `readtype: 0`

```js
getImgs: `function(context, processData) {
  return {
    imgUrlArr: ['https://example.com/3.jpg'],
    nextPageUrl: 'https://example.com/chapter/2.html',
    imgCount: 12,
    otherData: {
      currentPage: 2
    }
  }
}`
```

- `context`：当前页请求正文
- `processData`：进程中的共享数据
- 返回值字段：
  - `imgUrlArr`：当前页图片地址
  - `nextPageUrl`：下一页地址，为空字符串时结束
  - `imgCount`：本章总图片数
  - `otherData`：可选，自定义透传数据

### `useFrame: true` 且 `readtype: 1`

```js
getImgs: `async function(context, processData) {
  const iframeWindow = document.getElementById(processData.frameId).contentWindow
  const iframeDom = document.getElementById(processData.frameId).contentDocument

  const image = [...iframeDom.querySelectorAll('.xx img')]
    .map(img => img.dataset.src ?? img.src)

  document.getElementById(processData.frameId).remove()
  return image
}`
```

- `processData.frameId`：脚本创建的隐藏 `iframe` id
- 适合必须在真实页面上下文里才能拿到图片地址的站点

## 提示

- `getImgs` 是字符串函数，正则和反斜杠要注意转义。
- 搜索能力不是自定义规则的必填项；如果只想支持下载，最小规则即可。
- 站点若是 SPA，章节切换后可能需要在脚本中手动点一次“重载列表”。
