<template>
  <div class="px-4 py-4">
    <form @submit.prevent="changePassword">
      <div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-12">
        <div>
          <label
            class="block text-sm font-medium text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']"
            >Password</label
          >
          <input
            type="password"
            v-model="passwordForm.password"
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
          <label
            class="block text-sm font-medium text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']"
            >Confirm Password</label
          >
          <input
            type="password"
            v-model="passwordForm.confirmPassword"
            @keyup="markAsTouched('confirmPassword')"
            autocomplete="off"
            class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
          />
          <p
            v-if="touched.confirmPassword && confirmPasswordError != true"
            class="mt-2 text-sm text-red-500"
          >
            {{ confirmPasswordError }}
          </p>
        </div>
        <div>
          <button
            :disabled="checkformValid"
            type="submit"
            class="mt-4 w-20 rounded-md bg-dark-gray py-2 text-sm font-bold text-white disabled:bg-gray-300"
          >
            Change
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

const passwordForm = reactive({
  password: "",
  confirmPassword: "",
});
const touched = reactive({
  password: "",
  confirmPassword: "",
});
const config = useRuntimeConfig();
const userInfo = useCookie("userInfo");
const settings = useCookie("appSettings");
useHead({
  title: `Change Password | ${settings.value?.siteTitle}`,
});
const toast = useToast();

//form validation check
const { $minLength } = useNuxtApp();
const passwordError = computed(() => $minLength(passwordForm.password, 6));
const confirmPasswordError = computed(() =>
  $minLength(passwordForm.confirmPassword, 6),
);

//exutes when key pressed of an input field
const markAsTouched = (field) => {
  touched[field] = true;
};

//check form fields to enable submit button
const checkformValid = computed(() => {
  if (passwordError.value == true && confirmPasswordError.value == true) {
    return false;
  } else {
    return true;
  }
});

//password change
const changePassword = async () => {
  if (passwordForm.password !== passwordForm.confirmPassword) {
    toast.error("Password not matched with Confirm Password!");
  } else {
    try {
      const response = await $fetch.raw(
        config.public.apiUrl + "/api/Users/ChangeUserPassword",
        {
          method: "PATCH",
          body: {
            userId: userInfo?.value.obj.userId,
            password: passwordForm.password,
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
  }
};
</script>
