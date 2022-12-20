<script setup lang="ts">

import { Switch } from '@element-plus/icons-vue'
import { useWorkspaceStore } from '@/stores/workspace'
import genesysService from '@/services/genesyscloud-service'

const workspaceStore = useWorkspaceStore()
const { genesysUser, genesysOrg, genesysUserPermissions, isTokenActive, genesysApiUrl, genesysLoginUrl, genesysRegion, gsysCloudClient } = storeToRefs(workspaceStore)
const { setLoginURL, getActiveOrg, getActiveUserPermissions, getActiveUser, setupUserToken, resetInfo, refreshEnvironment } = workspaceStore

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

// Update the login/api url when region changes
watch(
  () => gsysCloudClient.value.region,
  (reg) => {
    setLoginURL(getGenesysCloudLoginUrl(reg))
    gsysCloudClient.value.login_url = genesysLoginUrl.value
    isTokenActive.value = false
    genesysService.setEnvironment(genesysLoginUrl.value.replace('https://login.',''))
})

// Update token when route hash change in response to 
// watchEffect(async () => {
//   //console.log(routeHash.value)
//   if (routeHash.value.includes('access_token')) {
//     genesysToken.value = getParameterByName('access_token')
//     gsysCloudToken.value.access_token = genesysToken.value
//     routeHash.value = ''
//     // setupUserToken(genesysToken.value)
//     // genesysService.setAccessToken(genesysToken.value)
//     // genesysService.setEnvironment(gsysCloudToken.value.login_url.replace('https://login.',''))
//     refreshEnvironment()
//   }

// })

onMounted(() =>{
   //page reload different page
   if (gsysCloudClient.value?.access_token != '' && !genesysUser.value?.email ) {
    refreshEnvironment()
  }
})

function getGenesysCloudLoginUrl(region: string) : string {
  console.log(region)
  return regions.filter((reg) => {
    return reg.value == region
  })[0].url
}

function loginWithGenesysCloud () {
  location.href = `${gsysCloudClient.value.login_url}/oauth/authorize?client_id=${GLABS_CLOUD_OAUTH_CLIENT_ID}&response_type=token&redirect_uri=${GLABS_APP_URL}/workshops`
}

</script>

<template>

<div class="">

<div class="vstack gap-4">


  <!-- Personal info START -->
  <div class="card">
    <!-- Card header -->
    <div class="card-header border-bottom">
      <h4 class="card-header-title text-primary">Active Organization</h4>
    </div>

    <!-- Card body START -->
    <div class="card-body">

      <div class="row">
        <el-alert
          title="Select your Genesys region and log in to your Genesys Cloud organization"
          type="warning"
          description="You must already have a Genesys Cloud user provisioned to access your Genesys Cloud profile. Your access token will be valid for 24 hours. Sign out from Genesys Cloud when you want to change organization."
          show-icon
          :closable="false"
        />
        <el-row class="my-4">
        <el-select v-model="gsysCloudClient.region" class="mx-4" placeholder="Select your region">
        <el-option v-for="item in regions" :label="item.label" :value="item.value" :key="item.value" />
      </el-select>
      <el-button @click="loginWithGenesysCloud" type="primary" :icon="Switch" :disabled="isTokenActive">Log in to Genesys</el-button>
      <!-- <el-button @click="loginWithGenesysCloud" type="primary" :icon="Switch">Log in to Genesys</el-button> -->

    </el-row>

    </div>
    <div v-show="isTokenActive" class="row">
      <h6>Genesys Cloud Profile</h6>
    </div>
    
    <div v-show="isTokenActive" class="container my-3">
      <div class="row">
        <el-tabs tab-position="top" class="demo-tabs">
          <el-tab-pane label="Organization">
            <pre>{{genesysOrg}}</pre> 
          </el-tab-pane>
          <el-tab-pane label="User">
            <pre>{{genesysUser}}</pre>
          </el-tab-pane>
          <el-tab-pane label="Permisisons">
            <pre>{{genesysUserPermissions}}</pre> 
          </el-tab-pane>
        </el-tabs>
      
        <div class="col-4 px-2 m-2">
          <!-- <el-button @click="getActiveUserPermissions" type="primary">Get Permissions</el-button>
          <el-button @click="getActiveUser" type="primary">Get My User</el-button>
          <el-button @click="getActiveOrg" type="primary">Get My Organization</el-button> -->
          <el-button @click="resetInfo" type="primary">Reset</el-button>

      </div>

      <div class="col-7 px-2">
        <div class="my-2 row">
       
        
        
      </div>
      </div>
    
    </div>
      

    </div>


    </div>
    <!-- Card body END -->
  </div>
  <!-- Personal info END -->


</div>
</div>

</template>

<style>

</style>
