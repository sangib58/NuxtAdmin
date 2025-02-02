<template>
  <Teleport to="body" v-if="show">
    <div
      class="fixed inset-0 z-50 flex min-h-dvh items-center justify-center bg-black bg-opacity-50"
    >
      <div
        class="flex max-w-[780px] flex-col space-y-10 rounded-md bg-white px-4 py-6"
      >
        <div v-if="isEdit == true" class="text-xl font-semibold">Edit Menu</div>
        <div v-else class="text-xl font-semibold">Add Menu</div>
        <form @submit.prevent="saveMenu" class="flex flex-col space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-3 md:gap-x-3 md:gap-y-3">
            <div>
              <label
                class="block text-sm font-medium text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']"
                >Name</label
              >
              <input
                type="text"
                v-model="menuForm.menuTitle"
                @keyup="markAsTouched('menuTitle')"
                autocomplete="off"
                class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
              />
              <p
                v-if="touched.menuTitle && titleError != true"
                class="mt-2 text-sm text-red-500"
              >
                {{ titleError }}
              </p>
            </div>
            <div>
              <label
                class="block text-sm font-medium text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']"
                >Parent</label
              >
              <select
                v-model="menuForm.parentID"
                class="w-full appearance-none border-b border-gray-300 p-1 text-sm text-gray-700 outline-none focus:border-blue-600"
              >
                <option
                  value=""
                  class="text-sm font-medium text-gray-700"
                  disabled
                >
                  Select parent
                </option>
                <option
                  v-for="item in totalItems"
                  :key="item.id"
                  :value="item.id"
                  class="text-sm font-medium text-gray-700"
                >
                  {{ item.text }}
                </option>
              </select>
              <p
                v-if="touched.parentID && parentError != true"
                class="mt-2 text-sm text-red-500"
              >
                {{ parentError }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">URL</label>
              <input
                type="text"
                v-model="menuForm.url"
                autocomplete="off"
                class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
              />
            </div>
            <div v-if="menuForm.parentID == 0">
              <label
                class="block text-sm font-medium text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']"
                >Order</label
              >
              <input
                type="number"
                v-model="menuForm.sortOrder"
                autocomplete="off"
                class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
              />
            </div>
            <div v-if="menuForm.parentID == 0">
              <label
                class="block text-sm font-medium text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']"
                >Icon Class</label
              >
              <input
                type="text"
                v-model="menuForm.iconClass"
                autocomplete="off"
                class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
              />
            </div>
          </div>
          <div class="flex justify-end space-x-4 text-sm font-bold text-white">
            <button
              @click.stop="cancel"
              class="cursor-pointer text-blue-500 hover:text-blue-600"
            >
              Cancel
            </button>
            <button
              class="text-gray-700 hover:text-gray-800 disabled:text-gray-300"
              type="submit"
              :disabled="checkformValid"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { useToast } from "vue-toastification";

const toast = useToast();
const config = useRuntimeConfig();
const totalItems = ref([]);
const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  obj: {
    type: Object,
    required: false,
    default: () => ({}),
  },
});
const emit = defineEmits(["close", "reload"]);
const userInfo = useCookie("userInfo");
const menuForm = reactive({
  menuID: "",
  parentID: "",
  menuTitle: "",
  url: "",
  isSubMenu: 0,
  sortOrder: 0,
  iconClass: "",
});
const touched = reactive({
  parentID: "",
  menuTitle: "",
  sortOrder: 0,
  iconClass: "",
});

//form validation check
const { $required } = useNuxtApp();
const titleError = computed(() => $required(menuForm.menuTitle));

//check add or edit
const isEdit = computed(() => {
  if (props.obj?.menuID == undefined) {
    return false;
  } else {
    //console.log(props.obj);
    menuForm.menuID = props.obj.menuID;
    menuForm.parentID = props.obj.parentID;
    menuForm.menuTitle = props.obj.menuTitle;
    menuForm.url = props.obj.url;
    menuForm.sortOrder = props.obj.sortOrder;
    menuForm.iconClass = props.obj.iconClass;
    return true;
  }
});

//exutes when key pressed of an input field
const markAsTouched = (field) => {
  touched[field] = true;
};

//check form fields to enable submit button
const checkformValid = computed(() => {
  if (titleError.value == true) {
    return false;
  } else {
    return true;
  }
});

//calcel action
const cancel = () => {
  emit("close", false);
};

//menu add/edit
const saveMenu = async () => {
  if (isEdit.value) {
    try {
      const updateObj = {
        menuID: menuForm.menuID,
        parentID: menuForm.parentID,
        menuTitle: menuForm.menuTitle,
        url: menuForm.url,
        sortOrder: menuForm.sortOrder,
        iconClass: menuForm.iconClass,
        isActive: true,
        isSubMenu: menuForm.url.trim().length > 0 ? 0 : 1,
        lastUpdatedBy: userInfo?.value.obj.userId,
      };
      const response = await $fetch.raw(
        config.public.apiUrl + "/api/Menu/UpdateMenu",
        {
          method: "PATCH",
          body: updateObj,
          headers: {
            Authorization: `Bearer ${userInfo?.value.token}`,
          },
        },
      );
      if (response.status == 200) {
        toast.success(response._data.responseMsg);
        emit("close", false);
        emit("reload", true);
      } else if (response.status == 202) {
        toast.error(response._data.responseMsg);
      }
    } catch (error) {
      console.error(error);
      useSiteError(error?.response);
    }
  } else {
    try {
      const insertObj = {
        parentID: menuForm.parentID,
        menuTitle: menuForm.menuTitle,
        url: menuForm.url,
        sortOrder: menuForm.sortOrder,
        iconClass: menuForm.iconClass,
        isActive: true,
        isSubMenu: menuForm.url.trim().length > 0 ? 0 : 1,
        addedBy: userInfo?.value.obj.userId,
      };
      //console.log(insertObj);
      const response = await $fetch.raw(
        config.public.apiUrl + "/api/Menu/CreateMenu",
        {
          method: "POST",
          body: insertObj,
          headers: {
            Authorization: `Bearer ${userInfo?.value.token}`,
          },
        },
      );
      if (response.status == 200) {
        toast.success(response._data.responseMsg);
        emit("close", false);
        emit("reload", true);
      } else if (response.status == 202) {
        toast.error(response._data.responseMsg);
      }
    } catch (error) {
      console.error(error);
      useSiteError(error?.response);
    }
  }
};

//fetch all parent menu
const fetchParentMenu = async () => {
  try {
    const response = await $fetch.raw(
      config.public.apiUrl + `/api/Menu/GetParentMenuList`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userInfo?.value.token}`,
        },
      },
    );
    if (response.status == 200) {
      //console.log(response._data);
      totalItems.value = response._data;
    }
  } catch (error) {
    console.error(error);
    useSiteError(error?.response);
  }
};

onMounted(() => fetchParentMenu());
</script>
