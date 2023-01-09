<script setup lang="ts">
import { useWorkshopStore } from '@/stores/workshop'
import { useWorkspaceStore } from '@/stores/workspace';
import { getParameterByName } from '@/utils/string'
import { useRouteHash } from '@vueuse/router';
import { useUserStore } from '@/stores/user';
import {
	Plus,
	MagicStick,
	Search,
	Filter,
	List,
	Menu,
	CircleCheck
} from '@element-plus/icons-vue'
import type { IWorkshop, WsFilter, WsFilterClient, WsQueryDTO } from '@/interfaces/workshop';
import router from '@/router';
import type { FormInstance } from 'element-plus/es/components/form';
import type { FormRules } from 'element-plus/es/tokens/form';
import { useAdminStore } from '@/stores/admin';

const userStore = useUserStore()
const { user, isAdmin, localization } = storeToRefs(userStore)

const workspaceStore = useWorkspaceStore()
const { isTokenActive, gsysCloudClient } = storeToRefs(workspaceStore)
const { refreshEnvironment } = workspaceStore
const routeHash = useRouteHash()

const adminStore = useAdminStore()
const { tags: tagsLoV, businessTags: bizTagsLoV, technicalTags: techTagsLoV, userGroups: userGroupsLoV } = storeToRefs(adminStore)
const { fetchTags } = adminStore

const wStore = useWorkshopStore()
const { workshops, workshopsQuery } = storeToRefs(wStore)
const { loadWorkshops } = wStore

const formatter = 'YYYY-MM-DD HH:mm:ss:SSS'
const store = useUserStore()
const { isMobile } = storeToRefs(store)

const drawerSize = ref('45%')
drawerSize.value = isMobile.value ? '85%' : '45%'
const connectCloudPanel = ref(false)

const showFilterCriteria = ref(false)
const filterForm = ref({} as WsFilterClient)
const filter = ref({} as WsFilter)


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
	filter.value = { ...filterForm.value, tags: mergeTags }

	// if (workshops.value.records > 0 || !checkSameQuery(query.value, workshopsQuery.value)) {
	// 	loadWorkshops(query.value)
	// }
}

/** Pagination */
const handleSizeChange = (val: number) => {
	//currentPage.value = 1;
	//pageSize.value = val;
	console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
	//currentPage.value = val;
	console.log(`current page: ${val}`)
}

const checkSameQuery = (currentFilter: WsQueryDTO, lastFilter: WsQueryDTO) => {
	return (currentFilter.page == lastFilter.page) && (currentFilter.pageSize == lastFilter.pageSize) &&
		(currentFilter?.searchString == lastFilter?.searchString) && (
			currentFilter?.tags?.join(',') == lastFilter?.tags?.join(',')
		)
}

const currentPage = ref(1)
const pageSize = ref(25)
const small = ref(false)
const disabled = ref(false)
const background = ref(true)
const query = computed(() => {
	return {
		searchString: filter.value.searchString,
		tags: filter.value.tags || [],
		page: currentPage.value,
		pageSize: pageSize.value
	}
})

const filterType = computed(() => {
	return (filter.value?.tags?.length > 0 || (filter.value?.searchString && filter.value?.searchString?.length > 0)) ? 'warning': 'primary'
})
/** Pagination */

watchEffect(async () => {
	//Environments
	//Token parameters must be read from the the oauth client redirects uri
	if (routeHash.value.includes('access_token')) {
		gsysCloudClient.value.access_token = getParameterByName('access_token')
		routeHash.value = ''
		refreshEnvironment()
	}
})

// watch(() => user.value, () => {
// 	if (workshops.value.records < 1 || !checkSameQuery(query.value, workshopsQuery.value)) {
// 		loadWorkshops(query.value)
// 	}
// })

watch(() => query.value, () => {
	if (!workshops.value?.records || !checkSameQuery(query.value, workshopsQuery.value)) {
		loadWorkshops(query.value)
	}
})

onMounted(() => {
	if (!tagsLoV.value?.records) {
		fetchTags({ page: 1, pageSize: 200 });
	}
	if (!workshops.value?.records || !checkSameQuery(query.value, workshopsQuery.value)) {
		loadWorkshops(query.value)
	}
})
//Load views and fetch metadata
// if (user.value) {
// 	fetchTags()
// 	loadWorkshops({page: currentPage.value, pageSize: pageSize.value})
// }


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

// const matchLocalization = (ws: IWorkshop): boolean => {
// 	return true || 
// }

const availableWorkshops = computed(() => {
	if (localization.value.length > 0 && localization.value != 'en-US') {
		return workshops.value?.rows?.filter(ws => ws?.localizations?.some(loc => loc.locale == localization.value))
	}
	else {
		return workshops.value?.rows
	}
	
})

