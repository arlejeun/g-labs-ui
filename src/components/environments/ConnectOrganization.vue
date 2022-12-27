<script setup lang="ts">

import { Switch } from '@element-plus/icons-vue'
import { useWorkspaceStore } from '@/stores/workspace'
import genesysService from '@/services/genesyscloud-service'
import { useUserStore } from '@/stores/user';

const userStore = useUserStore()
const { isMobile } = storeToRefs(userStore)

const workspaceStore = useWorkspaceStore()
const { genesysUser, genesysOrg, genesysUserPermissions, isTokenActive, activeOrgSummary, genesysLoginUrl, genesysRegion, gsysCloudClient } = storeToRefs(workspaceStore)
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
  //page reload different page
  if (gsysCloudClient.value?.access_token != '' && !genesysUser.value?.email) {
    refreshEnvironment()
  }
})

function getGenesysCloudLoginUrl(region: string): string {
  console.log(region)
  return regions.filter((reg) => {
    return reg.value == region
  })[0].url
}

function loginWithGenesysCloud() {
  location.href = `${gsysCloudClient.value.login_url}/oauth/authorize?client_id=${GLABS_CLOUD_OAUTH_CLIENT_ID}&response_type=token&redirect_uri=${GLABS_APP_URL}/workshops`
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

      <div class="row">
        <h6>Connect to your Genesys Cloud org</h6>
        <el-alert title="Select your Genesys region and log in to your Genesys Cloud organization" type="warning"
          description="You must already have a Genesys Cloud user provisioned to access your Genesys Cloud profile. Your access token will be valid for 24 hours. Sign out from Genesys Cloud when you want to change organization."
          show-icon />
        <div class="row my-4">
          <div class="col-xl-6 col-lg-8 col-md-9 px-0">
            <el-select v-model="gsysCloudClient.region" placeholder="Select your region">
              <el-option v-for="item in regions" :label="item.label" :value="item.value" :key="item.value" />
            </el-select>
          </div>
          <div class="col-xl-6 col-lg-4 col-md-3">
            <el-button @click="loginWithGenesysCloud" type="primary" :icon="Switch" :disabled="isTokenActive">Log
              in</el-button>
          </div>

          <!-- <el-button @click="loginWithGenesysCloud" type="primary" :icon="Switch">Log in to Genesys</el-button> -->

        </div>

      </div>
      <div v-show="isTokenActive" class="row">
        <h6>Genesys Cloud Profile</h6>
      </div>

      <div v-show="isTokenActive" class="container my-3">
        <div class="row">
          <el-tabs tab-position="top" class="demo-tabs">
            <el-tab-pane label="Summary">
              <!-- <el-descriptions
                direction="horizontal"
                :column="1"
              >

               <el-descriptions-item v-for="(value, key) in activeOrgSummary" :label="key">
                <el-tag size="small">{{value}}</el-tag>
              </el-descriptions-item> -->

              <!-- <el-descriptions-item label="Organization name">
                {{activeOrgSummary.orgName}}
              </el-descriptions-item>
              <el-descriptions-item class="pt-0" label="User email">
                  {{activeOrgSummary.userEmail}}<span class="org-status ms-1" :class="{active: activeOrgSummary.userStatus=='active'}">&#9679;</span>
              </el-descriptions-item>
              <el-descriptions-item class="pt-0" label="User roles">
                  {{activeOrgSummary.userRole}}
              </el-descriptions-item>

            </el-descriptions> -->

              <ul class="summary">
                <li><b>organization:</b> {{ activeOrgSummary.orgName }}</li>
                <li><b>user:</b><span class="org-status ms-1"
                    :class="{ active: activeOrgSummary.userStatus == 'active' }">&#9679;</span>{{ activeOrgSummary.userEmail }}
                </li>
                <li><b>roles:</b>
                  <el-tag class="px-3 mx-1" v-for="(role) in activeOrgSummary.userRole">{{ role }}</el-tag>
                </li>
              </ul>


            </el-tab-pane>

            <!-- <el-tab-pane label="Organization">
              <pre>{{ genesysOrg }}</pre>
            </el-tab-pane>
            <el-tab-pane label="User">
              <pre>{{ genesysUser }}</pre>
            </el-tab-pane> -->
            <el-tab-pane label="Permisisons">
              <pre>{{ genesysUserPermissions }}</pre>
            </el-tab-pane>
          </el-tabs>

          <div class="col-4 px-2 m-2">
            <!-- <el-button @click="getActiveUserPermissions" type="primary">Get Permissions</el-button>
          <el-button @click="getActiveUser" type="primary">Get My User</el-button>
          <el-button @click="getActiveOrg" type="primary">Get My Organization</el-button> -->
            <el-button @click="resetInfo" type="primary">Reset</el-button>

          </div>


        </div>


      </div>


    </div>
    <!-- Card body END -->
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
  padding: 3px 0px;
}

.active-org .summary li {
  display: block;
  padding: 3px 0px;
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
