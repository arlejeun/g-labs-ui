<script setup lang="ts">
import type { ITree } from '@/interfaces/workshop'
import router from '@/router';
import { useUserStore } from '@/stores/user';
import { useWorkshopStore } from '@/stores/workshop';
import { ArrowRight } from '@element-plus/icons-vue'

const route = useRoute()
const urlParam = route.params.all.toString()
const wsId = urlParam.split('/')[0]

const userStore = useUserStore()
const { isMobile } = storeToRefs(userStore)

const wStore = useWorkshopStore()
const { workshopTree } = storeToRefs(wStore)
const { setTreeIndex } = wStore


</script>

<template>

  <div v-show="!isMobile">
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
