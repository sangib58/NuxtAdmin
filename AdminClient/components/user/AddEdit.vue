<template>
  <Teleport to="body" v-if="show">
    <div
      class="fixed inset-0 z-50 flex min-h-dvh items-center justify-center bg-black bg-opacity-50"
    >
      <div
        class="flex max-w-[780px] flex-col space-y-10 rounded-md bg-white px-4 py-6"
      >
        <div v-if="isEdit == true" class="text-xl font-semibold">Edit User</div>
        <div v-else class="text-xl font-semibold">Add User</div>
        <form @submit.prevent="saveUser" class="flex flex-col space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-3 md:gap-x-3 md:gap-y-3">
            <div>
              <label
                class="block text-sm font-medium text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']"
                >Name</label
              >
              <input
                type="text"
                v-model="userForm.fullName"
                @keyup="markAsTouched('fullName')"
                autocomplete="off"
                class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
              />
              <p
                v-if="touched.fullName && nameError != true"
                class="mt-2 text-sm text-red-500"
              >
                {{ nameError }}
              </p>
            </div>
            <div>
              <label
                class="block text-sm font-medium text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']"
                >Email</label
              >
              <input
                type="email"
                v-model="userForm.email"
                @keyup="markAsTouched('email')"
                autocomplete="off"
                class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
              />
              <p
                v-if="touched.email && emailError != true"
                class="mt-2 text-sm text-red-500"
              >
                {{ emailError }}
              </p>
            </div>
            <div>
              <label
                class="block text-sm font-medium text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']"
                >Role</label
              >
              <select
                v-model="userForm.userRoleId"
                class="w-full appearance-none border-b border-gray-300 p-1 text-sm text-gray-700 outline-none focus:border-blue-600"
              >
                <option
                  value=""
                  class="text-sm font-medium text-gray-700"
                  disabled
                >
                  Select Role
                </option>
                <option
                  v-for="item in totalItems"
                  :key="item.userRoleId"
                  :value="item.userRoleId"
                  class="text-sm font-medium text-gray-700"
                >
                  {{ item.roleName }}
                </option>
              </select>
              <p
                v-if="touched.userRoleId && roleError != true"
                class="mt-2 text-sm text-red-500"
              >
                {{ roleError }}
              </p>
            </div>
            <div v-if="isEdit == false">
              <label
                class="block text-sm font-medium text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']"
                >Password</label
              >
              <input
                type="password"
                v-model="userForm.password"
                @keyup="markAsTouched('password')"
                autocomplete="off"
                class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
              />
              <p
                v-if="touched.password && passwordError != true"
                class="mt-2 text-sm text-red-500"
              >
                {{ passwordError }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Date Of Birth</label
              >
              <Datepicker
                v-model="userForm.dateOfBirth"
                autocomplete="off"
                class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Mobile</label
              >
              <input
                type="text"
                v-model="userForm.mobile"
                autocomplete="off"
                class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Profile Picture</label
              >
              <input
                type="file"
                accept="image/*"
                @change="onProfileImageChange"
                class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
              />
            </div>
            <div v-if="previewImage != null">
              <img :src="previewImage" class="size-16 object-contain" />
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
const previewImage = ref(null);
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
const userForm = reactive({
  userId: "",
  userRoleId: "",
  fullName: "",
  mobile: "",
  email: "",
  password: "",
  dateOfBirth: null,
  imagePath: null,
});
const touched = reactive({
  userRoleId: "",
  fullName: "",
  email: "",
  password: "",
});

//form validation check
const { $required, $email, $minLength } = useNuxtApp();
const nameError = computed(() => $required(userForm.fullName));
const emailError = computed(() => $email(userForm.email));
const passwordError = computed(() => $minLength(userForm.password, 6));
const roleError = computed(() => $required(userForm.userRoleId));

//check add or edit
const isEdit = computed(() => {
  if (props.obj?.userId == undefined) {
    return false;
  } else {
    userForm.userId = props.obj.userId;
    userForm.userRoleId = props.obj.userRoleId;
    userForm.fullName = props.obj.fullName;
    userForm.email = props.obj.email;
    userForm.password = props.obj.password;
    userForm.mobile = props.obj.mobile;
    userForm.imagePath = props.obj.imagePath;
    userForm.dateOfBirth =
      props.obj.dateOfBirth != null
        ? new Date(props.obj.dateOfBirth.substr(0, 10))
        : null;
    previewImage.value =
      props.obj.imagePath == null
        ? null
        : config.public.apiUrl + props.obj.imagePath;

    return true;
  }
});

//exutes when key pressed of an input field
const markAsTouched = (field) => {
  touched[field] = true;
};

//save profile image to db
const onProfileImageChange = async (event) => {
  if (event != null) {
    let files = event.target.files;
    let objFormData = new FormData();
    objFormData.append("image", files[0]);
    const response = await $fetch.raw(
      config.public.apiUrl + "/api/Users/Upload",
      {
        method: "POST",
        body: objFormData,
        headers: {
          Authorization: `Bearer ${userInfo?.value.token}`,
        },
      },
    );
    if (response.status == 200) {
      previewImage.value = config.public.apiUrl + "/" + response._data.dbPath;
      userForm.imagePath = "/" + response._data.dbPath;
    }
  }
};

//check form fields to enable submit button
const checkformValid = computed(() => {
  if (
    nameError.value == true &&
    roleError.value == true &&
    emailError.value == true &&
    passwordError.value == true
  ) {
    return false;
  } else {
    return true;
  }
});

//calcel action
const cancel = () => {
  emit("close", false);
};

//user add/edit
const saveUser = async () => {
  if (isEdit.value) {
    try {
      const updateObj = {
        userId: userForm.userId,
        userRoleId: userForm.userRoleId,
        password: userForm.password,
        fullName: userForm.fullName,
        email: userForm.email,
        mobile: userForm.mobile,
        imagePath: userForm.imagePath,
        dateOfBirth:
          userForm.dateOfBirth != null
            ? userForm.dateOfBirth.toISOString().split("T")[0]
            : null,
        lastUpdatedBy: userInfo?.value.obj.userId,
      };
      const response = await $fetch.raw(
        config.public.apiUrl + "/api/Users/UpdateUser",
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
        fullName: userForm.fullName,
        userRoleId: userForm.userRoleId,
        password: userForm.password,
        email: userForm.email,
        mobile: userForm.mobile,
        imagePath: userForm.imagePath,
        dateOfBirth:
          userForm.dateOfBirth != null
            ? userForm.dateOfBirth.toISOString().split("T")[0]
            : null,
        addedBy: userInfo?.value.obj.userId,
      };
      //console.log(insertObj);
      const response = await $fetch.raw(
        config.public.apiUrl + "/api/Users/CreateUser",
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
const fetchRoles = async () => {
  try {
    const response = await $fetch.raw(
      config.public.apiUrl + `/api/Users/GetUserRoleList`,
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

onMounted(() => fetchRoles());
</script>
