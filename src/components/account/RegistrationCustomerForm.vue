<script setup lang="ts">

import type { FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '@/stores/user'
import type { ICustomerRegistrationForm, IDriveCustomer, IDriveCustomerDTO, IDriveCustomerForm, IDriveIdentifier, IDriveUser } from '@/interfaces';
import { Delete } from '@element-plus/icons-vue'
import { generateCustomerPayload } from '@/utils/axios';


const userStore = useUserStore()
const { isMobile } = storeToRefs(userStore)
const { createCustomerProfile } = userStore

const props = defineProps<{
  user: IDriveUser,
}>();

const { user: myRegistrationUser } = toRefs(props)

const user = ref({} as IDriveUser)

const identifiersForm = ref( {"identifiers": [
    {
      "name": "Work Phone",
      "type": "Voice",
      "value": myRegistrationUser.value.phone_number
    },
    {
      "name": "Work Email",
      "type": "Email",
      "value": myRegistrationUser.value.email
    }
  ]})

const customerDTO = ref({
  "first_name": myRegistrationUser.value.first_name,
  "last_name": myRegistrationUser.value.last_name,
  "address": "6975 Union Park Ave",
  "city": "Daly City",
  "state": "CA",
  "zip": "94014",
  "country": "United States",
  "identifiers": []
} as IDriveCustomer)


// const { width } = useWindowSize()
// const isMobile = computed(() => width.value < 750)
const dialogWidth = computed(() => isMobile.value ? '90%' : '30%')
const customerFormRef = ref<FormInstance>()

const emailDialogFormVisible = ref(false)
const phoneDialogFormVisible = ref(false)

const customerPhones = computed(() => customerDTO?.value?.identifiers?.filter(x => x.type == 'Voice'))
const customerEmails = computed(() => customerDTO?.value?.identifiers?.filter(x => x.type == 'Email'))

const hasWorkEmail = computed(() => customerEmails?.value?.filter(x => x.name == 'Work Email')?.length > 0)
const hasPersonalEmail = computed(() => customerEmails?.value?.filter(x => x.name == 'Personal Email')?.length > 0)
const hasOtherEmail = computed(() => customerEmails?.value?.filter(x => x.name == 'Other Email')?.length > 0)

const hasWorkPhone = computed(() => customerPhones?.value?.filter(x => x.name == 'Work Phone')?.length > 0)
const hasMobilePhone = computed(() => customerPhones?.value?.filter(x => x.name == 'Mobile Phone')?.length > 0)
const hasHomePhone = computed(() => customerPhones?.value?.filter(x => x.name == 'Home Phone')?.length > 0)

const customerForm = ref({} as ICustomerRegistrationForm)

const rules = reactive<FormRules>({
  first_name: [
    { required: true, message: 'Please enter first name', trigger: 'blur' },
    { min: 2, max: 30, message: 'Length should be 2 to 30', trigger: 'blur' },
  ],
  last_name: [
    { required: true, message: 'Please enter first name', trigger: 'blur' },
    { min: 2, max: 30, message: 'Length should be 2 to 30', trigger: 'blur' },
  ],
  country: [
    {
      required: true,
      message: 'Please enter Country',
      trigger: 'change',
    }
  ],
  phone: [
    {
      required: true,
      message: 'Please enter Phone number e.164 format',
      trigger: 'change',
      pattern: /^\+[1-9]\d{1,14}$/
    },
  ],
  email: [
    {
      type: 'string',
      required: true,
      pattern:
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: 'Please enter email address',
      trigger: 'change',
    },
    { min: 3, message: 'Please enter email', trigger: 'blur' },
  ]


})

watchEffect(() => {
  
  if (myRegistrationUser?.value?.email) {
    user.value = myRegistrationUser.value
    customerDTO.value.first_name = user.value.first_name,
    customerDTO.value.last_name = user.value.last_name,
    customerDTO.value.identifiers = [...identifiersForm.value.identifiers]
  }
  customerForm.value = { ...customerDTO.value, emails: customerEmails.value, phones: customerPhones.value }
}
)

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      const { emails, phones, messengers, ...customerFormDTO } = customerForm.value
      const storedUserId = localStorage.getItem('registration_uid')
      let storedUid = -1
      if (typeof storedUserId == 'string') {
        storedUid = parseInt(storedUserId)
      }
      const uid = myRegistrationUser.value?.user_id || storedUid
      const customerPayload = { user_id: uid, ...generateCustomerPayload(customerFormDTO) }
      createCustomerProfile(uid as number, customerPayload)
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const addPhoneNumber = () => {
  phoneDialogFormVisible.value = true
}

const addEmail = () => {
  emailDialogFormVisible.value = true
}

const phoneDialogForm = reactive({
  name: '',
  value: '',
  type: 'Voice'
})

const emailDialogForm = reactive({
  name: '',
  value: '',
  type: 'Email'
})

const emailTypeOptions = reactive([
  {
    value: '1',
    label: 'Work Email',
    disabled: hasWorkEmail

  },
  {
    value: '2',
    label: 'Personal Email',
    disabled: hasPersonalEmail
  },
  {
    value: '3',
    label: 'Other Email',
    disabled: hasOtherEmail
  }
])

const phoneTypeOptions = reactive([
  {
    value: '1',
    label: 'Work Phone',
    disabled: hasWorkPhone
  },
  {
    value: '2',
    label: 'Mobile Phone',
    disabled: hasMobilePhone
  },
  {
    value: '3',
    label: 'Home Phone',
    disabled: hasHomePhone
  }
])


const addPhoneSubmit = () => {
  phoneTypeOptions.filter(opt => opt.label == phoneDialogForm.name)
  identifiersForm.value?.identifiers.push({ ...phoneDialogForm })
  phoneDialogFormVisible.value = false
}

const addEmailSubmit = () => {
  emailTypeOptions.filter(opt => opt.label == emailDialogForm.name)
  identifiersForm.value?.identifiers.push({ ...emailDialogForm })
  emailDialogFormVisible.value = false
}

const formLabelWidth = '100px'

const removeIdentifier = ((identifier: IDriveIdentifier, idx: number) => {
  if (identifier.type == 'Email' && customerEmails.value.length > 1) {
    identifiersForm.value.identifiers = identifiersForm.value.identifiers.filter((ident) => ident.name != identifier.name)
  }
  if (identifier.type == 'Voice' && customerPhones.value.length > 1) {
    identifiersForm.value.identifiers = identifiersForm.value.identifiers.filter((ident) => ident.name != identifier.name)
  }
})

</script>

<template>

  <div class="row">

    <div class="vstack gap-4">


      <el-alert title="Customer Record" type="info"
        description="Your customer information is required to be identified and personalize your experience with the Genesys Cloud demos organization. Within Drive, many of the demonstrations use a 'Demonstration Customer' to give the demo a realistic interaction. Below you can set the contact information, email, and social media of that 'Demonstration Customer'. Note that this customer info is just used within Drive and should not be reflective of real customers."
        show-icon close-text="Gotcha" />

      <!-- Personal info START -->
      <div class="card border">
        <!-- Card header -->
        <div class="card-header border-bottom">
          <h4 class="card-header-title text-primary">Customer Information</h4>
        </div>

        <!-- Card body START -->
        <div class="card-body">

          <el-form ref="customerFormRef" :model="customerForm" :rules="rules" label-width="120px" label-position="top"
            class="demo-ruleForm" status-icon>
            <el-row :gutter="20">
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
                      <el-button :disabled="customerEmails.length < 2" @click.prevent="removeIdentifier(email, index)"
                        :icon="Delete" />
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
                      <el-button :disabled="customerPhones.length < 2" @click.prevent="removeIdentifier(phone, index)"
                        :icon="Delete" />
                    </template>
                  </el-input>
                </el-form-item>

              </el-col>
            </el-row>


            <el-divider></el-divider>

            <div class="pt-2 d-sm-flex justify-content-end">
              <el-form-item>
                <el-button type="primary" @click.prevent="submitForm(customerFormRef)">Register</el-button>
                <el-button @click="resetForm(customerFormRef)">Reset</el-button>
              </el-form-item>
            </div>


          </el-form>

        </div>
        <!-- Card body END -->
      </div>
      <!-- Personal info END -->


    </div>
  </div>

  <el-dialog v-model="emailDialogFormVisible" :width="dialogWidth" title="Add Email">
    <el-form :model="emailDialogForm">
      <el-form-item label="Type" :label-width="formLabelWidth">
        <el-select v-model="emailDialogForm.name" placeholder="Select Type">
          <el-option v-for="item in emailTypeOptions" :key="item.value" :label="item.label" :value="item.label"
            :disabled="item.disabled" />
        </el-select>
      </el-form-item>
      <el-form-item label="Email" :label-width="formLabelWidth">
        <el-input v-model="emailDialogForm.value" autocomplete="off" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="emailDialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="addEmailSubmit">
          Confirm
        </el-button>
      </span>
    </template>

  </el-dialog>

  <el-dialog v-model="phoneDialogFormVisible" :width="dialogWidth" title="Add Phone Number">
    <el-form :model="phoneDialogForm">
      <el-form-item label="Type" :label-width="formLabelWidth">
        <el-select v-model="phoneDialogForm.name" placeholder="Select Type">
          <el-option v-for="item in phoneTypeOptions" :key="item.value" :label="item.label" :value="item.label"
            :disabled="item.disabled" />
        </el-select>
      </el-form-item>
      <el-form-item label="Phone #" :label-width="formLabelWidth">
        <el-input v-model="phoneDialogForm.value" autocomplete="off" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="phoneDialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="addPhoneSubmit">
          Confirm
        </el-button>
      </span>
    </template>

  </el-dialog>


</template>

<style>

</style>
