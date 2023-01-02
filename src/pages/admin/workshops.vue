<script lang="ts" setup>
import TagFormatter from "@/components/testing/TagFormatter.vue";
import DateTimeFormatter from "@/components/testing/DateTimeFormatter.vue";
import type { ICategoryTag, ITag, IWorkshop, IWorkshopAdminTable, TagQueryDTO } from "@/interfaces/workshop";
import { useTagStore } from "@/stores/tag";
import { useWorkshopStore } from "@/stores/workshop";
import { Filter, Plus, Search } from '@element-plus/icons-vue'
import type { FormInstance } from "element-plus/es/components/form";
import type { FormRules } from "element-plus/es/tokens/form";

const wsStore = useWorkshopStore()
const { workshops } = storeToRefs(wsStore)
const { loadWorkshops, updateWorkshop, removeWorkshop, addWorkshop } = wsStore

const filterTag = (value: string, row: ICategoryTag) => {
	return row.category === value
}

/** Pagination */
const handlePaginationSizeChange = (val: number) => {
	loadWorkshops(query.value)
}
const handlePaginationCurrentChange = (val: number) => {
	loadWorkshops(query.value)
}
const handleServerSearch = (val: string) => {
	if (val.length > 1) {
		filterActive.value = true
		loadWorkshops(query.value)
	} else {
		filterActive.value = false
		if (val == '') {
			loadWorkshops(query.value)
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
	return workshops.value.records || 0
})

const currentWorkshop = ref({} as IWorkshop)
const loading = ref(true)

const search = ref('')
const disabledForm = ref(true)
const editMode = ref(true)

const filterTableData = computed(() =>
	workshops.value?.rows?.filter(
		(data) =>
			!search.value ||
			data.name.toLowerCase().includes(search.value.toLowerCase()) ||
			data.title.toLowerCase().includes(search.value.toLowerCase())
	)
)
const handleProvision = (index: number, row: ICategoryTag) => {
	console.log(index, row)
	disabledForm.value = false
}

const handleActivate = (index: number, row: ICategoryTag) => {
	console.log(index, row)
	disabledForm.value = false
}
const handleEdit = (index: number, row: ICategoryTag) => {
	console.log(index, row)
	disabledForm.value = false
}

const handleDelete = (index: number, row: IWorkshop) => {
	console.log(index, row)
	removeWorkshop(row.id)
}

const handleRowClick = (row: IWorkshop) => {
	currentWorkshop.value = row
	console.log(row)
}

const handleWorkshopAdd = () => {
	//currentWorkshop.value = { id: 0, name: '', owner: '', title: '', description: '' }
	disabledForm.value = false
	editMode.value = false
}


const tagFormRef = ref<FormInstance>()
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

const editWorkshopForm = async (formEl: FormInstance | undefined) => {
	if (!formEl) return
	await formEl.validate((valid, fields) => {
		if (valid) {
			//TODO: Update workshop
			updateWorkshop(currentWorkshop.value)
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
			addWorkshop(currentWorkshop.value)
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
	if (workshops.value.records > 0) {
		loading.value = false
	}
})


const columns = ref({} as IWorkshopAdminTable)

columns.value = {
	id: {
		label: 'ID',
		width: 40
	},
	owner: {
		label: 'Owner',
		width: 150
	},
	name: {
		label: 'Name',
		width: 250
	},
	tags: {
		label: 'Tags',
		width: 250,
		formatter: 'tagformatter'
	},

}

onMounted(() => {
	loadWorkshops(query.value)
	if (workshops.value.records > 0) {
		loading.value = false
	}

})

</script>

<template>

	<section class="pt-4">
		<div class="container position-relative pt-0 pb-3">
			<div class="row">
				<div class="col-xs-12 col-lg-10">
					<h3 class="fs-3 text-primary">Workshops Administration</h3>
				</div>
			</div>
		</div>

		<div class="row justify-content-center">
			<div class="col-lg-7 col-md-7 me-2" style="width: 1200px">
				<el-table :data="filterTableData" :border="true" highlight-current-row stripe
					@row-click="handleRowClick" :default-sort="{ prop: 'name', order: 'descending' }"
					style="width:100%">
					<el-table-column v-for="(column, prop) in columns" :key="prop"
						:label="columns[prop].label" 
						:prop="typeof prop == 'string' ? prop: ''" 
						:width="columns[prop].width">
						<template #default="{ row }">
							<TagFormatter v-if="columns[prop].formatter == 'tagformatter'" :row="row" />
							<template v-else>
								{{ row[prop] }}
							</template>
						</template>
					</el-table-column>
					<el-table-column width="400" align="right">
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
							<el-button size="small" @click="handleProvision(scope.$index, scope.row)">Provision</el-button>
							<el-button size="small" @click="handleActivate(scope.$index, scope.row)">Activate</el-button>
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

			<div class="col ms-2" style="max-width: 600px">
				<div class="card ">
					<div class="card-header border row px-0">
						<div class="col-8">
							<h5 class="text-primary">Edit Workshop</h5>
						</div>
						<div class="col-4">
							<el-button-group>
								<el-tooltip content="Add tag" placement="left">
									<el-button @click="handleWorkshopAdd" type="primary" size="small" :icon="Plus" />
								</el-tooltip>
							</el-button-group>

						</div>
					</div>
					
					<div class="card-body border row px-0">
						<WorkshopForm></WorkshopForm>
						<!-- <el-form ref="tagFormRef" :model="currentWorkshop" :rules="rules" :disabled="disabledForm"
							class="row" label-position="top">
							<div class="col-xs-12 col-12">
								<el-form-item label="Tag Name" prop="name">
									<el-input v-model="currentWorkshop.name" class="w-100 m-2" />
								</el-form-item>
							</div>

							<div class="col-xs-12 col-12">
								<el-form-item label="Owner" prop="owner">
									<el-input v-model="currentWorkshop.owner" class="w-100 m-2" />
								</el-form-item>
							</div>

							<div class="col-xs-12 col-12">
								<el-form-item label="Tag Label" prop="label">
									<el-input v-model="currentWorkshop.tags" class="w-100 m-2" />
								</el-form-item>
							</div>

							<div class="pt-2 d-sm-flex justify-content-end">
								<el-form-item class="mb-0">
									<el-button v-show="editMode" type="primary"
										@click="editWorkshopForm(tagFormRef)">Edit</el-button>
									<el-button v-show="!editMode" type="primary"
										@click="addTagForm(tagFormRef)">Add</el-button>
									<el-button @click="resetForm(tagFormRef)">Reset</el-button>
								</el-form-item>
							</div>


						</el-form> -->
					</div>


				</div>
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
