<script setup lang="ts">
import { useWorkshopStore } from '@/stores/workshop'
import { useWorkspaceStore } from '@/stores/workspace';
import { getParameterByName } from '@/utils/string'
import { useRouteHash } from '@vueuse/router';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const workspaceStore = useWorkspaceStore()
const { isTokenActive, gsysCloudClient } = storeToRefs(workspaceStore)
const { refreshEnvironment } = workspaceStore
const routeHash = useRouteHash()

const wStore = useWorkshopStore()
const { workshops } = storeToRefs(wStore)
const { loadWorkshops } = wStore 

const form = ref()

const formatter = 'YYYY-MM-DD HH:mm:ss:SSS'
const formatted = useDateFormat(useNow(), formatter)
const store = useUserStore()
const { isMobile } = storeToRefs(store)

const drawerSize = ref('45%')
drawerSize.value = isMobile.value ? '85%':'45%'


watchEffect(async () => {

})




</script>

<template>

	<section class="pt-0 pb-4">
		<div class="container position-relative">
			<div class="row">
				<div class="col">
					<h3 class="fs-3 text-primary mt-4">Edit Workshop</h3>
				</div>
			</div>

		</div>
	</section>

</template>

<style scoped lang="scss">

</style>

<route lang="yaml">
meta:
  layout: BasicTopNavigationLayout
  requiresAuth: true
</route>
