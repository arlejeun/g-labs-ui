import { GLabsApiClient } from "@/apis/glabs";
import { useAxios } from "@vueuse/integrations/useAxios";
import { useUserStore } from "@/stores/user";
import { useWorkshopStore } from '@/stores/workshop';
import { WS, type IWsBreadcrumb } from '@/interfaces/workshop';

const WORKSHOP_URL = 'https://analytics.drive-dev.genesys.com/event'


export const esWorkshopEndChapter = () => {
  esWorkshopEvent('chapter-completed')
}

export const esWorkshopEndCourse = () => {
  esWorkshopEvent('course-completed')
}

export const esWorkshopPreview = () => {
  esWorkshopEvent('preview')
}

export const esWorkshopEvent = (ws_action: string = 'preview') => {

  const wStore = useWorkshopStore()
  const { workshopCreadcrub, workshopName } = storeToRefs(wStore)
  const userStore = useUserStore();
  const { localization, user, username, userId, userEmail, userType, userCompany } = storeToRefs(userStore);

  if (username.value === 'Anonymous' || !workshopName.value) return

  const webObject = {
    ip: "4.4.4.4",  // should be assigned by backend
    url: location.href
  }

  const userObject = {
    name: user.value.first_name + ' ' + user.value.last_name,
    username: username.value,
    email: userEmail.value,
    type: userType.value as string,
    company: userCompany.value,
    id: userId.value.toString()
  }

  const workshopEvent = {
    name: workshopName.value,
    chapter: (workshopCreadcrub.value[WS.Chapter] as IWsBreadcrumb)?.title || '',
    section: (workshopCreadcrub.value[WS.Section] as IWsBreadcrumb)?.title || '',
    action: ws_action,
    locale: localization.value || 'en-US',
    activeenv: user.value.active_org_id || 'unknown',
  }

  const payload = {
    web: webObject,
    user: userObject,
    workshop: workshopEvent
  }
  const { execute } = useAxios(GLabsApiClient);
  execute(WORKSHOP_URL, {
    method: "POST",
    data: payload,
  });

}

