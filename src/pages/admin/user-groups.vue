<script lang="ts" setup>
import type { ICategoryTag, IUserGroup, IWorkshopAdminTable, TagQueryDTO } from "@/interfaces/workshop";
import { useAdminStore } from "@/stores/admin";
import { Filter, Plus, Search } from '@element-plus/icons-vue'
import type { FormInstance } from "element-plus/es/components/form";
import type { FormRules } from "element-plus/es/tokens/form";

const adminStore = useAdminStore()
const { userGroups } = storeToRefs(adminStore)
const { fetchUserGroups, removeUserGroup, addUserGroup, updateUserGroup } = adminStore

const filterTag = (value: string, row: ICategoryTag) => {
	return row.category === value
}

/** Pagination */
const handlePaginationSizeChange = (val: number) => {
	fetchUserGroups(query.value)
}
const handlePaginationCurrentChange = (val: number) => {
	fetchUserGroups(query.value)
}
const handleServerSearch = (val: string) => {
	if (val.length > 1) {
		filterActive.value = true
		fetchUserGroups(query.value)
	} else {
		filterActive.value = false
		if (val == '') {
			fetchUserGroups(query.value)
		}
	}

}

const currentPage = ref(1)
const pageSize = ref(25)
const small = ref(false)
const disabled = ref(false)
const background = ref(true)
const filterActive = ref(false)
const query = computed((): TagQueryDTO => {
	return {
		searchString: search.value,
		page: currentPage.value,
		pageSize: pageSize.value
	}
})

const totalRecords = computed(() => {
	return userGroups.value.records || 0
})

const currentUserGroup = ref({} as IUserGroup)
const loading = ref(true)

const search = ref('')
const disabledForm = ref(true)
const editMode = ref(true)

const columns = ref({} as IWorkshopAdminTable)

columns.value = {
	id: {
		label: 'ID',
		width: 60
	},
	name: {
		label: 'Name',
		width: 250
	},
	isActive: {
		label: 'Active',
		width: 80
	},

}

const filterTableData = computed(() =>
	userGroups.value?.rows?.filter(
		(data) =>
			!search.value ||
			data?.name?.toLowerCase()?.includes(search.value.toLowerCase())
	)
)
const handleEdit = (index: number, row: IUserGroup) => {
	console.log(index, row)
	disabledForm.value = false
}

const handleDelete = (index: number, row: IUserGroup) => {
	console.log(index, row)
	removeUserGroup(row)
}

const handleRowClick = (row: IUserGroup) => {
	currentUserGroup.value = row
}

const handleTagAdd = () => {
	currentUserGroup.value = { id: 0, name: '' }
	disabledForm.value = false
	editMode.value = false
}


const ugFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
	name: [
		{ required: true, message: 'Please enter name', trigger: 'blur' },
		{ min: 2, max: 40, message: 'Length should be 2 to 30', trigger: 'blur' },
	],
	label: [
		{ required: true, message: 'Please enter name', trigger: 'blur' },
		{ min: 2, max: 40, message: 'Length should be 2 to 30', trigger: 'blur' },
	],
})

const editTagForm = async (formEl: FormInstance | undefined) => {
	if (!formEl) return
	await formEl.validate((valid, fields) => {
		if (valid) {
			updateUserGroup(currentUserGroup.value)
			console.log('Submit!')
			disabledForm.value = true
		} else {
			console.log('error submit!', fields)
		}
	})
}

const addTagForm = async (formEl: FormInstance | undefined) => {
	if (!formEl) return
	await formEl.validate((valid, fields) => {
		if (valid) {
			addUserGroup(currentUserGroup.value)
			disabledForm.value = true
			editMode.value = true
		} else {
			console.log('error submit!', fields)
		}
	})
}

const resetForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return
	formEl.resetFields()
	disabledForm.value = true
}

watch(filterTableData, () => {
	if (userGroups.value.records > 0) {
		loading.value = false
	}
})


onMounted(() => {
	fetchUserGroups(query.value)
	if (userGroups.value.records > 0) {
		loading.value = false
	}

})

