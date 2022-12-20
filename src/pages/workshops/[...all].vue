<script setup lang="ts">
import { useWorkshopStore } from "@/stores/workshop";
import type { IWorkshop } from "@/interfaces";
import VueMarkdown from "vue-markdown-render";
import { useRoute } from "vue-router";
import { useDateFormat, useNow } from "@vueuse/core";
import type { ComputedRef, VNode } from "vue";
import { onMounted, computed, ref, getCurrentInstance } from "vue";
import type { ITree, IWorkshopMenuItem } from "@/interfaces/workshop";
import router from '@/router'
import { slash } from "@antfu/utils";
 
const route = useRoute();

const wStore = useWorkshopStore();

const searchValue = ref("");
const wsName = computed(
  () =>
    (wStore.getWorkshopMenu.length > 0 && wStore.getWorkshopMenu[0].name) || ""
);
const wsMenu = computed(
  () => wStore.getWorkshopMenu.length > 0 && wStore.getWorkshopMenu[0].menus
);

var urlParam = route.params.all.toString()
const slashIdx = urlParam.indexOf('/')
const wsId = urlParam.split('/')[0]
urlParam = urlParam.substr(slashIdx+1) 


const mdProps = { html: true };

const tree = ref()

onMounted(() => {    
  wStore.loadWorkshop(wsId).then(()=>{
    wStore.setTreeIndexByPath(urlParam);
    tree.value!.setCurrentKey(wStore.getTreeKey, true); 
  });
});

const treeChange = (node: ITree) => {
  var treeIndex = node?.index || [];
  var path = ''
  treeIndex.forEach(idx=>path += idx + '/')
  wStore.setTreeIndex(treeIndex);
  router.push(`/workshops/${wsId}/${node.path}`)
};

const treeData: ComputedRef<ITree[]> = computed(
  () => wStore.getWorkshopTree || []
);
</script>

<template>
  <div>
    <!-- {{$route.params.id}} -->

    <div>
      <div class="row">
        <div class="col-12 col-md-8 pr-0 workshop">
          <div class="left-side common-layout">
            <el-container class="ws-body">
              <el-container class="ws-body">
                <el-aside width="300px" class="ws-side">
                  <el-header class="ws-side-header ws-search">
                    <el-input
                      v-model="searchValue"
                      placeholder="Search..."
                      clearable
                    >
                    </el-input>
                  </el-header>
                  <div class="ws-side-body">
                    <el-tree
                      ref="tree"
                      node-key="id"
                      accordion
                      :data="treeData"
                      @current-change="treeChange"
                    />
                  </div>
                </el-aside>

                <el-main>
                  <el-header class="ws-header">
                    <h3 class="fs-3 ws-header">{{ wsName }}</h3>
                  </el-header>
                  <!--el-carousel height="800px" :autoplay="false" trigger="click">
                  <el-carousel-item v-for="item in wStore.getWorkshopPage" :key="item"-->
                  <vue-markdown
                    :options="mdProps"
                    :source="wStore.getWorkshopPage"
                  />
                  <!--/el-carousel-item>
                </el-carousel-->
                </el-main>
              </el-container>
            </el-container>
          </div>
        </div>

        <div class="col-12 col-md-4 px-0">
          <div class="right-side">
            <div class="workshop-layout">
              <div class="container-fluid my-5">
                <div class="row mt-5">
                  <div class="col-12">
                    <div
                      class="text-3xl font-semibold text-gray-9000 pb-2 mr-2"
                    >
                      <div class="row">
                        <div class="col">
                          <h1 class="mb-4 p-1 text-left">Environments</h1>
                        </div>
                        <div class="col-auto"></div>
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
  background-color: white;
}
.ws-header {
  color: #ff6428;
  background-color: white;
}
.ws-side {
  color: #ccc;
  background-color: #23395d;
}
.ws-side-body {
  padding-top: 5ex;
}

.ws-side-header {
  height: 150px;
  font-size: 18px;
  background-color: #ff6428;
}
.ws-search {
  padding-top: 50px;
  color: #23395d;
}

.ws-body {
  padding-top: 0px;
  padding-bottom: 0px;
  min-height: 1000px;
}

// ----------
.el-tree {
  margin-left: 15px;
  background-color: inherit;
}
.tree-is-top > .el-tree-node__content {
  font-size: 18px;
  color: #ff6428;
}
.el-tree-node.is-current > .el-tree-node__content {
  color: #ff6428;
}
.tree > .el-tree-node__content {
  color: #aaa;
}
.tree > .el-tree-node__content:hover {
  background-color: #ccf;
  color: #555;
}
.el-tree-node__label {
  font-size: 20px;
}
.is-current > .el-tree-node__content {
  //  color: #333;
}
.el-tree-node {
  padding-bottom: 5px;
}
.tree-is-top > .el-tree-node__children > div {
  //width: 25%;
}
</style>

<route lang="yaml">
meta:
  layout: BasicTopNavigationLayout
</route>
