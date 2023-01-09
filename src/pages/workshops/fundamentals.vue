<script setup lang="ts">
import { useWorkshopStore } from '@/stores/workshop'
import { useWorkspaceStore } from '@/stores/workspace';
import { getParameterByName } from '@/utils/string'
import { useRouteHash } from '@vueuse/router';
import { useUserStore } from '@/stores/user';
import { useAdminStore } from '@/stores/admin';

const userStore = useUserStore()

const workspaceStore = useWorkspaceStore()
const { gsysCloudClient } = storeToRefs(workspaceStore)
const { refreshEnvironment } = workspaceStore
const routeHash = useRouteHash()

const adminStore = useAdminStore()
const { tags: tagsLoV, businessTags: bizTagsLoV, technicalTags: techTagsLoV, userGroups: userGroupsLoV } = storeToRefs(adminStore)
const { fetchTags } = adminStore


watchEffect(async () => {
	//Environments
	//Token parameters must be read from the the oauth client redirects uri
	if (routeHash.value.includes('access_token')) {
		gsysCloudClient.value.access_token = getParameterByName('access_token')
		routeHash.value = ''
		refreshEnvironment()
	}
})


onMounted(() => {
	if (!tagsLoV.value?.records) {
		fetchTags({ page: 1, pageSize: 200 });
	}
})


</script>

<template>

<!-- <p>Loading: {{ isLoading.toString() }}</p>
  <p>Finished: {{ isFinished.toString() }}</p>
  <p>Error: {{ error?.toString() }}</p> -->

	<WorkshopCatalogFilter/>	
	<WorkshopCatalog />
	<WorkshopPagination />

	</template>

<style scoped lang="scss">

</style>

<route lang="yaml">
meta:
  layout: BasicTopNavigationLayout
  requiresAuth: true
</route>
