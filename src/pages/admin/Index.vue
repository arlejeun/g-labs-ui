<script lang="ts" setup>
import type { Header, Item } from "vue3-easy-data-table";

const userType = ref('')
const companies = ref([
	"24sessions",
	"2BCons sp. z o.o.",
	"2P - Perfect Presentation",
	"3Fiftynine",
	"8x8",
	"8x8, Inc.",
	"Ablecom",
	"Ablecom Co. Ltd",
	"accenture",
	"Accenture",
	"ACCENTURE",
	"ACCENTURE CONSULTORES DE GESTAO SA",
	"Accenture GmbH",
	"Accenture Inc",
	"Accenture Interactive"
])
const company = ref('')
const searchQuery = ref('')
const userStatus = ref('')
const sortProp = ref('name')
const sortOrder = ref('ascending')
const currentPage = ref(1)
const pageSize = ref(10)

const userTypes = [
	{ value: 2, label: 'Internal', name: 'internal' },
	{ value: 3, label: 'Partner', name: 'partner' },
	{ value: 4, label: 'Customer', name: 'customer' },
]

const userStatuses = [
	{ value: 50, label: 'Active', name: 'active' },
	{
		value: 10,
		label: 'Awaiting confirmation',
		name: 'awaiting-confirmation',
	},
	{ value: 40, label: 'Disabled', name: 'disabled' },
	{ value: 0, label: 'Needs approval', name: 'needs-approval' },
	{ value: 30, label: 'Rejected', name: 'rejected' },
]

const headers: Header[] = [
	{ text: "PLAYER", value: "player" },
	{ text: "TEAM", value: "team" },
	{ text: "NUMBER", value: "number" },
	{ text: "POSITION", value: "position" },
	{ text: "HEIGHT", value: "indicator.height" },
	{ text: "WEIGHT (lbs)", value: "indicator.weight", sortable: true },
	{ text: "LAST ATTENDED", value: "lastAttended", width: 200 },
	{ text: "COUNTRY", value: "country" },
];

const items: Item[] = [
	{ player: "Stephen Curry", team: "GSW", number: 30, position: 'G', indicator: { "height": '6-2', "weight": 185 }, lastAttended: "Davidson", country: "USA" },
	{ player: "Lebron James", team: "LAL", number: 6, position: 'F', indicator: { "height": '6-9', "weight": 250 }, lastAttended: "St. Vincent-St. Mary HS (OH)", country: "USA" },
	{ player: "Kevin Durant", team: "BKN", number: 7, position: 'F', indicator: { "height": '6-10', "weight": 240 }, lastAttended: "Texas-Austin", country: "USA" },
	{ player: "Giannis Antetokounmpo", team: "MIL", number: 34, position: 'F', indicator: { "height": '6-11', "weight": 242 }, lastAttended: "Filathlitikos", country: "Greece" },
];

const handleSelectChange = () => {
}

const getQueryString = () => {
      const params = {
        page: currentPage.value,
        rows: pageSize.value,
        sidx: sortProp.value,
        sord: sortOrder.value || '',
        q: searchQuery.value.trim(),
      }
}

const reloadTableData = async () => {
	return 1
}

const exportToCSV = async () => {

}

</script>

<template>
	<div class="container-fluid mt-4 mb-6">
		<div class="row">
			<div class="col-2">

				<el-form label-position="top">
					<el-form-item label="Search">
						<el-input prefix-icon="el-icon-search" placeholder="Search..." clearable>
						</el-input>
					</el-form-item>

					<el-form-item label="User Type">
						<el-select placeholder="Please select a Type" clearable>
							<el-option v-for="item in userTypes" :key="item.value" :value="item.value"
								:label="item.label" />
						</el-select>
					</el-form-item>

					<el-form-item label="User Status">
						<el-select placeholder="Please select a Status" v-model="userStatus" clearable
							@change="">
							<el-option v-for="item in userStatuses" :key="item.value" :value="item.value"
								:label="item.label" />
						</el-select>
					</el-form-item>

					<el-form-item label="Company">
						<el-select placeholder="Please select a Company" v-model="company" filterable clearable>
							<el-option v-for="(comp, index) in companies" :key="index" :value="comp" />
						</el-select>
					</el-form-item>
				</el-form>

			</div>
			<div class="col">
				<EasyDataTable :headers="headers" :items="items" alternating>
					<template #loading>
						<img
						src="https://i.pinimg.com/originals/94/fd/2b/94fd2bf50097ade743220761f41693d5.gif"
						style="width: 100px; height: 80px;"
						/>
					</template>
				</EasyDataTable>
			</div>



		</div>


	</div>

</template>
  
 
  
<route lang="yaml">
meta:
  layout: BasicTopNavigationLayout
  title: GLabs Administration
</route>
