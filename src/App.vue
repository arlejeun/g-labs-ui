<script setup lang="ts">

import { useSocketStore } from '@/stores/socket'
import socketioService from './services/socketio.service';

import { useI18n } from 'vue-i18n'
import { useUserStore } from './stores/user';

const { t, locale } = useI18n()
const store = useUserStore();

const { localization } = storeToRefs(store)

watch(localization,(newVal) => { //watch the getter
  //t.locale.value = newVal.value;
  locale.value = newVal;
},{
  immediate:true
});

const { notifyUser } = useSocketStore()
socketioService.setupSocketConnection(notifyUser)

onBeforeUnmount(() => {
  socketioService.disconnect()
})

</script>

<template>
  <notifications />
  <RouterView />
</template>

<style lang="scss">

#nprogress {
  pointer-events: none;
}

#nprogress .bar {
  background: var(--bs-orange);
  opacity: 0.75;
  position: fixed;
  z-index: 1031;
  top: 70px;
  left: 0;
  width: 100%;
  height: 4px;
}


.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

}
</style>
