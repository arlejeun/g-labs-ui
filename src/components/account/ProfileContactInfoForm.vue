<script setup lang="ts">

import type { FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { useOptionsStore } from '@/stores/options'
import type { IDriveUser } from '@/interfaces';

const userStore = useUserStore()
const { updateUserContactInfoProfile } = userStore

const props = withDefaults(
  defineProps<{
    user: IDriveUser,
    admin: boolean
  }>(),
  {
    admin: false,
  },
);

const { user: myUser, admin } = toRefs(props)
const userForm = ref({} as IDriveUser)
const countryStore = useOptionsStore()
const { countries } = storeToRefs(countryStore)
const { fetchCountries, selectCountry } = countryStore

watchEffect(() => {
  if (myUser.value?.email) {
    if (countries && countries.value?.length == 0) {
      fetchCountries()
    }
    if (admin && admin.value) {
      //lose reactivty when coming from users admin page form
      userForm.value = { ...myUser.value }
      console.log(userForm.value)
    } else {
      //keep user reactivty of the profile of me user
      userForm.value = myUser.value
      //userForm.value = { ...myUser.value }
      console.log(userForm.value)
    }
  }
})

//Initialize countries only at the beginning
const personalFormRef = ref<FormInstance>()
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
      updateUserContactInfoProfile(userForm.value)
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
      <div class="card border">
        <!-- Card header -->
        <div class="card-header border-bottom">
          <h4 class="card-header-title">User Profile</h4>
        </div>

        <!-- Card body START -->
        <div class="card-body">
          <!-- Form START -->

          <h5 class="pb-3">Contact Information</h5>

          <el-form ref="personalFormRef" :model="userForm" :rules="personalRules" label-width="120px"
            label-position="top" class="demo-ruleForm" status-icon>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="First Name" prop="first_name">
                  <el-input v-model="userForm.first_name" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Last Name" prop="last_name">
                  <el-input v-model="userForm.last_name" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="Job Function" prop="job">
                  <el-input v-model="userForm.job_function" />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="Company" prop="company">
                  <el-input v-model="userForm.company" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="Relation with Genesys" prop="type">
                  <el-select v-model="userForm.type" filterable :disabled="!admin">
                    <el-option label="Prospect" value="Prospect"></el-option>
                    <el-option label="Partner" value="Partner"></el-option>
                    <el-option label="Customer" value="Customer"></el-option>
                    <el-option label="Employee" value="Internal"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="Country" prop="country_id">
                  <el-select v-model="userForm.country_id" filterable placeholder="Select Country">
                    <el-option v-for="item in countries" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                  <!-- <el-input v-model="user.country" /> -->
                </el-form-item>
              </el-col>
            </el-row>

            <el-row v-show="userForm.type!='Internal'" :gutter="20">
              <el-col :span="12">
                <el-form-item label="Genesys Contact Name" prop="gen_contact_name">
                  <el-input v-model="userForm.gen_contact_name" />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="Genesys Contact Email" prop="gen_contact_email">
                  <el-input v-model="userForm.gen_contact_email" />
                </el-form-item>
              </el-col>
              
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="Email" prop="email">
                  <el-input v-model="userForm.email" :disabled="!admin"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Phone Number" prop="phone_number">
                  <el-input v-model="userForm.phone_number" />
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


        </div>

      </div>

    </div>

  </div>
</template>


<style scoped>
.demo-progress .el-progress--line {
  margin-bottom: 15px;
}
</style>