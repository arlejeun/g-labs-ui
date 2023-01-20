<script setup lang="ts">

import type { FormInstance } from 'element-plus'
import { useUserStore } from '@/stores/user'
import type { IDriveUser } from '@/interfaces';
import { useAdminStore } from '@/stores/admin';

const userstore = useUserStore()
const { isAdmin, isMobile } = storeToRefs(userstore)
const { updateUserGroupsProfile } = userstore

const adminStore = useAdminStore()
const { userGroups: userGroupsLoV } = storeToRefs(adminStore)
const { fetchUserGroups } = adminStore

const props = defineProps<{
  user: IDriveUser,
  admin?: boolean
}>()

const { user: myUser, admin } = toRefs(props)
const user = ref({} as IDriveUser)
const formGroups = ref()
const lov = computed(() => {
  return userGroupsLoV.value.rows
})

onMounted(() => {
  if (!userGroupsLoV.value?.records ) {
  fetchUserGroups({ page: 1, pageSize: 200 })
  //formGroups.value = user.value?.groups?.map(x => x.id) || []
}
})

watchEffect(() => {
  if(myUser.value?.email) {
    if (admin && admin.value) {
    //lose reactivty when coming from users admin page form
    user.value = { ...myUser.value }
  } else {
    //keep user reactivty of the profile of me user
    user.value = myUser.value
  }
  //
    formGroups.value = user.value?.groups?.map(x => x.id) || []
  }
})

const statusOptions = [
  { value: '', label: 'Unknown' },
  { value: 0, label: 'NeedsApproval' },
  { value: 10, label: 'AwaitingConfirmation' },
  { value: 30, label: 'Rejected' },
  { value: 40, label: 'Disabled' },
  { value: 50, label: 'Active' }
]

const typeOptions = [
  { value: 1, label: 'Unknown' },
  { value: 2, label: 'Internal' },
  { value: 3, label: 'Partner' },
  { value: 4, label: 'Customer' },
  { value: 5, label: 'Prospect' },
]
const restrictedFormRef = ref<FormInstance>()


//TODO: Check country code matches with phone number
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log(user.value)
      console.log(formGroups.value)
      updateUserGroupsProfile(user.value, formGroups.value)
//      const userGroupDTO = {id: id, status: status, type: type, groups: {'connect': formGroups.value?.map((x: number) => { return {'id': x}})}

    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const filterMethod = (query:any, item:any) => {
  return item.name.toLowerCase().includes(query.toLowerCase())
}

</script>

<template>
  <!--- Profile Form -->

  <div class="row">
    <div class="col">

      <!-- Personal info START -->
      <div class="card border">
        <!-- Card header -->
        <div class="card-header">
          <h5 class="card-header-title">Administration</h5>
        </div>

        <!-- Card body START -->
        <div class="card-body">
          <!-- Form START -->

          <el-form ref="restrictedFormRef" :model="user" label-width="120px" label-position="top"
            class="card-body" status-icon>
            
            <el-row :gutter="20">
              <el-col v-if="admin" :span="6">
                <el-form-item label="Status" prop="status">
                  <el-select v-model="user.status" class="" placeholder="Status">
                    <el-option v-for="(status, id) in statusOptions" :key="id" :label="status.label"
                      :value="status.label" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="User Profile" prop="type">
                  <el-select :disabled="!admin" v-model="user.type" class="" placeholder="Type">
                    <el-option v-for="item1 in typeOptions" :key="item1.value" :label="item1.label" :value="item1.label" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-row :gutter="20" class="my-3">
              <el-col :span="24">
                <el-form-item label="Current Access Groups">
              <el-tag v-for="item in user.groups" :key="item.id" class="m-2" type="info">{{ item.name }}</el-tag>
            </el-form-item>
            </el-col>
            </el-row>
            
            <el-row v-if="isAdmin" :gutter="20" class="mt-2 mb-2 w-100">
                <el-transfer
                    class="user-groups"
                    filterable
                    :filter-method="filterMethod"
                    :titles="['Unassigned Groups', 'Assigned Groups']"
                    :props="{
                        key: 'id',
                        label: 'name'
                    }"
                    :data="lov"
                    v-model="formGroups"

                  />
            </el-row>

          
            <div class="pt-2 d-sm-flex justify-content-end">
              <el-form-item>
                <el-button type="primary" @click="submitForm(restrictedFormRef)">Save</el-button>
                <el-button @click="resetForm(restrictedFormRef)">Reset</el-button>
              </el-form-item>
            </div>


          </el-form>

          <!-- Form END -->
        </div>
        <!-- Card body END -->


      </div>
      <!-- Personal info END -->

    </div>
  </div>


</template>


<style>
.demo-progress .el-progress--line {
  margin-bottom: 15px;
}
.user-groups .el-transfer-panel {
  width: 300px;
}
</style>