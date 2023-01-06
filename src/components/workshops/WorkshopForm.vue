<script setup lang="ts">
import type { IWorkshop, IWorkshopLocalizationForm, IWorkshopForm } from '@/interfaces/workshop';
import { useAdminStore } from '@/stores/admin.js';
import { useUserStore } from '@/stores/user';
import { useWorkshopStore } from '@/stores/workshop';
import type { FormInstance } from 'element-plus/es/components/form';
import type { FormRules } from 'element-plus/es/tokens/form';
import type { PropType, Ref } from 'vue';
import { ArrowDownBold, ArrowLeftBold, Plus, Remove } from '@element-plus/icons-vue'

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

const adminStore = useAdminStore()
const { tags: tagsLoV, businessTags: bizTagsLoV, technicalTags: techTagsLoV, userGroups: userGroupsLoV } = storeToRefs(adminStore)
const { fetchTags, fetchUserGroups } = adminStore

const wStore = useWorkshopStore()
const { workshopMeta } = storeToRefs(wStore)
const { addWorkshop, updateWorkshop } = wStore

const showInfoSection = ref(true)
const showPublishSection = ref(false)
const toggleInfoSection = () => {
  showInfoSection.value = !showInfoSection.value
}
const togglePublishSection = () => {
  showPublishSection.value = !showPublishSection.value
}


const localizationsLoV = ['es-ES', 'fr-FR', 'pt-BR']
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

  owner: [
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
    { min: 2, max: 50, message: 'Length should be 2 to 30', trigger: 'blur' },
  ]

})

const addForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      addWorkshop(form.value)
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      updateWorkshop(form.value)
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}

//TODO: Create endpoint to fetch the list of environment
const environments = reactive([
  {
    id: 1,
    name: 'purecloudnow',
  },
  {
    id: 2,
    name: '3rd party org',
  },
]);

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const addLocalization = (formEl: FormInstance | undefined) => {
  if (!formEl && formLocalizations.value.length > 0) return
  form.value.localizations.push({locale: formLocalizations.value[0], title: '', description: '', active: false})
}

const removeLocalization = (loc: string) => {
  form.value.localizations.splice(form.value.localizations.findIndex(x => x.locale == loc), 1)
}

const form = ref({} as IWorkshopForm)
const formLocalizations = computed(() => { return filterAvailableLocales(form.value?.localizations)})
const localizationsCount = computed(() => form.value?.localizations?.length)

const filterAvailableLocales = (currentLocs: IWorkshopLocalizationForm[]) => {
  const currentLocales = currentLocs?.map((loc) =>  {return loc.locale})
  return localizationsLoV.filter(x => !currentLocales?.includes(x));
}

watchEffect(() => {
  if (props.workshop) {
    form.value = { bizTags: [], techTags: [], groups: [], envs:[], ...props.workshop };
    form.value.techTags = form.value?.tags?.filter(t => t.category == 'Technical')?.map(x => x.id) || [];
    form.value.bizTags = form.value?.tags?.filter(t => t.category == 'Business')?.map(x => x.id) || [];
    form.value.groups = form.value?.user_groups?.map(x => x.id) || [];
    form.value.envs =  form.value?.environments?.map(x => x.id) || [];
    form.value.localizations =  form.value?.localizations || []
  }
})

// watch(props.workshop, (newVal, _oldVal) => {
//   console.log('New props ' + JSON.stringify(newVal))
//   if(props?.workshop) {
//     console.log('New props ' + JSON.stringify(newVal))

//    // form.value = Object.assign({} as IWorkshopForm, {...props.workshop})
//     // form.value.bizTags = [...form.value?.tags?.filter(t => t.category == 'Business')]?.map(x => x.id)
//     // form.value.techTags = [...form.value?.tags?.filter(t => t.category == 'Technical')]?.map(x => x.id)
//     // form.value.groups = [...form.value?.user_groups]?.map(x => x.id)
//     // form.value.localizations = [...form.value?.localizations]
//   }
// })

