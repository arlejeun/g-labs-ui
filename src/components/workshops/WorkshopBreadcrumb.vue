<script setup lang="ts">
import type { ITree } from '@/interfaces/workshop'
import router from '@/router';
import { useWorkshopStore } from '@/stores/workshop';
import { ArrowRight } from '@element-plus/icons-vue'

const route = useRoute()
const urlParam = route.params.all.toString()
const wsId = urlParam.split('/')[0]

const wStore = useWorkshopStore()
const { workshopTree } = storeToRefs(wStore)
const { setTreeIndex } = wStore


</script>

<template>

  <div class="">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/' }">homepage</el-breadcrumb-item>
      <el-breadcrumb-item>promotion management</el-breadcrumb-item>
      <el-breadcrumb-item>promotion list</el-breadcrumb-item>
      <el-breadcrumb-item>promotion detail</el-breadcrumb-item>
    </el-breadcrumb>
  </div>

</template>

<style>

</style>
