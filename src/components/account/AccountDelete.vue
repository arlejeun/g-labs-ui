<script setup lang="ts">

import { useUserStore } from '@/stores/user';
const userStore = useUserStore()
const { removeUserProfile } = userStore
const deleteTag = ref(false)

const deleteProfile = async () => {
	if (deleteTag.value) {
		removeUserProfile()
	}
}

</script>

<template>

	<div class="card border">
		<!-- Card header -->
		<div class="card-header border-bottom">
			<h4 class="card-header-title">Delete my account</h4>
		</div>

		<!-- Card body START -->
		<div class="card-body">
			<h6>Reminder...</h6>
			<ul>
				<li>
					<p>If you delete your account, you will lose your all data.</p>
				</li>
			</ul>
			<div class="form-check my-4">
				<el-checkbox v-model="deleteTag" label="Yes, I'd like to delete my account" />
			</div>
			
			<div class="pt-2 d-sm-flex justify-content-end">
				<el-button type="danger" @click="deleteProfile()">Delete my account</el-button>
			</div>

		</div>
		<!-- Card body END -->
	</div>

</template>

<style>

</style>
