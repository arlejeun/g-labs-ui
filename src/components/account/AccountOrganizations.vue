<script setup lang="ts">
import type { IDriveOrg, IDriveUser } from '@/interfaces'

const props = withDefaults(
  defineProps<{
    user: IDriveUser,
    admin?: boolean
  }>(),
  {
    admin: false,
  },
);

const { user: myUser, admin } = toRefs(props)
const user = ref({} as IDriveUser)

const orgs = computed(() => user.value?.orgs || [])

watchEffect(() => {
  if (myUser.value?.email) {
    if (admin && admin.value) {
      //lose reactivty when coming from users admin page form
      user.value = { ...myUser.value }
      // orgs.value = [...myOrgs.value]
    } else {
      //keep user reactivty of the profile of me user
      // orgs.value = myOrgs.value
      user.value = myUser.value
    }
  }
})

const assignedOrgs = computed(() => orgs.value.filter((organization) => organization.is_owned_by_gts))
const showAvailableOrgs = ref(false)

const orgsName = computed(() => {
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

const availableOrgs = computed(() => gtsOrgs.filter(o => !orgsName.value?.includes(o.name))) 

const toggleAvailableOrgs = () => {
  showAvailableOrgs.value = !showAvailableOrgs.value
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
                <AccountOrganizationSummary :org="org" :user="user" :assigned="false" />
              </div>
            </div>

            <div class="row mt-4">
              <h6>Managed organizations associated to your profile ({{ assignedOrgs.length }})</h6>
            </div>

            <div class="row">
              <div v-for="org in (assignedOrgs)" class="mb-4">
                <AccountOrganizationSummary :org="org" :user="user" :assigned="true" />
              </div>
            </div>




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
