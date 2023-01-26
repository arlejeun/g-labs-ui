<script setup lang="ts">
import type { ITree } from '@/interfaces/workshop'
import router from '@/router';
import { useUserStore } from '@/stores/user';
import { useWorkshopStore } from '@/stores/workshop';
import { esWorkshopPreview } from "@/services/analytics";

const wStore = useWorkshopStore()
const { workshopTree, workshopProgress, workshopTreeKey, urlParam, wsId } = storeToRefs(wStore)
const { setTreeIndexByKey, treeChange, rebuildTree, loadWorkshop, setTreeIndexByPath } = wStore
const userStore = useUserStore()

const { localization } = storeToRefs(userStore)

const defaultProps = {
  children: 'children',
  label: 'label',
  disabled: 'disabled'
}

const treeRef = ref()

watch(localization, () => {
  loadWorkshop(true).then(() => {
    setTreeIndexByKey();
    setTimeout(() => { treeRef.value?.setCurrentKey(workshopTreeKey.value, true) }, 100);
  });
});

onMounted(() => {
  loadWorkshop(false).then(() => {
    setTreeIndexByPath(urlParam.value);
    treeRef.value?.setCurrentKey(workshopTreeKey.value, true);
  });

});

onBeforeRouteUpdate(async (to, from) => {
  const newPath = to.path.replace(`/workshops/${wsId.value}/`, '')
  setTreeIndexByPath(newPath.startsWith('./') ? newPath.substring(2) : newPath);
  treeRef.value?.setCurrentKey(workshopTreeKey.value, true);
  esWorkshopPreview();
})

const setNewCurrentKey = () => {
  treeRef.value?.setCurrentKey(workshopTreeKey.value, true)
  treeRef.value!.setCheckedKeys(workshopProgress.value, false)
}

defineExpose({ setNewCurrentKey })
</script>

<template>

  <div>
    <el-tree class="nav-tree" ref="treeRef" node-key="id" show-checkbox :data="workshopTree" default-expand-all
      :props="defaultProps" :default-checked-keys="workshopProgress" @current-change="treeChange" />
  </div>

</template>

<style>
.el-tree-node__content {
  height: unset;
  display: flex;
}

.el-tree-node {
  white-space: unset;
}

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
  overflow-wrap: break-word;
}

.nav-tree .el-tree-node {
  padding-bottom: 5px;
}
</style>
