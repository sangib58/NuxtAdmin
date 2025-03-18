<template>
  <div @click="closePopUps">
    <nav
      class="sidebar fixed left-0 top-0 z-50 min-h-full w-64 bg-dark-black"
      :class="{ 'sidebar-hidden': hideSidebar }"
    >
      <div class="flex flex-col">
        <div class="flex space-x-2 border-b border-b-gray-800 px-4 py-4">
          <img :src="profileImg" class="size-12 rounded-full object-cover" />
          <div class="flex flex-col justify-center text-white">
            <span class="text-sm font-bold">{{ userInfo?.obj.fullName }}</span>
            <span class="text-xs font-semibold">{{
              userInfo?.obj.roleName
            }}</span>
          </div>
        </div>
        <div class="mt-4 px-3">
          <ul class="space-y-1">
            <li v-for="(item, index) in menu" :key="index">
              <NuxtLink
                :to="item.route"
                class="parent flex items-center px-3 py-3.5 text-gray-300 hover:rounded-lg hover:bg-semi-black hover:text-white"
                :class="{
                  'cursor-pointer': item.route == '',
                  'parent-active': index === expandedIndex,
                }"
                @click.stop="toggleItem(index)"
              >
                <span
                  ><Icon :icon-name="item.icon" size="20" color="#ffffff"
                /></span>
                <span class="ml-2 text-sm">{{ item.title }}</span>
                <span class="ml-auto" v-if="item.childItems.length > 0">
                  <Icon
                    v-if="index === expandedIndex"
                    icon-name="mdiArrowDown"
                    size="18"
                    color="#ffffff"
                  />
                  <Icon
                    v-else
                    icon-name="mdiArrowRight"
                    size="18"
                    color="#ffffff"
                  />
                </span>
              </NuxtLink>
              <ul
                v-if="item.childItems.length > 0 && index === expandedIndex"
                class="space-y-3"
              >
                <li
                  v-for="(child, cIndex) in item.childItems"
                  :key="cIndex"
                  class="ml-6 mt-3"
                >
                  <NuxtLink
                    :to="child.route"
                    class="child text-gray-300 before:mr-4"
                    ><span class="text-sm">{{ child.title }}</span></NuxtLink
                  >
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div
      @click.stop="hideSidebar = true"
      class="overlay fixed z-30 ml-64 min-h-full w-[calc(100%-256px)] bg-black opacity-50 md:hidden"
      :class="{ 'overlay-hidden': hideSidebar }"
    ></div>
    <main
      class="relative min-h-screen w-full"
      :class="{
        'md:ml-64 md:w-[calc(100%-256px)]': hideSidebar == false,
      }"
    >
      <header
        class="sticky top-0 z-40 flex items-center justify-between bg-light-gray px-2 py-2 shadow-2xl"
      >
        <span
          @click.stop="sidebarToggle"
          class="cursor-pointer rounded-full p-1.5 hover:bg-ultra-light-gray"
          ><Icon icon-name="mdiMenu" size="24" color="#3a484a"
        /></span>
        <div class="flex space-x-12">
          <span
            @click.stop="toggleFullScreen"
            class="cursor-pointer rounded-full p-1.5 hover:bg-ultra-light-gray"
            ><Icon
              v-if="props.isFullScreen == false"
              icon-name="mdiFullscreen"
              size="24"
              color="#3a484a"
            />
            <Icon
              v-else
              icon-name="mdiFullscreenExit"
              size="24"
              color="#3a484a"
            />
          </span>
          <span
            class="cursor-pointer rounded-full p-1.5 hover:bg-ultra-light-gray"
            ><Icon
              icon-name="mdiLock"
              size="24"
              color="#3a484a"
              @click.stop="openUserLock"
          /></span>
          <div
            @click.stop="
              showNotification = !showNotification;
              showPersonalize = false;
            "
            class="flex cursor-pointer rounded-full p-1.5 hover:bg-ultra-light-gray"
          >
            <span><Icon icon-name="mdiBell" size="24" color="#3a484a" /></span>
            <span
              class="absolute right-[242px] top-[1px] flex size-8 items-center justify-center rounded-full bg-semi-black text-sm font-semibold text-white"
              >{{ notifications?.recordsTotal }}</span
            >
            <div
              v-if="notifications?.recordsTotal > 0 && showNotification"
              class="absolute right-0 top-10 max-h-64 space-y-1 overflow-y-scroll rounded-md bg-white px-2 py-2 shadow-2xl shadow-black/70"
            >
              <div
                v-for="(item, index) in notifications.data"
                :key="index"
                class="text-lg font-medium text-gray-700 odd:bg-white even:bg-slate-50"
              >
                LogIn Time: {{ item.logInTime }} IP: {{ item.ip }} Browser:
                {{ item.browser }} Platform: {{ item.platform }}
              </div>
            </div>
          </div>
          <div class="flex flex-col space-y-0">
            <button
              @click.stop="
                showPersonalize = !showPersonalize;
                showNotification = false;
              "
              class="rounded-md p-1 px-2 hover:bg-ultra-light-gray focus:bg-ultra-light-gray"
            >
              <div class="flex">
                <span class="pt-0.5"
                  ><Icon
                    icon-name="mdiArrowDownBoldOutline"
                    size="18"
                    color="#3a484a" /></span
                ><span class="text-[15px] font-semibold">Personalize</span>
              </div>
            </button>
            <div
              v-if="showPersonalize"
              class="right-18 absolute top-10 flex w-[120px] flex-col space-y-2 rounded-md bg-white pb-[2px] text-sm font-semibold shadow-md shadow-black/20"
            >
              <NuxtLink
                to="/user/change-password"
                class="py-2 text-center hover:rounded-md hover:bg-ultra-light-gray"
                >Password</NuxtLink
              >
              <NuxtLink
                to="/user/profile"
                class="py-2 text-center hover:rounded-md hover:bg-ultra-light-gray"
                >Profile</NuxtLink
              >
            </div>
          </div>
          <span
            class="cursor-pointer rounded-full p-1.5 hover:bg-ultra-light-gray"
            @click.stop="openSignOut"
            ><Icon icon-name="mdiLogout" size="24" color="#3a484a"
          /></span>
        </div>
      </header>
      <slot />
      <CommonUserLockModal
        v-if="showUserLock"
        :show="showUserLock"
        @close="handleLock"
      />
      <CommonSignOutModal
        v-if="showSignOut"
        :show="showSignOut"
        @close="handleClose"
      />
    </main>
    <footer class="right-0 flex justify-end px-2 py-2 text-sm text-gray-700">
      {{ allSettings?.copyRightText }}
    </footer>
  </div>
