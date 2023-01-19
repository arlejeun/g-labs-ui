<script setup lang="ts">

import type { FormInstance, FormRules, ElProgress } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { useCountryStore } from '@/stores/country'
import type { IDriveUser, IDriveUserDTO } from '@/interfaces';

const props = defineProps(['account'])
const myUser = ref(props.account)

const userStore = useUserStore()
const { registrationUser: myRegistrationUser, isMobile} = storeToRefs(userStore)
const { activateUserProvisioning } = userStore

const provisionForm = ref({})
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
      const storedUserId = localStorage.getItem('registration_uid')
      let storedUid = -1
      if ( typeof storedUserId == 'string') {
        storedUid = parseInt(storedUserId)
      }
      const uid = myRegistrationUser.value.user_id || storedUid 
      //userStore.updatePersonalProfile(user)
      activateUserProvisioning(uid)
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
                description="The last step of the registration provision your account with a demo organization"
                show-icon />

                <el-alert title="Provision user with Genesys Demo organization" type="info"
              description="Your customer information is required to be identified and personalize your experience with Genesys Cloud"
              show-icon close-text="Gotcha" />


                <el-form ref="registrationFormRef" :model="provisionForm" :rules="registrationRules" label-width="120px" label-position="top"
            class="demo-ruleForm" status-icon>
            <!-- <el-row :gutter="20">
              <el-col :xs="24" :span="12">
                <el-form-item label="Customer First Name" prop="first_name">
                  <el-input v-model="customerForm.first_name" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :span="12">
                <el-form-item label="Customer Last Name" prop="last_name">
                  <el-input v-model="customerForm.last_name" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :xs="24" :gutter="20">
              <el-col :span="18">
                <el-form-item label="Address" prop="address">
                  <el-input v-model="customerForm.address" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :span="6">
                <el-form-item label="Country" prop="country">
                  <el-input v-model="customerForm.country" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :xs="24" :span="8">
                <el-form-item label="City" prop="city">
                  <el-input v-model="customerForm.city" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :span="8">
                <el-form-item label="State" prop="state">
                  <el-input v-model="customerForm.state" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :span="8">
                <el-form-item label="Zipcode" prop="zipcode">
                  <el-input v-model="customerForm.zip" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-divider></el-divider>

            <el-row :gutter="20">
              <el-col>
                <h4 class="card-header-title text-primary mt-2 pb-2">Emails
                  <el-button @click.prevent="addEmail" type="primary" :text="true">
                    <i class="text-primary bi bi-plus-circle"></i>
                  </el-button>
                </h4>
              </el-col>
            </el-row>

            <el-row v-if="customerEmails" :gutter="20">

              <el-col v-for="(email, index) in customerForm.emails" :key="index" :xs="24" :span="12">
                <el-form-item :label="email.name" :prop="'emails.' + index + '.value'" :rules="rules.email">
                  <el-input v-model="email.value">
                    <template #append>
                      <el-button @click.prevent="removeIdentifier(email, index)" :icon="Delete" />
                    </template>
                  </el-input>
                </el-form-item>

              </el-col>
            </el-row>

            <el-divider></el-divider>

            <el-row :xs="24" :gutter="20">
              <el-col>
                <h4 class="card-header-title text-primary mt-2 pb-2">Phones
                  <el-button @click.prevent="addPhoneNumber" type="primary" :text="true">
                    <i class="text-primary bi bi-plus-circle"></i>
                  </el-button>
                </h4>
              </el-col>
            </el-row>

            <el-row v-if="customerPhones" :gutter="20">

              <el-col v-for="(phone, index) in customerForm.phones" :key="index" :xs="24" :span="12">
                <el-form-item :label="phone.name" :prop="'phones.' + index + '.value'" :rules="rules.phone">
                  <el-input v-model="phone.value">
                    <template #append>
                      <el-button @click.prevent="removeIdentifier(phone, index)" :icon="Delete" />
                    </template>
                  </el-input>
                </el-form-item>

              </el-col>
            </el-row> -->


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