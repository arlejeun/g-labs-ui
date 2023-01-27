<script setup lang="ts">

import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { useOptionsStore } from '@/stores/options'
import type { IJiraForm } from '@/interfaces';
import { notify } from '@kyvg/vue3-notification';
import { handleAxiosError } from '@/utils/axios';
import { JiraMiddlewareApiClient } from '@/apis/glabs';
import { useAxios } from '@vueuse/integrations/useAxios';


const userStore = useUserStore()
const { userEmail, userType, issuesInProgress, showIssueForm } = storeToRefs(userStore)
const { fetchIssues } = userStore


const jiraForm = ref({} as IJiraForm)
const optionsStore = useOptionsStore()
const { jiraFields } = storeToRefs(optionsStore)
const { fetchJiraOptions } = optionsStore

const fedPlatform = ref('' as string)
const fedProduct = ref('')
const fedBusiness = ref('')
const feedbackResponse = ref()
const formLoading = ref(false)

const getPlatforms = computed(() => Object.keys(jiraFields.value?.products || []))
const getRegions = computed(() => jiraFields.value?.regions || [])
const getProducts = computed(() => {
  const products = jiraFields.value?.products || {}
  return (!products[fedPlatform.value] || products[fedPlatform.value].length == 0) ? ['Others'] : products[fedPlatform.value]
})

const feedbackPayload = () => {
  let payload = { ...jiraForm.value }
  let mapUserType = {
    "Internal": "Genesys Employee",
    "Partner": "Genesys Partner",
    "Unknown": "Other",
    "Customer": "Other",
    "Prospect": "Other"
  }

  let
    relationship = mapUserType[userType.value],
    demoScriptURL = location.href

  switch (jiraForm.value.requestType) {

    case "Gdemo Issue":
      payload.relationship = relationship
      payload.region = jiraForm.value.region
      payload.platform = fedPlatform.value
      payload.product = fedProduct.value
      payload.business = fedBusiness.value
      break;
    case "Documentation Feedback":
      payload.relationship = relationship
      payload.region = jiraForm.value.region
      payload.demoScript = demoScriptURL
      break;
    case "Request a Feature":
      payload.relationship = relationship
      payload.region = jiraForm.value.region
      break;
    case "PureConnectNow Access":
      payload.relationship = relationship
      payload.region = jiraForm.value.region
      payload.reason = fedBusiness.value
      delete payload.description
      break;
    default:
      break;
  }
  payload.customer = userEmail.value
  return payload
}


const sendFeedbackRequest = async () => {
  const jiraUrl = ref(`/issue`)
  const { execute } = useAxios(JiraMiddlewareApiClient)
  issuesInProgress.value = true
  const result = await execute(jiraUrl.value, { method: "POST", data: feedbackPayload() });
  if (result.isFinished.value) {
    feedbackResponse.value = result.data.value
    ElMessage(`Your Feedback was submitted - ${feedbackResponse.value.issueKey}`)

  }
  if (result.error.value) {
    notify({
      title: 'Jira API',
      text: `${handleAxiosError(
        result.error.value,
        "Impossible to retrieve the list of your service requests at the moment."
      )}`,
      duration: -1,
      type: "error",
    });
  }
  fetchIssues(userEmail.value)
  showIssueForm.value = false
}

watchEffect(() => {
  fetchJiraOptions()
})

//Initialize countries only at the beginning
const jiraFormRef = ref<FormInstance>()
const jiraRules = reactive<FormRules>({
  title: [
    { required: true, message: 'Please enter summary', trigger: 'blur' },
    { min: 2, max: 200, message: 'Length should be 2 to 200', trigger: 'blur' },
  ],
  requestType: [
    { required: true, message: 'Please select type', trigger: 'blur' },
    { min: 2, max: 100, message: 'Pick best choice', trigger: 'blur' },
  ],
  region: [
    { required: true, message: 'Please select type', trigger: 'blur' },
    { min: 2, max: 100, message: 'Pick best choice', trigger: 'blur' },
  ],
})

//TODO: Check country code matches with phone number
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      sendFeedbackRequest()
      console.log(feedbackPayload())
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
      <div class="card">

        <!-- Card body START -->
        <div class="card-body">
          <!-- Form START -->

          <h5 class="pb-3">Details</h5>

          <el-form ref="jiraFormRef" :model="jiraForm" :rules="jiraRules" label-position="top" class="demo-ruleForm"
            status-icon>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="Summary" prop="title">
                  <el-input v-model="jiraForm.title" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="Type" prop="requestType">
                  <el-select v-model="jiraForm.requestType" placeholder="Select type of feedback" style="width:100%">
                    <el-option label="Gdemo Issue" value="Gdemo Issue"></el-option>
                    <el-option label="Documentation Feedback" value="Documentation Feedback"></el-option>
                    <el-option label="Request a Feature" value="Request a Feature"></el-option>
                    <el-option label="PureConnectNow Access" value="PureConnectNow Access"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="Region" prop="region">
                  <el-select v-model="jiraForm.region" placeholder="Select region" style="width:100%">
                    <el-option v-for="item in getRegions" :label="item" :value="item" :key="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">

              <el-col :span="12">
                <el-form-item v-if="jiraForm.requestType === 'Gdemo Issue'" label="Platform">
                  <el-select v-model="fedPlatform" placeholder="Select platform" style="width:100%">
                    <el-option v-for="item in getPlatforms" :label="item" :value="item" :key="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item v-if="jiraForm.requestType === 'Gdemo Issue'" label="Product">
                  <el-select v-model="fedProduct" placeholder="Select product" style="width:100%">
                    <el-option v-for="item in getProducts" :label="item" :value="item" :key="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item v-if="jiraForm.requestType != 'Documentation Feedback'"
                  :label="jiraForm.requestType === 'PureConnectNow Access' ? 'Reason' : 'Business Impact'">
                  <el-input type="textarea" v-model="fedBusiness" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="jiraForm.requestType == 'Documentation Feedback'" label="Description">
                  <el-input type="textarea" v-model="jiraForm.description" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item v-if="jiraForm.requestType !== 'PureConnectNow Access' && jiraForm.requestType != 'Documentation Feedback'" label="Description">
                  <el-input type="textarea" v-model="jiraForm.description" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>


            </el-row>


            <div class="pt-2 d-sm-flex justify-content-end">
              <el-form-item>
                <el-button type="primary" @click="submitForm(jiraFormRef)" :loading="formLoading">{{
                  formLoading?
                                  'Submitting ...':
                    'Submit'
                }}</el-button>
                <el-button @click="resetForm(jiraFormRef)">Reset</el-button>
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