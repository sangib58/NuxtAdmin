<template>
  <Teleport to="body" v-if="show">
    <div
      class="fixed inset-0 z-50 flex min-h-dvh items-center justify-center bg-black bg-opacity-50"
    >
      <div
        class="flex min-w-[680px] flex-col space-y-10 rounded-md bg-white px-4 py-6"
      >
        <div v-if="isEdit == true" class="text-xl font-semibold">Edit Role</div>
        <div v-else class="text-xl font-semibold">Add Role</div>
        <form @submit.prevent="saveRole" class="space-y-8">
          <div>
            <label
              class="block text-sm font-medium text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']"
              >Name</label
            >
            <input
              type="text"
              v-model="roleForm.roleName"
              @keyup="markAsTouched('roleName')"
              autocomplete="off"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            />
            <p
              v-if="touched.roleName && titleError != true"
              class="mt-2 text-sm text-red-500"
            >
              {{ titleError }}
            </p>
          </div>
          <div>
            <label
              class="block text-sm font-medium text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']"
              >Menu Group</label
            >
            <select
              v-model="roleForm.menuGroupID"
              class="mt-1 w-full appearance-none border-b border-gray-300 p-1 text-sm text-gray-700 shadow-sm outline-none focus:border-blue-600"
            >
              <option
                value=""
                class="text-sm font-medium text-gray-700"
                disabled
              >
                Select Menu Group
              </option>
              <option
                v-for="item in totalItems"
                :key="item.menuGroupID"
                :value="item.menuGroupID"
                class="text-sm font-medium text-gray-700"
              >
                {{ item.menuGroupName }}
              </option>
            </select>
            <p
              v-if="touched.menuGroupID && menuGroupError != true"
              class="mt-2 text-sm text-red-500"
            >
              {{ menuGroupError }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Description</label
            >
            <textarea
              v-model="roleForm.roleDesc"
              @keyup="markAsTouched('roleDesc')"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
              rows="3"
            ></textarea>
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
const roleForm = reactive({
  userRoleId: "",
  menuGroupID: "",
  roleName: "",
  roleDesc: "",
});
const touched = reactive({
  roleName: "",
  roleDesc: "",
  menuGroupID: "",
});

//check add or edit
const isEdit = computed(() => {
  if (props.obj?.userRoleId == undefined) {
    return false;
  } else {
    roleForm.userRoleId = props.obj.userRoleId;
    roleForm.menuGroupID = props.obj.menuGroupID;
    roleForm.roleName = props.obj.roleName;
    roleForm.roleDesc = props.obj.roleDesc;
    return true;
  }
});

//form validation check
const { $required } = useNuxtApp();
const titleError = computed(() => $required(roleForm.roleName));
const menuGroupError = computed(() => $required(roleForm.menuGroupID));

//exutes when key pressed of an input field
const markAsTouched = (field) => {
  touched[field] = true;
};

//check form fields to enable submit button
const checkformValid = computed(() => {
  if (titleError.value == true && menuGroupError.value == true) {
    return false;
  } else {
    return true;
  }
});

//calcel action
const cancel = () => {
  emit("close", false);
};

//role add/edit
const saveRole = async () => {
  if (isEdit.value) {
    try {
      const updateObj = {
        userRoleId: roleForm.userRoleId,
        menuGroupId: roleForm.menuGroupID,
        roleName: roleForm.roleName,
        roleDesc: roleForm.roleDesc,
        lastUpdatedBy: userInfo?.value.obj.userId,
      };
      const response = await $fetch.raw(
        config.public.apiUrl + "/api/Users/UpdateUserRole",
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
        roleName: roleForm.roleName,
        menuGroupId: roleForm.menuGroupID,
        roleDesc: roleForm.roleDesc,
        addedBy: userInfo?.value.obj.userId,
      };
      const response = await $fetch.raw(
        config.public.apiUrl + "/api/Users/CreateUserRole",
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

//fetch all menu group
const fetchMenuGroups = async () => {
  try {
    const response = await $fetch.raw(
      config.public.apiUrl + `/api/Menu/GetMenuGroupList`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userInfo?.value.token}`,
        },
      },
    );
    if (response.status == 200) {
      totalItems.value = response._data.data;
    }
  } catch (error) {
    console.error(error);
    useSiteError(error?.response);
  }
};

onMounted(() => fetchMenuGroups());
</script>
