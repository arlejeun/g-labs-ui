<script setup lang="ts">

import type { FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '@/stores/user'
import type { GCUserInfo, IDriveUser } from '@/interfaces';
import { getPureCloudSkill1, getPureCloudSkill2, regionOptions, partnerRegionOptions } from '@/utils/gc';

// const militaryAlphabet = ["Alpha", "Bravo", "Charlie", "Delta", "Echo",
// 			"Foxtrot", "Golf", "Hotel", "India", "Juliet", "Kilo", "Lima", "Mike", "November", "Oscar", "Papa",
// 			"Quebec", "Romeo", "Sierra", "Tango", "Uniform", "Victor", "Whiskey", "X-Ray", "Yankee", "Zulu"]

// const medals = ["Platinum", "Gold", "Silver", "Bronze"]

// const getPureCloudSkill1 = (lastName: string) => {
//   const index = militaryAlphabet.findIndex( name => name.substring(0,1) == lastName.substring(0,1).toUpperCase())
//   return militaryAlphabet[index]
// }

// const getPureCloudSkill2 = () => {
//   return medals[getRandomInt(medals.length)]
// }

const props = defineProps<{
  user: IDriveUser,
}>();

const { user: myRegistrationUser } = toRefs(props)

const user = ref({} as IDriveUser)

// const regionOptions = ref([{ "label": "APAC", "value": "APAC" }, { "label": "CANADA", "value": "CANADA" }, { "label": "EMEA", "value": "EMEA" }, { "label": "LATAM", "value": "LATAM" }, { "label": "SCO US West", "value": "NA_USW" }, { "label": "SCO - US Central", "value": "NA_USC" }, { "label": "SCO - US East", "value": "NA_USE" }, { "label": "SCO - Velocity", "value": "NA_VELOCITY" }, { "label": "SCO - Architects", "value": "NA_ARCHITECTS" }, { "label": "SCO - Government", "value": "NA_GOVERNMENT" }, { "label": "US East", "value": "USE" }, { "label": "US Central", "value": "USC" }, { "label": "US West", "value": "USW" }])
// const partnerRegionOptions = ref([{ "label": "APAC Partner", "value": "APAC_Partner" }, { "label": "Canada Partner", "value": "Canada_Partner" }, { "label": "EMEA Partner", "value": "EMEA_Partner" }, { "label": "LATAM Partner", "value": "LATAM_Partner" }, { "label": "US Partner", "value": "US_Partner" }])

const userStore = useUserStore()
const { isMobile } = storeToRefs(userStore)

const { activateUserProvisioning } = userStore

const provisionForm = ref({} as GCUserInfo)

const registrationFormRef = ref<FormInstance>()
const registrationRules = reactive<FormRules>({
  region: [
    { required: true, message: 'Please select the GC division matching with your location', trigger: 'blur' },
    { min: 2, max: 30, message: 'Length should be 2 to 30', trigger: 'blur' },
  ]
})

const generateProvisioningPayload = () => {
  provisionForm.value = {...provisionForm.value, 
    org_name: 'purecloudnow',
    email: myRegistrationUser.value.email,
    username: myRegistrationUser.value.username,
    name: `${myRegistrationUser.value.first_name} ${myRegistrationUser.value.last_name}`,
    //phoneNumber: myRegistrationUser.value.phone_number,
    skills: [getPureCloudSkill1(myRegistrationUser.value.last_name), getPureCloudSkill2()],
    //country: myRegistrationUser.value?.customer?.country,
    title: myRegistrationUser.value.job_function,
    state: 'active'
  }

}


watchEffect(() => {
  if (myRegistrationUser?.value?.email) {
    user.value = myRegistrationUser.value
  }
})


//TODO: Check country code matches with phone number
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      const storedUserId = localStorage.getItem('registration_uid')
      let storedUid = -1
      if (typeof storedUserId == 'string') {
        storedUid = parseInt(storedUserId)
      }
      const uid = myRegistrationUser.value?.id || storedUid
      generateProvisioningPayload()
      activateUserProvisioning(uid, provisionForm.value)
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}


</script>

<template>
  <!--- Profile Form -->
  <div class="row">
    <div class="col">

      <div class="card mb-4 border">
        <!-- Card header -->
        <div class="card-header">
          <h4 class="card-header-title"></h4>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-auto">
              <img src="@/assets/images/persons/pose-fs-9.png" />
            </div>
            <div class="col">
              <el-alert title="Thank you for submitting your registration" type="info" :closable="false"
                description="The last step of the registration provision your account with a demo organization. Please fill up the fields with match the best with your profile to provision a user for a demo environment"
                show-icon />


              <el-form ref="registrationFormRef" :model="provisionForm" :rules="registrationRules" label-width="120px"
                label-position="top" class="demo-ruleForm" status-icon>

                <el-row :gutter="20">
                  <el-col v-if="user.status=='Internal'" :xs="24" :span="12">
                    <el-form-item label="Region" prop="region">
                      <el-select v-model="provisionForm.region">
                        <el-option v-for="item in regionOptions" :key="item.value" :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col v-if="user.status!='Internal'" :xs="24" :span="12">
                    <el-form-item label="Region" prop="region">
                      <el-select v-model="provisionForm.region">
                        <el-option v-for="item in partnerRegionOptions" :key="item.value" :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>


                <el-divider></el-divider>

                <div class="pt-2 d-sm-flex justify-content-end">
                  <el-form-item>
                    <el-button type="primary" @click.prevent="submitForm(registrationFormRef)">Activate</el-button>
                    <el-button @click="resetForm(registrationFormRef)">Reset</el-button>
                  </el-form-item>
                </div>


              </el-form>

            </div>

          </div>

        </div>

      </div>

    </div>


  </div>
  <!-- Main content END -->
</template>


<style scoped>
.demo-progress .el-progress--line {
  margin-bottom: 15px;
}
</style>