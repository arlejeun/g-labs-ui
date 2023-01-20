<script setup lang="ts">
import type { IDriveUser, IUserAdminTable } from '@/interfaces';
import { useAdminStore } from '@/stores/admin';
import {
  Refresh,
  Menu as IconMenu,
  Setting,
} from '@element-plus/icons-vue'

const adminStore = useAdminStore()
const { users, usersQuery } = storeToRefs(adminStore)
const { removeUser, fetchUsers } = adminStore

const currentUserSubView = ref(1)

const handleSubView = (key: number) => {
	currentUserSubView.value = key
}

const filterTableData = computed(() =>
	users.value?.rows?.filter(
		(data) =>
			!usersQuery.value?.searchString ||
			data?.email?.toLowerCase()?.includes(usersQuery.value.searchString?.toLowerCase())
	)
)

const columns = ref({} as IUserAdminTable)
columns.value = {
	id: {
		label: 'ID',
		width: 60
	},
	email: {
		label: 'Email',
		width: 'auto'
	},
	company: {
		label: 'Company',
		width: 'auto'
	},
	status: {
		label: 'Status',
		width: 120
	},
	type: {
		label: 'Type',
		width: 120
	},

}

const loadingTable = ref(true)

const totalRecords = computed(() => {
	return users.value.records || 0
})

const currentUser = ref({} as IDriveUser)

const refresh = async () => {
	fetchUsers(usersQuery.value)
}

const handleRowClick = (row: IDriveUser) => {
	currentUser.value = row
}

const handleEdit = (index: number, row: IDriveUser) => {
	console.log(index, row)
}

const handleDelete = (index: number, row: IDriveUser) => {
	console.log(index, row)
}


watchEffect(() => {
	loadingTable.value = !(totalRecords.value > 0);
})

onMounted(() => {

})

</script>

<template>

	<div class="row justify-content-center">
		<div class="col-lg-10 col-md-10">
			<el-table v-loading="loadingTable" :data="filterTableData" :border="true" highlight-current-row stripe
				@row-click="handleRowClick" :default-sort="{ prop: 'used', order: 'descending' }" style="width:100%">
				<el-table-column type="expand">
					<template #header>
						<el-button class="px-1 refresh-button" size="small" :icon="Refresh" @click="refresh()"></el-button> 
					</template>
					<template #default="props">
						<div class="container-fluid my-3">
							<div class="row">
								<div class="col-2">
									<el-menu default-active="1" class="el-menu-vertical-demo">
								<el-menu-item @click=handleSubView(1) index="1">
									<el-icon><icon-menu /></el-icon>
									<span>User Profile</span>
								</el-menu-item>
								<el-menu-item @click=handleSubView(2) index="2">
									<el-icon><icon-menu /></el-icon>
									<span>Customer Record</span>
								</el-menu-item>
								<el-menu-item @click=handleSubView(3) index="3">
									<el-icon>
										<Setting />
									</el-icon>
									<span>Provisioning</span>
								</el-menu-item>
							</el-menu>
								</div>
								<div v-show="currentUserSubView==1" class="col-10">
									<!-- <profile-contact-info-form :user="props.row" :admin="true"></profile-contact-info-form>
									<profile-settings-form :user="props.row" :admin="true"></profile-settings-form>
									<profile-access-groups-form :user="props.row" :admin="true"></profile-access-groups-form> -->

									<profile-contact-info-form :user="props.row" :admin=true></profile-contact-info-form>
									<profile-settings-form :user="props.row" :admin=true></profile-settings-form>
									<profile-access-groups-form :user="props.row" :admin=true></profile-access-groups-form>
									<profile-delete-form :user="props.row" :admin=true></profile-delete-form>
								</div>
								<div v-show="currentUserSubView==2" class="col-10">
									<profile-customer-record :myCustomer="props.row.customer"></profile-customer-record>
								</div>
								<div v-show="currentUserSubView==3" class="col-10">
									<!-- <user-organizations></user-organizations> -->
									<account-organizations :orgs="props.row.orgs" :user="props.row" :admin=true></account-organizations>

								</div>


							</div>





							
							
						</div>
					</template>
				</el-table-column>

				<el-table-column v-for="(column, prop) in columns" :key="prop" :label="columns[prop].label"
					:prop="typeof prop == 'string' ? prop : ''" :width="columns[prop].width">
					<template #default="{ row }">
						<!-- <TagFormatter v-if="columns[prop].formatter == 'tagformatter'" :row="row" /> -->
						<!-- <template v-else> -->
						{{ row[prop] }}
						<!-- </template> -->
					</template>
				</el-table-column>

				<el-table-column width="200" align="right">
					<!-- <template #header>
							<el-row>
								<el-input v-model="search.searchString" placeholder="Type to search">
									<template #append>
										<el-button :class="{ 'bg-primary text-white': filterActive }" size="small"
											:icon="Filter" @click="handleServerSearch(search.searchString)"></el-button>
									</template>
								</el-input>

							</el-row>
						</template> -->
					<template #default="scope">
						<el-button size="small" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
						<el-button size="small" type="danger"
							@click="handleDelete(scope.$index, scope.row)">Delete</el-button>
					</template>
				</el-table-column>
			</el-table>

			<UsersPagination />

		</div>


	</div>

</template>

<style>
.refresh-button {
	border: 0
}
</style>
