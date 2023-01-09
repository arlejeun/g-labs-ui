<script setup lang="ts">

import { Switch } from '@element-plus/icons-vue'
import { useWorkspaceStore } from '@/stores/workspace'
import genesysService from '@/services/genesyscloud-service'
import { useUserStore } from '@/stores/user';

const userStore = useUserStore()
const route = useRoute()

const workspaceStore = useWorkspaceStore()
const { genesysUser, genesysUserPermissions, isTokenActive, activeOrgSummary, genesysLoginUrl, gsysCloudClient } = storeToRefs(workspaceStore)
const { setLoginURL, resetInfo, refreshEnvironment } = workspaceStore

const GLABS_APP_URL = import.meta.env.VITE_GLABS_APP_URL
const GLABS_CLOUD_OAUTH_CLIENT_ID = import.meta.env.VITE_GLABS_CLOUD_OAUTH_CLIENT_ID

const regions = [
  {
    value: 'us-east-1',
    label: 'Americas (US East)',
    url: 'https://login.mypurecloud.com'
  },
  {
    value: 'us-east-2',
    label: 'Americas (US East 2)',
    url: 'https://login.use2.us-gov-pure.cloud'
  },
  {
    value: 'us-west-2',
    label: 'Americas (US West)',
    url: 'https://login.usw2.pure.cloud'
  },
  {
    value: 'ca-central-1',
    label: 'Americas (Canada)',
    url: 'https://login.cac1.pure.cloud'
  },
  {
    value: 'sa-east-1',
    label: 'Americas (São Paulo)',
    url: 'https://login.sae1.pure.cloud'
  },
  {
    value: 'eu-central-1',
    label: 'EMEA (Frankfurt)',
    url: 'https://login.mypurecloud.de'
  },
  {
    value: 'eu-west-1',
    label: 'EMEA (Dublin)',
    url: 'https://login.mypurecloud.ie'
  },
  {
    value: 'eu-west-2',
    label: 'EMEA (London)',
    url: 'https://login.euw2.pure.cloud '
  },
  {
    value: 'ap-south-1',
    label: 'Asia Pacific (Mumbai)',
    url: 'https://login.aps1.pure.cloud'
  },
  {
    value: 'ap-northeast-2',
    label: 'Asia Pacific (Seoul)',
    url: 'https://login.apne2.pure.cloud'
  },
  {
    value: 'ap-southeast-2',
    label: 'Asia Pacific (Sydney)',
    url: 'https://login.mypurecloud.com.au'
  },
  {
    value: 'ap-northeast-1',
    label: 'Asia Pacific (Tokyo)',
    url: 'https://login.mypurecloud.jp'
  },
]

const isRedirectUrisConfigured = computed(() => {
  return route.path == '/workshops' || route.path == '/workshops/fundamentals'
})

// Update the login/api url when region changes
watch(
  () => gsysCloudClient.value.region,
  (reg) => {
    setLoginURL(getGenesysCloudLoginUrl(reg))
    gsysCloudClient.value.login_url = genesysLoginUrl.value
    isTokenActive.value = false
    genesysService.setEnvironment(genesysLoginUrl.value.replace('https://login.', ''))
  })


onMounted(() => {
  if (gsysCloudClient.value?.access_token != '' && !genesysUser.value?.email) {
    refreshEnvironment()
  }
})

function getGenesysCloudLoginUrl(region: string): string {
  return regions.filter((reg) => {
    return reg.value == region
  })[0].url
}

const loginWithGenesysCloud = () => {
  location.href = `${gsysCloudClient.value.login_url}/oauth/authorize?client_id=${GLABS_CLOUD_OAUTH_CLIENT_ID}&response_type=token&redirect_uri=${GLABS_APP_URL}${route.path}`
}

</script>

<template>


  <!-- Personal info START -->
  <div class="card active-org">
    <!-- Card header -->
    <div class="card-header">
      <h4 class="card-header-title text-primary">Active Organization</h4>
    </div>

    <!-- Card body START -->
    <div class="card-body">

      <div v-if="isRedirectUrisConfigured" class="row mb-3">
        <h6>Connect to your Genesys Cloud org</h6>
        <el-alert title="Select your Genesys region and log in to your Genesys Cloud organization" type="warning"
          description="You must already have a Genesys Cloud user provisioned to access your Genesys Cloud profile. Your access token will be valid for 24 hours. Sign out from Genesys Cloud when you want to change organization."
          show-icon />
        <div class="row my-4 justify-content-center">
          <div v-show="isRedirectUrisConfigured" class="col px-0">
            <el-select v-model="gsysCloudClient.region" placeholder="Select your region">
              <el-option v-for="item in regions" :label="item.label" :value="item.value" :key="item.value" />
            </el-select>
            <el-button class="ms-2" @click="loginWithGenesysCloud" type="primary" :icon="Switch"
              :disabled="isTokenActive">Log
              in</el-button>
          </div>
        </div>

      </div>

      <div v-else="isRedirectUrisConfigured" class="row mb-3">
        <h6>Access to Genesys Cloud client information</h6>
        <el-alert title="Return to the catalog of workshops and log in against your Genesys organization."
          type="warning"
          description="You must already have a Genesys Cloud user provisioned to access your Genesys Cloud profile. Your access token will be valid for 24 hours. Sign out from Genesys Cloud when you want to change organization and log in again from this client."
          show-icon />
      </div>

      <div v-show="isTokenActive" class="row">
        <h6>Genesys Cloud Profile</h6>
        <div class="container my-3">
          <div class="row">
            <el-tabs tab-position="top" class="demo-tabs">
              <el-tab-pane label="Summary">
             
                <ul class="summary">
                  <li><b>organization:</b> {{ activeOrgSummary.orgName }}</li>
                  <li><b>user:</b><span class="org-status ms-1"
                      :class="{ active: activeOrgSummary.userStatus == 'active' }">&#9679;</span>{{
                        activeOrgSummary.userEmail
                      }}
                  </li>
                  <li><b>roles:</b>
                    <el-tag class="px-3 mx-1" v-for="(role) in activeOrgSummary.userRole">{{ role }}</el-tag>
                  </li>
                </ul>


              </el-tab-pane>

              <el-tab-pane label="Permisisons">
                <pre>{{ genesysUserPermissions }}</pre>
              </el-tab-pane>
            </el-tabs>

            <div class="col-4 px-2 m-2">

              <el-button @click="resetInfo" type="primary">Reset</el-button>

            </div>


          </div>


        </div>


      </div>
      <!-- Card body END -->
    </div>
</div>
</template>

<style>
.active-org .el-descriptions__body .el-descriptions__table .el-descriptions__cell {
  padding-bottom: 10px;
  padding-top: 5px;
}

.active-org .summary {
  font-size: medium;
}

.active-org ul.summary {
  display: block;
  padding: 5px 0px;
}

.active-org .summary li {
  display: block;
  padding: 10px 5px;
}

.active-org .summary li span {
  margin: 5px 5px;
}

.org-status.active {
  color: green;
  /* font-size: 25px; */
  padding-right: 10px;
}

.org-status {
  color: red;
  padding-right: 10px;
}
</style>
