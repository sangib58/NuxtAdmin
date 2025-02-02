<template>
  <div class="flex h-screen items-center justify-center">
    <div
      v-if="registerWindow"
      class="flex min-h-[510px] min-w-[380px] flex-col space-y-12 rounded-br-3xl rounded-tl-3xl px-4 py-2 shadow-2xl"
    >
      <div class="flex flex-col items-center justify-center">
        <img
          class="size-12 cursor-pointer object-contain"
          @click.stop="navigateTo('/')"
          :src="config.public.apiUrl + allSettings.logoPath"
        />
        <div class="text-xl font-semibold">Register</div>
      </div>
      <div>
        <form @submit.prevent="register">
          <div>
            <label
              class="block text-sm font-semibold after:ml-0.5 after:text-red-500 after:content-['*']"
              >Name</label
            >
            <input
              type="text"
              autocomplete="off"
              v-model="registerform.fullName"
              @keyup="markedAsRegisterTouched('fullName')"
              class="w-full rounded-2xl px-2 py-1 outline outline-1 outline-gray-600 focus:outline-blue-600"
            />
            <p
              v-if="touchedRegister.fullName && registerNameError != true"
              class="mt-2 text-sm text-red-500"
            >
              {{ registerNameError }}
            </p>
          </div>
          <div>
            <label
              class="block text-sm font-semibold after:ml-0.5 after:text-red-500 after:content-['*']"
              >Email</label
            >
            <input
              type="email"
              autocomplete="off"
              v-model="registerform.email"
              @keyup="markedAsRegisterTouched('email')"
              class="w-full rounded-2xl px-2 py-1 outline outline-1 outline-gray-600 focus:outline-blue-600"
            />
            <p
              v-if="touchedRegister.email && registerEmailError != true"
              class="mt-2 text-sm text-red-500"
            >
              {{ registerEmailError }}
            </p>
          </div>
          <div class="pt-2">
            <label
              class="block text-sm font-semibold after:ml-0.5 after:text-red-500 after:content-['*']"
              >Password</label
            >
            <input
              type="password"
              v-model="registerform.password"
              @keyup="markedAsRegisterTouched('password')"
              autocomplete="off"
              class="w-full rounded-2xl px-2 py-1 outline outline-1 outline-gray-600 focus:outline-blue-600"
            />
            <p
              v-if="touchedRegister.password && registerPaswordError != true"
              class="mt-2 text-sm text-red-500"
            >
              {{ registerPaswordError }}
            </p>
          </div>
          <div class="mt-12 flex justify-between">
            <button class="text-base font-semibold" @click.stop="resetWindow">
              Close
            </button>
            <button
              class="text-base font-semibold disabled:text-gray-300"
              type="submit"
              :disabled="checkRegisterFormValid"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>

    <div
      v-if="forgetPasswordWindow"
      class="flex min-h-[510px] min-w-[380px] flex-col space-y-12 rounded-br-3xl rounded-tl-3xl px-4 py-2 shadow-2xl"
    >
      <div class="flex flex-col items-center justify-center">
        <img
          class="size-12 cursor-pointer object-contain"
          @click.stop="navigateTo('/')"
          :src="config.public.apiUrl + allSettings.logoPath"
        />
        <div class="text-xl font-semibold">Forget Password</div>
      </div>
      <div>
        <form @submit.prevent="sendPassword">
          <div>
            <label
              class="block text-sm font-semibold after:ml-0.5 after:text-red-500 after:content-['*']"
              >Email</label
            >
            <input
              type="email"
              autocomplete="off"
              v-model="passwordEmail"
              class="w-full rounded-2xl px-2 py-1 outline outline-1 outline-gray-600 focus:outline-blue-600"
            />
          </div>
          <div class="mt-12 flex justify-between">
            <button class="text-base font-semibold" @click.stop="resetWindow">
              Close
            </button>
            <button class="text-base font-semibold" type="submit">
              Sent Password
            </button>
          </div>
        </form>
      </div>
    </div>

    <div
      v-if="signInWindow"
      class="flex min-h-[510px] min-w-[380px] flex-col space-y-12 rounded-br-3xl rounded-tl-3xl px-4 py-2 shadow-2xl"
    >
      <div class="flex flex-col items-center justify-center">
        <img
          class="size-12 cursor-pointer object-contain"
          @click.stop="navigateTo('/')"
          :src="config.public.apiUrl + allSettings.logoPath"
        />
        <div class="text-xl font-semibold">{{ allSettings.siteTitle }}</div>
        <div class="text-sm font-light">{{ allSettings.welComeMessage }}</div>
      </div>
      <div>
        <form @submit.prevent="login">
          <div>
            <label
              class="block text-sm font-semibold after:ml-0.5 after:text-red-500 after:content-['*']"
              >Email</label
            >
            <input
              type="email"
              autocomplete="off"
              v-model="signInform.email"
              @keyup="markedAsSignInTouched('email')"
              class="w-full rounded-2xl px-2 py-1 outline outline-1 outline-gray-600 focus:outline-blue-600"
            />
            <p
              v-if="touchedSignIn.email && signInEmailError != true"
              class="mt-2 text-sm text-red-500"
            >
              {{ signInEmailError }}
            </p>
          </div>
          <div class="pt-2">
            <label
              class="block text-sm font-semibold after:ml-0.5 after:text-red-500 after:content-['*']"
              >Password</label
            >
            <input
              type="password"
              v-model="signInform.password"
              @keyup="markedAsSignInTouched('password')"
              autocomplete="off"
              class="w-full rounded-2xl px-2 py-1 outline outline-1 outline-gray-600 focus:outline-blue-600"
            />
            <p
              v-if="touchedSignIn.password && signInPaswordError != true"
              class="mt-2 text-sm text-red-500"
            >
              {{ signInPaswordError }}
            </p>
          </div>
          <div class="flex justify-center space-x-2 pt-16 font-semibold">
            <span class="cursor-pointer" @click.stop="adminCred">Admin</span>
            <span class="cursor-pointer" @click.stop="userCred">User</span>
          </div>
          <div class="flex flex-col space-y-1 pt-2">
            <button
              type="submit"
              :disabled="checkSignInFormValid"
              class="rounded-3xl bg-gray-900 py-1 font-semibold text-white outline outline-1 disabled:bg-gray-300"
            >
              Sign In
            </button>
            <button
              @click.stop="registerToggle"
              type="button"
              class="rounded-3xl bg-gray-400 py-1 font-semibold text-gray-800"
            >
              Register
            </button>
          </div>
        </form>
      </div>
      <div class="flex justify-center">
        <div
          class="cursor-pointer font-semibold"
          @click.stop="forgetPasswordToggle"
        >
          Forget Password
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useToast } from "vue-toastification";
import { detect } from "detect-browser";
definePageMeta({
  layout: false,
});

