<script setup lang="ts">
import { useAxios } from '@vueuse/integrations/useAxios'
import { useWorkshopStore } from '@/stores/workshop'

const GLABS_APP_URL = import.meta.env.VITE_GLABS_APP_URL

const wStore = useWorkshopStore()
const formatter = 'YYYY-MM-DD HH:mm:ss:SSS'
const formatted = useDateFormat(useNow(), formatter)
const config = {
  headers:{
    Authorization: 'Bearer TBD',
    Accept: 'application/json, text/plain, */*'
  }
}
const url = `${GLABS_APP_URL}/demo/api/workshops.json`;

const { data, isLoading, isFinished: isWorkshopsLoaded, error } = useAxios(url, config)

watch(isWorkshopsLoaded, () => {
  wStore.setWorkshops(data.value?.data);
})

const availableWorkshops = computed(() => {
  return wStore.getAllWorkshops
})

// Reactivty
// watch(isFinished, async (newVal) => {
//   if (newVal) {
//     console.log(`${formatted.value} - watch: ${JSON.stringify(data.value)}`);
//   }
// })

// console.log(`${formatted.value} - test : ${JSON.stringify(publishedBooksMessage.value)}`);

</script>

<template>

<!-- <p>Loading: {{ isLoading.toString() }}</p>
  <p>Finished: {{ isFinished.toString() }}</p>
  <p>Error: {{ error?.toString() }}</p> -->

  <!-- =======================