const availableWorkshopsCount = computed(() => {
	return workshops.value?.records || 0
})

const connectToCloud = () => {
	connectCloudPanel.value = true
}

const launchGenesysCloud = () => {
	window.open(`${gsysCloudClient.value.login_url}`, '_blank', 'noreferrer');
}


</script>

<template>

	<!-- <p>Loading: {{ isLoading.toString() }}</p>
  <p>Finished: {{ isFinished.toString() }}</p>
  <p>Error: {{ error?.toString() }}</p> -->

	<!-- =======================
Title and Tabs START -->
	<section class="pt-0 pb-4">
		<div class="container position-relative">
			<div class="row">
				<div class="col-xs-12 col-lg-9">
					<h3 class="fs-3 text-primary mt-4">{{$t('workshops.title')}}</h3>
					<p class="text-secondary">{{$t('workshops.desc')}}</p>
				</div>
				<div v-if="!isMobile" class="col pt-4">
					<div v-show="!isTokenActive" class="row justify-content-end ms-4 ps-4 g-3">
						<el-button  type="warning" @click.prevent="connectToCloud" text bg>{{$t('workshops.connectButton')}}</el-button>
					</div>
					<div v-show="isTokenActive" class="row justify-content-end ms-4 ps-4 g-3">
					<el-button type="success" @click.prevent="connectToCloud" text bg>{{$t('workshops.checkButton')}}<CircleCheck style="width: 1em; height: 1em;margin-left: 8px; margin-right: 8px"/></el-button>
					<el-button type="primary" @click.prevent="launchGenesysCloud" text bg>{{ $t('workshops.launchButton') }}<MagicStick style="width: 1em; height: 1em;margin-left: 8px; margin-right: 8px" /></el-button>
					</div>
				</div>
			</div>


			<!-- Title and button START -->
			<div class="row">
				<div class="col-12">
					<!-- Meta START -->
					<div class="d-flex justify-content-between mt-2">
						<!-- Filter collapse button -->

						<el-input v-model="filterForm.searchString" @change="handleSearchChange" class="w-50" :placeholder="$t('workshops.searchFor')"
							:prefix-icon="Search" />


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
							<!-- <el-button type="primary" :icon="Share" />
								<el-button type="primary" :icon="Delete" /> -->
						</el-button-group>
						<!-- </ul> -->
					</div>
				</div>
			</div>

			<div v-show="showFilterCriteria">

				<div class="card card-body bg-light p-4 mt-4 z-index-9">

					<el-form ref="filterFormRef" :model="filterForm" :rules="rules" class="row">
						<div class="col-xs-12 col-md-9 col-lg-4">
							<label class="form-label">Search specific text</label>
							<el-form-item prop="search_text">
								<el-input v-model="filterForm.searchString" class="w-100 m-2" placeholder="Search for"
									:prefix-icon="Search" />
							</el-form-item>

						</div>
						<div class="col-xs-6 col-md-6 col-lg-4">
							<label class="form-label">Categories</label>
							<el-form-item prop="categories">
								<el-select class="w-100 m-2" v-model="filterForm.categories" multiple collapse-tags
									collapse-tags-tooltip filterable :multiple-limit=3 placeholder="Select">
									<el-option v-for="item in bizTagsLoV" :key="item.id" :label="item.name"
										:value="item.id" />
								</el-select>
							</el-form-item>
						</div>
						<div class="col-xs-6 col-md-6 col-lg-4">
							<label class="form-label">Tags</label>
							<el-form-item prop="tags">
								<el-select class="w-100 m-2" v-model="filterForm.tags" multiple collapse-tags
									collapse-tags-tooltip placeholder="Select" filterable :multiple-limit=5>
									<el-option v-for="item in techTagsLoV" :key="item.id" :label="item.name"
										:value="item.id" />
								</el-select>
							</el-form-item>
						</div>

						<div class="pt-2 d-sm-flex justify-content-end">
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
	<!-- =======================
Title and Tabs END -->

	<!-- =======================
Hotel grid START -->
	<section class="pt-0">
		<div class="container">
			<div class="row g-4">
				<template v-for="item in availableWorkshops">
					<WorkshopCard :workshop="item"></WorkshopCard>
				</template>
			</div>
			<!-- Card item START -->

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

		</div>

	</section>
	<!-- =======================
Hotel grid END -->

	<el-drawer v-model="connectCloudPanel" title="Active Organization" direction="rtl" :size="drawerSize">
		<ConnectOrganization></ConnectOrganization>
	</el-drawer>

	<!-- <pre lang="json">{{ availableWorkshops }}</pre> -->
</template>

<style scoped lang="scss">

</style>

<route lang="yaml">
meta:
  layout: BasicTopNavigationLayout
  requiresAuth: true
</route>
