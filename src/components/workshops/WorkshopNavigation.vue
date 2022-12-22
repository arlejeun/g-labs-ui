<script setup lang="ts">
import type { ITree } from '@/interfaces/workshop'
import router from '@/router';
import { useWorkshopStore } from '@/stores/workshop';

const route = useRoute()
const urlParam = route.params.all.toString()
const wsId = urlParam.split('/')[0]

const wStore = useWorkshopStore()
const { workshopTree } = storeToRefs(wStore)
const { setTreeIndex } = wStore
const treeChange = (node: ITree) => {
  let treeIndex = node?.index || [];
  let path = ''
  treeIndex.forEach(idx => path += idx + '/')
  setTreeIndex(treeIndex);
  router.push(`/workshops/${wsId}/${node.path}`)
};

</script>

<template>

  <div class="">
    <el-tree class="nav-tree" ref="tree" node-key="id" accordion :data="workshopTree" @current-change="treeChange" />
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
  font-size: 18px;
}

.nav-tree .el-tree-node {
  padding-bottom: 5px;
}



</style>
