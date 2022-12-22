<script setup lang="ts">
import BasicFooter from '@/components/layouts/BasicFooter.vue';
import { useUserStore } from '@/stores/user'
import { BrowserAuthError, InteractionRequiredAuthError, InteractionStatus, InteractionType } from '@azure/msal-browser'
import { watch } from 'vue'
import { loginRequest } from '@/plugins/msal/msalConfig'
import { GLabsApiClient, GLABS_STORAGE, GLABS_TOKEN } from '@/apis/glabs'
import type { IDriveUser } from '@/interfaces';
import { useNotification } from "@kyvg/vue3-notification";


const { notify } = useNotification()

const userStore = useUserStore()
const { user, status } = storeToRefs(userStore)
const { fetchUser } = userStore

const isAuthenticated = useIsAuthenticated()
const { instance, accounts, inProgress } = useMsal();




const state = reactive({
  resolved: false
});

async function getProfileData() {

  const response = await instance.acquireTokenSilent({ ...loginRequest }).catch(async (e) => {
    if (e instanceof InteractionRequiredAuthError) {
      await instance.acquireTokenRedirect(loginRequest);
    }
    console.log(e)
    // throw e;
  });
  if (inProgress.value === InteractionStatus.None) {
    GLABS_TOKEN.value = response?.idToken
    GLABS_STORAGE.value = { token: `${response?.idToken}` }
    fetchUser()
    state.resolved = true;
    stopWatcher();
  }
}

//Refresh token every 30min
const { start } = useTimeoutFn(renewSilentToken, 1000*60*30)


async function renewSilentToken() {

  const response = await instance.acquireTokenSilent({ ...loginRequest }).catch(async (e) => {
    if (e instanceof InteractionRequiredAuthError) {
      await instance.acquireTokenRedirect(loginRequest);
    }
    console.log(e)
  });
  if (inProgress.value === InteractionStatus.None) {
    GLABS_TOKEN.value = response?.idToken
    GLABS_STORAGE.value = { token: `${response?.idToken}` }
    start()
  }
}


onBeforeMount(() => {
  
  if (isAuthenticated.value) {
    start()
    getProfileData();
    
  }
})

const stopWatcher = watch(inProgress, () => {
  if (!state.resolved) {
    if (isAuthenticated.value) {
      console.log('Authenticated user')
      getProfileData();
      start()
    }
  }
});



</script>

<template>
  <div class="main-layout">
    <!-- <pre>Accounts Instance: {{instance}}</pre> -->
    <el-container class="pt-0">
      <BasicNavBar />
      <el-main class="main-content">
        <RouterView />
      </el-main>
      <!-- <pre>Authenticated MSAL: {{ isAuthenticated }} | In Progress: {{ inProgress }}</pre>
      <pre>Accounts MSAL: {{ accounts }}</pre>
      <pre>User Profile: {{ user }}</pre> -->
      <el-footer class="footer">
        <BasicFooter />
      </el-footer>
    </el-container>
  </div>
</template>

<style>
.main-header {
  background-color: var(--el-color-primary);
  padding: 0 0 0 0;
  padding-right: 0;
  top: 0;
}

.main-layout {
  position: relative;
  min-height: 100vh;
}

.main-content {
  padding: 0 0 0 0;
}

.footer {
  background-color: var(--el-color-info);
  font-family: AmazonEmberBold, Helvetica, Arial, "Sans-Serif";
  /* padding: 15px 0; */
  position: absolute;
  bottom: 5px;
  width: 100%;
  height: 2.5 rem;
}


* {
  --el-color-success: #0cbc87;
  --el-color-danger: #d6293e;
  --el-color-primary: #23395D
}
</style>
