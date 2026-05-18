const fs = require('fs')
const path = require('path')

const packageJson = require('../package.json')

const buildMetaFile = path.resolve(__dirname, '../.cache/tampermonkey-build.json')

const normalizeBaseVersion = (value) => {
  const parts = String(value || '')
    .trim()
    .split('.')
    .map(part => part.replace(/\D+/g, ''))
    .filter(Boolean)

  return parts.length ? parts.join('.') : '0.0.0'
}

const pad = (value) => String(value).padStart(2, '0')

const formatBuildId = (date = new Date()) => {
  return [
    date.getUTCFullYear(),
    pad(date.getUTCMonth() + 1),
    pad(date.getUTCDate()),
    pad(date.getUTCHours()),
    pad(date.getUTCMinutes()),
    pad(date.getUTCSeconds())
  ].join('')
}

const getBaseVersion = () => normalizeBaseVersion(packageJson.version)

const sanitizeBuildMeta = (meta) => {
  const baseVersion = normalizeBaseVersion(meta?.baseVersion)
  const buildId = String(meta?.buildId || '').trim().replace(/\D+/g, '')
  const releaseVersion = baseVersion && buildId ? `${baseVersion}.${buildId}` : ''

  if (!baseVersion || !/^\d{14}$/.test(buildId) || !releaseVersion) {
    return null
  }

  return {
    baseVersion,
    buildId,
    releaseVersion
  }
}

const createBuildMeta = (date = new Date()) => {
  return sanitizeBuildMeta({
    baseVersion: getBaseVersion(),
    buildId: formatBuildId(date)
  })
}

const readPreparedBuildMeta = () => {
  try {
    if (!fs.existsSync(buildMetaFile)) {
      return null
    }

    const parsed = JSON.parse(fs.readFileSync(buildMetaFile, 'utf8'))
    const meta = sanitizeBuildMeta(parsed)

    if (!meta || meta.baseVersion !== getBaseVersion()) {
      return null
    }

    return meta
  } catch (error) {
    return null
  }
}

const writePreparedBuildMeta = (meta) => {
  const sanitized = sanitizeBuildMeta(meta)

  if (!sanitized) {
    throw new Error('Invalid build meta')
  }

  fs.mkdirSync(path.dirname(buildMetaFile), { recursive: true })
  fs.writeFileSync(buildMetaFile, `${JSON.stringify(sanitized, null, 2)}\n`)
  return sanitized
}

const resolveBuildMeta = () => readPreparedBuildMeta() || createBuildMeta()

module.exports = {
  buildMetaFile,
  createBuildMeta,
  getBaseVersion,
  readPreparedBuildMeta,
  resolveBuildMeta,
  writePreparedBuildMeta
}
