<script setup lang="ts">
</script>
<template>
  <!-- **************** MAIN CONTENT START **************** -->
  <main>
    <!-- ======================= Content START -->
    <section>
      <div class="container" style="max-width: inherit;">
        <div class="row justify-content-center">
          <SidebarAccount />
          <CustomerRecord />
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
  