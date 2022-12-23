<script setup lang="ts">
import { useWorkshopStore } from '@/stores/workshop'
import { useWorkspaceStore } from '@/stores/workspace';
import { getParameterByName } from '@/utils/string'
import { useRouteHash } from '@vueuse/router';
import { useUserStore } from '@/stores/user';

const workspaceStore = useWorkspaceStore()
const { isTokenActive, gsysCloudClient } = storeToRefs(workspaceStore)
const { refreshEnvironment } = workspaceStore
const routeHash = useRouteHash()

const wStore = useWorkshopStore()
const { workshops } = storeToRefs(wStore)
const { loadWorkshops } = wStore 


const formatter = 'YYYY-MM-DD HH:mm:ss:SSS'
const formatted = useDateFormat(useNow(), formatter)
const store = useUserStore()
const { isMobile } = storeToRefs(store)

const drawerSize = ref('45%')
drawerSize.value = isMobile.value ? '85%':'45%'
const connectCloudPanel = ref(false)

//const { data, isLoading, isFinished: isWorkshopsLoaded, error } = useAxios(url, config)
// const url = `http://localhost:5173/demo/api/workshops.json`;
// const { data, isLoading, isFinished: isWorkshopsLoaded, error } = useAxios(url, config)

//const { data, isLoading, isFinished: isWorkshopsLoaded, error } = useAxios('/workshops', config, GLabsApiClient)

// watch(isWorkshopsLoaded, () => {
//   setWorkshops(data.value);
// })
loadWorkshops()


watchEffect(async () => {
  //Environments
  //Token parameters must be read from the the oauth client redirects uri
  if (routeHash.value.includes('access_token')) {
    gsysCloudClient.value.access_token = getParameterByName('access_token')
    routeHash.value = ''
    refreshEnvironment()
  }

})

const availableWorkshops = computed(() => {
	return workshops.value
})

const connectToCloud = () => {
	connectCloudPanel.value = true
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
				<div class="col">
					<h3 class="fs-3 text-primary mt-4">Workshops</h3>
					<p class="text-secondary">Genesys Workshops provide detailed instructions and open source code
						repositories
						to assist partners and customers in jump-starting your custom integrations with third-party
						products and
						complex solutions within Genesys Cloud.</p>
				</div>
				<div class="col-auto pt-2">
					<el-button v-show="!isTokenActive" type="warning" @click.prevent="connectToCloud" text bg>Connect to Genesys</el-button>
					<el-button v-show="isTokenActive" type="success" @click.prevent="connectToCloud" text bg>Active Genesys Session</el-button>
				</div>
			</div>


			<!-- Title and button START -->
			<div class="row">
				<div class="col-12">
					<!-- Meta START -->
					<div class="d-flex justify-content-between">
						<!-- Filter collapse button -->
						<input type="checkbox" class="btn-check" id="btn-check-soft">
						<label class="btn btn-primary-soft btn-primary-check mb-0" for="btn-check-soft"
							data-bs-toggle="collapse" data-bs-target="#collapseFilter" aria-controls="collapseFilter">
							<i class="bi fa-fe bi-sliders me-2"></i>Show Filters
						</label>

						<!-- tabs -->
						<ul class="nav nav-pills nav-pills-dark" id="tour-pills-tab" role="tablist">
							<!-- Tab item -->
							<li class="nav-item">
								<a class="nav-link rounded-start rounded-0 mb-0" href="hotel-list.html"><i
										class="bi fa-fw bi-list-ul"></i></a>
							</li>
							<!-- Tab item -->
							<li class="nav-item">
								<a class="nav-link rounded-end rounded-0 mb-0 active" href="hotel-grid.html"><i
										class="bi fa-fw bi-grid-fill"></i></a>
							</li>
						</ul>
					</div>
					<!-- Meta END -->
				</div>
			</div>
			<!-- Title and button END -->

		</div>
	</section>
	<!-- =======================
Title and Tabs END -->

	<!-- =======================
Hotel grid START -->
	<section class="pt-0">
		<div class="container">
			<div class="row g-4">
				<template v-for="item in workshops">
					<WorkshopCard :workshop="item"></WorkshopCard>
				</template>
			</div>
			<!-- Card item START -->

			<div class="row">
				<div class="col-12">
					<nav class="mt-4 d-flex justify-content-center" aria-label="navigation">
						<ul class="pagination pagination-primary-soft d-inline-block d-md-flex rounded mb-0">
							<li class="page-item mb-0"><a class="page-link" href="#" tabindex="-1"><i
										class="fa-solid fa-angle-left"></i></a></li>
							<li class="page-item mb-0"><a class="page-link" href="#">1</a></li>
							<li class="page-item mb-0 active"><a class="page-link" href="#">2</a></li>
							<li class="page-item mb-0"><a class="page-link" href="#">..</a></li>
							<li class="page-item mb-0"><a class="page-link" href="#">6</a></li>
							<li class="page-item mb-0"><a class="page-link" href="#"><i
										class="fa-solid fa-angle-right"></i></a></li>
						</ul>
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
</route>
