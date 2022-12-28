// /store/workshop.js

import { defineStore } from "pinia";
import type {
  IWorkshop,
  ITree,
  IPathMap,
  IWorkshopMenuItem,
  WsBreadcrumb,
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

// const config = {
//   headers: {
//     Authorization: "Bearer TBD",
//     Accept: "application/json, text/plain, */*",
//   },
// };

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

  const workshopCreadcrub = computed(() => {
    if (workshop.value.length === 0) {
      return "";
    }
    let bc = [] as WsBreadcrumb[]
    bc.push({ name: "Home", path: "/" })
    bc.push({ name: "Workshops", path: "/workshops" })

    const ws = workshop.value[0]
    const loc = localization.value || "en-US";
    let wsItem = ws?.[loc as keyof IWorkshopMenuItem] as IWorkshopMenuItem
    let title = wsItem?.name || wsId.value
    let path = workShopPathMap.value.find((item: IPathMap) => item.key == workshopTreeKey.value)?.path
    let pathArray = path?.substring(2)?.split('/')
    let modifiedPath = '/workshops/' + wsId.value + '/' + path?.substring(2) + '/'
    if (!title || !modifiedPath) return bc
    bc.push({ name: title, path: modifiedPath })

    wsItem = ws?.['menus']?.[page_index.value[0]]?.[loc as keyof IWorkshopMenuItem] as IWorkshopMenuItem
    title = wsItem.name
    path = workShopPathMap.value.find((item: IPathMap) => item.key == workshopTreeKey.value)?.path
    modifiedPath = '/workshops/' + wsId.value + '/' + pathArray?.[0] + '/'
    if (!title || !modifiedPath) return bc
    bc.push({ name: title, path: modifiedPath })

    path = workShopPathMap.value.find((item: IPathMap) => item.key == workshopTreeKey.value)?.path
    if (!(pathArray && pathArray?.length < 2)) {
      wsItem = ws?.['menus']?.[page_index.value[0]]?.[loc as keyof IWorkshopMenuItem] as IWorkshopMenuItem
      title = wsItem?.menus?.[page_index.value[1]]?.name || ''
      if (!title || !modifiedPath) return bc
      bc.push({ name: title, path: modifiedPath })
    }

    return bc
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
        if (content?.[index]?.[loc as keyof IWorkshopMenuItem]) {
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
    workShopPathMap.value = [];
    workshopTree.value = _buildTree(workshop.value[0]?.menus || []);
  };

  const treeChange = (node: ITree) => {
    if (!node) return

    let treeIndex = node?.index || [];
    let path = "";
    treeIndex.forEach((idx) => (path += idx + "/"));
    setTreeIndex(treeIndex);
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

  const loadWorkshops = async () => {
    const { execute } = useAxios(GLabsApiClient);
    const result = await execute(`/workshops`, {
        method: "GET"
    });
    if (result.isFinished.value && !result.error.value) {
          workshops.value = [...result?.data?.value];
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
        workShopPathMap.value.push({
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
    loadWorkshops,
    loadWorkshop,
    addWorkshop,
    removeWorkshop,
    setTreeIndex,
    setTreeIndexByKey,
    setTreeIndexByPath,
    rebuildTree,
    urlParam,
    wsId,
    slashIdx,
    treeChange,
    workshopCreadcrub
  };

  // async updatePersonalProfile(user: IDriveUser)
});
