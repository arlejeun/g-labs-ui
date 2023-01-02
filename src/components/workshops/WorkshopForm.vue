<script setup lang="ts">
import type { IWorkshop } from '@/interfaces/workshop';
import { useUserStore } from '@/stores/user';
import { useWorkshopStore } from '@/stores/workshop';
import type { FormInstance } from 'element-plus/es/components/form';
import type { FormRules } from 'element-plus/es/tokens/form';

const userStore = useUserStore()
const { user, isAdmin } = storeToRefs(userStore)
const { updateUserProfile } = userStore

const wStore = useWorkshopStore()
const { workshopMeta } = storeToRefs(wStore)
const { addWorkshop, editWorkshop } = wStore

const formSize = ref('')
const workshopFormRef = ref<FormInstance>()
const workshopRules = reactive<FormRules>({
  title: [
    { required: true, message: 'Please input workshop title', trigger: 'blur' },
    { min: 2, max: 30, message: 'Length should be 2 to 30', trigger: 'blur' },
  ],
  name: [
    { required: true, message: 'Please input github repo name', trigger: 'blur' },
    { min: 2, max: 30, message: 'Length should be 2 to 30', trigger: 'blur' },
  ],

  gh_owner: [
    { required: true, message: 'Please input github repo owner', trigger: 'blur' },
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
  image_filename: [
    { required: true, message: 'Please input image filename', trigger: 'blur' },
    { min: 2, max: 30, message: 'Length should be 2 to 30', trigger: 'blur' },
  ]
  
})

//TODO: Check country code matches with phone number
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      // //userStore.updatePersonalProfile(user)
      // updateCountryUser()
      // updateUserProfile()
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

const tagsLoV = computed(() => {
  return [{ id: 1, label: 'AI', name: 'AI' }]
})

const permissionsLoV = computed(() => {
  return [{ id: 1, label: 'Public Demos', name: 'Public Demos' }]
})

const form = ref({} as IWorkshop)

const selects = ref({
  platform: [
    { value: "pcn", label: "PureCloudNow" },
    { value: "pea", label: "Multicloud Azure" },
    { value: "pec", label: "Multicloud AWS" },
    { value: "custom", label: "Dev Org" }
  ],
})

    // getSourceThumbnail() {
    //   if (this.form.image) {
    //     return `${process.env.demos_api_base_url}/api/gdemo-assets/${this.form.image}`;
    //   } else {
    //     return "";
    //   }
    // },

    // isValidForSubmission() {
    //   return (
    //     !!this.form.title &&
    //     !!this.form.description &&
    //     !!this.form.workshop_url
    //   );
    // },


</script>

<template>
  <section>
    <div class="container-fluid mt--6">
      <div class="row">
        <div class="col-12">
          <div class="card-wrapper">
            <card>

              <div class="card-body">
                <!-- Form START -->

                <h5 class="pb-3">Workshop Information</h5>

                <el-form ref="workshopFormRef" :model="form" :rules="workshopRules" label-width="120px"
                  label-position="top" class="demo-ruleForm" status-icon>
                  <el-row :gutter="20">
                    <el-col :xs="24" :span="12">
                      <el-form-item label="Workshop Title" prop="title">
                        <el-input v-model="form.title" />
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :span="12">
                      <el-form-item label="Workshop Name" prop="name">
                        <el-input v-model="form.name" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :xs="24" :span="12">
                      <el-form-item label="Level" prop="level">
                        <el-input v-model="form.level" />
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :span="12">
                      <el-form-item label="Duration" prop="duration">
                        <el-input v-model="form.duration" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                 
                  <el-row :gutter="20">
                    <el-col :xs="24" :span="12">
                      <el-form-item label="Description" prop="desc">
                        <el-input v-model="form.description" />
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :span="12">
                      <!-- <el-form-item label="Phone Number" prop="phone_number">
                        <el-input v-model="form" />
                      </el-form-item> -->
                    </el-col>
                  </el-row>

                  <div class="pt-2 d-sm-flex justify-content-end">
                    <el-form-item>
                      <el-button type="primary" @click="submitForm(workshopFormRef)">Save changes</el-button>
                      <el-button @click="resetForm(workshopFormRef)">Reset</el-button>
                    </el-form-item>
                  </div>

                </el-form>

                <!-- Form END -->

                <el-divider></el-divider>

                <h5 class="pb-3">Account Settings</h5>


              </div>


              <!-- <form>
                <div class="row">
                  <div class="col-md-3">
                    <h3 class="text-default">Title</h3>
                    <el-input placeholder="Demo Title" v-model="form.title">
                    </el-input>
                  </div>

                  <div class="col-md-6">
                    <h3 class="text-default">Workshop URL</h3>
                    <el-input
                      placeholder="Workshop url"
                      prefix-icon="fas fa-globe"
                      v-model="form.workshop_url"
                    >
                    </el-input>
                  </div>

                  <div class="col-md-1">
                    <h3 class="text-default">Level</h3>
                    <el-input placeholder="Level" v-model="form.level">
                    </el-input>
                  </div>

                  <div class="col-md-2">
                    <h3 class="text-default">Duration</h3>
                    <el-input
                      placeholder="Duration"
                      prefix-icon="far fa-hourglass"
                      v-model="form.duration"
                    >
                    </el-input>
                  </div>
                </div>

                <div class="row mt-4">
                  <div class="col-md-4">
                    <h3 class="text-default">Supported Platforms</h3>
                    <base-input>
                      <el-select
                        v-model="form.platforms"
                        multiple
                        filterable
                        placeholder="Platforms"
                      >
                        <el-option
                          v-for="option in selects.platform"
                          :key="option.label"
                          :label="option.label"
                          :value="option.value"
                        ></el-option>
                      </el-select>
                    </base-input>
                  </div>

                  <div class="col-md-4">
                    <h3 class="text-default">Categories</h3>
                    <base-input>
                      <el-select
                        v-model="form.categories"
                        multiple
                        filterable
                        placeholder="Business Goals"
                      >
                        <el-option
                          v-for="option in getBusinessTagOptions"
                          :key="option.label"
                          :label="option.label"
                          :value="option.name"
                        ></el-option>
                      </el-select>
                    </base-input>
                  </div>

                  <div class="col-md-4">
                    <h3 class="text-default">Technical Tags</h3>
                    <base-input>
                      <el-select
                        v-model="form.tags"
                        multiple
                        filterable
                        placeholder="Technical Tags"
                      >
                        <el-option
                          v-for="option in getTechnicalTagOptions"
                          :key="option.label"
                          :label="option.label"
                          :value="option.name"
                        ></el-option>
                      </el-select>
                    </base-input>
                  </div>
                </div>

                <div class="row">
                  <div class="col-12 col-md-6 col-lg-2">
                    <h3 class="text-default">Thumbnail</h3>
                    <div class="row inline-block">
                      <div v-show="getSourceThumbnail.length > 0" class="mb-2">
                        <el-avatar
                          shape="square"
                          :size="180"
                          fit="contain"
                          :src="getSourceThumbnail"
                        ></el-avatar>

                      </div>
                      <div v-show="getSourceThumbnail.length > 0" class="ml-1">
                        <el-button
                          @click="removeThumbnail()"
                          type="danger"
                          icon="el-icon-delete"
                          circle
                        ></el-button>
                      </div>
                      <div
                        v-show="!(getSourceThumbnail.length > 0)"
                        class="toto ml-3"
                      >
                        <dropzone-file-upload
                          v-model="hardCodedValue"
                          v-on:uploaded="succesUpload"
                          v-on:error="errorUpload"
                        ></dropzone-file-upload>
                      </div>
                    </div>
                  </div>
                  <div class="col-12 col-md-8 col-lg-10">
                    <base-input>
                      <h3 class="text-default">Description</h3>
                      <textarea
                        v-model="form.description"
                        class="form-control"
                        id="descriptionTextArea"
                        rows="8"
                      ></textarea>
                    </base-input>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-9">
                    <div class="card-wrapper">
                      <h3 slot="header">Availability</h3>

                      <div class="row">
                        <div class="col-12">
                          <div class="card-wrapper">
                            <h3 slot="header" class="text-default mt-2 mb-3">
                              Restrictions
                            </h3>
                            <div class="row">
                              <div class="col-4 col-sm-4 col-md-2 col-xl-1">
                                <base-input label="Public">
                                  <base-switch
                                    class="mr-1"
                                    v-model="form.is_public"
                                    type="default"
                                  ></base-switch>
                                </base-input>
                              </div>

                              <div class="col-4 col-sm-4 col-md-2 col-xl-1">
                                <base-input label="Internal">
                                  <base-switch
                                    class="mr-1"
                                    v-model="form.is_internal"
                                    type="default"
                                  ></base-switch>
                                </base-input>
                              </div>

                              <div class="col-4 col-sm-4 col-md-2 col-xl-1">
                                <base-input disabled label="Partners">
                                  <base-switch
                                    class="mr-1"
                                    v-model="form.is_partners"
                                    type="default"
                                  ></base-switch>
                                </base-input>
                              </div>

                              <div class="col-4 col-sm-4 col-md-2 col-xl-1">
                                <base-input label="Specific">
                                  <base-switch
                                    class="mr-1"
                                    v-model="form.is_specific"
                                    type="default"
                                  ></base-switch>
                                </base-input>
                              </div>

                              <div
                                v-show="form.is_specific"
                                class="col-12 col-md-4"
                              >
                                <base-input
                                  label="Available to these group members"
                                >
                                  <el-select
                                    v-model="form.permissions_groups"
                                    multiple
                                    filterable
                                    placeholder="Select specific group"
                                  >
                                    <el-option
                                      v-for="option in getPermissionGroupOptions"
                                      :key="option.label"
                                      :label="option.label"
                                      :value="option.name"
                                    ></el-option>
                                  </el-select>
                                </base-input>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form> -->
            </card>
          </div>
        </div>
      </div>

      <!-- Demo Sections -->
    </div>

    <div class="mt-1 mr-6 col-12 mb-6 align-self-end">

    </div>
  </section>
</template>