const browser = detect();
const toast = useToast();
const config = useRuntimeConfig();
const allSettings = useCookie("appSettings");
const signInWindow = ref(true);
const registerWindow = ref(false);
const forgetPasswordWindow = ref(false);
useHead({
  title: `Sign In | ${allSettings.value?.siteTitle}`,
  link: [
    {
      rel: "icon",
      type: "image/png",
      href: config.public.apiUrl + allSettings.value?.faviconPath,
    },
  ],
});
const userInfo = useCookie("userInfo", {
  default: () => null,
  watch: true,
});
const signInform = ref({
  email: "",
  password: "",
});
const registerform = ref({
  fullName: "",
  email: "",
  password: "",
});
const touchedRegister = ref({
  fullName: "",
  email: "",
  password: "",
});
const touchedSignIn = ref({
  email: "",
  password: "",
});
const passwordEmail = ref("");
const adminCred = () => {
  signInform.value = {
    email: "admin@vueadmin.com",
    password: "admin@2024",
  };
};
const userCred = () => {
  signInform.value = {
    email: "user@vueadmin.com",
    password: "user@2024",
  };
};

const registerToggle = () => {
  registerWindow.value = true;
  signInWindow.value = false;
  forgetPasswordWindow.value = false;
};

const forgetPasswordToggle = () => {
  registerWindow.value = false;
  signInWindow.value = false;
  forgetPasswordWindow.value = true;
};

const resetWindow = () => {
  registerWindow.value = false;
  signInWindow.value = true;
  forgetPasswordWindow.value = false;
};

onMounted(() => {
  resetWindow();
});

//form validation check
const { $minLength, $email, $required } = useNuxtApp();
const registerNameError = computed(() =>
  $required(registerform.value.fullName),
);
const registerEmailError = computed(() => $email(registerform.value.email));
const registerPaswordError = computed(() =>
  $minLength(registerform.value.password, 6),
);
const signInEmailError = computed(() => $email(signInform.value.email));
const signInPaswordError = computed(() =>
  $minLength(signInform.value.password, 6),
);

