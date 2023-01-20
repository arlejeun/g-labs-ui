<script setup lang="ts">
import type { GCUserInfo, IDriveOrg, IDriveUser, GCDeleteUser } from '@/interfaces'
import { useUserStore } from '@/stores/user'
import type { FormInstance } from 'element-plus/es/components/form';
import type { FormRules } from 'element-plus/es/tokens/form';
import { getPureCloudSkill1, getPureCloudSkill2, regionOptions, partnerRegionOptions } from '@/utils/gc';
import { ElMessage, ElMessageBox } from 'element-plus'


const userStore = useUserStore()
const { provisionGCUser, deprovisionGCUser } = userStore

const props = defineProps<{ org: IDriveOrg, assigned: boolean, user: IDriveUser }>()

const provisionForm = ref({} as GCUserInfo)
const deprovisionForm = ref({} as GCDeleteUser)
const showSettings = ref(false)
const dialogDivisionFormVisible = ref(false)

const isActive = computed(() => {
  return props.org?.status == 'Active'
})
const inProgress = computed(() => {
  return props.org?.status == 'InProgress'
})

const registrationFormRef = ref<FormInstance>()
const registrationRules = reactive<FormRules>({
  region: [
    { required: true, message: 'Please select the GC division matching with your location', trigger: 'blur' },
    { min: 2, max: 30, message: 'Length should be 2 to 30', trigger: 'blur' },
  ]
})

const toggleSettings = () => {
  showSettings.value = !showSettings.value
}

const deprovisionOrg = () => {
     deprovision(() => {
        generateDeprovisioningPayload();
        deprovisionGCUser(deprovisionForm.value)
        // ElMessage({
        //   type: 'success',
        //   message: 'Delete completed',
        // })
     })  // 
}

const deprovision = (callback: CallableFunction) => {
  ElMessageBox.prompt(
    'Your user will be permanently deleted from the GC organization. Type deprovision to proceed forward',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
      distinguishCancelAndClose: true,
      inputErrorMessage: 'Type deprovision',
      center: true,
    }
  )
    .then((result) => {
      if (result?.value?.toLowerCase() !== 'deprovision') {
        throw new Error('cancel')
      }
     
      callback()
      // ElMessage({
      //   type: 'success',
      //   message: 'Delete completed',
      // })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled',
      })
    })
}


const generateProvisioningPayload = (region: string) => {
  provisionForm.value = {
    org_name: props.org.name,
    region: region,
    email: props.user.email,
    username: props.user.username,
    name: `${props.user.first_name} ${props.user.last_name}`,
    //phoneNumber: myRegistrationUser.value.phone_number,
    skills: [getPureCloudSkill1(props.user.last_name), getPureCloudSkill2()],
    //country: myRegistrationUser.value?.customer?.country,
    title: props.user.job_function,
    state: 'active'
  }
}

const generateDeprovisioningPayload = () => {
  deprovisionForm.value = {
    org_name: props.org.name,
    email: props.user.email,
    username: props.user.username,
  }
}


const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      generateProvisioningPayload(provisionForm.value.region)
      provisionGCUser(provisionForm.value)
      dialogDivisionFormVisible.value = false
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}


</script>

<template>

  <div class="card border mt-1 mb-2">
    <div class="card-header bg-light-soft d-md-flex justify-content-md-between align-items-center">
      <div class="d-flex align-items-center">
        <div class="icon-sm rounded-circle flex-shrink-0"
          :class="{ 'bg-success': isActive && assigned, 'bg-warning': inProgress && assigned, 'bg-light': !assigned }">
        </div>
        <div class="ms-2 me-1">
          <h6 class="card-title mb-0">{{ props.org.name }}<span class="ms-2">
              <p style="display:inline">(region: {{ props.org.region }})</p>
            </span></h6>
          <ul class="nav nav-divider small">
            <li class="nav-item">{{ props.org.description }}</li>
          </ul>
        </div>
      </div>

      <div class="mt-2 ms-2 mt-md-0">
        <el-button v-if="!inProgress && !isActive" @click="dialogDivisionFormVisible = true"
          type="primary">Provision</el-button>
        <el-button v-if="isActive || inProgress" @click="toggleSettings" bg text type="primary">Settings</el-button>
        <!-- <el-button v-if="isActive" @click="deprovision" bg text type="danger">Deprovision</el-button> -->
        <el-button @click="deprovisionOrg" bg text type="danger">Deprovision</el-button>

        <!-- <el-popconfirm
          width="220"
          confirm-button-text="OK"
          cancel-button-text="No, Thanks"
          icon-color="#626AEF"
          title="Are you sure to delete this?"
        >
          <template #reference>
            <el-button @click="deprovision" bg text type="danger">Deprovision</el-button>
          </template>
        </el-popconfirm> -->

        <!-- <div @click="toggleSettings" class="btn btn-light mb-0 me-2">Settings</div>
        <div @click="toggleSettings" class="btn btn-danger-soft mb-0">Deprovision</div> -->
      </div>
    </div>

    <div v-if="showSettings">
      <AccountOrganizationSettingsForm :org="props.org" :user="props.user"></AccountOrganizationSettingsForm>
    </div>


  </div>

  <el-dialog v-model="dialogDivisionFormVisible" title="Specify GC Division">
    <div>
      <el-alert class="mb-2" title="Select the Division based on your current location" type="info" show-icon />
      <el-form ref="registrationFormRef" :model="provisionForm" :rules="registrationRules" label-width="120px"
        label-position="top" class="demo-ruleForm" status-icon>

        <el-row :gutter="20">
          <el-col v-if="user.status == 'Internal'" :xs="24" :span="12">
            <el-form-item label="Region" prop="region">
              <el-select v-model="provisionForm.region">
                <el-option v-for="item in regionOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="user.status != 'Internal'" :xs="24" :span="12">
            <el-form-item label="Region" prop="region">
              <el-select v-model="provisionForm.region">
                <el-option v-for="item in partnerRegionOptions" :key="item.value" :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>

    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click.prevent="submitForm(registrationFormRef)">Provision</el-button>
      </span>
    </template>
  </el-dialog>



</template>

<style>
img.preview {
  max-height: 100px;
  float: right;
}
</style>
