import { defineStore } from "pinia";
import { useNotification } from "@kyvg/vue3-notification";
import { handleAxiosError } from "@/utils/axios";
import genesysService from '@/services/genesyscloud-service'
import type platformClient from 'purecloud-platform-client-v2'

export const useWorkspaceStore = defineStore("workspace", () => {
  // const router = useRouter();
  const { notify } = useNotification();
  const gsysCloudClient = useStorage('gsys-token', {region:'', access_token: '', login_url: '' })
  const gtsAvailableOrgs = ref([]);
  const genesysUserPermissions = ref({} as platformClient.Models.AuthzSubject | undefined);
  const genesysUser = ref({} as platformClient.Models.UserMe | undefined);
  const genesysOrg = ref({} as platformClient.Models.Organization | undefined);
  const genesysRegion = ref('')
  const genesysLoginUrl = ref(gsysCloudClient.value.login_url)
  const genesysApiUrl = computed(() => { return genesysLoginUrl.value.replace('login','api')})
  const isTokenActive = computed(() => gsysCloudClient.value.access_token != '')
  const hasAdminPermission = computed(() => genesysUserPermissions.value);

  function setupUserToken(token: string) {
    gsysCloudClient.value.access_token = token
  }

  function setLoginURL(url: string) {
    genesysLoginUrl.value = url
  }
  
  async function getActiveOrg() {
    try {
      genesysOrg.value = await genesysService.getOrganizationsMe()
    } catch (err) {
      notify({
        title: "Get Organization detail",
        text: `${handleAxiosError(err,"Please request Organization read permission to your Genesys Cloud Administrator")}`,
        duration: -1,
        type: "warn",
      });
    }
  }

  async function getActiveUser() {
    try {
      genesysUser.value = await genesysService.getUsersMe()
    } catch (err) {
      notify({
        title: "Get my Cloud User detail",
        text: `${handleAxiosError(err,"Please try to log in again.")}`,
        duration: -1,
        type: "error",
      });
    }
  }

  async function getActiveUserPermissions() {
    try {
      genesysUserPermissions.value = await genesysService.getAuthorizationSubjectsMe()
    } catch (err) {
      notify({
        title: "Get my cloud User permissions",
        text: `${handleAxiosError(err,"Please try to log in again.")}`,
        duration: -1,
        type: "error",
      });
    }
  }

  async function resetInfo() {
    gsysCloudClient.value.access_token = ''
  }

  async function refreshEnvironment () {
    setupUserToken(gsysCloudClient.value.access_token)
    genesysService.setAccessToken(gsysCloudClient.value.access_token)
    genesysService.setEnvironment(gsysCloudClient.value.login_url.replace('https://login.',''))
    getActiveUserPermissions()
    getActiveUser()
    getActiveOrg()
  }

  return {
    gtsAvailableOrgs,
    genesysUserPermissions,
    genesysUser,
    genesysOrg,
    hasAdminPermission,
    isTokenActive,
    genesysRegion,
    genesysApiUrl,
    genesysLoginUrl,
    gsysCloudClient,
    getActiveOrg,
    getActiveUser,
    getActiveUserPermissions,
    setupUserToken,
    refreshEnvironment,
    resetInfo,
    setLoginURL
  };

});
