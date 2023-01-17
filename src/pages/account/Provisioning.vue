<script setup lang="ts">import { useUserStore } from '@/stores/user';


const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const computedOrgs = computed(() => user.value.orgs || [])
const userId = computed(() => user.value.id || 0)

</script>
<template>

  <!-- Header END -->

  <!-- **************** MAIN CONTENT START **************** -->
  <main>

    <!-- =======================
  Content START -->
    <section>
      <div class="container pe-2" style="max-width: inherit;">
        <div class="row justify-content-center">
          <SidebarAccount />
          <account-organizations :orgs="computedOrgs" :userId="userId"></account-organizations>
        </div>
      </div>
    </section>
    <!-- =======================
  Content END -->

  </main>
  <!-- **************** MAIN CONTENT END **************** -->

</template>
  
<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
  
<route lang="yaml">
  meta:
    layout: BasicTopNavigationLayout
    title: Organizations Info
    requiresAuth: true
  </route>
  