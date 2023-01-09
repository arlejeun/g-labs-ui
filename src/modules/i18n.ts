import { createI18n } from 'vue-i18n'

// Import i18n resources
// https://vitejs.dev/guide/features.html#glob-import
//
import messages from '@intlify/unplugin-vue-i18n/messages'

export default createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'en-US',
    fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en-US',
    //messages: messages,
    messages: messages
  });