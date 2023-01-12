<script setup lang="ts">
import type { UsersQueryDTO } from '@/interfaces/workshop';
import { useAdminStore } from '@/stores/admin';
import type { FormInstance } from 'element-plus/es/components/form';
import type { FormRules } from 'element-plus/es/tokens/form';

const adminStore = useAdminStore()
const { users, usersQuery, companies } = storeToRefs(adminStore)
const { fetchUsers, fetchCompaniesLoV } = adminStore

const userTypes = [
	{ label: 'Internal', name: 'Internal' },
	{ label: 'Partner', name: 'Partner' },
	{ label: 'Customer', name: 'Customer' },
	{ label: 'Prospect', name: 'Prospect' },
	{ label: 'Unknown', name: 'Unknown' },
]

const userStatuses = [
	{ label: 'Active', name: 'Active' },
	{ label: 'Awaiting confirmation', name: 'AwaitingConfirmation'},
	{ label: 'Disabled', name: 'Disabled' },
	{ label: 'Needs approval', name: 'NeedsApproval' },
	{ label: 'Rejected', name: 'Rejected' },
	{ label: 'Unknown', name: 'Unknown'}
]


const currentPage = ref(usersQuery.value?.page || 1)
const pageSize = ref(usersQuery.value?.pageSize || 25)
const small = ref(false)
const disabled = ref(false)
const background = ref(true)

const userFilterFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
	// name: [
	// 	{ required: true, message: 'Please enter name', trigger: 'blur' },
	// 	{ min: 2, max: 40, message: 'Length should be 2 to 30', trigger: 'blur' },
	// ],
	// label: [
	// 	{ required: true, message: 'Please enter name', trigger: 'blur' },
	// 	{ min: 2, max: 40, message: 'Length should be 2 to 30', trigger: 'blur' },
	// ],
})




const filter = ref({  
	searchString: '',
	company: '',
	userStatus: '',
	userType: ''}
)


const query = computed((): UsersQueryDTO => {
	return {
		searchString: filter.value.searchString,
		company: filter.value.company,
		userStatus: filter.value.userStatus,
		userType: filter.value.userType,
		pageSize: pageSize.value,
		page: currentPage.value

	}
})

const refresh = async() => {
	fetchUsers(query.value)
}


onMounted(() => {
	fetchCompaniesLoV()
})

</script>

<template>

	<section class="pt-1 mt-1">
		<div class="row justify-content-center">
			<div class="col-12">
			<el-form ref="userFilterFormRef" label-position="top" :inline="true" :model="filter" class="justify-content-center demo-form-inline">
				<el-form-item label="Search">
				<el-input v-model="filter.searchString" @change="refresh()" placeholder="Search by email" />
				</el-form-item>
				<el-form-item label="Company">
				<el-select v-model="filter.company" @change="refresh()" clearable filterable placeholder="select a company">
					<el-option v-for="(comp, index) in companies" :key="index" :value="comp" />
				</el-select>
				</el-form-item>
				<el-form-item label="User Status">
				<el-select v-model="filter.userStatus" @change="refresh()" clearable filterable placeholder="select user status">
					<el-option v-for="(comp, index) in userStatuses" :key="index" :value="comp.name" />		
				</el-select>
				</el-form-item>
				<el-form-item label="User Type">
				<el-select v-model="filter.userType" @change="refresh()" clearable filterable placeholder="select user type">
					<el-option v-for="(comp, index) in userTypes" :key="index" :value="comp.name" />
				</el-select>
				</el-form-item>
			</el-form>
		</div>

		</div>
	</section>

</template>

<style>

</style>
