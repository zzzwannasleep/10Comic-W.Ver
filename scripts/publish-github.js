const fs = require('fs')
const path = require('path')

const repository = process.env.GITHUB_REPOSITORY
const branch = process.env.GITHUB_REF_NAME || process.env.PUBLISH_BRANCH || 'main'

if (!repository) {
  throw new Error('Missing GITHUB_REPOSITORY environment variable')
}

const repoUrl = `https://github.com/${repository}`
const rawUserScriptUrl = `https://raw.githubusercontent.com/${repository}/${branch}/release/10comic.user.js`
const filePageUrl = `${repoUrl}/blob/${branch}/release/10comic.user.js`

const replaceMarkedBlock = (content, markerName, replacement) => {
  const reg = new RegExp(`(<!-- ${markerName}:start -->)([\\s\\S]*?)(<!-- ${markerName}:end -->)`, 'm')
  if (!reg.test(content)) {
    throw new Error(`Missing marker block: ${markerName}`)
  }
  return content.replace(reg, `$1\n${replacement}\n$3`)
}

const readmeFile = path.resolve(process.env.README_FILE || path.resolve(__dirname, '../README.md'))
let readmeContent = fs.readFileSync(readmeFile, 'utf8')

readmeContent = replaceMarkedBlock(
  readmeContent,
  'AUTO_USERSCRIPT_LINK',
  `[安装到 Tampermonkey / ScriptCat](${rawUserScriptUrl})`
)

readmeContent = replaceMarkedBlock(
  readmeContent,
  'AUTO_USERSCRIPT_FILE',
  `[release/10comic.user.js](${filePageUrl})`
)

fs.writeFileSync(readmeFile, readmeContent)
console.log(`Updated README install links for ${repository}@${branch}`)
