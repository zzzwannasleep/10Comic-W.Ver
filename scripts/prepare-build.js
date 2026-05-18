const { createBuildMeta, writePreparedBuildMeta } = require('./build-meta')

const meta = writePreparedBuildMeta(createBuildMeta())

console.log(`Prepared build meta: ${meta.releaseVersion}`)
