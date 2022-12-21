<script setup lang="ts">
import type { IDriveOrg } from '@/interfaces'
import type { FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()  
const  { isAdmin } = storeToRefs(userStore)

const props = defineProps<{ org: IDriveOrg, active: boolean }>()

const showSettings = ref(false)

function toggleSettings() {
  showSettings.value = !showSettings.value 
}


</script>

<template>

  <div class="card border mb-4">
    <div class="card-header bg-light-soft d-md-flex justify-content-md-between align-items-center">
      <div class="d-flex align-items-center">
        <div class="icon-sm rounded-circle flex-shrink-0" :class="[active ? 'bg-success' : 'bg-light']">
        </div>
        <div class="ms-2">
          <h6 class="card-title mb-0">{{ props.org.name }} ({{ props.org.region }})</h6>
          <ul class="nav nav-divider small">
            <li class="nav-item">{{ props.org.org_uuid }}</li>
          </ul>
        </div>
      </div>

      <div class="mt-2 mt-md-0">
        <div @click="toggleSettings" class="btn btn-light mb-0 me-2">Settings</div>
        <div @click="toggleSettings" class="btn btn-danger-soft mb-0">Deprovision</div>
      </div>
    </div>

    <AccountOrganizationSettingsForm v-if="showSettings" :settings="org.org_user_settings"></AccountOrganizationSettingsForm>

  </div>


</template>

<style>
img.preview {
  max-height: 100px;
  float: right;
}
</style>
