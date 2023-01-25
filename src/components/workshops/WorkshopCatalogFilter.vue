<script setup lang="ts">
import type { WsFilterCriteria } from '@/interfaces/workshop';
import { useUserStore } from '@/stores/user';
import {
	Search, Menu, Plus, List, Filter, Check, Close
} from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus/es/components/form';
import type { FormRules } from 'element-plus/es/tokens/form';
import router from '@/router';
import { useAdminStore } from '@/stores/admin';
import { useWorkshopStore } from '@/stores/workshop';
import { environments } from '@/utils/gc'

const store = useUserStore()
const { isMobile, isAdmin, userEmail } = storeToRefs(store)

const adminStore = useAdminStore()
const { tags: tagsLoV, businessTags: bizTagsLoV, technicalTags: techTagsLoV, userGroups: userGroupsLoV } = storeToRefs(adminStore)
const { fetchTags } = adminStore

const wStore = useWorkshopStore()
const { workshopsCriteria } = storeToRefs(wStore)

const showFilterCriteria = ref(false)
const filterForm = ref({} as WsFilterCriteria)
const filter = ref({} as WsFilterCriteria)
const mySearch = ref('')

const toggleFilterCriteria = () => {
	showFilterCriteria.value = !showFilterCriteria.value
}

const addWorkshopHandler = () => {
	router.push({ path: '/workshops/add' })
}

const filterFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
	search_text: [
		{ required: false, message: 'Please enter search text', trigger: 'blur' },
		{ min: 2, max: 40, message: 'Length should be 2 to 30', trigger: 'blur' },
	],
})

const handleSearchChange = () => {

	const mergeTags = [...filterForm.value.categories, ...filterForm.value.tags]
	filterForm.value.searchString = mySearch.value
	filter.value = { ...filterForm.value, tags: mergeTags }
}

const submitForm = async (formEl: FormInstance | undefined) => {
	if (!formEl) return
	await formEl.validate((valid, fields) => {
		if (valid) {
			handleSearchChange()
		} else {
			console.log('error submit!', fields)
		}
	})
}

const resetForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return
	formEl.resetFields()
}

const filterType = computed(() => {
	return (filter.value?.tags?.length > 0 || (filter.value?.searchString && filter.value?.searchString?.length > 0)) ? 'warning' : 'primary'
})

watchEffect(() => {
	//loadWorkshops(query.value)
	if (userEmail.value) {
		if (tagsLoV.value?.records == 0) {
			fetchTags({ page: 1, pageSize: 200 });
		}
		workshopsCriteria.value = filter.value
		filterForm.value = filter.value
	}
	else {
		console.log('Waiting for user authentication')
	}

	//changeWorkshopQuery(query.value)
})

</script>

