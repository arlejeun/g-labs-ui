<script setup lang="ts">
import { useWorkshopStore } from '@/stores/workshop'
import { useWorkspaceStore } from '@/stores/workspace';
import { getParameterByName } from '@/utils/string'
import { useRouteHash } from '@vueuse/router';
import { useUserStore } from '@/stores/user';
import type { IWorkshopForm } from '@/interfaces/workshop';

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const wStore = useWorkshopStore()
const { workshops, workshopMeta } = storeToRefs(wStore)
//const { loadWorkshops } = wStore 

const store = useUserStore()
const { isMobile } = storeToRefs(store)

const drawerSize = ref('45%')
drawerSize.value = isMobile.value ? '85%':'45%'


watchEffect(async () => {

})

const form = ref({} as IWorkshopForm)




</script>

<template>

	<section class="pt-0 pb-4">
		<div class="container position-relative">
			<div class="row">
				<h3 class="fs-3 text-primary mt-4">Add Workshop</h3>
			</div>
			<WorkshopForm :workshop="workshopMeta" :editMode="false"></WorkshopForm>
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
