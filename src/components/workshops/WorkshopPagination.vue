<script setup lang="ts">
import type { WsFilter, WsFilterClient, WsQueryDTO } from '@/interfaces/workshop';
import { useUserStore } from '@/stores/user';
import {
	Search, Menu, Plus, List, Filter
} from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus/es/components/form';
import type { FormRules } from 'element-plus/es/tokens/form';
import router from '@/router';
import { useWorkshopStore } from '@/stores/workshop';

const store = useUserStore()
const { isMobile } = storeToRefs(store)

const wStore = useWorkshopStore()
const { workshops, workshopsQuery } = storeToRefs(wStore)

/** Pagination */
const handleSizeChange = (val: number) => {
	workshopsQuery.value = {...workshopsQuery.value, pageSize: val}
}
const handleCurrentChange = (val: number) => {
	workshopsQuery.value = {...workshopsQuery.value, page: val}
}

const currentPage = ref(workshopsQuery.value?.page || 1)
const pageSize = ref(workshopsQuery.value?.pageSize || 25)
const small = ref(false)
const disabled = ref(false)
const background = ref(true)

const availableWorkshopsCount = computed(() => {
	return workshops.value?.records || 0
})

</script>

<template>

	<section class="pt-1 mt-1">
	<div class="row">
		<div class="col-12">
			<nav class="mt-4 d-flex justify-content-center" aria-label="navigation">
				<el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
					:page-sizes="[5, 10, 25, 50]" :small="small" :disabled="disabled" :background="background"
					layout="total, sizes, prev, pager, next, jumper" :total="availableWorkshopsCount"
					@size-change="handleSizeChange" @current-change="handleCurrentChange" />
			</nav>
		</div>
	</div>
	</section>

</template>

<style>

</style>
