<script setup lang="ts">
import { useWorkshopStore } from "@/stores/workshop";
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import WorkshopContent from "@/components/workshops/WorkshopContent.vue";
import { useUserStore } from '@/stores/user'
import type { ITree } from "@/interfaces/workshop";

const route = useRoute();

const wStore = useWorkshopStore();
const { workshopTreeKey, workshopTitle } = storeToRefs(wStore)
const { loadWorkshopById, setTreeIndexByPath, rebuildTree, setTreeIndex } = wStore


const userStore = useUserStore()
const { localization } = storeToRefs(userStore)

let urlParam = route.params.all.toString()
const slashIdx = urlParam.indexOf('/')
const wsId = urlParam.split('/')[0]
urlParam = urlParam.substr(slashIdx + 1)

const tree = ref()

onMounted(() => {
  loadWorkshopById(wsId).then(() => {
    setTreeIndexByPath(urlParam);
    tree.value?.setCurrentKey(workshopTreeKey.value, true);
  });

});

watch(localization, () => {
  rebuildTree()
  tree.value?.setCurrentKey(workshopTreeKey.value, true);
});

</script>

<template>
  <div>

    <div>
      <div class="row">
        <div class="col-12 col-md-8 pr-0 workshop">

          <div class="left-side common-layout">
            <el-container class="ws-body">
              <el-header class="ws-header">
                <!-- <h3 class="fs-3 ws-header">{{ workshopTitle }}</h3> -->
                <WorkshopBreadcrumb />
              </el-header>
              <el-container class="pt-1">
                <el-aside width="300px" class="ws-side">
                  <WorkshopNavigation />
                </el-aside>

                <el-main>
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

.ws-side-body {
  padding-top: 5ex;
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
