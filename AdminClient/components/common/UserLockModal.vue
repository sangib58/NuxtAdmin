<template>
  <Teleport to="body" v-if="show">
    <div
      class="fixed inset-0 z-50 flex min-h-dvh items-center justify-center bg-black bg-opacity-50"
    >
      <div
        class="flex min-w-64 flex-col space-y-6 rounded-md bg-dark-black px-4 py-2"
      >
        <div class="flex justify-center">
          <img :src="profileImg" class="size-12 rounded-full object-cover" />
        </div>
        <div>
          <input
            type="password"
            placeholder="Type password"
            v-model="password"
            @keyup="markAsTouched('password')"
            class="bg-dark-black py-2 pl-1 text-white outline outline-1 outline-gray-300 placeholder:pl-1 placeholder:text-sm"
          />
          <p
            v-if="touched.password && passwordError != true"
            class="mt-2 text-sm text-red-500"
          >
            {{ passwordError }}
          </p>
        </div>
        <div class="flex justify-center text-sm font-bold text-white">
          <button @click.stop="changePassword" class="cursor-pointer">
            <Icon icon-name="mdiKey" size="32" color="#ffffff" />
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { useToast } from "vue-toastification";
import fallBackProfileImg from "~/assets/images/pp1.jpeg";

defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(["close"]);
const config = useRuntimeConfig();
const userInfo = useCookie("userInfo");
const password = ref("");
const touched = ref({
  password: "",
});
const toast = useToast();

//form validation check
const { $minLength } = useNuxtApp();
const passwordError = computed(() => $minLength(password.value, 6));

//exutes when key pressed of an input field
const markAsTouched = (field) => {
  touched.value[field] = true;
};

const profileImg = computed(() => {
  if (userInfo?.value?.obj?.imagePath == null) {
    return fallBackProfileImg;
  } else {
    return config.public.apiUrl + userInfo?.value?.obj?.imagePath;
  }
});

const changePassword = async () => {
  try {
    const response = await $fetch.raw(
      config.public.apiUrl + "/api/Users/GetLoginInfo",
      {
        method: "POST",
        body: { email: userInfo?.value?.obj?.email, password: password.value },
      },
    );
    if (response.status == 200) {
      emit("close", false);
    } else if (response.status == 202) {
      toast.error(response._data.responseMsg);
    }
  } catch (error) {
    useSiteError(error?.response);
  }
};
</script>
