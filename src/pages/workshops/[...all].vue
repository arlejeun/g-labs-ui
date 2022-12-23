<script setup lang="ts">
import { useWorkshopStore } from "@/stores/workshop";

const showNav = ref(true)

const toggleNavigation = () => {
  showNav.value = !showNav.value
}

</script>

<template>
  <div>

    <div>
      <div class="row">
        <div class="col-12 col-md-8 pr-0 workshop">

          <div class="left-side common-layout">
            <el-container class="workshop">
              <el-header class="ws-header">
                <!-- <h3 class="fs-3 ws-header">{{ workshopTitle }}</h3> -->
                <WorkshopBreadcrumb />
              </el-header>
              <el-container class="pt-1">
                <el-button v-show="!showNav" type="primary" text @click="toggleNavigation">[+]</el-button>
                <el-aside class="ws-nav" :class="{ hide: !showNav }">
                  <el-row class="pb-3" justify="end">
                    <el-button type="primary" text @click="toggleNavigation">[-]</el-button>
                  </el-row>

                  <WorkshopNavigation v-show="showNav" />
                </el-aside>

                <el-main class="ws-body">
                  <WorkshopContent />
                </el-main>
              </el-container>
            </el-container>
          </div>
        </div>

        <div class="col-12 col-md-4 px-0">
          <div class="right-side">
            <div class="right-side">
              <div class="workshop-layout">
                <div class="container-fluid my-5">
                  <div class="row mt-5">
                    <div class="col-12">
                      <div class="text-3xl font-semibold text-gray-9000 pb-2 mr-2">
                        <div class="row">
                          <div class="col">
                            <ConnectOrganization></ConnectOrganization>
                          </div>
                          <div class="col-auto">
                          </div>
                        </div>


                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
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
  width: 250px;
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
