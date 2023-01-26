<script lang="ts" setup>
import type { IDriveBaseUser, IDriveUser } from '@/interfaces';

import { Edit, Picture, UploadFilled } from '@element-plus/icons-vue'
import { GLABS_TOKEN } from '@/apis/glabs'
import { useMsal } from "@/composables/useMsal";
import type Token from 'markdown-it/lib/token';
import type { AccountInfo } from '@azure/msal-common';
// import jwt_decode from 'jwt-decode';

const decodeToken4User = (msalAccount: AccountInfo[]) => {
  let userTemp = {} as IDriveBaseUser
  userTemp.first_name = msalAccount?.[0]?.idTokenClaims?.given_name as string
  userTemp.last_name = msalAccount?.[0]?.idTokenClaims?.family_name as string
  userTemp.idp = msalAccount?.[0]?.idTokenClaims?.idp as string
  userTemp.email = msalAccount?.[0]?.idTokenClaims?.emails?.[0] as string
  return userTemp
}
const { accounts } = useMsal();
const registrationUser = ref({} as IDriveBaseUser)
const activeStep = ref(2)

onMounted(() => {
  // console.log(GLABS_TOKEN.value)
  // console.log('On mounted : ' + JSON.stringify(accounts.value))
  // const decoded = jwt_decode(GLABS_TOKEN.value)
  // console.log(decoded);

})
</script>


<template>
  <!-- **************** MAIN CONTENT START **************** -->
  <main>
    <!-- ======================= Content START -->
    <section class="pt-3">
      <div class="container">
        <div class="row mb-4">

          <el-steps :active="activeStep" process-status="process" finish-status="success" simple style="margin-top: 20px">
            <el-step title="Register profile" />
            <el-step title="Personalize Customer" />
            <el-step title="Activate profile" />
          </el-steps>

        </div>

        <div class="row" v-if="activeStep==2">
          <!-- <registration-profile-form v-if="activeStep==0" :account="registrationUser"/> -->
          <!-- <registration-customer-form v-if="activeStep==1" :account="registrationUser"/> -->
          <!-- <registration-validation v-if="activeStep==1"></registration-validation> -->

            <div class="col">

              <!-- Personal info START -->
              <registration-validation></registration-validation> 


          </div>

        </div>
        <!-- <SidebarAccount /> -->
      </div>
    </section>
    <!-- =======================
  Content END -->
  <pre>{{accounts}}</pre>

  </main>
  <!-- **************** MAIN CONTENT END **************** -->

</template>
  
<style>
@media (min-width: 1024px) {
  .container.profile {
    max-width: 80%;
  }
}
</style>
  
<route lang="yaml">
  meta:
    layout: BasicTopNavigationLayout
    title: Account Profile
    requiresAuth: true
  </route>
    