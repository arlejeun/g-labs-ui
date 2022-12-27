<template>
  <!-- **************** MAIN CONTENT START **************** -->
  <main>
    <!-- ======================= Content START -->
    <section>
      <div class="container">
        <div class="row">
          <SidebarAccount />
          <AccountProfile />
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
  .container.profile {
    max-width: 80%;
  }
}
</style>
  
<route lang="yaml">
  meta:
    layout: BasicTopNavigationLayout
    title: Account Profile
    requiresAuth: true
  </route>
    