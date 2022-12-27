// /store/workshop.js

import { defineStore } from "pinia";
import type {
  IWorkshop,
  ITree,
  IPathMap,
  IWorkshopMenuItem,
} from "@/interfaces/workshop";
import sanitizeHtml from "sanitize-html";
import { GLabsApiClient } from "@/apis/glabs";

import { useAxios } from "@vueuse/integrations/useAxios";
import { useNotification } from "@kyvg/vue3-notification";
import { handleAxiosError } from "@/utils/axios";
import { useUserStore } from "@/stores/user";

const WORKSHOPS_BASE = import.meta.env.VITE_GLABS_GCP_CONTENT;
const store = useUserStore();
const { localization } = storeToRefs(store);

const config = {
  headers: {
    Authorization: "Bearer TBD",
    Accept: "application/json, text/plain, */*",
  },
};

export const useWorkshopStore = defineStore("workshop", () => {
  const route = useRoute();
  const router = useRouter();

  const { notify } = useNotification();

  // state properties vue composition of store
  //const registrationUser = ref({} as IDriveUserRegistration);
  const workshops = ref([] as IWorkshop[]);
  const workshopTree = ref([] as ITree[]);
  const workshopTreeKey = ref(0);
  const workShopPathMap = ref([] as IPathMap[]);
  const workshopName = ref("");
  const workshop = ref([] as IWorkshopMenuItem[]);
  const page_index = ref([0, 0] as number[]);
  const treeIndex = ref(0);
  const pathMap = ref([] as IPathMap[]);
  
  const workshopTitle = computed(() => {
    if (workshop.value.length === 0) {
      return "";
    }
    const loc = localization.value || "en-US";
    const title = workshop.value[0]?.[loc]?.name || wsId.value
    const path = workShopPathMap.value.find((item: IPathMap) => item.key == workshopTreeKey.value)?.path
    const modifiedPath = '/workshops/'+ wsId.value + '/' + path?.substring(2) + '/'
    return {title: title, path: modifiedPath};
  });

  const workshopChapter = computed(() => {
      if (workshop.value.length === 0) {
        return "";
      }
      const loc = localization.value || "en-US";
      const title = workshop.value[0]?.['menus']?.[page_index.value[0]]?.[loc]?.name
      const path = workShopPathMap.value.find((item: IPathMap) => item.key == workshopTreeKey.value)?.path
      const pathArray = path?.substring(2)?.split('/')
      const modifiedPath = '/workshops/'+ wsId.value + '/' + pathArray?.[0] + '/'
      return {title: title, path: modifiedPath};
  });
  

  const workshopSection = computed(() => {
    if (workshop.value.length === 0) {
      return "";
    }
    const path = workShopPathMap.value.find((item: IPathMap) => item.key == workshopTreeKey.value)?.path
    const pathArray = path?.substring(2)?.split('/')
    if (pathArray && pathArray?.length < 2) {
      return ""
    }
    const loc = localization.value || "en-US";
    const title = workshop.value[0]?.['menus']?.[page_index.value[0]]?.[loc]?.['menus']?.[page_index.value[1]]?.name
    return {title: title, path: path};
  });


  const wsId = computed(() => {
    return route.params?.all?.toString().split("/")?.[0];
  });

  const slashIdx = computed(() => {
    return route.params.all?.toString()?.indexOf("/");
  });

  const urlParam = computed(() => {
    return route.params?.all?.toString().substring(slashIdx.value + 1);
  });

  const getWorkshopUrl = computed(() => {
    return WORKSHOPS_BASE + workshopName.value + "/";
  });

  const getWorkshopPage = computed(() => {
    if (workshop.value.length === 0) {
      return "";
    }
    let content = [...(workshop.value[0]?.menus || [])] as IWorkshopMenuItem[];
    let page = "";
    page_index.value?.forEach((index) => {
      if (content.length > index) {
        page = content[index].body || "";
        const loc = localization.value || "en-US";
        if (content?.[index]?.[loc]) {
          // @ts-ignore
          //TODO - fix type with body
          page = content[index][loc]?.body;
        }
        content = content[index].menus || [];
      }
    });
    page = page.replaceAll(
      "/images/",
      `${WORKSHOPS_BASE}${workshopName.value}/images/`
    );

    page = sanitizeHtml(page, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
      allowedIframeHostnames: ["www.youtube.com"],
    });
    return page || "Sorry, this page has no content";
  });

  const workshopEmpty = computed(() => {
    workshops.value.length <= 0;
  });

  const rebuildTree = () => {
    treeIndex.value = 0;
    pathMap.value = [];
    workshopTree.value = _buildTree(workshop.value[0]?.menus || []);
    workShopPathMap.value = [...pathMap.value];
  };

  const treeChange = (node: ITree) => {
    let treeIndex = node?.index || [];
    let path = "";
    treeIndex.forEach((idx) => (path += idx + "/"));
    setTreeIndex(treeIndex);
    const nodePath = node.path?.replace('./', '') || node.path
    router.push({ path: `/workshops/${wsId.value}/${nodePath}` });
  };

  const buildTree = (ws: IWorkshopMenuItem[], index?: number[]): ITree[] => {
    treeIndex.value = 0;
    pathMap.value = [];
    return _buildTree(ws, index);
  };

  const buildMenu = (submenu: IWorkshopMenuItem[]): any => {
    if (typeof submenu.forEach !== "function") {
      return [];
    }

    let result: {
      name: string;
      menus: IWorkshopMenuItem[];
      pages: IWorkshopMenuItem[];
    }[] = [];
    let menu = {
      name: "",
      menus: [] as IWorkshopMenuItem[],
      pages: [] as IWorkshopMenuItem[],
    };

    submenu.forEach((item: IWorkshopMenuItem) => {
      menu.name = item.name;
      menu.menus = [];
      if (item.menus && item.menus.length > 0) {
        menu.menus = { ...buildMenu(item.menus) };
      }
      if (item.pages && item.pages.length > 0) {
        menu.pages = { ...buildMenu(item.pages) };
      }
      result.push({ ...menu });
    });
    //  console.log(result)
    return result;
  };

  // const refreshView = (url: string | undefined) => {
  //   console.log("url: " + url);
  //   console.log("url param: " + urlParam.value);
  //   setTreeIndexByPath(urlParam.value);
  //   //tree.value?.setCurrentKey(workshopTreeKey.value, true)
  // };

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

  const addWorkshop = (todo: IWorkshop) => {
    workshops.value.push(todo);
  };

  const loadWorkshops = () => {
    const {
      data,
      isLoading,
      isFinished: isWorkshopsLoaded,
      error,
    } = useAxios("/workshops", config, GLabsApiClient);
    
    watch(isWorkshopsLoaded, () => {
      workshops.value = [...data.value];
    });

    if (error.value) {
      notify({
        title: `Workshops Issue`,
        text: `${handleAxiosError(
          error.value,
          `Workshops are not available at the moment`
        )}`,
        duration: -1,
        type: "error",
      });
    }
  };

  const removeWorkshop = (index: number) => {
    workshops.value.splice(index, 1);
  };

  const setTreeIndex = (ind: number[]) => {
    page_index.value = [...ind];
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
        localization.value === item.locale ||
        item[loc]
      ) {
        branch = {} as ITree;
        let locItem = { ...item };
        if (item[loc]) {
          locItem = item[loc] as IWorkshopMenuItem;
          locItem.menus = item.menus;
        }
        branch.index = [...(index || [])];
        branch.label = locItem.name;
        branch.path = locItem.path.substr(0, locItem.path.lastIndexOf("."));
        branch.path = branch.path.substr(2);
        branch.path = branch.path.replaceAll(" ", "-");
        branch.path = branch.path.replaceAll("_index", "");
        branch.path = branch.path.replaceAll("_", "-");
        branch.path = branch.path.replaceAll(".", "-");
        branch.path = './' + branch.path
        branch.id = treeIndex.value;
        treeIndex.value++;
        branch.index.push(i);
        if (locItem.menus && locItem.menus.length > 0) {
          branch.children = [..._buildTree(locItem.menus, branch.index)];
        }
        pathMap.value.push({
          path: branch.path,
          index: [...branch.index],
          key: branch.id,
        });
        result.push({ ...branch });
        delete branch.children;
      }
      i++;
    });

    return result;
  };

  return {
    workshops,
    workshopTree,
    workshopTreeKey,
    workShopPathMap,
    workshopName,
    workshop,
    page_index,
    getWorkshopUrl,
    getWorkshopPage,
    workshopEmpty,
    //workshopTitle,
    //workshopMenu,
    loadWorkshops,
    loadWorkshop,
    addWorkshop,
    removeWorkshop,
    setTreeIndex,
    setTreeIndexByKey,
    setTreeIndexByPath,
    rebuildTree,
    buildMenu,
    buildTree,
    pathMap,
    urlParam,
    wsId,
    slashIdx,
    treeChange,
    workshopTitle,
    workshopChapter,
    workshopSection
  };

  // async updatePersonalProfile(user: IDriveUser)
});
