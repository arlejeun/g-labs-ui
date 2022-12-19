<script setup lang="ts">

import type { FormInstance, FormRules, ElProgress } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { useCountryStore } from '@/stores/country'
import type { IDriveUser, IDriveUserDTO } from '@/interfaces';

const props = defineProps(['account'])
const myUser = ref(props.account)

const userStore = useUserStore()
const { status, registrationStep } = storeToRefs(userStore)
const { setUserRegistration } = userStore

const countryStore = useCountryStore()
const { countries } = storeToRefs(countryStore)
const { fetchCountries, selectCountry } = countryStore

//Initialize countries only at the beginning
if (countries.value?.length == 0) fetchCountries()

const registrationFormRef = ref<FormInstance>()
const registrationRules = reactive<FormRules>({
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
      myUser.value.country = {connect: {"id": myUser.value.country_id}}
      myUser.value.settings = {create: {"id_provider": myUser.value.idp}}
      const {country_id, idp, ...userForm} = myUser.value
      setUserRegistration(userForm)
     // createUserProfile(userForm)
     
      registrationStep.value = 1
      status.value = 'Registration - Customer'
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

const updateCountryUser = () => {
  console.log(myUser.value?.country_id);
  selectCountry(myUser.value?.country_id)

}

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

          <el-form ref="registrationFormRef" :model="myUser" :rules="registrationRules" label-width="120px"
            label-position="top" class="demo-ruleForm" size="" status-icon>
            <el-row :gutter="20">
              <el-col :xs="24" :span="12">
                <el-form-item label="First Name" prop="first_name">
                  <el-input v-model="myUser.first_name" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :span="12">
                <el-form-item label="Last Name" prop="last_name">
                  <el-input v-model="myUser.last_name" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :xs="24" :span="12">
                <el-form-item label="Job Function" prop="job">
                  <el-input v-model="myUser.job_function" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :span="12">
                <el-form-item label="Company" prop="company">
                  <el-input v-model="myUser.company" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">

              <el-col :xs="24" :span="12">
                <el-form-item label="Country" prop="country_id">
                  <el-select v-model="myUser.country_id" filterable placeholder="Select Country">
                    <el-option v-for="item in countries" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                  <!-- <el-input v-model="user.country" /> -->
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :xs="24" :span="12">
                <el-form-item label="Email" prop="email">
                  <el-input v-model="myUser.email" disabled />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :span="12">
                <el-form-item label="Phone Number" prop="phone_number">
                  <el-input v-model="myUser.phone_number" />
                </el-form-item>
              </el-col>
            </el-row>

            <div class="pt-2 d-sm-flex justify-content-end">
              <el-form-item>
                <el-button type="primary" @click="submitForm(registrationFormRef)">Next</el-button>
                <!-- <el-button @click="resetForm(registrationFormRef)">Reset</el-button> -->
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