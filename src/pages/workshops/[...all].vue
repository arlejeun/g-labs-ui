<script setup lang="ts">

import { useWorkshopStore } from '@/stores/workshop';

const showNav = ref(true)
const showEnv = ref(true)
const title = useTitle()
const wStore = useWorkshopStore()
const { workshopTitle, workshopChapter, workshopSection } = storeToRefs(wStore)


const toggleNavigation = () => {
  showNav.value = !showNav.value
}

const toggleEnv = () => {
  showEnv.value = !showEnv.value
}

onMounted(() => {
});

onBeforeRouteUpdate(async (to, from) => {
  if( workshopSection.value?.title) {
    title.value = workshopTitle.value?.title + ' - ' + workshopChapter.value?.title + ' - ' + workshopSection.value?.title
  } else if ( workshopChapter.value?.title) {
    title.value = workshopTitle.value?.title + ' - ' + workshopChapter.value?.title
  } else {
      title.value = workshopTitle.value?.title
  }

 })

</script>

<template>
  <section class="workshop pt-4">
    <div class="row ps-4">
      <WorkshopBreadcrumb />
    </div>
    <div class="row">
      <div v-show="!showNav" class="ws-nav-min">
        <el-tooltip class="box-item" effect="dark" content="Show navigation" placement="right">

          <el-button type="primary" text @click="toggleNavigation">[+]</el-button>
        </el-tooltip>
      </div>
      <div v-show="showNav" class="ws-nav">
        <el-row class="pb-3" justify="end">
          <el-tooltip class="box-item" effect="dark" content="Hide navigation" placement="right">
            <el-button type="primary" text @click="toggleNavigation">[-]</el-button>
          </el-tooltip>
        </el-row>
        <WorkshopNavigation />
      </div>
      <div class="ws-content" :class="{'hide-nav': !showNav}">
        <div v-if="!showEnv" class="row">

          <div class="col-xl-11 col-lg-11 col-md-11">
            <div class="container ws-body">
              <WorkshopContent />
            </div>
          </div>

          <div class="col-xl-1 col-lg-1 col-md-1 ">
            <div class="row justify-content-end">
              <el-tooltip class="box-item" effect="dark" content="Show organization" placement="left">
                <el-button type="primary" text @click="toggleEnv">[+]</el-button>
              </el-tooltip>

            </div>
          </div>

        </div>

         <div v-if="showEnv" class="row">

          <div class="col-xl-8 col-lg-8 col-md-9">
            <div class="container ws-body">
              <WorkshopContent />
            </div>
          </div>

          <div class="col-xl-4 col-lg-4 col-md-3 ">
            <div class="row justify-content-end">
              <div class="col">
                <el-tooltip class="box-item" effect="dark" content="Hide organization" placement="left">
                <el-button type="primary" text @click="toggleEnv">[-]</el-button>
              </el-tooltip>
              </div>
             </div>
             <div class="row">
              <ConnectOrganization></ConnectOrganization>
             </div>
             
            </div>

        </div>

  


      </div>
     
     
     
    </div>
  </section>
</template>

<style lang="scss">
.workshop {
  height: "100%";
  width: "100%";
  // background-color: white;
}

.ws-header {
  color: #ff6428;

}

.ws-nav {
  width: 300px;
  margin-top: 40px;
}

.ws-content {
  width: calc(100% - 300px);
}

.ws-content.hide-nav{
  width:calc(100% - 40px);
}

.ws-nav-min {
  width: 40px;
  padding-top: 40px;
  //padding-left: 0;
  //padding-right: 0;
}

.ws-body{
  padding-top: 40px;
}

.ws-nav.hide {
  display: none;
}

.ws-body img,
#body .video-container {
  margin: 3rem auto;
  display: block;
  text-align: center;
}

.el-tree {
  margin-left: 15px;
  background-color: inherit;
}

.tree-is-top>.el-tree-node__content {
  font-size: 18px;
  color: #ff6428;
}

.el-tree-node.is-current>.el-tree-node__content {
  color: #ff6428;
}
</style>

<route lang="yaml">
meta:
  layout: BasicTopNavigationLayout
</route>