Title and Tabs START -->
<section class="pt-0 pb-4">
	<div class="container position-relative">
    <h3 class="fs-3 text-primary mt-4">Workshops</h3>
    <p class="text-secondary">Genesys Workshops provide detailed instructions and open source code repositories to assist partners and customers in jump-starting your custom integrations with third-party products and complex solutions within Genesys Cloud.</p>

		<!-- Title and button START -->
		<div class="row">
			<div class="col-12">
				<!-- Meta START -->
				<div class="d-flex justify-content-between">
          <!-- Filter collapse button -->
          <input type="checkbox" class="btn-check" id="btn-check-soft">
          <label class="btn btn-primary-soft btn-primary-check mb-0" for="btn-check-soft" data-bs-toggle="collapse" data-bs-target="#collapseFilter" aria-controls="collapseFilter">
            <i class="bi fa-fe bi-sliders me-2"></i>Show Filters
          </label>

          <!-- tabs -->
          <ul class="nav nav-pills nav-pills-dark" id="tour-pills-tab" role="tablist">
            <!-- Tab item -->
            <li class="nav-item">
              <a class="nav-link rounded-start rounded-0 mb-0" href="hotel-list.html"><i class="bi fa-fw bi-list-ul"></i></a>
            </li>
            <!-- Tab item -->
            <li class="nav-item">
              <a class="nav-link rounded-end rounded-0 mb-0 active" href="hotel-grid.html"><i class="bi fa-fw bi-grid-fill"></i></a>
            </li>
          </ul>
				</div>
				<!-- Meta END -->
			</div>
		</div>
		<!-- Title and button END -->

		<!-- Collapse body START -->
		<div class="collapse" id="collapseFilter">
			<div class="card card-body bg-light p-4 mt-4 z-index-9">

				<!-- Form START -->
				<form class="row g-4">
					<!-- Input item -->
					<div class="col-md-6 col-lg-4">
						<div class="form-control-borderless">
							<label class="form-label">Enter Hotel Name</label>
							<input type="text" class="form-control form-control-lg">
						</div>
					</div>

					<!-- nouislider item -->
					<div class="col-md-6 col-lg-4">
						<div class="form-control-borderless">
							<label class="form-label">Price Range</label>
							<div class="position-relative">
								<div class="noui-wrapper">
									<div class="d-flex justify-content-between">
										<input type="text" class="text-body input-with-range-min">
										<input type="text" class="text-body input-with-range-max">
									</div>
									<div class="noui-slider-range mt-2" data-range-min='500' data-range-max='2000' data-range-selected-min='700' data-range-selected-max='1500'></div>
								</div>
							</div>
						</div>
					</div>

					<!-- Select item -->
					<div class="col-md-6 col-lg-4">
						<div class="form-size-lg form-control-borderless">
							<label class="form-label">Popular Filters</label>
							<select class="form-select js-choice border-0">
								<option value="">Select Option</option>
								<option>Recently search</option>
								<option>Most popular</option>
								<option>Top rated</option>
							</select>
						</div>
					</div>

					<!-- Customer rating -->
					<div class="col-md-6 col-lg-4">
						<div class="form-control-borderless">
							<label class="form-label">Customer Rating</label>
							<ul class="list-inline mb-0 g-3">
								<!-- 1 -->
								<li class="list-inline-item">
									<input type="checkbox" class="btn-check" id="btn-check-1">
									<label class="btn btn-white btn-primary-soft-check" for="btn-check-1">3+</label>
								</li>
								<!-- 2 -->
								<li class="list-inline-item">
									<input type="checkbox" class="btn-check" id="btn-check-2">
									<label class="btn btn-white btn-primary-soft-check" for="btn-check-2">3.5+</label>
								</li>
								<!-- 3 -->
								<li class="list-inline-item">
									<input type="checkbox" class="btn-check" id="btn-check-3">
									<label class="btn btn-white btn-primary-soft-check" for="btn-check-3">4+</label>
								</li>
								<!-- 4 -->
								<li class="list-inline-item">
									<input type="checkbox" class="btn-check" id="btn-check-4">
									<label class="btn btn-white btn-primary-soft-check" for="btn-check-4">4.5+</label>
								</li>
							</ul>
						</div>	
					</div>

					<!-- Star rating -->
					<div class="col-md-6 col-lg-4">
						<div class="form-control-borderless">
							<label class="form-label">Star Rating</label>
							<ul class="list-inline mb-0 g-3">
								<!-- 1 -->
								<li class="list-inline-item">
									<input type="checkbox" class="btn-check" id="btn-check-9">
									<label class="btn btn-white btn-primary-soft-check" for="btn-check-9">1<i class="bi bi-star-fill"></i></label>
								</li>
								<!-- 2 -->
								<li class="list-inline-item">
									<input type="checkbox" class="btn-check" id="btn-check-10">
									<label class="btn btn-white btn-primary-soft-check" for="btn-check-10">2<i class="bi bi-star-fill"></i></label>
								</li>
								<!-- 3 -->
								<li class="list-inline-item">
									<input type="checkbox" class="btn-check" id="btn-check-11">
									<label class="btn btn-white btn-primary-soft-check" for="btn-check-11">3<i class="bi bi-star-fill"></i></label>
								</li>
								<!-- 4 -->
								<li class="list-inline-item">
									<input type="checkbox" class="btn-check" id="btn-check-12">
									<label class="btn btn-white btn-primary-soft-check" for="btn-check-12">4<i class="bi bi-star-fill"></i></label>
								</li>
								<!-- 4 -->
								<li class="list-inline-item">
									<input type="checkbox" class="btn-check" id="btn-check-13">
									<label class="btn btn-white btn-primary-soft-check" for="btn-check-13">5<i class="bi bi-star-fill"></i></label>
								</li>
							</ul>
						</div>	
					</div>

					<!-- Select item -->
					<div class="col-md-6 col-lg-4">
						<div class="form-size-lg form-control-borderless">
							<label class="form-label">Hotel Type</label>
							<select class="form-select js-choice border-0">
								<option value="">Select Option</option>
								<option>Free Cancellation Available</option>
								<option>Pay At Hotel Available</option>
								<option>Free Breakfast Included</option>
							</select>
						</div>
					</div>

					<!-- Check box item -->
					<div class="col-12">
						<div class="form-control-borderless">
							<label class="form-label">Amenities</label>
							<div class="row g-3">
								<!-- checkbox -->
								<div class="col-sm-6 col-md-4 col-lg-3 col-xl-2">
									<div class="form-check">
										<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
										<label class="form-check-label h6 fw-light mb-0" for="flexCheckDefault">
											Air Conditioning
										</label>
									</div>
								</div>

								<!-- checkbox -->
								<div class="col-sm-6 col-md-4 col-lg-3 col-xl-2">
									<div class="form-check">
										<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault2">
										<label class="form-check-label h6 fw-light mb-0" for="flexCheckDefault2">
											Room Services
										</label>
									</div>
								</div>

								<!-- checkbox -->
								<div class="col-sm-6 col-md-4 col-lg-3 col-xl-2">
									<div class="form-check">
										<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault3">
											<label class="form-check-label h6 fw-light mb-0" for="flexCheckDefault3">
												Dining
											</label>
									</div>
								</div>

								<!-- checkbox -->
								<div class="col-sm-6 col-md-4 col-lg-3 col-xl-2">
									<div class="form-check">
										<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault4">
											<label class="form-check-label h6 fw-light mb-0" for="flexCheckDefault4">
												Caretaker
											</label>
									</div>
								</div>

								<!-- checkbox -->
								<div class="col-sm-6 col-md-4 col-lg-3 col-xl-2">
									<div class="form-check">
										<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault5">
											<label class="form-check-label h6 fw-light mb-0" for="flexCheckDefault5">
												Free Internet
											</label>
									</div>
								</div>
								
								<!-- checkbox -->
								<div class="col-sm-6 col-md-4 col-lg-3 col-xl-2">
									<div class="form-check">
										<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault6">
											<label class="form-check-label h6 fw-light mb-0" for="flexCheckDefault6">
												Business Service
											</label>
									</div>
								</div>

								<!-- checkbox -->
								<div class="col-sm-6 col-md-4 col-lg-3 col-xl-2">
									<div class="form-check">
										<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault7">
											<label class="form-check-label h6 fw-light mb-0" for="flexCheckDefault7">
												Bonfire
											</label>
									</div>
								</div>

								<!-- checkbox -->
								<div class="col-sm-6 col-md-4 col-lg-3 col-xl-2">
									<div class="form-check">
										<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault8">
											<label class="form-check-label h6 fw-light mb-0" for="flexCheckDefault8">
												Mask
											</label>
									</div>
								</div>

								<!-- checkbox -->
								<div class="col-sm-6 col-md-4 col-lg-3 col-xl-2">
									<div class="form-check">
										<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault9">
											<label class="form-check-label h6 fw-light mb-0" for="flexCheckDefault9">
												Spa
											</label>
									</div>
								</div>

								<!-- checkbox -->
								<div class="col-sm-6 col-md-4 col-lg-3 col-xl-2">
									<div class="form-check">
										<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault10">
											<label class="form-check-label h6 fw-light mb-0" for="flexCheckDefault10">
												Swimming pool
											</label>
									</div>
								</div>

								<!-- checkbox -->
								<div class="col-sm-6 col-md-4 col-lg-3 col-xl-2">
									<div class="form-check">
										<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault11">
											<label class="form-check-label h6 fw-light mb-0" for="flexCheckDefault11">
												Fitness Centre 
											</label>
									</div>
								</div>

								<!-- checkbox -->
								<div class="col-sm-6 col-md-4 col-lg-3 col-xl-2">
									<div class="form-check">
										<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault12">
											<label class="form-check-label h6 fw-light mb-0" for="flexCheckDefault12">
												Bar 
											</label>
									</div>
								</div>
							</div> <!-- Row END -->
						</div>
					</div>

					<!-- Button -->
					<div class="text-end align-items-center">
						<button class="btn btn-link p-0 mb-0">Clear all</button>
						<button class="btn btn-dark mb-0 ms-3">Apply filter</button>
					</div>
				</form>
				<!-- Form END -->
			</div>
		</div>
		<!-- Collapse body END -->

	</div>
