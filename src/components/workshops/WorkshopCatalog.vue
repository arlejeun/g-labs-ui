<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { useWorkshopStore } from '@/stores/workshop';

const store = useUserStore()
const { localization } = storeToRefs(store)

const wStore = useWorkshopStore()
const { workshops } = storeToRefs(wStore)


const availableWorkshops = computed(() => {
	if (localization.value.length > 0 && localization.value != 'en-US') {
		return workshops.value?.rows?.filter(ws => ws?.localizations?.some(loc => loc.locale == localization.value))
	}
	else {
		return workshops.value?.rows
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