</script>

<template>

	<section class="pt-4">
		<div class="container position-relative pt-0 pb-3">
			<div class="row">
				<div class="col-xs-12 col-lg-10">
					<h3 class="fs-3 text-primary">User Groups Administration</h3>
				</div>
			</div>
		</div>

		<div class="row justify-content-center">
			<div class="col-lg-7 col-md-7" style="max-width: 900px">
				<el-table :data="filterTableData" :border="true" highlight-current-row stripe
					@row-click="handleRowClick" :default-sort="{ prop: 'used', order: 'descending' }"
					style="width:100%">

					<el-table-column v-for="(column, prop) in columns" :key="prop" :label="columns[prop].label"
						:prop="typeof prop == 'string' ? prop : ''" :width="columns[prop].width">
						<template #default="{ row }">
							<!-- <TagFormatter v-if="columns[prop].formatter == 'tagformatter'" :row="row" /> -->
							<!-- <template v-else> -->
							{{ row[prop] }}
							<!-- </template> -->
						</template>
					</el-table-column>

					<el-table-column width="200" align="right">
						<template #header>
							<el-row>
								<el-input v-model="search" placeholder="Type to search">
									<template #append>
										<el-button :class="{ 'bg-primary text-white': filterActive }" size="small"
											:icon="Filter" @click="handleServerSearch(search)"></el-button>
									</template>
								</el-input>

							</el-row>
						</template>
						<template #default="scope">
							<el-button size="small" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
							<el-button size="small" type="danger"
								@click="handleDelete(scope.$index, scope.row)">Delete</el-button>
						</template>
					</el-table-column>
				</el-table>

				<div class="mt-4 row justify-content-center">
					<el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
						:page-sizes="[10, 25, 50, 500]" :small="small" :disabled="disabled" :background="background"
						layout="total, sizes, prev, pager, next, jumper" :total="totalRecords"
						@size-change="handlePaginationSizeChange" @current-change="handlePaginationCurrentChange" />
				</div>

			</div>

			<div class="col ms-2" style="max-width: 350px">


				<el-card shadow="hover">
					<template #header>
						<div class="card-header row justify-content-between px-0">
							<div class="col">
								<h5 class="text-primary">Edit Group</h5>
							</div>
							<div class="col-2">
								<el-button-group>
									<el-tooltip content="Add Group" placement="left">
										<el-button @click="handleTagAdd" type="primary" size="small" :icon="Plus" />
									</el-tooltip>
								</el-button-group>

							</div>
						</div>
					</template>

					<div class="card-body">
						<div class="container-fluid">
							<div class="row">
								<div class="col-12">
								<div class="card-wrapper">

										<!-- Form START -->

										<h5 class="pb-3">Group Information</h5>
						
										<el-form ref="tagFormRef" :model="currentUserGroup" :rules="rules" :disabled="disabledForm"
							class="row" label-position="top">
							<div class="col-xs-12 col-12">
								<el-form-item label="Group Name" prop="name">
									<el-input v-model="currentUserGroup.name" class="w-100 m-2" />
								</el-form-item>
							</div>
							<div class="col-xs-12 col-12">
								<el-form-item label="Is Active">
									<el-switch v-model="currentUserGroup.isActive" />
								</el-form-item>
							</div>



							<div class="pt-2 d-sm-flex justify-content-end">
								<el-form-item class="mb-0">
									<el-button @click="resetForm(ugFormRef)">Reset</el-button>
									<el-button v-show="editMode" type="primary"
										@click="editTagForm(ugFormRef)">Edit</el-button>
									<el-button v-show="!editMode" type="primary"
										@click="addTagForm(ugFormRef)">Add</el-button>
									
								</el-form-item>
							</div>


						</el-form>
					</div>
					</div>
					</div>
					</div>
					</div>

				</el-card>



			</div>


		</div>


	</section>


</template>
  
 
  
<route lang="yaml">
meta:
  layout: BasicTopNavigationLayout
  title: GLabs Tags Administration
  requiresAuth: true
</route>
