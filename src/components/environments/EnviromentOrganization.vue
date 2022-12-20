<script setup lang="ts">
import type platformClient from 'purecloud-platform-client-v2'

import { Switch } from '@element-plus/icons-vue'
import { useAxios } from '@vueuse/integrations/useAxios'
import { useStorage} from '@vueuse/core'
import { useRouteHash } from '@vueuse/router'
import { getParameterByName } from '@/utils/string'

import axios from 'axios'
import genesysService from '@/services/genesyscloud-service'

const GLABS_APP_URL = import.meta.env.VITE_GLABS_APP_URL

const gsysToken = useStorage('gsys-token-1', {region:'', access_token: '', login_url: '' })
const gsysCloudToken = useStorage('gsys-token', {region:'', access_token: '', login_url: '' })
const genesysToken = ref(gsysCloudToken.value.access_token)
const loginUrl = ref(gsysCloudToken.value.login_url)
const showCloudProfile = ref(false)
const perms = ref({})
const me = ref({})
const org = ref({})

console.log('gsysToken setup :' + JSON.stringify(gsysToken.value))
const showMe = ref(false)
const showPermissions = ref(false)
const showOrg = ref(false)

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

const GenesysCloudApiClient = axios.create({
    baseURL: '/',
    timeout: 5000,
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${genesysToken.value}`
    }
  });

const apiUrl = computed(() => { return loginUrl.value.replace('login','api')})

const routeHash = useRouteHash()

// Update the login/api url when region changes
watch(
  () => gsysCloudToken.value.region,
  (reg) => {
    loginUrl.value = getGenesysCloudLoginUrl(reg)
    gsysCloudToken.value.login_url = loginUrl.value
    genesysService.setEnvironment(gsysCloudToken.value.login_url.replace('https://login.',''))
})

const {data, isFinished, execute, isLoading, error} = useAxios(GenesysCloudApiClient)

// Update token when route hash change in response to 
watchEffect(async () => {
  console.log(routeHash.value)
  if (routeHash.value.includes('access_token')) {
    genesysToken.value = getParameterByName('access_token')
    gsysCloudToken.value.access_token = genesysToken.value
    routeHash.value = ''
    console.log(`API Url:  ${apiUrl.value}`)
    showCloudProfile.value = true
  }
  genesysService.setAccessToken(genesysToken.value)
  genesysService.setEnvironment(gsysCloudToken.value.login_url.replace('https://login.',''))
})

onMounted(() =>{
  // genesysService.setAccessToken(gsysCloudToken.value.access_token)
  // genesysService.setEnvironment(gsysCloudToken.value.login_url.replace('https://login.',''))
  if (showCloudProfile.value) {
    getPermissions()
    getMyUser()
    getMyOrg()
  }
})

function getGenesysCloudLoginUrl(region: string) : string {
  console.log(region)
  return regions.filter((reg) => {
    return reg.value == region
  })[0].url
}

function loginWithGenesysCloud () {
  console.log('login URL: ' + gsysCloudToken.value.login_url)
  location.href = `${gsysCloudToken.value.login_url}/oauth/authorize?client_id=51dbce28-867f-459c-b38d-182fc1d446cc&response_type=token&redirect_uri=${GLABS_APP_URL}/account/organizations`
  //location.href = `${gsysCloudToken.value.login_url}/oauth/authorize?client_id=51dbce28-867f-459c-b38d-182fc1d446cc&response_type=token&redirect_uri=${GLABS_APP_URL}/workshops/Genesys-Dialog-Engine-Build-a-Bot`
}

async function getPermissions() {
  try {
    perms.value = await genesysService.getAuthorizationSubjectsMe()
    // showPermissions.value = true
    // showMe.value = false
    // showOrg.value = false
    return perms
  } catch (err) {
    console.log(err)
  }
}

//async function getMyUser(opts: platformClient.UsersApi.getUsersMeOptions | undefined) {
  async function getMyUser() {
  try {
    me.value = await genesysService.getUsersMe()
    // showMe.value = true
    // showPermissions.value = false
    // showOrg.value = false
    return me
  } catch (err) {
    console.log(err)
  }
}

async function getMyOrg() {
  try {
    org.value = await genesysService.getOrganizationsMe()
    // showMe.value = false
    // showPermissions.value = false
    // showOrg.value = true
    return me
  } catch (err) {
    console.log(err)
  }
}

</script>

<template>

<div class="">

<!-- Offcanvas menu button -->
<div class="d-grid mb-0 d-lg-none w-100">
  <button class="btn btn-primary mb-4" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasSidebar"
    aria-controls="offcanvasSidebar">
    <i class="fas fa-sliders-h"></i> Menu
  </button>
</div>

<div class="vstack gap-4">


  <!-- Personal info START -->
  <div class="card border">
    <!-- Card header -->
    <div class="card-header border-bottom">
      <h4 class="card-header-title text-primary">My Organizations</h4>
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
        <el-select v-model="gsysCloudToken.region" class="mx-4" placeholder="Select your region">
        <el-option v-for="item in regions" :label="item.label" :value="item.value" :key="item.value" />
      </el-select>
      <el-button @click="loginWithGenesysCloud" type="primary" :icon="Switch">Log in to Genesys</el-button>

    </el-row>

    </div>
    <div v-show="showCloudProfile" class="row">
      <h6>Genesys Cloud Profile</h6>
    </div>
    
    <div v-show="showCloudProfile" class="container my-3">
      <div class="row">
        <el-tabs tab-position="top" class="demo-tabs">
          <el-tab-pane label="Organization">
            <pre>{{org}}</pre> 
          </el-tab-pane>
          <el-tab-pane label="User">
            <pre>{{me}}</pre>
          </el-tab-pane>
          <el-tab-pane label="Permisisons">
            <pre>{{perms}}</pre> 
          </el-tab-pane>
        </el-tabs>
      
        <div class="col-4 px-2 m-2">
          <el-button @click="getPermissions" type="primary">Get Permissions</el-button>
          <el-button @click="getMyUser" type="primary">Get My User</el-button>
          <el-button @click="getMyOrg" type="primary">Get My Organization</el-button>
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

  

<pre>{{genesysToken}}</pre>
<pre>{{gsysCloudToken}}</pre>
<!-- <pre>{{data}}</pre>
<p>Finished: {{isFinished}}</p>
<p>Loading: {{isLoading}}</p>
<p>Error: {{error}}</p> -->
  <!-- <pre>{{customer}}</pre> -->
  <!-- Main content END -->
</template>

<style>

</style>
