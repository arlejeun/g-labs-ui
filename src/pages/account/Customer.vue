<script setup lang="ts">

import { useUserStore } from '@/stores/user';

const userStore = useUserStore()
const { user, isStatusActive, customer } = storeToRefs(userStore)

</script>
<template>
  <!-- **************** MAIN CONTENT START **************** -->
  <main>
    <!-- ======================= Content START -->
    <section>
      <div class="container" style="max-width: inherit;">
        <div class="row justify-content-center">
          <SidebarAccount />
          <!-- <CustomerRecord /> -->
          <user-customer-record :myCustomer="customer"></user-customer-record>
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
    title: Customer Record
    requiresAuth: true
  </route>
  