import { handleAxiosError } from '@/utils/axios'
import { notify } from '@kyvg/vue3-notification'
import platformClient from 'purecloud-platform-client-v2'
const authorizationApi = new platformClient.AuthorizationApi()
const organizationApi = new platformClient.OrganizationApi()
const usersApi = new platformClient.UsersApi();
const client = platformClient.ApiClient.instance


export default {

  // Login to Genesys Cloud
  setAccessToken(token: string) {
    client.setAccessToken(token)
  },

  setEnvironment(env: string) {
    client.setEnvironment(env)
  },

  async getAuthorizationSubjectsMe() {
    const data = await authorizationApi.getAuthorizationSubjectsMe()
    return data  
  },

  //async getUsersMe(opts: platformClient.UsersApi.getUsersMeOptions | undefined) {
  async getUsersMe() {
    const data = await usersApi.getUsersMe()
    return data  
  },

  async getOrganizationsMe() {
      const data = await organizationApi.getOrganizationsMe()
      return data
  },
  
}