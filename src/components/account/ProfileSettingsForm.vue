<script setup lang="ts">

import type { FormInstance } from 'element-plus'
import { useUserStore } from '@/stores/user'
import type { IDriveUser, IDriveUserSettings } from '@/interfaces';

const userStore = useUserStore()
const { localization } = storeToRefs(userStore)
const { updateUserProfile } = userStore

const props = defineProps<{
  user: IDriveUser,
  admin?: boolean
}>()

const { user: myUser, admin } = toRefs(props)
const user = ref({} as IDriveUser)
const settings = ref({} as IDriveUserSettings)

watchEffect(() => {
  if (admin && admin.value) {
    user.value = { ...myUser.value }
    if (myUser.value?.settings) {
      settings.value = {...myUser.value.settings}
    }
  } else {
    user.value = myUser.value
    if (myUser.value?.settings) {
    settings.value = myUser.value.settings
    settings.value.locale = localization.value
  }
  }
 
})

const settingsFormRef = ref<FormInstance>()

//TODO: Check country code matches with phone number
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      //userStore.updatePersonalProfile(user)
      //updateCountryUser()
      //user.value.settings = {...settings.value}
      updateUserProfile(user.value)
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

      <div class="card mb-4 border">
        <!-- Card header -->
        <div class="card-header">
          <h5 class="card-header-title">Account Settings</h5>
        </div>

        <!-- Card body START -->
        <div class="card-body">
          <!-- Form START -->

          <el-form ref="settingsFormRef" :model="settings" size="" label-position="left" class="demo-ruleForm">

            <el-row v-if="!admin" :gutter="20">
              <el-col :span="24">
                <el-form-item label-width="80%" label="Preferred language">
                  <el-select v-model="localization" class="nav flex-row" filterable placeholder="Select Language">
                    <el-option label="English" value="en-US"></el-option>
                    <el-option label="Spanish" value="es-ES"></el-option>
                    <el-option label="Portuguese" value="pt-PT"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row v-if="admin" :gutter="20">
              <el-col :span="24">
                <el-form-item label-width="80%" label="Preferred language">
                  <el-select v-model="settings.locale" class="nav flex-row" filterable placeholder="Select Language">
                    <el-option label="English" value="en-US"></el-option>
                    <el-option label="Spanish" value="es-ES"></el-option>
                    <el-option label="Portuguese" value="pt-PT"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
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
            </el-row>

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