<template>

	<section class="pt-0 pb-4">
		<div class="container position-relative">
			<div class="row">
				<div class="col-xs-12 col-lg-9">
					<h3 class="fs-3 text-primary mt-4">{{ $t('workshops.title') }}</h3>
					<p class="text-secondary">{{ $t('workshops.desc') }}</p>
				</div>
				<div v-if="!isMobile" class="col pt-4">
					<WorkshopGenesysEnvironment />
				</div>
			</div>


			<!-- Title and button START -->
			<div class="row">
				<div class="col-12">
					<!-- Meta START -->
					<div class="d-flex justify-content-between mt-2">
						<!-- Filter collapse button -->

						<el-input v-model="mySearch" @change="handleSearchChange" class="w-50"
							:placeholder="$t('workshops.searchFor')" :prefix-icon="Search" />


						<!-- tabs -->
						<!-- <ul class="nav nav-pills nav-pills-dark" id="tour-pills-tab" role="tablist"> -->
						<el-button-group class="nav nav-pills nav-pills-dark">
							<el-tooltip v-if="isAdmin" content="Add workshop" placement="bottom-start">
								<el-button @click="addWorkshopHandler" type="primary" :icon="Plus" />
							</el-tooltip>
							<el-tooltip content="Tile display mode" placement="bottom-start">
								<el-button type="primary" :icon="Menu" />
							</el-tooltip>
							<el-tooltip content="List display mode" placement="bottom-start">
								<el-button type="primary" :icon="List" />
							</el-tooltip>
							<el-tooltip content="Apply Filters" placement="bottom-start">
								<el-button @click="toggleFilterCriteria" :type="filterType" :icon="Filter" />
							</el-tooltip>
						</el-button-group>
					</div>
				</div>
			</div>

			<div v-show="showFilterCriteria">

				<div class="card card-body bg-light p-4 mt-4 z-index-9">

					<el-form ref="filterFormRef" :model="filterForm" :rules="rules" label-position="top" class="row">
						<!-- <div class="col-xs-12 col-md-9 col-lg-4">
							<label class="form-label">Search specific text</label>
							<el-form-item prop="search_text">
								<el-input v-model="filterForm.searchString" class="w-100 m-2" placeholder="Search for"
									:prefix-icon="Search" />
							</el-form-item>

						</div> -->
						<div class="col-xs-6 col-md-6 col-lg-3">
							<!-- <label class="form-label">Categories</label> -->
							<el-form-item label="Categories" prop="categories">
								<el-select class="w-100" v-model="filterForm.categories" multiple collapse-tags
									collapse-tags-tooltip filterable :multiple-limit=3 placeholder="Select">
									<el-option v-for="item in bizTagsLoV" :key="item.id" :label="item.name"
										:value="item.id" />
								</el-select>
							</el-form-item>
						</div>
						<div class="col-xs-6 col-md-6 col-lg-3">
							<!-- <label class="form-label">Tags</label> -->
							<el-form-item label="Tags" prop="tags">
								<el-select class="w-100" v-model="filterForm.tags" multiple collapse-tags
									collapse-tags-tooltip placeholder="Select" filterable :multiple-limit=5>
									<el-option v-for="item in techTagsLoV" :key="item.id" :label="item.name"
										:value="item.id" />
								</el-select>
							</el-form-item>
						</div>

						<div class="col-xs-6 col-md-6 col-lg-3">
							<!-- <label class="form-label">Level</label> -->
							<el-form-item label="Level" prop="levels">
								<el-select class="w-100" v-model="filterForm.levels" multiple collapse-tags
									collapse-tags-tooltip placeholder="Select" filterable :multiple-limit=2>
									<el-option label="100" value="100"></el-option>
									<el-option label="200" value="200"></el-option>
									<el-option label="300" value="300"></el-option>
									<el-option label="400" value="400"></el-option>
									<el-option label="500" value="500"></el-option>
								</el-select>
							</el-form-item>
						</div>

						<div class="col-xs-6 col-md-6 col-lg-3">
							<!-- <label class="form-label">Categories</label> -->
							<el-form-item label="Environments" prop="environments">
								<el-select class="w-100" v-model="filterForm.environments" multiple collapse-tags
									collapse-tags-tooltip filterable placeholder="Select" :multiple-limit=1>
									<el-option v-for="item in environments" :key="item.id" :label="item.name"
										:value="item.id" />
								</el-select>
							</el-form-item>
						</div>

						<div v-if="isAdmin" class="col-xs-6 col-md-6 col-lg-3">
							<!-- <label class="form-label">Categories</label> -->
							<el-form-item label="Show all" prop="showAll">
								<el-switch
									v-model="filterForm.showAll"
									class="mt-2"
									style="margin-left: 24px"
									inline-prompt
									:active-icon="Check"
									:inactive-icon="Close"
								/>
							</el-form-item>
						</div>

						<div class="d-sm-flex justify-content-end">
							<el-form-item class="mb-0">
								<el-button type="primary" @click="submitForm(filterFormRef)">Apply filter</el-button>
								<el-button @click="resetForm(filterFormRef)">Reset</el-button>
							</el-form-item>
						</div>


					</el-form>

				</div>
			</div>


		</div>
	</section>

</template>

<style>

</style>
