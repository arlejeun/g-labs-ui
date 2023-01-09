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
  IWorkshopForm
} from "@/interfaces/workshop";
import { GLabsApiClient } from "@/apis/glabs";
import { useStorage } from '@vueuse/core'
import { useAxios } from "@vueuse/integrations/useAxios";
import { useNotification } from "@kyvg/vue3-notification";
import { handleAxiosError } from "@/utils/axios";
import { useUserStore } from "@/stores/user";
import { processPath } from "@/utils/workshops"
import sanitizeHtml from "sanitize-html";
import type { Ref } from "vue";

const WORKSHOPS_BASE = import.meta.env.VITE_GLABS_GCP_CONTENT;
const store = useUserStore();
const { localization } = storeToRefs(store);

export const useWorkshopStore = defineStore("workshop", () => {
  const route = useRoute();
  const router = useRouter();

  const { notify } = useNotification();

  //const workshops = ref([] as IWorkshop[]);
  const workshops = ref({} as IWorkshopsResponse);

  const editingWorkshops = ref(true)

  const workshopsQuery = ref({page: 1, pageSize:25} as WsQueryDTO)
  const workshopMeta = ref({} as IWorkshop)

  const workshopTree = ref([] as ITree[]);
  const workshopTreeKey = ref(0);
  let workshopTitle = '';
  const workShopPathMap = ref([] as IPathMap[]);
  const workshopName = ref("");
  //TODO: Should be renamed workshopManifest
  const workshop = ref([] as IWorkshopMenuItem[]);
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

    page = _processPage(page)
    return page || "Sorry, this page has no content";
  });

  const _processPage = (page: string) => {
    let res = page.replaceAll(
      "/images/",
      `${WORKSHOPS_BASE}${workshopName.value}/images/`
    );

    res = sanitizeHtml(res, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
      allowedIframeHostnames: ["www.youtube.com"],
    });
    return res
  }

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
      const loc = localization.value || "en-US";
      if (
        (loc == "en-US" && !item.locale) ||
        localization.value === item.locale || item[loc as keyof IWorkshopMenuItem]
      ) {
        branch = {} as ITree;
        let locItem = { ...item };
        if (item[loc as keyof IWorkshopMenuItem]) {
          locItem = item[loc as keyof IWorkshopMenuItem] as IWorkshopMenuItem;
          locItem.menus = item.menus;
        }
        branch.index = [...(index || [])];
        branch.label = locItem.name;
        branch.body = locItem.body;
        branch.path = processPath(locItem.path);
        branch.id = treeIndex.value;
        branch.disabled = true;
        treeIndex.value++;
        branch.index.push(i);
        workShopPathMap.value.push({
          path: branch.path,
          index: [...branch.index],
          key: branch.id,
        });
        if (locItem.menus && locItem.menus.length > 0) {
          branch.children = [..._buildTree(locItem.menus, branch.index)];
        }
        result.push({ ...branch });
        delete branch.children;
        i++;
      }
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

  const loadWorkshop = async () => {
    if (!wsId.value) {
      return;
    }
    try {
      const { execute } = useAxios(GLabsApiClient);
      const result = await execute(`/workshops/name/${wsId.value}`);
      if (result.isFinished.value && !result.error.value) {
        const resData = result.data.value;
        workshopName.value = resData.name;
        let mnf = resData.manifest;
        mnf = mnf.replaceAll('\\"', "\\$");
        mnf = mnf.replaceAll('"', '"');
        mnf = mnf.replaceAll("\\$", '\\"');
        workshop.value = [JSON.parse(mnf).content] || [];
        rebuildTree();
        setTreeIndexByPath(urlParam.value);

        const loc = localization.value || "en-US";
        const ws = workshop.value[0]
        let wsItem = ws?.[loc as keyof IWorkshopMenuItem] as IWorkshopMenuItem
        workshopTitle = wsItem?.name || wsId.value

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
    
    const { execute } = useAxios(GLabsApiClient);
    const { techTags, bizTags, groups, envs, localizations, ...wsEdit } = ws;

    const wsEditDTO = {...wsEdit, 
      tags: { connect: [...bizTags, ...techTags].map((x) => { return {'id': x}})},
      user_groups: {connect: groups?.map(x => {return {'id': x }})},
      environments: {connect: envs?.map(x => {return {'id': x }})}
    }

    // Provisioned is available when workshop is provisioned meaning the manifest was generated
    // Active is true when workshop is available in search
    wsEditDTO.provisioned = false;
    wsEditDTO.active = false;
    
    //const result = await execute(`/users/${user.value.id}`, {method: 'PATCH', data: userProperty}, )
    const result = await execute(`/workshops`, {
      method: "POST",
      data: wsEditDTO,
    });
    if (result.isFinished.value && !result.error.value) {
         workshops.value?.rows?.push(result.data.value);
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

  const editWorkshop = (workshop: any) => {
    const index = workshops.value?.rows?.findIndex( x => x.id == workshop.id)
    if (index >= 0) {
      workshops.value.rows[index] = {...workshop};
      //loadWorkshops(workshopsQuery.value)
    }
      
  };

  const nextStep = () => {
    if (!workshopProgress.value.includes(treeIndex.value)) {
      workshopProgress.value.push(treeIndex.value)
    }
    if (treeIndex.value < workShopPathMap.value.length) {
      treeIndex.value++
      setTreeIndexByKey(treeIndex.value)
    }
  }

  const loadWorkshops = async (query: WsQueryDTO ) => {
      const { execute } = useAxios(GLabsApiClient);
      let myQuery = Object.assign({active: true}, {...query})
      let result, queryParams;
      queryParams = `page=${myQuery.page}&pageSize=${myQuery.pageSize}&active=${myQuery.active}`;
      if (myQuery.searchString) {
        queryParams += `&searchString=${myQuery.searchString}`   
      } 
      if (myQuery?.tags && myQuery?.tags?.length > 0) {
        queryParams += `&tags=${myQuery?.tags?.join(',')}`   
      } 

      result = await execute(`/workshops?${queryParams}`, {
        method: "GET"
      });
      if (result.isFinished.value && !result.error.value) {
        workshopsQuery.value = {...myQuery}
        workshops.value = {...result?.data?.value};
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

  //TODO: Update workshop
  const updateWorkshop = async (ws: IWorkshopForm) => {
    
    const { execute } = useAxios(GLabsApiClient);
    const { techTags, bizTags, groups, envs, localizations, ...wsEdit } = ws;

    const wsEditDTO = {...wsEdit, 
      tags: { set: [...bizTags, ...techTags].map((x) => { return {'id': x}})},
      user_groups: {set: groups?.map(x => {return {'id': x }})},
      environments: {set: envs?.map(x => {return {'id': x }})},
      localizations: {create: localizations} }
    
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
   
    const result = await execute(`/workshops/provision/${owner}/${repo}`, {
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
    workshopsQuery,
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
    loadWorkshops,
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
    removeLocalizedWorkshop
  }
})