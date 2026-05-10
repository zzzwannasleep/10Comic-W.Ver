/**
 * TamperMonkey插件打包脚本
 */

const fs = require('fs')
const path = require('path')

const appName = process.env.TAMPERMONKEY_APP_NAME
const appVersion = require('./package.json').version
const entryFile = process.env.TAMPERMONKEY_ENTRY_FILE
const homepageUrl = process.env.TAMPERMONKEY_HOMEPAGE_URL || ''
const supportUrl = process.env.TAMPERMONKEY_SUPPORT_URL || ''
const updateUrl = process.env.TAMPERMONKEY_UPDATE_URL || ''
const downloadUrl = process.env.TAMPERMONKEY_DOWNLOAD_URL || ''

const distFilePath = `./dist/${entryFile}`
const metaFileName = entryFile.replace(/\.js$/, '.meta.js')
const distMetaFilePath = `./dist/${metaFileName}`
const app = fs.readFileSync(distFilePath, 'utf8')
let tampermonkeyConfig = fs.readFileSync('./tampermonkey.js', 'utf8')
tampermonkeyConfig = tampermonkeyConfig.replace('__APP_NAME__', appName)
tampermonkeyConfig = tampermonkeyConfig.replace('__APP_VERSION__', appVersion)
tampermonkeyConfig = tampermonkeyConfig.replace('__APP_HOMEPAGE_URL_LINE__', homepageUrl ? `// @homepageURL  ${homepageUrl}` : '')
tampermonkeyConfig = tampermonkeyConfig.replace('__APP_SUPPORT_URL_LINE__', supportUrl ? `// @supportURL   ${supportUrl}` : '')
tampermonkeyConfig = tampermonkeyConfig.replace('__APP_UPDATE_URL_LINE__', updateUrl ? `// @updateURL    ${updateUrl}` : '')
tampermonkeyConfig = tampermonkeyConfig.replace('__APP_DOWNLOAD_URL_LINE__', downloadUrl ? `// @downloadURL  ${downloadUrl}` : '')
tampermonkeyConfig = tampermonkeyConfig.replace(/\n{3,}/g, '\n\n')

const output = tampermonkeyConfig + '\n' + app
fs.writeFileSync(distFilePath, output)
fs.writeFileSync(distMetaFilePath, `${tampermonkeyConfig}\n`)

const releaseDir = './release'
const releaseFile = entryFile.replace(/\.js$/, '.user.js')
const releaseMetaFile = entryFile.replace(/\.js$/, '.meta.js')
fs.mkdirSync(releaseDir, { recursive: true })
fs.writeFileSync(path.join(releaseDir, releaseFile), output)
fs.writeFileSync(path.join(releaseDir, releaseMetaFile), `${tampermonkeyConfig}\n`)
console.log('build complete!')
