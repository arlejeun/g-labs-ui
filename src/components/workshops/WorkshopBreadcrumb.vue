<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { useWorkshopStore } from '@/stores/workshop';
import { ArrowRight } from '@element-plus/icons-vue'

const userStore = useUserStore()
const { isMobile } = storeToRefs(userStore)
const wStore = useWorkshopStore()
const { workshopTitle, workshopChapter, workshopSection } = storeToRefs(wStore)

const router = useRouter()

// const gotoPath = () => {
//   router.push({ path: workshopChapter.value.path })
// }

</script>

<template>
  <div v-show="!isMobile">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/workshops' }">Workshops</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path:  workshopTitle.path }">{{workshopTitle.title}}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: workshopChapter.path }">{{workshopChapter.title}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{workshopSection.title}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>

</template>

<style>

</style>
