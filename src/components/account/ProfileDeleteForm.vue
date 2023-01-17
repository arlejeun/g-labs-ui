<script setup lang="ts">

import type { IDriveUser } from '@/interfaces';
import { useUserStore } from '@/stores/user';
const userStore = useUserStore()
const { removeUserProfile } = userStore
const deleteTag = ref(false)

const props = defineProps<{
	user: IDriveUser,
	admin?: boolean
}>()

const { user: myUser, admin } = toRefs(props)
const user = ref({} as IDriveUser)

watchEffect(() => {
	if (admin && admin.value) {
		user.value = { ...myUser.value }
	}
	else {
		user.value = myUser.value
	}

})

const deleteProfile = async () => {
	if (deleteTag.value) {
		removeUserProfile()
	}
}

const createdDate = computed(() => {
	return user.value?.date_created ?
		useDateFormat(user.value?.date_created, 'YYYY-MM-DD H:mma').value
		: 'N/A'
})

const createdAgo = computed(() => {
	return user.value?.date_created ?
		useTimeAgo(user.value?.date_created).value
		: 'N/A'
})

const updatedAgo = computed(() => {
	return user.value?.date_updated ?
		useTimeAgo(user.value?.date_updated).value
		: 'N/A'
})

const updatedDate = computed(() => {
	return user.value?.date_updated ?
		useDateFormat(user.value?.date_updated, 'YYYY-MM-DD H:mma').value
		: 'N/A'
})

const approvedDate = computed(() => {
	return user.value?.type == 'Internal' ?
		useDateFormat(user.value?.date_created, 'YYYY-MM-DD H:mma').value
		: (user.value?.date_approved ? useDateFormat(user.value?.date_approved, 'YYYY-MM-DD H:mma').value : 'N/A')
})

const approvedAgo = computed(() => {
	return user.value?.type == 'Internal' ?
		useTimeAgo(user.value?.date_created).value
		: (user.value?.date_approved ? useTimeAgo(user.value?.date_approved).value : 'N/A')
})

const loginDate = computed(() => {
	return user.value?.date_lastLogin ?
		useDateFormat(user.value?.date_lastLogin, 'YYYY-MM-DD H:mma').value
		: 'N/A'
})

const loginAgo = computed(() => {
	return user.value?.date_lastLogin ?
		useTimeAgo(user.value?.date_lastLogin).value
		: 'N/A'
})


const expiredDate = computed(() => {
	return user.value?.date_expired ?
		useDateFormat(user.value?.date_expired, 'YYYY-MM-DD H:mma')
		: "N/A"
})

const expiredAgo = computed(() => {
	return user.value?.date_expired ?
		useTimeAgo(user.value?.date_expired).value
		: 'N/A'
})

const activities = computed(() => {
	return [

		{
			content: 'User expired - ' + expiredAgo.value,
			timestamp: expiredDate.value as string,
			type: 'warning' as "primary" | "success" | "warning" | "info",
			hollow: true
		},
		{
			content: 'Last Login - ' + loginAgo.value,
			timestamp: loginDate.value as string,
			color: '#0bbd87',
			type: undefined
		},
		{
			content: 'User updated - ' + updatedAgo.value,
			timestamp: updatedDate.value as string,
			type: 'primary' as "primary" | "success" | "warning" | "info",
			hollow: true,
		},
		{
			content: 'User approved - ' + approvedAgo.value,
			timestamp: approvedDate.value as string,
			type: 'primary' as "primary" | "success" | "warning" | "info",
			hollow: true,
		},
		{
			content: 'User created - ' + createdAgo.value,
			timestamp: createdDate.value as string,
			type: 'primary' as "primary" | "success" | "warning" | "info",
			hollow: true,
		}
	]
})

</script>

<template>

	<div class="card border">
		<!-- Card header -->
		<div class="card-header">
			<h5 class="card-header-title">Delete user profile</h5>
		</div>

		<!-- Card body START -->
		<div class="card-body">

			<div class="row">
				<div class="col">
					<el-alert
						title="Important Reminder"
						type="error"
						:closable="false"
						description="If you delete your account, you will lose your all data."
					/>
					
					<div class="form-check my-4">
						<el-checkbox v-model="deleteTag" label="Yes, I'd like to delete my account" />
						
					</div>

					<div class="pt-2 d-sm-flex">
						<el-button type="danger" @click="deleteProfile()">Delete my account</el-button>
					</div>
				</div>
				<div class="col-auto">
					<div v-show="createdAgo != 'N/A'" class="col-auto">
						<!-- Timeline Experimentation -->
						<el-timeline>
							<template v-for="(activity, index) in activities" :key="index">
								<el-timeline-item v-show="activity.timestamp != 'N/A'" :type="activity.type"
									:color="activity.color" :hollow="activity.hollow" :timestamp="activity.timestamp">
									{{ activity.content }}
								</el-timeline-item>
							</template>
						</el-timeline>

						<!-- End of Timeline -->
					</div>
				</div>

			</div>



		</div>
		<!-- Card body END -->
	</div>



</template>

<style>

</style>
