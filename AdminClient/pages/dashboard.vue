<template>
  <div class="space-y-24 px-4 py-6">
    <div class="grid grid-cols-1 md:grid-cols-4 md:gap-x-2">
      <div
        class="bg-semi-black flex min-h-28 flex-col justify-center space-y-2 rounded-md pl-4 text-white"
      >
        <Icon icon-name="mdiGithub" size="26" color="#ffffff" />
        <div class="flex">
          <span class="pr-2 text-base font-semibold">Total</span
          ><span>{{ userStatus?.totalUser }}</span>
        </div>
      </div>
      <div
        class="bg-semi-black flex min-h-28 flex-col justify-center space-y-2 rounded-md pl-4 text-white"
      >
        <Icon icon-name="mdiGithub" size="26" color="#ffffff" />
        <div class="flex">
          <span class="pr-2 text-base font-semibold">Active</span
          ><span>{{ userStatus?.activeUser }}</span>
        </div>
      </div>
      <div
        class="bg-semi-black flex min-h-28 flex-col justify-center space-y-2 rounded-md pl-4 text-white"
      >
        <Icon icon-name="mdiGithub" size="26" color="#ffffff" />
        <div class="flex">
          <span class="pr-2 text-base font-semibold">In Active</span
          ><span>{{ userStatus?.inActiveUser }}</span>
        </div>
      </div>
      <div
        class="bg-semi-black flex min-h-28 flex-col justify-center space-y-2 rounded-md pl-4 text-white"
      >
        <Icon icon-name="mdiGithub" size="26" color="#ffffff" />
        <div class="flex">
          <span class="pr-2 text-base font-semibold">Admin</span
          ><span>{{ userStatus?.adminUser }}</span>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1">
      <ChartsDateChart />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-2">
      <div><ChartsMonthChart /></div>
      <div><ChartsYearChart /></div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-2">
      <div><ChartsRoleChart /></div>
      <div><ChartsBrowserChart /></div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "root",
});
const config = useRuntimeConfig();
const userInfo = useCookie("userInfo");
const settings = useCookie("appSettings");
useHead({
  title: `Dashboard | ${settings.value?.siteTitle}`,
});

const {
  data: userStatus,
  status,
  error,
} = await useFetch(config.public.apiUrl + "/api/Users/UserStatus", {
  method: "get",
  headers: {
    Authorization: `Bearer ${userInfo?.value.token}`,
  },
});
if (status.value == "error") {
  useSiteError(error.value?.cause);
}
</script>
