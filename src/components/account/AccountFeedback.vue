<script setup lang="ts">
import type { IUserAdminTable } from '@/interfaces';
import { useUserStore } from '@/stores/user';
import {
  Refresh,
} from '@element-plus/icons-vue'

const userStore = useUserStore()
const { userEmail, issuesInProgress, issues, showIssueForm } = storeToRefs(userStore)
const { fetchIssues } = userStore


const filterTableData = computed(() => issues.value?.results || [])

const columns = ref({} as IUserAdminTable)
columns.value = {
  ISSUEID: {
    label: 'ID',
    width: 'auto'
  },
  REQUESTOR: {
    label: 'Requestor',
    width: 'auto'
  },
  SUMMARY: {
    label: 'Summary',
    width: 'auto'
  },
  TYPE: {
    label: 'Type',
    width: 'auto'
  },
  STATUS: {
    label: 'Status',
    width: 'auto'
  },

}

const currentPage = ref(1)
const handleRowClick = () => { }

const refresh = () => { }

const handlePaginationSizeChange = () => { }

const handlePaginationCurrentChange = () => { }

//TODO: issue type
const totalIssuesCount = computed(() => {
  return issues.value?.totalResults || 0
})

const toggleIssueForm = () => {
  showIssueForm.value = !showIssueForm.value
}

const pageSize = ref(50)

watchEffect(() => {
  if (userEmail.value) {
    issuesInProgress.value = true
    fetchIssues(userEmail.value)
  }
})



</script>

<template>
  <div class="col-md-8 col-lg-9 col-xl-9" style="max-width: 1600px;">

    <div class="d-grid mb-0 d-lg-none w-100">
      <button class="btn btn-primary mb-4" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasSidebar"
        aria-controls="offcanvasSidebar">
        <i class="fas fa-sliders-h"></i> Menu
      </button>
    </div>

    <div class="card">

      <section class="pt-4">
        <div class="container position-relative pt-0 pb-3">
          <div class="row">
            <div class="col-xs-10 col-lg-10">
              <h3 class="fs-3 text-primary">Drive Service Requests</h3>
            </div>
            <div class="col-xs-2 col-lg-2">
              <el-button @click="toggleIssueForm()" type="primary">New idea / Issue?</el-button>
            </div>
          </div>
        </div>

        <div class="container-fluid justify-content-center">
          <div v-show="showIssueForm" class="row">
            <ProfileFeedbackForm></ProfileFeedbackForm>
          </div>
          <div class="row">
            <div class="col-lg-12 col-md-12">
              <el-table v-loading="issuesInProgress" :data="filterTableData" :border="true" highlight-current-row stripe
                @row-click="handleRowClick" :default-sort="{ prop: 'used', order: 'descending' }" style="width:100%">
               
                <el-table-column v-for="(column, prop) in columns" :key="prop" :label="columns[prop].label"
                  :prop="typeof prop == 'string' ? prop : ''" :width="columns[prop].width">
                  <template #default="{ row }">
                    <TagFormatter v-if="columns[prop].formatter == 'tagformatter'" :row="row" />
                    <template v-else>
                      {{ row[prop] }}
                    </template>
                  </template>
                </el-table-column>

              </el-table>

            </div>
          </div>
          <div class="row justify-content-end mt-4">
            <div class="col-auto align-self-end">
              <el-button class="refresh-button pt-0" size="small" :icon="Refresh" @click="refresh()"></el-button>
            </div>
            <div class="col-auto">
              <el-pagination small layout="total, prev, pager, next" :total="totalIssuesCount" :page-size="pageSize" />
              <!-- <el-pagination v-model:current-page="currentPage" :page-size="pageSize" :disabled=true
                    layout="total, sizes, prev, pager, next" :total="totalIssuesCount"
                    /> -->
            </div>

          </div>

        </div>

      </section>


    </div>
  </div>
</template>

<style>
.refresh-button {
  border: 0
}
</style>
