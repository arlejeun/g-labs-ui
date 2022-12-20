<script setup lang="ts">
import AccountOrganizationSummary from '../organizations/AccountOrganizationSummary.vue'
import { useUserStore } from '@/stores/user'
import type { IDriveOrg } from '@/interfaces'

const userStore = useUserStore()
const { customer, orgs } = storeToRefs(userStore)
const selfManagedOrgs = computed(() => orgs.value.filter((organization) => organization.is_owned_by_gts))
const customOrgs = computed(() => orgs.value.filter((organization) => !organization.is_owned_by_gts))

function isOrgActive(org: IDriveOrg): boolean {
  return true
}

</script>

<template>
  <!-- Main content START -->
  <div class="col-lg-8 col-xl-9 ps-xl-5">

    <!-- Offcanvas menu button -->
    <div class="d-grid mb-0 d-lg-none w-100">
      <!-- <button class="btn btn-primary mb-4" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasSidebar"
        aria-controls="offcanvasSidebar">
        <i class="fas fa-sliders-h"></i> Menu
      </button> -->
    </div>

    <div class="card border bg-transparent">
      <!-- Card header -->
      <div class="card-header bg-transparent border-bottom">
        <h4 class="card-header-title text-primary">My Organizations</h4>
      </div>

      <!-- Card body START -->
      <div class="card-body p-0">

        <!-- Tabs -->
        <ul class="nav nav-tabs nav-bottom-line nav-responsive nav-justified">
          <li class="nav-item">
            <a class="nav-link mb-0 active" data-bs-toggle="tab" href="#tab-1"><i
                class="bi bi-box-fill fa-fw me-1"></i>Demonstrations</a>
          </li>
          <li class="nav-item">
            <a class="nav-link mb-0" data-bs-toggle="tab" href="#tab-2"><i
                class="bi bi-wrench-adjustable fa-fw me-1"></i>Development</a>
          </li>
        </ul>

        <!-- Tabs content START -->
        <div class="tab-content p-2 p-sm-4" id="nav-tabContent">

          <!-- Tab content item START -->
          <div class="tab-pane fade show active" id="tab-1">

            <div class="row pt-1 pb-2 mb-2">
              <div class="col">
                <h6>Hands-on orgnizations managed by GTS ({{ selfManagedOrgs.length }})</h6>
              </div>
              <div class="col-auto">
                <div class="mt-2 mt-md-0">
                  <a href="#" class="btn btn-primary-soft mb-0 mr-1">Add Org</a>
                </div>

              </div>
            </div>

            <div v-for="org in (selfManagedOrgs)" class="mb-4">
              <AccountOrganizationSummary :org="org" :active="isOrgActive(org)" />
            </div>

          </div>
          <!-- Tabs content item END -->

          <!-- Tab content item START -->
          <div class="tab-pane fade" id="tab-2">
            <div class="row pt-1 pb-2 mb-2">
              <div class="col">
                <h6>Development Organizations (1)</h6>
              </div>
              <div class="col-auto">
                <div class="mt-2 mt-md-0">
                  <a href="#" class="btn btn-primary-soft mb-0 mr-1">Add Org</a>
                </div>

              </div>
            </div>



            <!-- Card item START -->
            <!-- Card item START -->
            <div class="card border mb-4">
              <!-- Card header -->
              <div class="card-header d-md-flex justify-content-md-between align-items-center">
                <!-- Icon and Title -->
                <div class="d-flex align-items-center">
                  <div class="icon-lg bg-light rounded-circle flex-shrink-0"><i class="fa-solid fa-plane"></i>
                  </div>
                  <!-- Title -->
                  <div class="ms-2">
                    <h6 class="card-title mb-0">SC1</h6>
                    <ul class="nav nav-divider small">
                      <li class="nav-item">Region: us-europe</li>
                      <li class="nav-item">Dev Org</li>
                    </ul>
                  </div>
                </div>

                <!-- Button -->
                <div class="mt-2 mt-md-0">
                  <a href="#" class="btn btn-primary-soft mb-0 mr-1">Connect</a>
                </div>
              </div>

            </div>
            <!-- Card item END -->
            <!-- Card item END -->
          </div>
          <!-- Tabs content item END -->

        </div>

      </div>
      <!-- Card body END -->
    </div>

  </div>

  <!-- <pre>{{orgs}}</pre> -->
  <!-- <pre>{{customer}}</pre> -->
  <!-- Main content END -->
</template>

<style>

</style>
