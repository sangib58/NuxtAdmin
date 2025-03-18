<template>
  <div>
    <header
      class="sticky top-0 flex items-center justify-between bg-light-gray px-2 py-2 shadow-2xl"
    >
      <img
        class="size-12 object-contain"
        :src="config.public.apiUrl + settings?.logoPath"
      />
      <div class="hidden space-x-2 md:block">
        <NuxtLink
          :to="homeUrl"
          class="rounded-md px-2 py-1.5 text-base font-semibold text-gray-700 hover:bg-gray-200"
          >Home</NuxtLink
        >
        <NuxtLink
          :to="featureUrl"
          class="rounded-md px-2 py-1.5 text-base font-semibold text-gray-700 hover:bg-gray-200"
          >Features</NuxtLink
        >
        <NuxtLink
          :to="contactUrl"
          class="rounded-md px-2 py-1.5 text-base font-semibold text-gray-700 hover:bg-gray-200"
          >Contact</NuxtLink
        >
      </div>
      <button
        @click.stop="navigateTo('/signIn')"
        class="hidden rounded-md px-3 py-1 text-base font-semibold text-gray-700 outline outline-1 outline-black hover:bg-gray-200 md:block"
      >
        Sign In
      </button>
      <span class="cursor-pointer md:hidden" @click.stop="showNav = !showNav">
        <Icon icon-name="mdiMenu" size="26" color="#3a484a" />
      </span>
    </header>
    <Teleport to="body" v-if="showNav">
      <div
        class="fixed inset-0 z-50 bg-black bg-opacity-50"
        @click="showNav = !showNav"
      >
        <nav
          class="left-0 top-0 min-h-full w-64 bg-dark-gray text-white"
          @click.stop
        >
          <div class="flex flex-col">
            <div class="flex justify-center py-[17px] text-xl font-semibold">
              {{ settings?.siteTitle }}
            </div>
            <div class="border-b border-t border-b-gray-100 border-t-gray-100">
              <ul class="py-2">
                <li class="py-3 pl-6 hover:bg-gray-600">
                  <NuxtLink class="flex" :to="homeUrl"
                    ><span
                      ><Icon
                        icon-name="mdiAccount"
                        size="26"
                        color="#ffffff" /></span
                    ><span class="pl-6 text-base font-semibold"
                      >Home</span
                    ></NuxtLink
                  >
                </li>
                <li class="py-3 pl-6 hover:bg-gray-600">
                  <NuxtLink class="flex" :to="featureUrl"
                    ><span
                      ><Icon
                        icon-name="mdiFeatureSearch"
                        size="26"
                        color="#ffffff" /></span
                    ><span class="pl-6 text-base font-semibold"
                      >Features</span
                    ></NuxtLink
                  >
                </li>
                <li class="py-3 pl-6 hover:bg-gray-600">
                  <NuxtLink class="flex" :to="contactUrl"
                    ><span
                      ><Icon
                        icon-name="mdiContacts"
                        size="26"
                        color="#ffffff" /></span
                    ><span class="pl-6 text-base font-semibold"
                      >Contact</span
                    ></NuxtLink
                  >
                </li>
              </ul>
            </div>
            <div
              class="flex cursor-pointer py-4 hover:bg-gray-600"
              @click.stop="navigateTo('/signIn')"
            >
              <span class="pl-6"
                ><Icon icon-name="mdiLogin" size="26" color="#ffffff"
              /></span>
              <span class="pl-6 text-base font-semibold">Sign In</span>
            </div>
          </div>
        </nav>
      </div>
    </Teleport>

    <slot />

    <footer class="mt-52">
      <div class="bg-dark-gray py-2 text-center text-white">
        <div class="space-y-6">
          <div class="flex justify-center space-x-6">
            <a :href="settings?.footerInstagram" target="_blank"
              ><Icon icon-name="mdiInstagram" size="26" color="#ffffff"
            /></a>
            <a :href="settings?.footerLinkedin" target="_blank"
              ><Icon icon-name="mdiLinkedin" size="26" color="#ffffff"
            /></a>
            <a :href="settings?.footerFacebook" target="_blank"
              ><Icon icon-name="mdiFacebook" size="26" color="#ffffff"
            /></a>
            <a :href="settings?.footerTwitter" target="_blank"
              ><Icon icon-name="mdiTwitter" size="26" color="#ffffff"
            /></a>
          </div>
          <div>{{ settings?.footerText }}</div>
          <div class="border-t border-white pt-4">
            {{ settings?.copyRightText }}
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const appSettings = useCookie("appSettings", {
  path: "/",
  default: () => null,
  watch: true,
});
useHead({
  link: [
    {
      rel: "icon",
      type: "image/png",
      href: config.public.apiUrl + appSettings.value?.faviconPath,
    },
  ],
});
const showNav = ref(false);
const homeUrl = ref("");
const featureUrl = ref("");
const contactUrl = ref("");

const {
  data: settings,
  status,
  error,
} = await useFetch(config.public.apiUrl + "/api/Settings/GetSiteSettings");
if (status.value == "success") {
  useState("appSettings", () => settings.value);
  appSettings.value = {
    siteTitle: settings.value?.siteTitle,
    welComeMessage: settings.value?.welComeMessage,
    logoPath: settings.value?.logoPath,
    faviconPath: settings.value?.faviconPath,
    faviconPath: settings.value?.faviconPath,
    copyRightText: settings.value?.copyRightText,
    defaultEmail: settings.value?.defaultEmail,
    password: settings.value?.password,
    host: settings.value?.host,
    port: settings.value?.port,
    allowWelcomeEmail: settings.value?.allowWelcomeEmail,
  };
} else if (status.value == "error") {
  useSiteError(error.value?.cause);
}

onMounted(() => {
  homeUrl.value = window?.location?.origin + "/#home";
  featureUrl.value = window?.location?.origin + "/#features";
  contactUrl.value = window?.location?.origin + "/#contact";
});
</script>
