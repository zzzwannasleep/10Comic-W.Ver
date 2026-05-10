/* eslint-disable no-undef */
const AppName = __APP_NAME__
const AppVersion = __APP_VERSION__
const AppEnv = __APP_ENVIRONMENT__
const AppHomepageUrl = __APP_HOMEPAGE_URL__
const AppSupportUrl = __APP_SUPPORT_URL__
const AppUpdateUrl = __APP_UPDATE_URL__
const AppDownloadUrl = __APP_DOWNLOAD_URL__
const isDev = AppEnv === 'development'

export {
  AppName,
  AppVersion,
  AppEnv,
  AppHomepageUrl,
  AppSupportUrl,
  AppUpdateUrl,
  AppDownloadUrl,
  isDev
}
