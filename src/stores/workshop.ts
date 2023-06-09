// /store/workshop.js

import { defineStore } from "pinia";
import type {
  IWorkshop,
  ITree,
  IPathMap,
  IWorkshopMenuItem,
  IWsBreadcrumb,
  WsQueryDTO,
  IWorkshopsResponse,
  ITag,
  IWorkshopForm,
  IWorkshopSettingsResponse,
  WsFilterCriteria,
  IWorkshopSettings
} from "@/interfaces/workshop";
import { GLabsApiClient } from "@/apis/glabs";
import { useStorage } from '@vueuse/core'
import { useAxios } from "@vueuse/integrations/useAxios";
import { useNotification } from "@kyvg/vue3-notification";
import { handleAxiosError } from "@/utils/axios";
import { useUserStore } from "@/stores/user";
import { esWorkshopEndChapter, esWorkshopEndCourse } from "@/services/analytics";
import { processPath, processPage, updateUserProgress, getUserProgress } from "@/utils/workshops"

const WORKSHOPS_BASE = import.meta.env.VITE_GLABS_GCP_CONTENT;
const store = useUserStore();
const { localization, userId } = storeToRefs(store);

export const useWorkshopStore = defineStore("workshop", () => {
  const route = useRoute();
  const router = useRouter();

  const { notify } = useNotification();

  //const workshops = ref([] as IWorkshop[]);
  const workshops = ref({ page: 1, records: 0, rows: [] } as IWorkshopsResponse);
  const workshopSettings = ref({} as IWorkshopSettingsResponse)

  const editingWorkshops = ref(true)
  const workshopsQuery = ref({ page: 1, pageSize: 25 } as WsQueryDTO)
  const workshopsCriteria = ref({} as WsFilterCriteria)
  const workshopMeta = ref({} as IWorkshopSettings)

  const workshopTree = ref([] as ITree[]);
  const workshopTreeKey = ref(0);
  let workshopTitle = '';
  const workShopPathMap = ref([] as IPathMap[]);
  const workshopName = ref("");
  //TODO: Should be renamed workshopManifest
  const workshop = ref([] as IWorkshopMenuItem[]);
  const workshopId = ref(0)
  const page_index = ref([0, 0] as number[]);
  const treeIndex = ref(0);

  const tagsLoV = ref([] as ITag[])

  const fetchTagsLov = async () => {
    if (tagsLoV.value.length < 1) {
      const { execute } = useAxios(GLabsApiClient);
      const result = await execute(`/tags?page=1&pageSize=300`, {
        method: "GET"
      });
      if (result.isFinished.value && !result.error.value) {
        tagsLoV.value = [...result?.data?.value.rows];
      }
      if (result.error.value) {
        notify({
          title: "Tags API",
          text: `${handleAxiosError(
            result.error.value,
            "Impossible to get your tags at the moment"
          )}`,
          duration: -1,
          type: "error",
        });
      }
    }
  }

  const workshopCreadcrub = computed(() => {
    if (workshop.value.length === 0) {
      return "";
    }
    let bc = [] as IWsBreadcrumb[]
    bc.push({ title: "Home", path: "/" })
    bc.push({ title: "Workshops", path: "/workshops" })
    bc.push({ title: workshopTitle, path: "/workshops/" + wsId.value })

    let content = [...(workshopTree.value || [])] as ITree[];
    page_index.value?.forEach((index) => {
      let crumb = {} as IWsBreadcrumb
      if (content.length > index) {
        crumb.title = content[index].label
        crumb.path = `/workshops/${workshopName.value}/${content[index].path.substr(2)}`
        content = content[index].children || [];
        if (!crumb.title || !crumb.path) return bc
        bc.push(crumb)
      }
    });
    return bc
  });

  const wsId = computed(() => {
    return route.params?.all?.toString().split("/")?.[0];
  });

  const workshopProgress = useStorage(wsId.value, [] as number[], localStorage)

  const slashIdx = computed(() => {
    return route.params.all?.toString()?.indexOf("/");
  });

  const nextButtonName = computed(() => {
    let res = 'Next'
    if (treeIndex.value == workShopPathMap.value.length - 1) {
      if (workShopPathMap.value.length == workshopProgress.value.length ||
        workShopPathMap.value.length == workshopProgress.value.length - 1 &&
        !workshopProgress.value.includes(workShopPathMap.value.length - 1)) {
        res = 'Course is completed!'
      }
      else {
        res = 'Continue...'
      }
    }
    else if (workShopPathMap.value[treeIndex.value + 1]?.chapter) {
      res = 'Next Chapter'
    }
    return res
  })

  const getWorkshopUrl = computed(() => {
    return WORKSHOPS_BASE + workshopName.value + "/";
  });

  const urlParam = computed(() => {
    return route.params?.all?.toString().substring(slashIdx.value + 1);
  });

  const getWorkshopPage = computed(() => {
    if (workshop.value.length === 0) {
      return "";
    }
    let content = [...(workshopTree.value || [])] as ITree[];
    let page = "";
    page_index.value?.forEach((index) => {
      if (content.length > index) {
        page = content[index].body || "";
      }
      content = content[index].children || [];
    });

    page = page.replaceAll(
      "/images/",
      `${WORKSHOPS_BASE}${workshopName.value}/images/`
    );

    return processPage(page, workshopName.value) || "Sorry, this page has no content";
  });

  const workshopEmpty = computed(() => {
    workshops.value.records > 0;
  });

  const _buildTree = (ws: IWorkshopMenuItem[], index?: number[]): ITree[] => {
    if (typeof ws?.forEach !== "function") {
      return [];
    }

    index = index || [];
    let result = [] as ITree[];
    let branch = {} as ITree;
    let i = 0;

    ws.forEach((item: IWorkshopMenuItem) => {
      branch = {} as ITree;
      const locItem = { ...item };
      branch.index = [...(index || [])];
      branch.label = locItem.name;
      branch.body = locItem.body;
      branch.chapter = !!locItem.chapter
      branch.path = processPath(locItem.path);
      branch.id = treeIndex.value;
      branch.disabled = true;
      treeIndex.value++;
      branch.index.push(i);
      workShopPathMap.value.push({
        path: branch.path,
        index: [...branch.index],
        key: branch.id,
        chapter: branch.index.length === 1 || (branch.index.length === 2 && branch.index[1] === 0)
      });
      if (locItem.menus && locItem.menus.length > 0) {
        branch.children = [..._buildTree(locItem.menus, branch.index)];
      }
      result.push({ ...branch });
      delete branch.children;
      i++;
    });

    return result;
  };

  const rebuildTree = () => {
    treeIndex.value = 0;
    workShopPathMap.value = [];
    workshopTree.value = _buildTree(workshop.value[0]?.menus || []);
  };

  const setTreeIndex = (ind: number) => {
    treeIndex.value = ind;
  };

  const setTreeIndexByKey = (key?: number) => {
    key = key || workshopTreeKey.value;
    let path = "";
    workShopPathMap.value.forEach((item) => {
      if (item.key == key) {
        path = item.path.substring(2);
      }
    });
    setTreeIndexByPath(path);
  };

  const setTreeIndexByPath = (path: string) => {
    const brunches = workShopPathMap.value.filter((item) => {
      return item.path.substring(2) === path;
    });
    const brunch = brunches[0] || workShopPathMap.value[0];
    page_index.value = brunch?.index;
    workshopTreeKey.value = brunch?.key;
  };

  const setPageIndex = (ind: number[]) => {
    page_index.value = [...ind];
  };

  const treeChange = (node: ITree) => {
    if (!node) return

    let treeIndex = node?.index || [];
    let path = "";
    treeIndex.forEach((idx) => (path += idx + "/"));
    setTreeIndex(node.id);
    setPageIndex(treeIndex);
    const nodePath = node.path?.replace('./', '') || node.path
    router.push({ path: `/workshops/${wsId.value}/${nodePath}` });
  };

  const loadWorkshop = async (isReload: boolean) => {
    if (!wsId.value) {
      return;
    }
    try {
      const locale = localization.value || "en-US"
      const { execute } = useAxios(GLabsApiClient);
      const result = await execute(`/workshops/name/${wsId.value}/locale/${locale}`);
      if (result.isFinished.value && !result.error.value) {
        const resData = result.data.value;
        workshopName.value = wsId.value;
        workshopId.value = resData.id
        const getProgress = () => {
          if (userId.value) {
            getUserProgress(workshopId.value, userId.value).then((res) => {
              if (!result.error.value && res.data.value.completed_pages) {
                workshopProgress.value = JSON.parse(res.data.value.completed_pages)
              }
            })
            updateUserProgress(workshopId.value, userId.value, {
              recent_at: new Date().toISOString()
            })
          }
          else {
            setTimeout(() => { getProgress() }, 200)         
          }
        }
        getProgress()
        let mnf = resData.localizations[0].manifest;
        mnf = mnf.replaceAll('\\"', "\\$");
        mnf = mnf.replaceAll('"', '"');
        mnf = mnf.replaceAll("\\$", '\\"');
        workshop.value = [JSON.parse(mnf).content] || [];
        rebuildTree();
        const loc = localization.value || "en-US";
        const ws = workshop.value[0]
        let wsItem = ws?.[loc as keyof IWorkshopMenuItem] as IWorkshopMenuItem
        workshopTitle = wsItem?.name || wsId.value
        if (!isReload) {
          setTreeIndexByPath(urlParam.value);
        }
      }
      if (result.error.value) {
        notify({
          title: `Workshop - ${wsId.value} is not available at the moment`,
          text: `${handleAxiosError(
            result.error.value,
            "Impossible to retrieve the workshop manifest at the moment"
          )}`,
          duration: -1,
          type: "error",
        });
      }
    } catch (error) {
      console.error(
        `Workshop #${wsId.value} - manifest cannot be loaded and parsed!\n`,
        error
      );
    }
  };

  const addWorkshop = async (ws: IWorkshopForm) => {
    // No localization for adding settings

    const { execute } = useAxios(GLabsApiClient);
    const { techTags, bizTags, groups, envs, ...wsEdit } = ws;

    const wsEditDTO = {
      ...wsEdit,
      tags: { connect: [...bizTags, ...techTags].map((x) => { return { 'id': x } }) },
      user_groups: { connect: groups?.map(x => { return { 'id': x } }) },
      environments: { connect: envs?.map(x => { return { 'id': x } }) }
    }

    // Provisioned is available when workshop is provisioned meaning the manifest was generated
    // Active is true when workshop is available in search
    // wsEditDTO.isProvisioned = false;
    // wsEditDTO.isPublished = false;

    //const result = await execute(`/users/${user.value.id}`, {method: 'PATCH', data: userProperty}, )
    const result = await execute(`/workshops`, {
      method: "POST",
      data: wsEditDTO,
    });
    if (result.isFinished.value && !result.error.value) {
      workshopMeta.value = { ...result.data.value }
      workshopSettings.value?.rows?.push(workshopMeta.value);

      notify({
        title: "Workshop API",
        text: "Your workshop metadata was created successfully",
        duration: 2000,
        type: "success",
      });
    }
    if (result.error.value) {
      notify({
        title: "Workshop API",
        text: `${handleAxiosError(
          result.error.value,
          "Impossible to create the workshop metadata at the moment"
        )}`,
        duration: -1,
        type: "error",
      });
    }

  };

  const addWorkshopLocale = async (id: number, ws: IWorkshop) => {

    const { execute } = useAxios(GLabsApiClient);
    //const result = await execute(`/users/${user.value.id}`, {method: 'PATCH', data: userProperty}, )
    const result = await execute(`/workshops/${id}/localized`, {
      method: "POST",
      data: ws,
    });
    if (result.isFinished.value && !result.error.value) {
      workshops.value?.rows?.push(result.data.value);
      notify({
        title: "Workshop API",
        text: "Your workshop locale was created successfully",
        duration: 2000,
        type: "success",
      });
    }
    if (result.error.value) {
      notify({
        title: "Workshop API",
        text: `${handleAxiosError(
          result.error.value,
          "Impossible to create your workshop locale at the moment"
        )}`,
        duration: -1,
        type: "error",
      });
    }

  };

  const editWorkshopLocale = async (ws: IWorkshop) => {

    const { execute } = useAxios(GLabsApiClient);
    //const result = await execute(`/users/${user.value.id}`, {method: 'PATCH', data: userProperty}, )
    const result = await execute(`/workshops/localized/${ws.id}`, {
      method: "PATCH",
      data: ws,
    });
    if (result.isFinished.value && !result.error.value) {
      workshops.value?.rows?.push(result.data.value);
      notify({
        title: "Workshop API",
        text: "Your workshop locale was updated successfully",
        duration: 2000,
        type: "success",
      });
    }
    if (result.error.value) {
      notify({
        title: "Workshop API",
        text: `${handleAxiosError(
          result.error.value,
          "Impossible to update your workshop locale at the moment"
        )}`,
        duration: -1,
        type: "error",
      });
    }

  };




  const editWorkshop = (workshop: any) => {
    const index = workshops.value?.rows?.findIndex(x => x.id == workshop.id)
    if (index >= 0) {
      workshops.value.rows[index] = { ...workshop };
    }

  };

  const nextStep = () => {
    if (!workshopProgress.value.includes(treeIndex.value)) {
      workshopProgress.value.push(treeIndex.value)
      let payload = {
        completed_pages: JSON.stringify(workshopProgress.value)
      } as any
      if (workshopProgress.value.length === workShopPathMap.value.length) {
        payload.completed_at = new Date().toISOString()
      }
      //TODO: @uncleash Implement with backend services
      updateUserProgress(workshopId.value, userId.value, payload)
      let chIdxes = workShopPathMap.value.filter(item => {
        return item.index[0] == workShopPathMap.value[treeIndex.value].index[0]
      })
      if (chIdxes.every((el) => { return workshopProgress.value.includes(el.key) })) {
        esWorkshopEndChapter()
      }
    }
    if (treeIndex.value < workShopPathMap.value.length) {
      treeIndex.value++
      setTreeIndexByKey(treeIndex.value)
    }
  }

  // const changeWorkshopQuery = async (query: WsQueryDTO) => {
  //   let myQuery = Object.assign({ active: true }, { ...query })
  //   let result, queryParams;
  //   queryParams = `page=${myQuery.page}&pageSize=${myQuery.pageSize}&active=${myQuery.active}`;
  //   if (myQuery.searchString) {
  //     queryParams += `&searchString=${myQuery.searchString}`
  //   }
  //   if (myQuery?.tags && myQuery?.tags?.length > 0) {
  //     queryParams += `&tags=${myQuery?.tags?.join(',')}`
  //   }
  //   workshopsQuery.value = { ...myQuery }
  // }

  const loadWorkshops = async (query: WsQueryDTO) => {
    const { execute } = useAxios(GLabsApiClient);
    let myQuery = Object.assign({ published: query.showAll ? false : true }, { ...query })
    let result, queryParams;
    queryParams = `page=${myQuery.page}&pageSize=${myQuery.pageSize}&published=${myQuery.published}`;
    if (myQuery.searchString) {
      queryParams += `&searchString=${myQuery.searchString}`
    }
    if (myQuery?.tags && myQuery?.tags?.length > 0) {
      queryParams += `&tags=${myQuery?.tags?.join(',')}`
    }
    if (myQuery?.levels && myQuery?.levels?.length > 0) {
      queryParams += `&levels=${myQuery?.levels?.join(',')}`
    }
    if (myQuery?.environments && myQuery?.environments > 0) {
      queryParams += `&environments=${myQuery?.environments}`
    }
    if (myQuery?.locale) {
      queryParams += `&locale=${myQuery?.locale}`
    }

    result = await execute(`/workshops?${queryParams}`, {
      method: "GET"
    });
    if (result.isFinished.value && !result.error.value) {
      //workshopsQuery.value = { ...myQuery }
      workshops.value = { ...result?.data?.value };
    }
    if (result.error.value) {
      notify({
        title: "Workshops API",
        text: `${handleAxiosError(
          result.error.value,
          "Impossible to get your workshops at the moment"
        )}`,
        duration: -1,
        type: "error",
      });
    }
  };

  const loadWorkshopSettings = async (query: WsQueryDTO) => {
    const { execute } = useAxios(GLabsApiClient);
    let myQuery = Object.assign({ active: true }, { ...query })
    let result, queryParams;
    queryParams = `page=${myQuery.page}&pageSize=${myQuery.pageSize}&published=${myQuery.active}`;
    if (myQuery.searchString) {
      queryParams += `&searchString=${myQuery.searchString}`
    }
    if (myQuery?.tags && myQuery?.tags?.length > 0) {
      queryParams += `&tags=${myQuery?.tags?.join(',')}`
    }

    result = await execute(`/workshops/settings?${queryParams}`, {
      method: "GET"
    });
    if (result.isFinished.value && !result.error.value) {
      workshopsQuery.value = { ...myQuery }
      workshopSettings.value = { ...result?.data?.value };
    }
    if (result.error.value) {
      notify({
        title: "Workshops API",
        text: `${handleAxiosError(
          result.error.value,
          "Impossible to get your workshops settings at the moment"
        )}`,
        duration: -1,
        type: "error",
      });
    }
  };

  //TODO: Update workshop
  const updateWorkshop = async (ws: IWorkshopForm) => {

    const { execute } = useAxios(GLabsApiClient);
    const { techTags, bizTags, groups, envs, ...wsEdit } = ws;

    const wsEditDTO = {
      ...wsEdit,
      tags: { set: [...bizTags, ...techTags].map((x) => { return { 'id': x } }) },
      user_groups: { set: groups?.map(x => { return { 'id': x } }) },
      environments: { set: envs?.map(x => { return { 'id': x } }) },
    }

    //const result = await execute(`/users/${user.value.id}`, {method: 'PATCH', data: userProperty}, )
    const result = await execute(`/workshops/${wsEditDTO.id}`, {
      method: "PATCH",
      data: wsEditDTO,
    });
    if (result.isFinished.value && !result.error.value) {
      editWorkshop(result.data.value)
      notify({
        title: "Workshop API",
        text: "Your workshop was updated successfully",
        duration: 2000,
        type: "success",
      });
    }
    if (result.error.value) {
      notify({
        title: "Workshop API",
        text: `${handleAxiosError(
          result.error.value,
          "Impossible to update the workshop at the moment"
        )}`,
        duration: -1,
        type: "error",
      });
    }


  };

  const removeWorkshop = async (workshopId: number) => {
    const index = workshops.value?.rows?.findIndex(rec => rec.id == workshopId)
    const { execute } = useAxios(GLabsApiClient);
    const result = await execute(`/workshops/${workshopId}`, {
      method: "DELETE"
    });
    if (result.isFinished.value && !result.error.value) {
      workshops.value?.rows.splice(index, 1);
      notify({
        title: "Workshop API",
        text: "Your workshop is deleted successfully",
        duration: 2000,
        type: "success",
      });
    }
    if (result.error.value) {
      notify({
        title: "Workshop API",
        text: `${handleAxiosError(
          result.error.value,
          "Impossible to delete the workshop at the moment"
        )}`,
        duration: -1,
        type: "error",
      });
    }
  };

  const removeLocalizedWorkshop = async (index: number | undefined) => {
    if (!index) {
      return
    }
    const workshopId = workshops.value?.rows?.findIndex(rec => rec.id == index)
    workshops.value?.rows.splice(workshopId, 1);
    const { execute } = useAxios(GLabsApiClient);

    const result = await execute(`/workshops/localized/${workshopId}`, {
      method: "DELETE"
    });
    if (result.isFinished.value && !result.error.value) {
      notify({
        title: "Workshop API",
        text: "Your localized workshop is deleted successfully",
        duration: 2000,
        type: "success",
      });
    }
    if (result.error.value) {
      notify({
        title: "Workshop API",
        text: `${handleAxiosError(
          result.error.value,
          "Impossible to delete the localized workshop at the moment"
        )}`,
        duration: -1,
        type: "error",
      });
    }
  };

  const provisionWorkshop = async (owner: string, repo: string) => {

    const { execute } = useAxios(GLabsApiClient);

    //const result = await execute(`/workshops/provision/${owner}/${repo}`, {
    const result = await execute(`/workshops/provision/${repo}`, {
      method: "POST"
    });
    if (result.isFinished.value && !result.error.value) {
      notify({
        title: "Workshop API",
        text: "Your workshop is being provisioned",
        duration: 2000,
        type: "success",
      });
    }
    if (result.error.value) {
      notify({
        title: "Workshop API",
        text: `${handleAxiosError(
          result.error.value,
          "Impossible to provision the workshop at the moment"
        )}`,
        duration: -1,
        type: "error",
      });
    }
  }

  return {
    workshops,
    workshopSettings,
    workshopsQuery,
    workshopsCriteria,
    workshopTree,
    workshopTreeKey,
    workShopPathMap,
    workshopName,
    workshopProgress,
    workshop,
    page_index,
    getWorkshopUrl,
    getWorkshopPage,
    tagsLoV,
    workshopEmpty,
    wsId,
    slashIdx,
    workshopCreadcrub,
    workshopTitle,
    urlParam,
    workshopMeta,
    nextButtonName,
    loadWorkshops,
    loadWorkshopSettings,
    loadWorkshop,
    addWorkshop,
    editWorkshop,
    removeWorkshop,
    setPageIndex,
    setTreeIndexByKey,
    setTreeIndexByPath,
    rebuildTree,
    treeChange,
    nextStep,
    fetchTagsLov,
    updateWorkshop,
    provisionWorkshop,
    removeLocalizedWorkshop,
    addWorkshopLocale,
    editWorkshopLocale
  }
})