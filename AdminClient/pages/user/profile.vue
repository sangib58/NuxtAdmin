<template>
  <div class="px-4 py-4">
    <form @submit.prevent="updateProfile">
      <div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-12 md:gap-y-4">
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
          <label class="block text-sm font-medium text-gray-700">Mobile</label>
          <input
            type="text"
            v-model="userForm.mobile"
            autocomplete="off"
            class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
          />
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
            >Profile Picture</label
          >
          <input
            type="file"
            accept="image/*"
            @change="onProfileImageChange"
            class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
          />
        </div>
        <div>
          <img :src="previewImage" class="size-16 object-contain" />
        </div>
        <div>
          <button
            :disabled="checkformValid"
            type="Update"
            class="mt-4 w-20 rounded-md bg-dark-gray py-2 text-sm font-bold text-white disabled:bg-gray-300"
          >
            Update
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { useToast } from "vue-toastification";
definePageMeta({
  layout: "root",
});

const userInfo = useCookie("userInfo");
const settings = useCookie("appSettings");
useHead({
  title: `Profile | ${settings.value?.siteTitle}`,
});
const userForm = reactive({
  userId: userInfo?.value.obj.userId,
  email: "",
  mobile: "",
  fullName: "",
  dateOfBirth: null,
  imagePath: null,
  lastUpdatedBy: userInfo?.value.obj.userId,
});
const touched = reactive({
  email: "",
  mobile: "",
});
const toast = useToast();
const config = useRuntimeConfig();
const previewImage = ref("");

//form validation check
const { $email, $required } = useNuxtApp();
const nameError = computed(() => $required(userForm.fullName));
const emailError = computed(() => $email(userForm.email));

//exutes when key pressed of an input field
const markAsTouched = (field) => {
  touched[field] = true;
};

//check form fields to enable submit button
const checkformValid = computed(() => {
  if (nameError.value == true && emailError.value == true) {
    return false;
  } else {
    return true;
  }
});

//get profile info
const fetchProfileInfo = async () => {
  try {
    const response = await $fetch.raw(
      config.public.apiUrl +
        `/api/Users/GetSingleUser/${userInfo?.value.obj.userId}`,
      {
        headers: {
          Authorization: `Bearer ${userInfo?.value.token}`,
        },
      },
    );
    if (response.status == 200) {
      userForm.fullName = response._data.fullName;
      userForm.email = response._data.email;
      userForm.mobile = response._data.mobile;
      userForm.imagePath = response._data.imagePath;
      userForm.dateOfBirth =
        response._data.dateOfBirth != null
          ? new Date(response._data.dateOfBirth.substr(0, 10))
          : null;
      previewImage.value =
        response._data.imagePath == null
          ? null
          : config.public.apiUrl + response._data.imagePath;
    }
  } catch (error) {
    console.error(error);
    useSiteError(error?.response);
  }
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

//profile update
const updateProfile = async () => {
  try {
    const obj = {
      ...userForm,
      dateOfBirth:
        userForm.dateOfBirth != null
          ? userForm.dateOfBirth.toISOString().split("T")[0]
          : null,
    };
    const response = await $fetch.raw(
      config.public.apiUrl + "/api/Users/UpdateUserProfile",
      {
        method: "PATCH",
        body: obj,
        headers: {
          Authorization: `Bearer ${userInfo?.value.token}`,
        },
      },
    );
    if (response.status == 200) {
      toast.success(response._data.responseMsg);
    }
  } catch (error) {
    console.log(error);
    useSiteError(error?.response);
  }
};

onMounted(() => fetchProfileInfo());
</script>
