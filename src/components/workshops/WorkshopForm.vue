<script setup lang="ts">
import type { IWorkshop, IWorkshopLocalizationForm, IWorkshopForm } from '@/interfaces/workshop';
import { useAdminStore } from '@/stores/admin.js';
import { useUserStore } from '@/stores/user';
import { useWorkshopStore } from '@/stores/workshop';
import type { FormInstance } from 'element-plus/es/components/form';
import type { FormRules } from 'element-plus/es/tokens/form';
import type { PropType } from 'vue';

const props = defineProps({
  editMode: {
    type: Boolean,
    required: true
  },
  workshop: {
    type: Object as PropType<IWorkshop>,
  }
})

const userStore = useUserStore()
const { user, isAdmin } = storeToRefs(userStore)
const { updateUserProfile } = userStore

const adminStore = useAdminStore()
const { tags: tagsLoV, businessTags: bizTagsLoV, technicalTags: techTagsLoV, userGroups: userGroupsLoV } = storeToRefs(adminStore)
const { fetchTags, fetchUserGroups } = adminStore

const wStore = useWorkshopStore()
const { workshopMeta } = storeToRefs(wStore)
const { addWorkshop, editWorkshop } = wStore

const formSize = ref('')
const localizationArrayForm = ref([] as IWorkshopLocalizationForm[])
const workshopFormRef = ref<FormInstance>()
const workshopRules = reactive<FormRules>({
  title: [
    { required: true, message: 'Please input workshop title', trigger: 'blur' },
    { min: 2, max: 50, message: 'Length should be 2 to 50', trigger: 'blur' },
  ],
  name: [
    { required: true, message: 'Please input github repo name', trigger: 'blur' },
    { min: 2, max: 50, message: 'Length should be 2 to 50', trigger: 'blur' },
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

const permissionsLoV = computed(() => {
  return [{ id: 1, label: 'Public Demos', name: 'Public Demos' }]
})

const form = ref({} as IWorkshopForm)

const selects = ref({
  platform: [
    { value: "pcn", label: "PureCloudNow" },
    { value: "custom", label: "Dev Orgs" },
    { value: "managed", label: "Managed Orgs" }
  ],
})

watch(props, () => {
  console.log('New props')
  if(props?.workshop) {
    form.value = {...props.workshop}
    form.value.bizTags = [...form.value?.tags?.filter(t => t.category == 'Business')]?.map(x => x.id)
    form.value.techTags = [...form.value?.tags?.filter(t => t.category == 'Technical')]?.map(x => x.id)
    form.value.groups = [...form.value?.user_groups]?.map(x => x.id)
    localizationArrayForm.value = props.workshop?.ws_localized
  }
})

onMounted(() => {
    fetchTags({ page: 1, pageSize:200 });
    fetchUserGroups({ page: 1, pageSize:200 })
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
  <!-- <section class="pt-0"> -->
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card-wrapper">

              <div class="card-body">
                <!-- Form START -->

                <h5 class="pb-3">Workshop Information</h5>

                <el-form ref="workshopFormRef" :model="form" :rules="workshopRules" label-width="120px"
                  label-position="top" class="demo-ruleForm" status-icon>
                  <el-row :gutter="20">
                    <el-col :xs="24" :span="24">
                      <el-form-item label="Workshop Title" prop="title">
                        <el-input v-model="form.title" />
                      </el-form-item>
                    </el-col>  
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :xs="24" :span="12">
                      <el-form-item label="Workshop Name" prop="name">
                        <el-input v-model="form.name" />
                      </el-form-item>
                    </el-col>
                    <el-col :xs="18" :span="6">
                      <el-form-item label="Level" prop="level">
                        <el-input v-model="form.level" />
                      </el-form-item>
                    </el-col>
                    <el-col :xs="6" :span="6">
                      <el-form-item label="Duration" prop="duration">
                        <el-input v-model="form.duration" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                 
                  <el-row :gutter="20">
                    <el-col :xs="24" :span="24">
                      <el-form-item label="Description" prop="desc">
                        <el-input :rows="3" type="textarea" v-model="form.description" />
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row :gutter="20">
                    <el-col :xs="24" :span="24">
                      
                      <el-form-item class="ws-100" label="Supported platforms" prop="platforms">
                        <el-select class="w-100"
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
                      </el-form-item>
                    </el-col>

                    
                    </el-row>
                    <el-row>
                    <el-col :xs="24" :span="24">
                      <el-form-item label="Categories">
                        <el-select class="w-100"
                        v-model="form.bizTags"
                        multiple
                        filterable
                        placeholder="Business Goals"
                      >
                        <el-option
                          v-for="option in bizTagsLoV"
                          :key="option.id"
                          :label="option.label"
                          :value="option.id"
                        ></el-option>
                      </el-select>
                      </el-form-item>
                    </el-col>

                  </el-row>

                  <el-row>
                    <el-col :xs="24" :span="24">
                      <el-form-item label="Tags">
                        <el-select class="w-100"
                        v-model="form.techTags"
                        multiple
                        filterable
                        placeholder="Technical Tags"
                      >
                        <el-option
                          v-for="option in techTagsLoV"
                          :key="option.id"
                          :label="option.label"
                          :value="option.id"
                        ></el-option>
                      </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-divider></el-divider>

                    <h5 class="pb-3">Workshop Publication</h5>

                    <el-row :gutter="20">
                      <el-col :xs="24" :span="24">
                        <el-form-item label="Workshop URL" prop="workshop_url">
                          <el-input v-model="form.workshop_url" />
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row :gutter="20">
                      <el-col :xs="18" :span="18">
                        <el-form-item label="User Groups" prop="user_groups">
                          <el-select class="w-100"
                        v-model="form.groups"
                        multiple
                        filterable
                        placeholder="User Groups"
                      >
                        <el-option
                          v-for="option in userGroupsLoV.rows"
                          :key="option.id"
                          :label="option.name"
                          :value="option.id"
                        ></el-option>
                      </el-select>                        
                    </el-form-item>
                      </el-col>
                      <el-col :xs="6" :span="6">
                        <el-form-item label="Active">
                          <el-switch v-model="form.active" />
                        </el-form-item>
                        </el-col>
                    </el-row>

                    <el-divider></el-divider>

                    <div v-for="loc in form.ws_localized" :key="loc.id">
                      <el-row :gutter="20">
                      <el-col :xs="18" :span="18">
                        <el-form-item label="localization">
                          <el-select class="w-100"
                        v-model="loc.locale"
                        placeholder="Localization"
                      >
                        <el-option value="es-ES" label="es-ES"></el-option>
                        <el-option value="fr-FR" label="fr-FR"></el-option>
                        <el-option value="pt-BR" label="pt-BR"></el-option>
                        </el-select>

                        </el-form-item>
                      </el-col>
                        <el-col :xs="6" :span="6">
                        <el-form-item label="Active">
                          <el-switch v-model="loc.active" />
                        </el-form-item>
                        </el-col>
                      <el-col :xs="24" :span="24">
                        <el-form-item label="title">
                          <el-input v-model="loc.title" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                    <el-col :xs="24" :span="24">
                      <el-form-item label="Description" prop="desc">
                        <el-input :rows="3" type="textarea" v-model="loc.description" />
                      </el-form-item>
                    </el-col>
                  </el-row>

                    <el-divider></el-divider>

                    </div>
                    




                  
                  <!-- <el-row>
                    <el-col :xs="24" :span="24">
                      <el-form-item label="Tags" prop="tags">
                        <el-select class="w-100"
                        v-model="form.tags"
                        multiple
                        filterable
                        placeholder="Technical Tags"
                      >
                        <el-option
                          v-for="option in tags.rows"
                          :key="option.id"
                          :label="option.label"
                          :value="option.id"
                        ></el-option>
                      </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row> -->

                  <div class="pt-2 d-sm-flex justify-content-end">
                    <el-form-item>
                      <el-button @click="resetForm(workshopFormRef)">Reset</el-button>
                      <el-button type="primary" @click="submitForm(workshopFormRef)">Save changes</el-button>
                    </el-form-item>
                  </div>

                </el-form>

                <!-- Form END -->


              </div>


              <!-- <form>
                

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
          </div>
        </div>
      </div>

      <!-- Demo Sections -->
    </div>

    <div class="mt-1 mr-6 col-12 mb-6 align-self-end">

    </div>
  <!-- </section> -->
</template>

