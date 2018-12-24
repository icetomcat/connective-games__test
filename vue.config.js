module.exports = {
  baseUrl: process.env.NODE_ENV === 'production' ? '/connective-games__test/' : '/',
  pluginOptions: {
    i18n: {
      locale: 'ru',
      fallbackLocale: 'ru',
      localeDir: 'locales',
      enableInSFC: true
    }
  }
}
