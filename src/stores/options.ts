// /store/user.js

import { defineStore } from "pinia";
import type { IDriveCountry, IJiraOptionsFIelds } from "@/interfaces";

import { GLabsApiClient, JiraMiddlewareApiClient } from "@/apis/glabs";
import { useAxios } from "@vueuse/integrations/useAxios";
import { notify, useNotification } from "@kyvg/vue3-notification";
import { handleAxiosError } from "@/utils/axios";

export const useOptionsStore = defineStore("options", () => {
  // state properties vue composition of store
  const countries = ref([] as IDriveCountry[]);
  const selectedCountry = ref({} as IDriveCountry);
  const jiraFields = ref({} as IJiraOptionsFIelds)

  // computed properties vue composition of store
  const getCountryCode = computed(() => {
    return selectedCountry.value.code;
  });

  const fetchJiraOptions = async () => {
    const jiraUrl = ref(`/fields`)
    const { execute } = useAxios(JiraMiddlewareApiClient)
    const result = await execute(jiraUrl.value, { method: "GET" });
    if (result.isFinished.value) {
      jiraFields.value = result.data.value
    }
    if (result.error.value) {
      notify({
        title: 'Jira API',
        text: `${handleAxiosError(
          result.error.value,
          "Impossible to retrieve the list of available fields for service requests at the moment."
        )}`,
        duration: -1,
        type: "error",
      });
    }
  }

  const fetchCountries = async () => {
    const { execute } = useAxios(GLabsApiClient);
    const result = await execute("/countries");
    countries.value = result.data.value as IDriveCountry[];
    if (result.error.value) {
      const { notify } = useNotification();
      notify({
        title: "API Error",
        text: `Impossible to fetch the list of countries at the moment. Issue: ${result.error.value.toString()}. Please reach out to Global Technical Sales`,
        duration: -1,
        type: "error",
      });
    }
  }

  const selectCountry = (id: number): IDriveCountry | undefined => {
    return countries.value.find((country) => country.id == id);
  }

  return {
    countries,
    selectedCountry,
    getCountryCode,
    jiraFields,
    fetchCountries,
    selectCountry,
    fetchJiraOptions
  };
});
