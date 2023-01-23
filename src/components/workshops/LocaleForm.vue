<script setup lang="ts">
import type { IWorkshop, IWorkshopLocalizationForm, IWorkshopForm, IWorkshopSettings } from '@/interfaces/workshop';
import { useAdminStore } from '@/stores/admin.js';
import { useUserStore } from '@/stores/user';
import { useWorkshopStore } from '@/stores/workshop';
import type { FormInstance } from 'element-plus/es/components/form';
import type { FormRules } from 'element-plus/es/tokens/form';
import type { PropType, Ref } from 'vue';
import { ArrowDownBold, ArrowLeftBold, Plus, Remove } from '@element-plus/icons-vue'

const props = defineProps({
  workshop: {
    type: Object as PropType<IWorkshop>,
  },
  id: {
    type: Number
  }
})


const userStore = useUserStore()
const { user, isAdmin } = storeToRefs(userStore)

const wStore = useWorkshopStore()
const { editWorkshopLocale, addWorkshopLocale } = wStore

const showLocaleSection = ref(true)
const toggleLocaleSection = () => {
  showLocaleSection.value = !showLocaleSection.value
}

const localeFormRef = ref<FormInstance>()
const localeRules = reactive<FormRules>({
  locale: [
    { required: true, message: 'Please input locale', trigger: 'blur' },
    { min: 2, max: 6, message: 'Length should be 2 to 6', trigger: 'blur' },
  ],
  title: [
    { required: true, message: 'Please input title to display', trigger: 'blur' },
    { min: 2, max: 100, message: 'Length should be 2 to 100', trigger: 'blur' },
  ],

  description: [
    { required: true, message: 'Please input description', trigger: 'blur' },
    { min: 2, max: 256, message: 'Length should be 2 to 256', trigger: 'blur' },
  ],

})

const editMode = computed(() => (props.workshop?.id && props.workshop?.id > 0) ? true : false)
const localesForm = ref({} as IWorkshop)

const addLocaleForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid && props.id) {
      addWorkshopLocale(props.id, localesForm.value)
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}

const editLocaleForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
     editWorkshopLocale(localesForm.value)
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}


watchEffect(() => {
  if (props.workshop) {
    if (props.workshop) {
      localesForm.value = {...props.workshop}
    }
  }
})


onMounted(() => {

})


</script>

<template>

    <div class="">
          <el-form ref="localeFormRef" :model="localesForm" :rules="localeRules" label-width="120px"
            label-position="top" class="" status-icon>
            <el-row :gutter="20">
              <el-col :xs="24" :span="24">
                <el-form-item label="title">
                  <el-input v-model="localesForm.title" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :xs="24" :span="24">
                <el-form-item label="Description" prop="desc">
                  <el-input :rows="3" type="textarea" v-model="localesForm.description" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :xs="12" :span="6">
                <el-form-item label="is Provisioned">
                  <el-switch v-model="localesForm.isProvisioned" />
                 </el-form-item>
                </el-col>
                <el-col :xs="12" :span="6">
                <el-form-item class="ms-2" label="is Published">
                  <el-switch v-model="localesForm.isPublished" />
                </el-form-item>
               </el-col>
            </el-row>
            
             
           

            <div class="pt-2 d-sm-flex justify-content-end">
              <el-form-item>
                <el-button type="primary" v-show="!editMode" @click="addLocaleForm(localeFormRef)">Add</el-button>
                <el-button type="primary" v-show="editMode" @click="editLocaleForm(localeFormRef)">Save
                  changes</el-button>
              </el-form-item>
            </div>

          </el-form>



    </div>

  <!-- </section> -->
</template>

<style>
.border-less {
  border: 0
}
</style>

