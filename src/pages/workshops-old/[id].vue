<script setup lang="ts">
import { useAxios } from '@vueuse/integrations/useAxios'
import { useWorkshopStore } from '@/stores/workshop'
import type { IWorkshop } from '@/interfaces';
import { useTitle } from '@vueuse/core'

const route = useRoute()
const title = useTitle()
title.value = `${route.params?.id} | Workshop` as string


const wStore = useWorkshopStore()
const workshops = wStore.getAllWorkshops
const formatter = 'YYYY-MM-DD HH:mm:ss:SSS'
const formatted = useDateFormat(useNow(), formatter)


//const workshopUrl = `https://workshop.genesys.com/workshops-gdemo/workshop-${route.params.id}/`
const workshopUrl = `https://workshop.genesys.com/workshops-gdemo/workshop-cxAsCodeDevlab/`

function workshopDefaultName(workshop: IWorkshop) {
  if (workshop.name && workshop.name.length > 0) {
    return workshop.name;
  } else {
    const idname = workshop.title.replace(/\s/g, "-");
    return idname;
  }
}


//https://workshop.genesys.com/workshops-gdemo/workshop-cxAsCodeDevlab/ . --> ok
// https://workshop.genesys.com/workshops-gdemo/workshop-Automation-with-CX-as-Code/ --> ko
</script>

<template>
  <div>
    <!-- {{$route.params.id}} -->

    <div>
    <div class="row">
      <div
        class="col-12 col-md-8 pr-0">
        <div class="left-side">
          <iframe
            ref="workshopIframe"
            class="iframe-worshop"
            :src="workshopUrl"
            height="100%"
            width="100%"
          >
            <!-- 'https://workshop.genesys.com/workshops/' + workshopId + '/' -->
          </iframe>

        </div>
      </div>

      <div class="col-12 col-md-4 px-0">
        <div class="right-side">
          <div class="workshop-layout">
            <div class="container-fluid my-5">
              <div class="row mt-5">
                <div class="col-12">
                  <div class="text-3xl font-semibold text-gray-9000 pb-2 mr-2">
                    <div class="row">
                      <div class="col">
                        <h1 class="mb-4 p-1 text-left">Environments</h1>
                        <ConnectOrganization></ConnectOrganization>
                      </div>
                      <div class="col-auto">
                      </div>
                    </div>

                  
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>


  </div>

<!-- <p>Loading: {{ isLoading.toString() }}</p>
  <p>Finished: {{ isFinished.toString() }}</p>
  <p>Error: {{ error?.toString() }}</p> -->


</template>

<style lang="scss">

  iframe {
    height:100vh
  }

</style>

<route lang="yaml">
meta:
  layout: BasicTopNavigationLayout
  title: Workshop Detail
  requiresAuth: true
</route>
