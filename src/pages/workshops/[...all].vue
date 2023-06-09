<script setup lang="ts">

import { useWorkshopStore } from '@/stores/workshop';
import { WS, type IWsBreadcrumb } from '@/interfaces/workshop';
import { ElTooltip, ElButton, ElRow } from 'element-plus';

const title = useTitle()
const showNav = ref(true)
const showEnv = ref(true)
const wStore = useWorkshopStore()
const { workshopCreadcrub, nextButtonName } = storeToRefs(wStore)
const { nextStep } = wStore
const toggleNavigation = () => {
  showNav.value = !showNav.value
}
const navRef = ref()

const toggleEnv = () => {
  showEnv.value = !showEnv.value
}

const addProgress = () => {
  nextStep()
  navRef.value.setNewCurrentKey()
}

onBeforeRouteUpdate(async (to, from) => {
  if ((workshopCreadcrub.value[WS.Section] as IWsBreadcrumb)?.title) {
    title.value = (workshopCreadcrub.value[WS.Title] as IWsBreadcrumb)?.title + ' - ' +
      (workshopCreadcrub.value[WS.Chapter] as IWsBreadcrumb)?.title + ' - ' +
      (workshopCreadcrub.value[WS.Section] as IWsBreadcrumb)?.title
  } else if ((workshopCreadcrub.value[WS.Chapter] as IWsBreadcrumb)?.title) {
    title.value = wStore.workshopTitle + ' - ' +
      (workshopCreadcrub.value[WS.Chapter] as IWsBreadcrumb)?.title
  } else {
    title.value = wStore.workshopTitle
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
        <WorkshopNavigation ref="navRef" />
      </div>
      <div class="ws-content" :class="{ 'hide-nav': !showNav }">
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
            <el-divider />
            <div>
              <el-button type="primary" style="float: right;" @click="addProgress" size="large">{{
                nextButtonName
              }}</el-button>
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
.bq {
  padding: 10px;
  border-radius: 10px;
  color: #666 !important;
  font-style: italic;
}

.container.ws-body {
  & h1 {
    text-align: start;
    font-weight: 600;
  }
  & h2 {
    text-align: start;
    font-weight: 600;
    font-size: 18pt;
    color: var(--bs-orange);
    margin: 1rem 0;
  }
  & h3 {
    text-align: start;
    font-weight: 400;
    font-size: 16pt;
    color:var(--bs-orange);
    margin: 1rem 0;
  }
}

.bq-info {
  background-color: #fff2db;
  //color: #f1b37e
}

.bq-note {
  background-color: #e7f3fa;
  //color: #6ab1de
}

.bq-warn {
  background-color: #fae2e2;
  //color: #e16f6d
}

.bq-tip {
  background-color: #e6fae6;
  //color: #79c678
}

.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
  background-color: #23395d;
  color: white;
  border-color: unset;
}

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

.ws-content.hide-nav {
  width: calc(100% - 40px);
}

.ws-nav-min {
  width: 40px;
  padding-top: 40px;
  //padding-left: 0;
  //padding-right: 0;
}

.ws-body {
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
  color: var(--bs-orange);
}

.el-tree-node.is-current>.el-tree-node__content {
  color: var(--bs-orange);
}
</style>

<route lang="yaml">
meta:
  layout: BasicTopNavigationLayout
</route>
