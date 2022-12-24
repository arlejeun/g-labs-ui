<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { useWorkshopStore } from '@/stores/workshop';
import { ArrowRight } from '@element-plus/icons-vue'

const userStore = useUserStore()
const { isMobile } = storeToRefs(userStore)
const wStore = useWorkshopStore()
const { workshopTree, wsId, workshopName, workshopTreeKey, urlParam } = storeToRefs(wStore)
const { setTreeIndex, setTreeIndexByPath } = wStore


const test = ref(workshopTreeKey.value)
const wsPath = ref()


</script>

<template>

<pre>{{ workshopTreeKey }}</pre>
<pre>{{ urlParam }}</pre>
  <div v-show="!isMobile">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/workshops/'+ wsId}">{{wsId}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{workshopName}}</el-breadcrumb-item>
      <el-breadcrumb-item>promotion detail</el-breadcrumb-item>
    </el-breadcrumb>
  </div>

</template>

<style>

</style>