onMounted(() => {
  fetchTags({ page: 1, pageSize: 200 });
  fetchUserGroups({ page: 1, pageSize: 200 })
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


            <el-form ref="workshopFormRef" :model="form" :rules="workshopRules" label-width="120px" label-position="top"
              class="demo-ruleForm" status-icon>

              <div class="row justify-content-between pb-3 px-0">
                <div class="col">
                  <h5 class="">Workshop Information</h5>
                </div>
                <div class="col-2">
                  <el-button-group>
                    <el-button v-show="showInfoSection" @click="toggleInfoSection()" size="small"><el-icon>
                        <ArrowDownBold />
                      </el-icon></el-button>
                    <el-button v-show="!showInfoSection" @click="toggleInfoSection()" size="small"><el-icon>
                        <ArrowLeftBold />
                      </el-icon></el-button>
                  </el-button-group>

                </div>
              </div>

              <div v-show="showInfoSection">


                <el-row :gutter="20">
                  <el-col :xs="24" :span="24">
                    <el-form-item label="Workshop Title" prop="title">
                      <el-input v-model="form.title" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :xs="24" :span="12">
                    <el-form-item label="Workshop Owner" prop="owner">
                      <el-input v-model="form.owner" />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :span="12">
                    <el-form-item label="Workshop Name" prop="name">
                      <el-input v-model="form.name" />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="18" :span="12">
                    <el-form-item label="Level" prop="level">
                      <el-input v-model="form.level" />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="6" :span="12">
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
                      <el-select class="w-100" v-model="form.envs" multiple filterable placeholder="Platforms">
                        <el-option v-for="option in environments" :key="option.id" :label="option.name"
                          :value="option.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="20">
                  <el-col :xs="18" :span="18">
                    <el-form-item label="User Groups">
                      <el-select class="w-100" v-model="form.groups" multiple filterable placeholder="User Groups">
                        <el-option v-for="option in userGroupsLoV.rows" :key="option.id" :label="option.name"
                          :value="option.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="6" :span="6">
                    <el-form-item label="Active">
                      <el-switch v-model="form.active" />
                    </el-form-item>
                  </el-col>
                </el-row>


                <el-row>
                  <el-col :xs="24" :span="24">
                    <el-form-item label="Categories">
                      <el-select class="w-100" v-model="form.bizTags" multiple filterable placeholder="Business Goals">
                        <el-option v-for="option in bizTagsLoV" :key="option.id" :label="option.label"
                          :value="option.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>

                </el-row>

                <el-row>
                  <el-col :xs="24" :span="24">
                    <el-form-item label="Tags">
                      <el-select class="w-100" v-model="form.techTags" multiple filterable placeholder="Technical Tags">
                        <el-option v-for="option in techTagsLoV" :key="option.id" :label="option.label"
                          :value="option.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>

              </div>

              <el-divider></el-divider>

              <div class="row justify-content-between pb-3 px-0">
                <div class="col">
                  <h5 class="">Workshop Publication</h5>
                </div>
                <div class="col-2">
                  <el-button-group>
                    <el-button v-show="showPublishSection" @click="togglePublishSection()" size="small"><el-icon>
                        <ArrowDownBold />
                      </el-icon></el-button>
                    <el-button v-show="!showPublishSection" @click="togglePublishSection()" size="small"><el-icon>
                        <ArrowLeftBold />
                      </el-icon></el-button>
                  </el-button-group>

                </div>
              </div>

              <div v-show="showPublishSection">

                <el-row :gutter="20">
                  <el-col :xs="24" :span="24">
                    <el-form-item label="Workshop URL" prop="workshop_url">
                      <el-input v-model="form.workshop_url" />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="20">
                  <el-col :xs="24" :span="24">
                    <el-form-item label="Image filename" prop="image_filename">
                      <el-input v-model="form.image_filename" />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-divider v-show="localizationsCount > 0"></el-divider>

                <div class="pt-2 d-sm-flex justify-content-end">
                  <el-form-item>
                    <el-button text type="primary" @click="addLocalization(workshopFormRef)">Add localization</el-button>
                  </el-form-item>
                </div>

                <div v-for="loc in form.localizations" :key="loc.id">
                  <div class="py-0 d-sm-flex justify-content-end">
                    <el-button class="border-less" size="" :icon="Remove" @click="removeLocalization(loc.locale)"></el-button>
                </div>
                  <el-row :gutter="20">
                    <el-col :xs="18" :span="18">
                      <el-form-item label="localization">
                        <el-select class="w-100" v-model="loc.locale" placeholder="Localization">
                        <el-option v-for="option in formLocalizations" :key="option" :label="option"
                          :value="option"></el-option>
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

                </div>
              </div>

              <el-divider></el-divider>


              <div class="pt-2 d-sm-flex justify-content-end">
                <el-form-item>
                  <el-button @click="resetForm(workshopFormRef)">Reset</el-button>
                  <el-button type="primary" v-show="editMode" @click="addForm(workshopFormRef)">Add</el-button>
                  <el-button type="primary" v-show="!editMode" @click="submitForm(workshopFormRef)">Save changes</el-button>
                </el-form-item>
              </div>

            </el-form>

            <!-- Form END -->


          </div>

        </div>
      </div>
    </div>

    <!-- Demo Sections -->
  </div>

  <div class="mt-1 mr-6 col-12 mb-6 align-self-end">

  </div>
  <!-- </section> -->
</template>

<style>
.border-less {
  border: 0
}
</style>

