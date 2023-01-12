import { createApp } from 'vue'
import { createPinia } from 'pinia'

//import { abilitiesPlugin } from '@casl/vue'
// import ability from '@/plugins/casl/ability'

import gtag from 'vue-gtag-next'
import Notifications from '@kyvg/vue3-notification'



//import ElementPlus from 'element-plus'
//import '@/assets/scss/vendor/bootstrap/scss/bootstrap.scss'
//import '@/assets/scss/element/index.scss'

// Import Bootstrap
import '@/assets/scss/audit/style.scss'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '@/assets/scss/audit/vendor/bootstrap-icons/bootstrap-icons.css'

import { msalPlugin } from '@/plugins/msal/msalPlugin'
import { msalInstance } from '@/plugins/msal/msalConfig'
import { EventType } from "@azure/msal-browser";
import type { AuthenticationResult } from "@azure/msal-browser";
import { CustomNavigationClient } from '@/router/NavigationClient'

// import '@/assets/scss/element/index.scss'
// import 'element-plus/dist/index.css'

import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';

import 'nprogress'

// Import Fontawesome
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

// import MazPhoneNumberInput from 'maz-ui/components/MazPhoneNumberInput'
// import 'maz-ui/css/main.css'

import router from './router'
import App from '@/App.vue'
import i18n from './i18n'

library.add(fas)

const app = createApp(App)
//app.use(ElementPlus)

app.component('fa', FontAwesomeIcon)
//app.component('MazPhoneNumberInput', MazPhoneNumberInput)
app.component('EasyDataTable', Vue3EasyDataTable);

// app.use(abilitiesPlugin, ability, {
//     useGlobalProperties: true,
//   })

app.use(Notifications)

app.use(createPinia())

app.use(router)
/***
 * Google Vue Tags for GA4
 */

 app.use(gtag, {
  isEnabled: true,
  useDebugger: true,
  disableScriptLoader: false,
  property: { id: "G-YR2MYN6ZRJ"}
});

/***
 *  MSAL Authentication
 *  Account selection logic is app dependent. Adjust as needed for different use cases.
 **/

// The next 2 lines are optional. This is how you configure MSAL to take advantage of the router's navigate functions when MSAL redirects between pages in your app
const navigationClient = new CustomNavigationClient(router);
msalInstance.setNavigationClient(navigationClient);

const accounts = msalInstance.getAllAccounts();
if (accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0]);
}
msalInstance.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
    const payload = event.payload as AuthenticationResult;
    const account = payload.account;
    msalInstance.setActiveAccount(account);
  }
});


app.use(msalPlugin, msalInstance);

app.use(i18n);



router.isReady().then(() => {
  app.mount("#app");
});