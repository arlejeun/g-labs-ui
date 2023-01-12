<script lang="ts" setup>
import type { IUserAdminTable } from "@/interfaces";
import type { IDriveUser, IDriveUserDTO } from '@/interfaces';
import type { ICategoryTag, IUserGroup, UsersQueryDTO } from "@/interfaces/workshop";
import { useAdminStore } from "@/stores/admin";
import { Filter, Plus, Search } from '@element-plus/icons-vue'
import type { FormInstance } from "element-plus/es/components/form";
import type { FormRules } from "element-plus/es/tokens/form";

const adminStore = useAdminStore()
const { users, usersQuery } = storeToRefs(adminStore)
const { fetchUsers, fetchCompaniesLoV } = adminStore



const filterTag = (value: string, row: ICategoryTag) => {
	return row.category === value
}


const handleServerSearch = (val: string) => {
	if (val.length > 1) {
		filterActive.value = true
		fetchUsers(usersQuery.value)
	} else {
		filterActive.value = false
		if (val == '') {
			fetchUsers(usersQuery.value)
		}
	}

}

const currentPage = ref(1)
const pageSize = ref(25)
const small = ref(false)
const disabled = ref(false)
const background = ref(true)
const filterActive = ref(false)
// const query = computed((): UsersQueryDTO => {
// 	return {
// 		searchString: searchApplied.value.searchString,
// 		userStatus: searchApplied.value.userStatus,
// 		userType: searchApplied.value.userType,
// 		pageSize: pageSize.value,
// 		page: currentPage.value

// 	}
// })


const disabledForm = ref(true)






onMounted(() => {
//	fetchCompaniesLoV()
	fetchUsers(usersQuery.value)
})

</script>

<template>

	<section class="pt-4">
		<div class="container position-relative pt-0 pb-3">
			<div class="row">
				<div class="col-xs-12 col-lg-10">
					<h3 class="fs-3 text-primary">User Administration</h3>
				</div>
			</div>
		</div>

		<UsersFilter/>
		<UsersTable/>

	</section>


</template>
  
 
  
<route lang="yaml">
meta:
  layout: BasicTopNavigationLayout
  title: GLabs Users Administration
  requiresAuth: true
</route>
