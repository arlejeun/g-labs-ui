<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { useWorkshopStore } from '@/stores/workshop';
import { ArrowRight } from '@element-plus/icons-vue'

const userStore = useUserStore()
const { isMobile } = storeToRefs(userStore)
const wStore = useWorkshopStore()
const { workshopTitle, workshop, wsId, workshopName, page_index } = storeToRefs(wStore)
const { setTreeIndex, setTreeIndexByPath } = wStore



const test = computed(() => {
  return page_index.value})
  
const test1 = ref()
// test1.value = workShopPathMap.value.find(wsp => wsp.key == test.value)?.index

const chapter = ref('')
const subChapter = ref('')
</script>

<template>
  <div v-show="!isMobile">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/workshops/'+ wsId}">{{workshopTitle}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{workshopName}}</el-breadcrumb-item>
      <el-breadcrumb-item>promotion detail</el-breadcrumb-item>
    </el-breadcrumb>
  </div>

</template>

<style>

</style>
