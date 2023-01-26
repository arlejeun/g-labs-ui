<script lang="ts" setup>
import TagFormatter from "@/components/layouts/table/TagFormatter.vue";
import EnvFormatter from "@/components/layouts/table/EnvFormatter.vue";

import type { IWorkshop, IWorkshopAdminTable, IWorkshopSettings, WsQueryDTO } from "@/interfaces/workshop";
import { useWorkshopStore } from "@/stores/workshop";
import { Filter, Plus } from '@element-plus/icons-vue'

const wsStore = useWorkshopStore()
const { workshops, workshopSettings } = storeToRefs(wsStore)
const { loadWorkshopSettings, removeWorkshop, provisionWorkshop } = wsStore


/** Pagination */
const handlePaginationSizeChange = (val: number) => {
	loadWorkshopSettings(query.value)
}
const handlePaginationCurrentChange = (val: number) => {
	loadWorkshopSettings(query.value)
}
const handleServerSearch = (val: string) => {
	if (val.length > 1) {
		filterActive.value = true
		loadWorkshopSettings(query.value)
	} else {
		filterActive.value = false
		if (val == '') {
			loadWorkshopSettings(query.value)
		}
	}

}

const currentPage = ref(1)
const pageSize = ref(25)
const small = ref(false)
const disabled = ref(false)
const background = ref(true)
const filterActive = ref(false)
const query = computed((): WsQueryDTO => {
	return {
		searchString: search.value,
		page: currentPage.value,
		pageSize: pageSize.value,
		showAll: true,
		tags: []
	}
})

const totalRecords = computed(() => {
	return workshopSettings.value.records || 0
})

const currentWorkshop = ref({} as IWorkshopSettings)
const loading = ref(true)

const search = ref('')
const disabledForm = ref(true)
const editMode = ref(false)

const filterTableData = computed(() =>
	workshopSettings.value?.rows?.filter(
		(data) =>
			!search.value ||
			data.name.toLowerCase().includes(search.value.toLowerCase()) ||
			data.name.toLowerCase().includes(search.value.toLowerCase())
	)
)
const handleProvision = (index: number, row: IWorkshopSettings) => {
	provisionWorkshop(row.owner, row.name)
	disabledForm.value = false
}

// const handleActivate = (index: number, row: ICategoryTag) => {
// 	disabledForm.value = false
// }
const handleEdit = (index: number, row: IWorkshopSettings) => {
	disabledForm.value = false
	editMode.value = true
}

const handleDelete = (index: number, row: IWorkshopSettings) => {
	removeWorkshop(row.id)
}

const handleRowClick = (row: IWorkshopSettings) => {
	currentWorkshop.value = row
}

const handleWorkshopAdd = () => {
	//currentWorkshop.value = { id: 0, name: '', owner: '', title: '', description: '' }
	disabledForm.value = false
	editMode.value = false
	currentWorkshop.value = {} as IWorkshopSettings 
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
		width: '60'
	},
	name: {
		label: 'Name',
		width: 'auto'
	},
	owner: {
		label: 'Owner',
		width: 'auto'
	},
	environments: {
		label: 'Environments',
		width: 'auto',
		formatter: 'envFormatter'
	},
	user_groups: {
		label: 'User Groups',
		width: 'auto',
		formatter: 'envFormatter'
	},
	tags: {
		label: 'Tags',
		width: 'auto',
		formatter: 'tagFormatter'
	},

}

onMounted(() => {
	loadWorkshopSettings(query.value)
	if (workshopSettings.value.records > 0) {
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
							<TagFormatter v-if="columns[prop].formatter == 'tagFormatter'" :row="row" />
							<EnvFormatter v-else-if="columns[prop].formatter == 'envFormatter'" :row="row" :prop="prop" />
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
							<h5 class="text-primary">Workshop Details</h5>
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

					<div class="card-body row my-4 px-0">
						<WorkshopForm :workshop="currentWorkshop" :edit-mode="editMode"></WorkshopForm>
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
