<script setup lang="ts">
import type { ITree } from '@/interfaces/workshop'
import router from '@/router';
import { useUserStore } from '@/stores/user';
import { useWorkshopStore } from '@/stores/workshop';

const wStore = useWorkshopStore()
const { workshopTree, workshopTreeKey, urlParam, wsId } = storeToRefs(wStore)
const { setTreeIndexByKey, treeChange, rebuildTree, loadWorkshop, setTreeIndexByPath } = wStore
const userStore = useUserStore()
const { localization } = storeToRefs(userStore) 

const treeRef = ref()

watch(localization, () => {
  rebuildTree()
  setTreeIndexByKey();
  treeRef.value?.setCurrentKey(workshopTreeKey.value, true);
});

onMounted(() => {
  loadWorkshop().then(() => {
    setTreeIndexByPath(urlParam.value);
    treeRef.value?.setCurrentKey(workshopTreeKey.value, true);
  });

});

onBeforeRouteUpdate(async (to, from) => {
  const newPath = to.path.replace(`/workshops/${wsId.value}/`, '')
  setTreeIndexByPath(newPath.startsWith('./') ? newPath.substring(2) : newPath);
  treeRef.value?.setCurrentKey(workshopTreeKey.value, true);
})

</script>

<template>


  <div>
    <el-tree class="nav-tree" ref="treeRef" node-key="id" accordion :data="workshopTree" @current-change="treeChange" />
  </div>

</template>

<style>
.dark .nav-tree .el-tree-node__content:hover {
    background-color: var(--bs-primary-rgb);
    color:white;
}

.nav-tree .el-tree-node.is-current > .el-tree-node__content {
    color: #ff6428;
    background-color: transparent;
}

.nav-tree .el-tree-node__label {
  font-size: 16px;
  overflow-wrap: break-word;
}

.nav-tree .el-tree-node {
  padding-bottom: 5px;
}

    
</style>
