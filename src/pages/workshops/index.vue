<script setup lang="ts">
import { useWorkspaceStore } from '@/stores/workspace';
import { getParameterByName } from '@/utils/string'
import { useRouteHash } from '@vueuse/router';


const workspaceStore = useWorkspaceStore()
const { gsysCloudClient } = storeToRefs(workspaceStore)
const { refreshEnvironment } = workspaceStore
const routeHash = useRouteHash()


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
	// race condition - move to CatalogFilter component
	// if (!tagsLoV.value?.records) {
	// 	fetchTags({ page: 1, pageSize: 200 });
	// }
})


</script>

<template>

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
