<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import type { IDriveOrg } from '@/interfaces'

const userStore = useUserStore()
const { orgs } = storeToRefs(userStore)
const selfManagedOrgs = computed(() => orgs.value.filter((organization) => organization.is_owned_by_gts))
const showAvailableOrgs = ref(false)
const hasManagedOrgs = computed(() => {
  selfManagedOrgs.value?.length > 0
})

const orgsName = computed(()=> {
  return orgs.value.map(o => o.name)
})

const gtsOrgs = [

  {
    "region": "us_east_1",
    "name": "purecloudnow",
    "description": "This organization is the go-to org when you want to demo a Genesys Cloud feature. This organization helps you get familiar with Genesys Cloud workspace for supervisors and agents."
  },
  {
    "region": "us_east_1",
    "name": "purecloudnowadmin",
    "description": "This organization is a clone of PureCloudNow without active telephony. It is used to show administration and configuration tasks for Administrators"
  },
  // {
  //   "region": "us_east_1",
  //   "orgName": "purecloudnowdev",
  // },
  { //GC1 Org
    "region": "us_west_2",
    "name": "GC1",
    "description": "This organization is restricted to features available in Genesys Cloud 1"
  },
  { //GC2 Org
    "region": "us_west_2",
    "name": "GC2",
    "description": "This organization is restricted to features available in Genesys Cloud 2"
  }
] as IDriveOrg[]

const availableOrgs = gtsOrgs.filter(o => !orgsName.value?.includes(o.name))
// const availableOrgs = gtsOrgs.filter(orgs.value.name)

const toggleAvailableOrgs = () => {
  showAvailableOrgs.value = !showAvailableOrgs.value
}

function isOrgActive(org: IDriveOrg): boolean {
  return true
}

</script>

<template>
  <!-- Main content START -->
  <div class="col-lg-9 col-xl-9" style="max-width: 1600px;">

    <div class="d-grid mb-0 d-lg-none w-100">
      <button class="btn btn-primary mb-4" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasSidebar"
        aria-controls="offcanvasSidebar">
        <i class="fas fa-sliders-h"></i> Menu
      </button>
    </div>

    <!-- <enviroment-organization></enviroment-organization> -->

    <div class="card border bg-transparent">
      <!-- Card header -->
      <div class="card-header bg-transparent border-bottom">
        <h4 class="card-header-title text-primary">Provisioning of your Demo environments</h4>
      </div>

      <!-- Card body START -->
      <div class="card-body p-0">

        <!-- Tabs -->


        <!-- Tabs content START -->
        <div class="tab-content p-2 p-sm-4">

          <!-- Tab content item START -->
          <div class="tab-pane fade show active">
            <div class="row pt-1 pb-2 mb-2 align-items-center">
              <h6>Looking for an organization?</h6>
              <div class="col-xs-12 col-lg-8">
                <el-alert
                  title="Genesys Tech Acceleration is providing access to managed Genesys Cloud organization, formerly known as demo organizations. You can request an access to provision your user with one of these organization"
                  type="info" :closable="false" />
              </div>
              <div class="col-auto">
                <el-button v-show="!showAvailableOrgs" type="primary" bg text @click.prevent="toggleAvailableOrgs">Show
                  organizations</el-button>
                <el-button v-show="showAvailableOrgs" type="warning" bg text @click.prevent="toggleAvailableOrgs">Hide
                  organizations</el-button>

              </div>
            </div>

            <div v-show="showAvailableOrgs" class="row">
              <div v-for="org in (availableOrgs)">
              <AccountOrganizationSummary :org="org" :active="false"/>
            </div>
            </div>
          
            <div class="row mt-4">
              <h6>Managed organizations associated to your profile ({{ selfManagedOrgs.length }})</h6>
            </div>

            <div class="row">
              <div v-for="org in (selfManagedOrgs)" class="mb-4">
              <AccountOrganizationSummary :org="org" :active="true" />
            </div>
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
