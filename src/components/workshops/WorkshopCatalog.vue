<script setup lang="ts">
import type { WsQueryDTO } from '@/interfaces/workshop';
import { useUserStore } from '@/stores/user';
import { useWorkshopStore } from '@/stores/workshop';

const store = useUserStore()
const { userEmail, localization } = storeToRefs(store)

const wStore = useWorkshopStore()
const { workshops, workshopsQuery, workshopsCriteria } = storeToRefs(wStore)
const { loadWorkshops } = wStore

const myWorkshopQuery = ref ({} as WsQueryDTO)

const criteriaTags = computed(() => {
	return workshopsCriteria.value?.tags || []
})

const criteriaCategories = computed(() => {
	return workshopsCriteria.value?.categories || []
})

const convertFilterCriteria = (): WsQueryDTO => {
	return {
		tags: [...criteriaCategories.value, ...criteriaTags.value],
		searchString: workshopsCriteria.value?.searchString,
		levels: workshopsCriteria.value?.levels,
		environments: workshopsCriteria.value?.environments,
		showAll: workshopsCriteria.value?.showAll,
		page: workshopsQuery.value.page,
		pageSize: workshopsQuery.value.pageSize,
	} as WsQueryDTO
}

const availableWorkshops = computed(() => {
	return workshops.value?.rows?.filter(ws => ws.locale == localization.value)	|| []
})

watchEffect(() => {
	if (userEmail.value) {
		myWorkshopQuery.value = convertFilterCriteria()
		loadWorkshops(myWorkshopQuery.value)
	} else {
		console.log('Waiting for user authentication - Catalog')
	}
})

</script>

<template>

	<section class="pt-0 pb-2">
		<div class="container">
			<div class="row g-4">
				<template v-for="item in availableWorkshops">
					<WorkshopCard :workshop="item"></WorkshopCard>
				</template>
			</div>
		</div>

	</section>


</template>

<style>

</style>
