<script setup lang="ts">
import type { IWsBreadcrumb } from '@/interfaces/workshop';
import { useUserStore } from '@/stores/user';
import { useWorkshopStore } from '@/stores/workshop';
import { ArrowRight } from '@element-plus/icons-vue'
import { ElBreadcrumb, ElBreadcrumbItem } from 'element-plus';

const userStore = useUserStore()
const { isMobile } = storeToRefs(userStore)
const wStore = useWorkshopStore()
const { workshopCreadcrub } = storeToRefs(wStore)

const router = useRouter()

// const gotoPath = () => {
//   router.push({ path: workshopChapter.value.path })
// }

</script>

<template>
  <div v-show="!isMobile">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item v-for="item in (workshopCreadcrub as IWsBreadcrumb[])" :to="{ path: item.path }">
        {{ item.title }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>

</template>

<style>
.el-breadcrumb__item {
  cursor: pointer;
}
</style>
