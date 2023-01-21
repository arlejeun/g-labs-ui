<script setup lang="ts">
import { JiraMiddlewareApiClient } from '@/apis/glabs';
import type { IUserAdminTable } from '@/interfaces';
import { useUserStore } from '@/stores/user';
import { handleAxiosError } from '@/utils/axios';
import { notify } from '@kyvg/vue3-notification';
import { useAxios } from '@vueuse/integrations/useAxios';
import {
  Refresh,
  Menu
} from '@element-plus/icons-vue'

const userStore = useUserStore()
const { userEmail } = storeToRefs(userStore)

const issues = ref({} as {pageCount: Number, pageNumber: Number, results: any, totalResults: Number })
//const issues = ref({} as any)

const filterTableData = computed(() => issues.value?.results || [])
const loadingTable = ref(true)

async function fetchIssues(email: string) {
  const jiraUrl = ref(`/issues?email=${email}`)
  const { execute } = useAxios(JiraMiddlewareApiClient)
  const result = await execute(jiraUrl.value, { method: "GET" });
  if (result.isFinished.value) {
    issues.value = result.data.value
    loadingTable.value = false
  }
  if (result.error.value) {
    notify({
      title: 'Jira API',
      text: `${handleAxiosError(
        result.error.value,
        "Impossible to retrieve the list of your service requests at the moment."
      )}`,
      duration: -1,
      type: "error",
    });
  }
}

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
  STATUS: {
    label: 'Status',
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

}

const currentPage = ref(1)
const handleRowClick = () => { }

const refresh = () => { }

const handlePaginationSizeChange = () => { }

const handlePaginationCurrentChange = () => { }

const totalIssuesCount = computed(() => {
  return issues.value?.totalResults || 0
})

const pageSize = ref(15)

watchEffect(() => {
  if (userEmail.value) {
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

    <div class="card border">

      <section class="pt-4">
        <div class="container position-relative pt-0 pb-3">
          <div class="row">
            <div class="col-xs-12 col-lg-10">
              <h3 class="fs-3 text-primary">Drive Service Requests</h3>
            </div>
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col-lg-10 col-md-11 me-2">
            <el-table v-loading="loadingTable" :data="filterTableData" :border="true" highlight-current-row stripe
              @row-click="handleRowClick" :default-sort="{ prop: 'used', order: 'descending' }" style="width:100%">
              <el-table-column type="expand">
                <template #header>
                  <el-button class="px-1 refresh-button" size="small" :icon="Refresh" @click="refresh()"></el-button>
                </template>
                <el-table-column v-for="(column, prop) in columns" :key="prop" :label="columns[prop].label"
                  :prop="typeof prop == 'string' ? prop : ''" :width="columns[prop].width">
                  <template #default="{ row }">
                    <TagFormatter v-if="columns[prop].formatter == 'tagformatter'" :row="row" />
                    <template v-else>
                      {{ row[prop] }}
                    </template>
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>

            <div class="mt-4 row justify-content-center">
              <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                :page-sizes="[10, 25, 50, 500]" :disabled=false :background=true
                layout="total, sizes, prev, pager, next, jumper" :total="totalIssuesCount"
                @size-change="handlePaginationSizeChange" @current-change="handlePaginationCurrentChange" />
            </div>

          </div>

          <!-- <div class="col ms-2" style="max-width: 300px">
            <div class="card ">
              <div class="card-header border row px-0">
                <div class="col-8">
                  <h5 class="text-primary">Edit Tag</h5>
                </div>
                <div class="col-4">
                  <el-button-group>
                    <el-tooltip content="Add tag" placement="left">
                      <el-button @click="handleTagAdd" type="primary" size="small" :icon="Plus" />
                    </el-tooltip>
                  </el-button-group>

                </div>
              </div>
              <div class="card-body border row px-0">
                <el-form ref="tagFormRef" :model="currentTag" :rules="rules" :disabled="disabledForm" class="row"
                  label-position="top">
                  <div class="col-xs-12 col-12">
                    <el-form-item label="Tag Name" prop="name">
                      <el-input v-model="currentTag.name" class="w-100 m-2" />
                    </el-form-item>
                  </div>

                  <div class="col-xs-12 col-12">
                    <el-form-item label="Tag Category" prop="category">
                      <el-select class="w-100 m-2" v-model="currentTag.category" placeholder="Select">
                        <el-option label="Business" value="Business"></el-option>
                        <el-option label="Technical" value="Technical"></el-option>
                      </el-select>
                    </el-form-item>
                  </div>

                  <div class="col-xs-12 col-12">
                    <el-form-item label="Tag Label" prop="label">
                      <el-input v-model="currentTag.label" class="w-100 m-2" />
                    </el-form-item>
                  </div>

                  <div class="pt-2 d-sm-flex justify-content-end">
                    <el-form-item class="mb-0">
                      <el-button v-show="editMode" type="primary" @click="editTagForm(tagFormRef)">Edit</el-button>
                      <el-button v-show="!editMode" type="primary" @click="addTagForm(tagFormRef)">Add</el-button>
                      <el-button @click="resetForm(tagFormRef)">Reset</el-button>
                    </el-form-item>
                  </div>


                </el-form>
              </div>


            </div>
          </div> -->


        </div>


      </section>


    </div>
  </div>
</template>

<style>

</style>