//exutes when key pressed of an sign in input field
const markedAsSignInTouched = (field) => {
  touchedSignIn.value[field] = true;
};
//exutes when key pressed of an register input field
const markedAsRegisterTouched = (field) => {
  touchedRegister.value[field] = true;
};

//check sign in form fields to enable submit button
const checkSignInFormValid = computed(() => {
  if (signInEmailError.value == true && signInPaswordError.value == true) {
    return false;
  } else {
    return true;
  }
});

//check register form fields to enable submit button
const checkRegisterFormValid = computed(() => {
  if (
    registerNameError.value == true &&
    registerEmailError.value == true &&
    registerPaswordError.value == true
  ) {
    return false;
  } else {
    return true;
  }
});

//send password reset link
const sendPassword = async () => {
  if (
    allSettings.value?.defaultEmail == "" ||
    allSettings.value?.password == "" ||
    allSettings.value?.host == "" ||
    allSettings.value?.port == null
  ) {
    toast.error(
      "Email settings not done yet! Do that then send email from here.",
    );
  } else {
    try {
      const response = await $fetch.raw(
        config.public.apiUrl +
          `/api/Users/GetUserInfoForForgetPassword/${passwordEmail.value}`,
      );
      if (response.status == 200) {
        const objEmail = {
          toEmail: passwordEmail.value,
          logoPath: config.public.apiUrl + allSettings.value?.logoPath,
          siteUrl: window.location.origin,
          siteTitle: allSettings.value?.siteTitle,
          resetLink:
            window.location.origin +
            "/password-reset/" +
            response._data.forgetPasswordRef,
        };

        forgetPasswordEmailSend(objEmail);
      } else if (response.status == 202) {
        toast.error(response._data.responseMsg);
      }
    } catch (error) {
      useSiteError(error?.response);
    }
  }
};

//register action
const register = async () => {
  try {
    const response = await $fetch.raw(
      config.public.apiUrl + "/api/Users/StudentRegistration",
      {
        method: "POST",
        body: registerform.value,
      },
    );
    if (response.status == 200) {
      if (allSettings.value?.allowWelcomeEmail == true) {
        const objEmail = {
          toEmail: registerform.value.email,
          name: registerform.value.fullName,
          logoPath: config.public.apiUrl + allSettings.value?.logoPath,
          siteUrl: window.location.origin,
          siteTitle: allSettings.value?.siteTitle,
          password: registerform.value.password,
        };
        console.log(objEmail);
        welcomeEmailSend(objEmail);
      }

      signInform.value = {
        email: registerform.value.email,
        password: registerform.value.password,
      };
      login();
    } else if (response.status == 202) {
      toast.error(response._data.responseMsg);
    }
  } catch (error) {
    useSiteError(error?.response);
  }
};

//sign in action
const login = async () => {
  try {
    const response = await $fetch.raw(
      config.public.apiUrl + "/api/Users/GetLoginInfo",
      {
        method: "POST",
        body: signInform.value,
      },
    );
    if (response.status == 200) {
      userInfo.value = response._data;
      browseLog(response._data);
      navigateTo("/dashboard");
    } else if (response.status == 202) {
      toast.error(response._data.responseMsg);
    }
  } catch (error) {
    useSiteError(error?.response);
  }
};

//sent welcome email
const welcomeEmailSend = (objEmail) => {
  $fetch.raw(config.public.apiUrl + "/api/Settings/SendWelcomeMail", {
    method: "POST",
    body: objEmail,
  });
};

//sent forget password email
const forgetPasswordEmailSend = async (objEmail) => {
  const response = await $fetch.raw(
    config.public.apiUrl + "/api/Settings/SendPasswordMail",
    {
      method: "POST",
      body: objEmail,
    },
  );
  if (response.status == 200) {
    toast.success(response._data.responseMsg);
  }
};

//save history
const browseLog = async (user) => {
  const response = await $fetch.raw("https://api.ipify.org?format=json");
  if (response.status == 200) {
    const objLogHistory = {
      userId: user.obj.userId,
      ip: response._data.ip,
      browser: browser.name,
      browserVersion: browser.version,
      platform: browser.os,
    };
    const confirmed = await $fetch.raw(
      config.public.apiUrl + "/api/Users/CreateLoginHistory",
      {
        method: "POST",
        body: objLogHistory,
      },
    );
    if (confirmed.status == 200) {
      localStorage.setItem("logCode", confirmed._data.responseMsg);
    }
  }
};
</script>
