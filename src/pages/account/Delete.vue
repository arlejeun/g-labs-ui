<template>

  <!-- Header END -->

  <!-- **************** MAIN CONTENT START **************** -->
  <main>

    <!-- =======================
  Content START -->
    <section>
      <div class="container">
        <div class="row">
          <SidebarAccount />
          <AccountDelete />
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
  </route>
  