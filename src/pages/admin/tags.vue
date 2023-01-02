<script lang="ts" setup>
import type { ICategoryTag, TagQueryDTO } from "@/interfaces/workshop";
import { useTagStore } from "@/stores/tag";
import { Filter, Plus, Search } from '@element-plus/icons-vue'
import type { FormInstance } from "element-plus/es/components/form";
import type { FormRules } from "element-plus/es/tokens/form";

const adminStore = useTagStore()
const { tags } = storeToRefs(adminStore)
const { fetchTags, updateTag, removeTag, addTag } = adminStore

const filterTag = (value: string, row: ICategoryTag) => {
	return row.category === value
}

/** Pagination */
const handlePaginationSizeChange = (val: number) => {
	fetchTags(query.value)
}
const handlePaginationCurrentChange = (val: number) => {
	fetchTags(query.value)
}
const handleServerSearch = (val: string) => {
	if (val.length > 1) {
		filterActive.value = true
		fetchTags(query.value)
	} else {
		filterActive.value = false
		if (val == '') {
		  fetchTags(query.value)
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
	return tags.value.records || 0
})

const currentTag = ref({} as ICategoryTag)
const loading = ref(true)

const search = ref('')
const disabledForm = ref(true)
const editMode = ref(true)

const modifiedTable = computed(() =>
  tags.value.rows?.map(
    (tag) => { 
		const t = {...tag, used: tag?.workshops?.length}
		return t
	}
  )
)

const filterTableData = computed(() =>
	modifiedTable.value?.filter(
		(data) =>
		!search.value ||
		data.name.toLowerCase().includes(search.value.toLowerCase())
	)
)
const handleEdit = (index: number, row: ICategoryTag) => {
  console.log(index, row)
  disabledForm.value = false
}

const handleDelete = (index: number, row: ICategoryTag) => {
  console.log(index, row)
  removeTag(row)
}

const handleRowClick = (row: ICategoryTag) => {
	currentTag.value = row
}

const handleTagAdd = () => {
	currentTag.value = { id:0 , name:'', category:'' }
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

const editTagForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
	  updateTag(currentTag.value)
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
	  addTag(currentTag.value)
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

watch(filterTableData, ()=> {
	if (tags.value.records > 0) {
		loading.value = false
	}
})


onMounted(() => {
	fetchTags(query.value)
	if (tags.value.records > 0) {
		loading.value = false
	}

})

</script>

<template>

	 <section class="pt-4">
		<div class="container position-relative pt-0 pb-3">
			<div class="row">
				<div class="col-xs-12 col-lg-10">
					<h3 class="fs-3 text-primary">Tags Administration</h3>
				</div>
			</div>
		</div>

		<div class="row justify-content-center">
			<div class="col-lg-7 col-md-7 me-2" style="width: 900px">
				<el-table :data="filterTableData" :border="true" highlight-current-row stripe
					@row-click="handleRowClick"
					:default-sort="{ prop: 'used', order: 'descending' }"
					style="width:100%" >
					<el-table-column prop="id" label="Id" width="60" />
					<el-table-column prop="category" label="Category" width="120" 
					:filters="[
						{ text: 'Business', value: 'Business' },
						{ text: 'Technical', value: 'Technical' }
						]" 
					:filter-method="filterTag"
					filter-placement="right"/>
					<el-table-column prop="name" label="Name" width="200" />
					<el-table-column prop="label" label="Label" width="200" />
					<el-table-column prop="used" label="Used" width="90" sortable />
					<el-table-column width="200" align="right">
					<template #header>
						<el-row>
						<el-input v-model="search" placeholder="Type to search">
							<template #append>
								<el-button :class="{'bg-primary text-white': filterActive}" size="small" :icon="Filter" @click="handleServerSearch(search)"></el-button> 
							</template>
						</el-input>

						</el-row>
					</template>
					<template #default="scope">
						<el-button size="small" @click="handleEdit(scope.$index, scope.row)"
						>Edit</el-button
						>
						<el-button
						size="small"
						type="danger"
						@click="handleDelete(scope.$index, scope.row)"
						>Delete</el-button
						>
					</template>
					</el-table-column>
				</el-table>

				<div class="mt-4 row justify-content-center">
					<el-pagination
					v-model:current-page="currentPage"
					v-model:page-size="pageSize"
					:page-sizes="[10, 25, 50, 500]"
					:small="small"
					:disabled="disabled"
					:background="background"
					layout="total, sizes, prev, pager, next, jumper"
					:total="totalRecords"
					@size-change="handlePaginationSizeChange"
					@current-change="handlePaginationCurrentChange"
					/>
				</div>

			</div>

			<div class="col ms-2" style="max-width: 300px">
				<div class="card " >
				<div class="card-header border row px-0">
					<div class="col-8">
						<h5 class="text-primary">Edit Tag</h5>
					</div>
					<div class="col-4">
						<el-button-group>
							<el-tooltip content="Add tag" placement="left">
								<el-button @click="handleTagAdd" type="primary" size="small" :icon="Plus" />
							</el-tooltip>
						</el-button-group>
						
					</div>
				</div>
				<div class="card-body border row px-0">
					<el-form ref="tagFormRef" :model="currentTag" :rules="rules" :disabled="disabledForm" class="row" label-position="top">
						<div class="col-xs-12 col-12">
							<el-form-item label="Tag Name" prop="name">
								<el-input v-model="currentTag.name" class="w-100 m-2"/>
							</el-form-item>
						</div>

						<div class="col-xs-12 col-12">
							<el-form-item label="Tag Category" prop="category">
								<el-select class="w-100 m-2"
								v-model="currentTag.category"
								placeholder="Select">
									<el-option label="Business" value="Business"></el-option>
									<el-option label="Technical" value="Technical"></el-option>
								</el-select>
							</el-form-item>
						</div>

						<div class="col-xs-12 col-12">
							<el-form-item label="Tag Label" prop="label">
								<el-input v-model="currentTag.label" class="w-100 m-2" />
							</el-form-item>
						</div>
													
						<div class="pt-2 d-sm-flex justify-content-end">
							<el-form-item class="mb-0">
							<el-button v-show="editMode" type="primary" @click="editTagForm(tagFormRef)">Edit</el-button>
							<el-button v-show="!editMode" type="primary" @click="addTagForm(tagFormRef)">Add</el-button>
							<el-button @click="resetForm(tagFormRef)">Reset</el-button>
							</el-form-item>
							</div>


					</el-form>
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