</section>
<!-- =======================
Title and Tabs END -->

<!-- =======================
Hotel grid START -->
<section class="pt-0">
	<div class="container">
		<div class="row g-4">

			
      
      <!-- Card item START -->
			<template v-for="item in availableWorkshops" >
        <WorkshopCard :workshop="item"></WorkshopCard>
      </template>

			
		</div> <!-- Row END -->

		<!-- Pagination -->
		<div class="row">
			<div class="col-12">
				<nav class="mt-4 d-flex justify-content-center" aria-label="navigation">
					<ul class="pagination pagination-primary-soft d-inline-block d-md-flex rounded mb-0">
						<li class="page-item mb-0"><a class="page-link" href="#" tabindex="-1"><i class="fa-solid fa-angle-left"></i></a></li>
						<li class="page-item mb-0"><a class="page-link" href="#">1</a></li>
						<li class="page-item mb-0 active"><a class="page-link" href="#">2</a></li>
						<li class="page-item mb-0"><a class="page-link" href="#">..</a></li>
						<li class="page-item mb-0"><a class="page-link" href="#">6</a></li>
						<li class="page-item mb-0"><a class="page-link" href="#"><i class="fa-solid fa-angle-right"></i></a></li>
					</ul>
				</nav>
			</div>
		</div>
	</div>
</section>
<!-- =======================
Hotel grid END -->

  <!-- <pre lang="json">{{ availableWorkshops }}</pre> -->
</template>

<style scoped lang="scss">
</style>

<route lang="yaml">
meta:
  layout: BasicTopNavigationLayout
  title: Workshops
  requiresAuth: true
</route>
