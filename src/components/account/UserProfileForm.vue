<script setup lang="ts">

import type { FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { useOptionsStore } from '@/stores/options'
import type { IDriveUser, IDriveUserSettings } from '@/interfaces';

const userStore = useUserStore()
const { updateUserProfile } = userStore

const props = defineProps<{
  myUser: IDriveUser,
  settings?: IDriveUserSettings
  admin?: boolean
}>()

// let user = ref({} as IDriveUser)
// let settings = ref({} as IDriveUserSettings)

const { myUser } = toRefs(props)

const user = ref({} as IDriveUser)

watchEffect(() => {
  user.value = myUser.value
})


const countryStore = useOptionsStore()
const { countries } = storeToRefs(countryStore)
const { fetchCountries, selectCountry } = countryStore

//Initialize countries only at the beginning
if (countries.value?.length == 0) fetchCountries()

const statusOptions = [
  { value: '', label: 'Unknown' },
  { value: 0, label: 'NeedsApproval' },
  { value: 10, label: 'Awaiting Confirmation' },
  { value: 30, label: 'Rejected' },
  { value: 40, label: 'Disabled' },
  { value: 50, label: 'Active' }
]

const typeOptions = [
  { value: 1, label: 'Unknown' },
  { value: 2, label: 'Internal' },
  { value: 3, label: 'Partner' },
  { value: 4, label: 'Customer' },
  { value: 5, label: 'Prospect' },
]
const formSize = ref('')
const personalFormRef = ref<FormInstance>()
const settingsFormRef = ref<FormInstance>()
const personalRules = reactive<FormRules>({
  first_name: [
    { required: true, message: 'Please input first name', trigger: 'blur' },
    { min: 2, max: 30, message: 'Length should be 2 to 30', trigger: 'blur' },
  ],
  last_name: [
    { required: true, message: 'Please input last name', trigger: 'blur' },
    { min: 2, max: 30, message: 'Length should be 2 to 30', trigger: 'blur' },
  ],
  email: [
    {
      type: 'string',
      required: true,
      pattern:
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: 'Please enter email address',
      trigger: 'blur',
    },
    { min: 3, message: 'Please enter email', trigger: 'blur' },
  ],
  phone_number: [
    {
      required: true,
      pattern: /^\+[1-9]\d{1,14}$/,
      message: 'Please enter Phone number e.164 format',
      trigger: 'blur'
    },
    { min: 3, message: 'Please enter email', trigger: 'blur' },
  ],
  company: [
    { required: true, message: 'Please input last name', trigger: 'blur' },
    { min: 2, max: 30, message: 'Length should be 2 to 30', trigger: 'blur' },
  ],
  country_id: [
    {
      required: true,
      message: 'Please select Country',
      trigger: 'change',
    },
  ]
})

//TODO: Check country code matches with phone number
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      //userStore.updatePersonalProfile(user)
      //updateCountryUser()
      //user.value.settings = {...settings.value}
      updateUserProfile(myUser.value)
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

// const updateCountryUser = () => {
//   console.log(user.value?.country_id);
//   selectCountry(user.value?.country_id)
// }

</script>

<template>
  <!--- Profile Form -->
  <div class="row">
    <div class="col">

      <!-- Personal info START -->
      <div class="card mb-4 border">
        <!-- Card header -->
        <div class="card-header border-bottom">
          <h4 class="card-header-title">User Profile</h4>
        </div>

        <!-- Card body START -->
        <div class="card-body">
          <!-- Form START -->

          <h5 class="pb-3">Contact Information</h5>

          <el-form ref="personalFormRef" :model="user" :rules="personalRules" label-width="120px" label-position="top"
            class="demo-ruleForm" status-icon>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="First Name" prop="first_name">
                  <el-input v-model="user.first_name" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Last Name" prop="last_name">
                  <el-input v-model="user.last_name" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="Job Function" prop="job">
                  <el-input v-model="user.job_function" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Company" prop="company">
                  <el-input v-model="user.company" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">

              <el-col :span="12">
                <el-form-item label="Country" prop="country_id">
                  <el-select v-model="user.country_id" filterable placeholder="Select Country">
                    <el-option v-for="item in countries" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                  <!-- <el-input v-model="user.country" /> -->
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="Email" prop="email">
                  <el-input v-model="user.email" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Phone Number" prop="phone_number">
                  <el-input v-model="user.phone_number" />
                </el-form-item>
              </el-col>
            </el-row>

            <div class="pt-2 d-sm-flex justify-content-end">
            <el-form-item>
              <el-button type="primary" @click="submitForm(personalFormRef)">Save changes</el-button>
              <el-button @click="resetForm(personalFormRef)">Reset</el-button>
            </el-form-item>
            </div>

          </el-form>

          <!-- Form END -->

          <el-divider></el-divider>

          <h5 class="pb-3">Account Settings</h5>

         <el-form ref="settingsFormRef" :model="settings" size="" label-position="left" class="demo-ruleForm">

          <!-- <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label-width="80%"
                label="I would like to receive notifications from the Techniical Acceleration team">
                <el-switch v-model="settings.notifications" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label-width="80%" label="Notifications channels">
                <el-checkbox-group v-model="settings.notifications_channels">
                  <el-checkbox label="Email" name="type" />
                  <el-checkbox label="Slack" name="type" />
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row> -->

          <div class="pt-2 d-sm-flex justify-content-end">
            <el-form-item>
              <el-button type="primary" @click="submitForm(settingsFormRef)">Save changes</el-button>
              <el-button @click="resetForm(settingsFormRef)">Reset</el-button>
            </el-form-item>
          </div>

        </el-form>

        </div>


      </div>
      <!-- Personal User Settings END -->

    </div>

  </div>
  <!-- Main content END -->
</template>


<style scoped>
.demo-progress .el-progress--line {
  margin-bottom: 15px;
}
</style>