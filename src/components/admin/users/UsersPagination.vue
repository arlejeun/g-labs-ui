<script setup lang="ts">
import { useAdminStore } from '@/stores/admin';

const adminStore = useAdminStore()
const { users, usersQuery } = storeToRefs(adminStore)
const { fetchUsers } = adminStore


/** Pagination */
const handleSizeChange = (val: number) => {
	usersQuery.value = {...usersQuery.value, pageSize: val}
	fetchUsers(usersQuery.value)
}
const handleCurrentChange = (val: number) => {
	usersQuery.value = {...usersQuery.value, page: val}
	fetchUsers(usersQuery.value)
}

const currentPage = ref(usersQuery.value?.page || 1)
const pageSize = ref(usersQuery.value?.pageSize || 25)
const small = ref(false)
const disabled = ref(false)
const background = ref(true)

const availableUsersCount = computed(() => {
	return users.value?.records || 0
})

</script>

<template>

	<section class="pt-1 mt-1">
	<div class="row">
		<div class="col-12">
			<nav class="mt-4 d-flex justify-content-center" aria-label="navigation">
				<el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
					:page-sizes="[5, 10, 25, 50]" :small="small" :disabled="disabled" :background="background"
					layout="total, sizes, prev, pager, next, jumper" :total="availableUsersCount"
					@size-change="handleSizeChange" @current-change="handleCurrentChange" />
			</nav>
		</div>
	</div>
	</section>

</template>

<style>

</style>
