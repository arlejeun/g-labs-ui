<script setup lang="ts">

const id = useStorage('latest', '/workshops/Genesys-Dialog-Engine-Build-a-Bot', sessionStorage) // returns Ref<string>
const router = useRouter()

const redirectTest = () => {
  //router.replace({path: '/workshops/Genesys-Dialog-Engine-Build-a-Bot'})
  //router.replace({path: '/workshops/Genesys-Dialog-Engine-Build-a-Bot'})
  //router.go(-1)
}

onMounted(() => {
    console.log('id : ' + id.value)
    //redirectTest()
  })


</script>
<template>
  <!-- Header END -->

  <!-- **************** MAIN CONTENT START **************** -->
  <main>

    <!-- =======================
  Content START -->
    <section class="pt-3">
      <el-button @click="redirectTest"></el-button>
      <EnviromentOrganization></EnviromentOrganization>
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
