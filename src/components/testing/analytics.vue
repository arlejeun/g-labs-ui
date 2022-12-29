<script setup lang="ts">

import { WS, type IWsBreadcrumb } from '@/interfaces/workshop';
import { useUserStore } from '@/stores/user';
import { useWorkshopStore } from '@/stores/workshop';
import { ElButton } from 'element-plus';
import { useGtag } from 'vue-gtag-next';

const userStore = useUserStore()
const wStore = useWorkshopStore()
const { event: gtagEvt, config } = useGtag()
const { workshopCreadcrub } = storeToRefs(wStore)
const { userId, userCompany, userType } = storeToRefs(userStore)


const addConfigParams = () => {
  config({
    'cookie_prefix': 'MyCookie',
    'user_company': userCompany.value,
    'user_type': userType.value
  })
}

const enterWorkshop = () => {
  gtagEvt('tutorial_begin', {
    'ws_name': (workshopCreadcrub.value[WS.Title] as IWsBreadcrumb).title,
    'userId': userId.value
  })
};

const exitWorkshop = () => {
  gtagEvt('tutorial_exit', {
    'ws_name': (workshopCreadcrub.value[WS.Title] as IWsBreadcrumb).title,
    'ws_chapter': (workshopCreadcrub.value[WS.Chapter] as IWsBreadcrumb)?.title,
    'userId': userId.value
  })
};

const completeWorkshop = () => {
  gtagEvt('tutorial_complete', {
    'ws_name': (workshopCreadcrub.value[WS.Title] as IWsBreadcrumb).title,
    'userId': userId.value
  })
};

const levelUp = () => {
  gtagEvt('level_up', {
    'level': 3,
    'ws_name': (workshopCreadcrub.value[WS.Title] as IWsBreadcrumb).title,
    'ws_chapter': (workshopCreadcrub.value[WS.Chapter] as IWsBreadcrumb)?.title,
    'ws_section': (workshopCreadcrub.value[WS.Section] as IWsBreadcrumb)?.title,
    'userId': userId.value
  })
};

const levelStart = () => {
  gtagEvt('level_start', {
    'level_name': (workshopCreadcrub.value[WS.Section] as IWsBreadcrumb)?.path,
    'ws_name': (workshopCreadcrub.value[WS.Title] as IWsBreadcrumb).title,
    'ws_chapter': (workshopCreadcrub.value[WS.Chapter] as IWsBreadcrumb)?.title,
    'ws_section': (workshopCreadcrub.value[WS.Section] as IWsBreadcrumb)?.title,
    'userId': userId.value
  })
};

const levelEnd = () => {
  gtagEvt('level_end', {
    'level_name': (workshopCreadcrub.value[WS.Section] as IWsBreadcrumb)?.title,
    'success': true,
    'ws_name': (workshopCreadcrub.value[WS.Title] as IWsBreadcrumb).title,
    'ws_chapter': (workshopCreadcrub.value[WS.Chapter] as IWsBreadcrumb)?.title,
    'ws_section': (workshopCreadcrub.value[WS.Section] as IWsBreadcrumb)?.title,
    'userId': userId.value
  })
};





</script>

<template>
  <section class="container">
    <h1>GA Events</h1>
    <el-button @click="enterWorkshop">Enter Workshop</el-button>
    <el-button @click="levelStart">Start Level</el-button>
    <el-button @click="levelUp">Level up</el-button>
    <el-button @click="levelEnd">End Level</el-button>
    <el-button @click="exitWorkshop">Exit workshop</el-button>
    <el-button @click="completeWorkshop">Complete Workshop</el-button>
    <el-button @click="addConfigParams">Edit Config</el-button>


  </section>
</template>

<style>

</style>
