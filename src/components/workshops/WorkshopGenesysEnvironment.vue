<script setup lang="ts">
import { useWorkspaceStore } from '@/stores/workspace';
import { useUserStore } from '@/stores/user';
import {
	MagicStick,
	CircleCheck
} from '@element-plus/icons-vue'

const store = useUserStore()
const { isMobile } = storeToRefs(store)

const drawerSize = ref('45%')
drawerSize.value = isMobile.value ? '85%' : '45%'
const connectCloudPanel = ref(false)


const workspaceStore = useWorkspaceStore()
const { isTokenActive, gsysCloudClient } = storeToRefs(workspaceStore)

const connectToCloud = () => {
	connectCloudPanel.value = true
}

const launchGenesysCloud = () => {
	window.open(`${gsysCloudClient.value.login_url}`, '_blank', 'noreferrer');
}

</script>

<template>

  <div v-show="!isTokenActive" class="row justify-content-end ms-4 ps-4 g-3">
    <el-button type="warning" @click.prevent="connectToCloud" text bg>{{ $t('workshops.connectButton') }}</el-button>
  </div>
  <div v-show="isTokenActive" class="row justify-content-end ms-4 ps-4 g-3">
    <el-button type="success" @click.prevent="connectToCloud" text bg>{{ $t('workshops.checkButton') }}
      <CircleCheck style="width: 1em; height: 1em;margin-left: 8px; margin-right: 8px" />
    </el-button>
    <el-button type="primary" @click.prevent="launchGenesysCloud" text bg>{{ $t('workshops.launchButton') }}
      <MagicStick style="width: 1em; height: 1em;margin-left: 8px; margin-right: 8px" />
    </el-button>
  </div>


  <el-drawer v-model="connectCloudPanel" title="Active Organization" direction="rtl" :size="drawerSize">
		<ConnectOrganization></ConnectOrganization>
	</el-drawer>

</template>

<style>

</style>
