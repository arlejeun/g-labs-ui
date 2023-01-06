<script lang="ts" setup>
import TagFormatter from "@/components/testing/TagFormatter.vue";
import DateTimeFormatter from "@/components/testing/DateTimeFormatter.vue";
import type { IWorkshop, IWorkshopAdminTable, TagQueryDTO } from "@/interfaces/workshop";
import { useWorkshopStore } from "@/stores/workshop";
import { Filter, Plus } from '@element-plus/icons-vue'

const wsStore = useWorkshopStore()
const { workshops } = storeToRefs(wsStore)
const { loadWorkshops, removeWorkshop, provisionWorkshop } = wsStore


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
const handleProvision = (index: number, row: IWorkshop) => {
	provisionWorkshop(row.owner, row.name)
	disabledForm.value = false
}

// const handleActivate = (index: number, row: ICategoryTag) => {
// 	disabledForm.value = false
// }
const handleEdit = (index: number, row: IWorkshop) => {
	disabledForm.value = false
}

const handleDelete = (index: number, row: IWorkshop) => {
	removeWorkshop(row.id)
}

const handleRowClick = (row: IWorkshop) => {
	currentWorkshop.value = row
}

const handleWorkshopAdd = () => {
	//currentWorkshop.value = { id: 0, name: '', owner: '', title: '', description: '' }
	disabledForm.value = false
	editMode.value = false
}


// const editWorkshopForm = async (formEl: FormInstance | undefined) => {
// 	if (!formEl) return
// 	await formEl.validate((valid, fields) => {
// 		if (valid) {
// 			//TODO: Update workshop
// 			updateWorkshop(currentWorkshop.value)
// 			console.log('Submit!')
// 			disabledForm.value = true
// 		} else {
// 			console.log('error submit!', fields)
// 		}
// 	})
// }

// const addTagForm = async (formEl: FormInstance | undefined) => {
// 	if (!formEl) return
// 	await formEl.validate((valid, fields) => {
// 		if (valid) {
// 			addWorkshop(currentWorkshop.value)
// 			disabledForm.value = true
// 			editMode.value = true
// 		} else {
// 			console.log('error submit!', fields)
// 		}
// 	})
// }

// const resetForm = (formEl: FormInstance | undefined) => {
// 	if (!formEl) return
// 	formEl.resetFields()
// 	disabledForm.value = true
// }

watch(filterTableData, () => {
	if (workshops.value.records > 0) {
		loading.value = false
	}
})


const columns = ref({} as IWorkshopAdminTable)

columns.value = {
	id: {
		label: 'ID',
		width: 50
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
			<div class="col-lg-7 col-md-7" style="max-width: 1150px">
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
					<el-table-column align="right">
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
							<!-- <el-button size="small" @click="handleActivate(scope.$index, scope.row)">Activate</el-button> -->
							<el-button size="small" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
							<el-button size="small" type="danger"
								@click="handleDelete(scope.$index, scope.row)">Delete</el-button>
						</template>
					</el-table-column>
				</el-table>



				<div class="mt-4 row justify-content-center">
					<el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
						:page-sizes="[5, 25, 50, 500]" :small="small" :disabled="disabled" :background="background"
						layout="total, sizes, prev, pager, next, jumper" :total="totalRecords"
						@size-change="handlePaginationSizeChange" @current-change="handlePaginationCurrentChange" />
				</div>

			</div>

			<div class="col-4" style="max-width: 600px">
				<el-card shadow="hover">
					<template #header>
						<div class="card-header row justify-content-between px-0">
						<div class="col">
							<h5 class="text-primary">Edit Workshop</h5>
						</div>
						<div class="col-2">
							<el-button-group>
								<el-tooltip content="Add tag" placement="left">
									<el-button @click="handleWorkshopAdd" type="primary" size="small" :icon="Plus" />
								</el-tooltip>
							</el-button-group>

						</div>
					</div>
					</template>

					<div class="card-body row px-0">
						<WorkshopForm :workshop="currentWorkshop" :edit-mode="true"></WorkshopForm>
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
