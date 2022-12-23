<script setup lang="ts">
import type { ITree } from '@/interfaces/workshop'
import router from '@/router';
import { useWorkshopStore } from '@/stores/workshop';
import { onMounted, ref, type ComputedRef } from "vue";
import { useUserStore } from '@/stores/user'
import { ElTree } from 'element-plus';

const route = useRoute()

const showNav = ref(true)

const wStore = useWorkshopStore()
const { workshopTree } = storeToRefs(wStore)
const { workshopTreeKey, workshopTitle, workshopName } = storeToRefs(wStore)
const { loadWorkshopById, setTreeIndexByPath, rebuildTree, setTreeIndex, setTreeIndexByKey } = wStore

const tree = ref()

const userStore = useUserStore()
const { localization } = storeToRefs(userStore) //

const urlParam = ref(route.params.all.toString())
const slashIdx = urlParam.value.indexOf('/')
const wsId = urlParam.value.split('/')[0]
urlParam.value = urlParam.value.substr(slashIdx + 1)

const treeChange = (node: ITree) => {
  var treeIndex = node?.index || [];
  var path = ''
  treeIndex.forEach(idx => path += idx + '/')
  wStore.setTreeIndex(treeIndex);
  router.push(`/workshops/${wsId}/${node.path}`)
  workshopTreeKey.value = node.id
};

const treeData: ComputedRef<ITree[]> = computed(
  () => workshopTree.value || []
);

onMounted(() => {
  loadWorkshopById(wsId).then(() => {
    setTreeIndexByPath(urlParam.value);
    tree.value?.setCurrentKey(workshopTreeKey.value, true);
  });

});

onBeforeRouteUpdate(async (to, from) => {
  const newPath = to.path.replace(`/workshops/${workshopName.value}/`, '')

  setTreeIndexByPath(newPath.startsWith('./') ? newPath.substr(2) : newPath);
  tree.value?.setCurrentKey(workshopTreeKey.value, true);
})

watch(localization, () => {
  rebuildTree()
  setTreeIndexByKey();
  tree.value?.setCurrentKey(workshopTreeKey.value, true);
});

</script>

<template>


  <div>
    <el-tree class="nav-tree" ref="tree" node-key="id" accordion :data="treeData" @current-change="treeChange" />
  </div>

</template>

<style>
.dark .nav-tree .el-tree-node__content:hover {
  background-color: var(--bs-primary-rgb);
  color: white;
}

.nav-tree .el-tree-node.is-current>.el-tree-node__content {
  color: #ff6428;
  background-color: transparent;
}

.nav-tree .el-tree-node__label {
  font-size: 16px;
}

.nav-tree .el-tree-node {
  padding-bottom: 5px;
}
</style>