</template>

<script setup>
import fallBackProfileImg from "~/assets/images/pp1.jpeg";
const config = useRuntimeConfig();
const userInfo = useCookie("userInfo");
const allSettings = useCookie("appSettings");
const expandedIndex = ref(null);
const hideSidebar = ref(false);
const showSignOut = ref(false);
const showUserLock = ref(false);
const showNotification = ref(false);
const showPersonalize = ref(false);
const emits = defineEmits(["toggle-screen"]);
const props = defineProps(["isFullScreen"]);
useHead({
  link: [
    {
      rel: "icon",
      type: "image/png",
      href: config.public.apiUrl + allSettings.value?.faviconPath,
    },
  ],
});

const closePopUps = () => {
  showNotification.value = false;
  showPersonalize.value = false;
};

const profileImg = computed(() => {
  if (userInfo?.value?.obj?.imagePath == null) {
    return fallBackProfileImg;
  } else {
    return config.public.apiUrl + userInfo?.value?.obj?.imagePath;
  }
});

const toggleFullScreen = () => {
  emits("toggle-screen", props.isFullScreen);
};

const openUserLock = () => {
  showUserLock.value = !showUserLock.value;
};

const handleLock = (confirmed) => {
  showUserLock.value = confirmed;
};

const openSignOut = () => {
  showSignOut.value = !showSignOut.value;
};

const handleClose = (confirmed) => {
  showSignOut.value = confirmed;
};

const sidebarToggle = () => {
  hideSidebar.value = !hideSidebar.value;
};

//toggle child menu
const toggleItem = (index) => {
  expandedIndex.value = expandedIndex.value === index ? null : index;
};

//get all notifications
const { data: notifications } = useFetch(
  config.public.apiUrl +
    `/api/Users/GetNotificationList/${userInfo?.value.obj.userId}`,
);

//get side bar menu
const { data: menu } = useFetch(
  config.public.apiUrl +
    `/api/Menu/GetSidebarMenu/${userInfo?.value.obj.userRoleId}`,
  {
    headers: {
      Authorization: `Bearer ${userInfo?.value.token}`,
    },
  },
);
</script>

<style scoped>
.sidebar {
  transition: transform 0.2s ease-in-out;
}

.sidebar-hidden {
  transform: translateX(-100%);
}

.overlay {
  transition: opacity 0.2s ease-in-out;
}

.overlay-hidden {
  opacity: 0;
  pointer-events: none;
}
</style>
