<script setup lang="ts">
import { useNotification } from '@kyvg/vue3-notification';

const { notify}  = useNotification()

// const displayNotification = ((event: any) => {
//   console.log(event);
//   notify({
//         title: 'Server Update',
//         text: event,
//         duration: -1,
//         type: 'info'
//       });
// })


// const { socket } = useSocketIO()

// wsClientService.socket.on('connected', displayNotification)

// wsClientService?.socket.on('msgToClient', displayNotification)

</script>

<template>
  <div class="websockets">
    <div class="main-div">

		<!-- <pre>{{isAuthenticated}}</pre>
		<pre>{{accounts}}</pre>
		<pre>{{inProgress}}</pre>
		<pre>{{result}}</pre>
		<pre>{{user}}</pre> -->

    </div>
  </div>
 
  <section class="">
	<div class="container">

	</div>
</section>

</template>

<style lang="scss">
  .title-text {
    text-align: left;
    color: var(--bs-primary)
  }
  .el-main .main-content {
      padding: 0px
  }

  .hightlight-section-content {
    padding-left: 1rem;
  }

  .image-icon {
    width: 150px;
    vertical-align: middle;
  }
  @media only screen and (min-width: 992px) {
    .hero-image {
      background-position: 66% 100%;
    }
  }
  @media only screen and (min-width: 768px)
  {
    .hero-image {
      background-position: 85% 100%;
    }
  }
</style>

<route lang="yaml">
meta:
  layout: BasicTopNavigationLayout
  title: Genesys Workshops Authentication
</route>
