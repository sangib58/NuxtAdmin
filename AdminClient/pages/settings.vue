<template>
  <div class="px-4 py-6">
    <!--General Settings Form-->
    <div
      @click.stop="toggleGeneralForm"
      class="flex cursor-pointer items-center justify-between rounded-md border border-gray-300 py-3 hover:bg-gray-100"
    >
      <span class="pl-2 text-base font-semibold">General Settings</span>
      <span class="pr-2">
        <Icon
          icon-name="mdiArrowRight"
          size="20"
          color="#3a484a"
          v-if="isGeneralSettingsVisible"
        />
        <Icon icon-name="mdiArrowDown" size="20" color="#3a484a" v-else />
      </span>
    </div>
    <div class="px-4 py-4" :class="{ hidden: isGeneralSettingsVisible }">
      <form @submit.prevent="saveGeneralSettings" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 md:gap-x-4 md:gap-y-4">
          <div>
            <label
              class="block text-sm font-medium text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']"
              >Site Title</label
            >
            <input
              type="text"
              v-model="generalSettingForm.siteTitle"
              @keyup="markAsTouched('siteTitle')"
              autocomplete="off"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            />
            <p
              v-if="touched.siteTitle && siteTitleError != true"
              class="mt-2 text-sm text-red-500"
            >
              {{ siteTitleError }}
            </p>
          </div>
          <div>
            <label
              class="block text-sm font-medium text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']"
              >Welcome Message</label
            >
            <input
              type="text"
              v-model="generalSettingForm.welComeMessage"
              @keyup="markAsTouched('welComeMessage')"
              autocomplete="off"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            />
            <p
              v-if="touched.welComeMessage && welComeMessageError != true"
              class="mt-2 text-sm text-red-500"
            >
              {{ welComeMessageError }}
            </p>
          </div>
          <div>
            <label
              class="block text-sm font-medium text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']"
              >Copyright Text</label
            >
            <input
              type="text"
              v-model="generalSettingForm.copyRightText"
              @keyup="markAsTouched('copyRightText')"
              autocomplete="off"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            />
            <p
              v-if="touched.copyRightText && copyRightTextError != true"
              class="mt-2 text-sm text-red-500"
            >
              {{ copyRightTextError }}
            </p>
          </div>
          <div>
            <label
              class="block text-sm font-medium text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']"
              >Version</label
            >
            <input
              type="number"
              v-model="generalSettingForm.version"
              @keyup="markAsTouched('version')"
              autocomplete="off"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            />
            <p
              v-if="touched.version && versionError != true"
              class="mt-2 text-sm text-red-500"
            >
              {{ versionError }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Allow Welcome Email</label
            >
            <input
              type="checkbox"
              v-model="generalSettingForm.allowWelcomeEmail"
              class="mt-4"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Allow Faq</label
            >
            <input
              type="checkbox"
              v-model="generalSettingForm.allowFaq"
              class="mt-4"
            />
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 md:gap-x-4">
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Site Logo</label
            >
            <input
              type="file"
              accept="image/*"
              @change="onLogoImageChange"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            />
          </div>
          <div class="flex items-center justify-center">
            <img :src="previewLogo" class="size-16 object-contain" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Site Favicon</label
            >
            <input
              type="file"
              accept="image/*"
              @change="onFaviconImageChange"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            />
          </div>
          <div class="flex items-center justify-center">
            <img :src="previewFavicon" class="size-16 object-contain" />
          </div>
        </div>
        <div>
          <button
            :disabled="checkGeneralformValid"
            type="submit"
            class="mt-4 w-24 rounded-md bg-gray-800 py-1.5 text-sm font-bold text-white disabled:bg-gray-300"
          >
            Update
          </button>
        </div>
      </form>
    </div>
    <!--Email Settings Form-->
    <div
      @click.stop="toggleEmailForm"
      class="mt-2 flex cursor-pointer items-center justify-between rounded-md border border-gray-300 py-3 hover:bg-gray-100"
    >
      <span class="pl-2 text-base font-semibold">Email Settings</span>
      <span class="pr-2">
        <Icon
          icon-name="mdiArrowRight"
          size="20"
          color="#3a484a"
          v-if="isEmailSettingsVisible"
        />
        <Icon icon-name="mdiArrowDown" size="20" color="#3a484a" v-else />
      </span>
    </div>
    <div class="px-4 py-4" :class="{ hidden: isEmailSettingsVisible }">
      <form @submit.prevent="saveEmailSettings" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-4 md:gap-x-4 md:gap-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              v-model="emailSettingForm.defaultEmail"
              autocomplete="off"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Password</label
            >
            <input
              type="password"
              v-model="emailSettingForm.password"
              autocomplete="off"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Port</label>
            <input
              type="text"
              v-model="emailSettingForm.port"
              autocomplete="off"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Host(SMTP)</label
            >
            <input
              type="text"
              v-model="emailSettingForm.host"
              autocomplete="off"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            />
          </div>
        </div>
        <div>
          <button
            type="submit"
            class="mt-4 w-24 rounded-md bg-gray-800 py-1.5 text-sm font-bold text-white disabled:bg-gray-300"
          >
            Update
          </button>
        </div>
      </form>
    </div>

    <!--Email Text Settings Form-->

    <div
      @click.stop="toggleEmailTextForm"
      class="mt-2 flex cursor-pointer items-center justify-between rounded-md border border-gray-300 py-3 hover:bg-gray-100"
    >
      <span class="pl-2 text-base font-semibold">Email Text Settings</span>
      <span class="pr-2">
        <Icon
          icon-name="mdiArrowRight"
          size="20"
          color="#3a484a"
          v-if="isEmailTextSettingsVisible"
        />
        <Icon icon-name="mdiArrowDown" size="20" color="#3a484a" v-else />
      </span>
    </div>
    <div class="px-4 py-4" :class="{ hidden: isEmailTextSettingsVisible }">
      <form @submit.prevent="saveEmailTextSettings" class="space-y-4">
        <div class="text-base font-semibold">Welcome Email</div>
        <div class="grid grid-cols-1 md:grid-cols-3 md:gap-x-4 md:gap-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Subject</label
            >
            <input
              type="text"
              v-model="emailTextSettingForm.welcomeEmailSubject"
              autocomplete="off"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Header</label
            >
            <input
              type="text"
              v-model="emailTextSettingForm.welcomeEmailHeader"
              autocomplete="off"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Body</label>
            <textarea
              v-model="emailTextSettingForm.welcomeEmailBody"
              autocomplete="off"
              rows="4"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            ></textarea>
          </div>
        </div>
        <div class="text-base font-semibold">Forget Password Email</div>
        <div class="grid grid-cols-1 md:grid-cols-3 md:gap-x-4 md:gap-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Subject</label
            >
            <input
              type="text"
              v-model="emailTextSettingForm.forgetPasswordEmailSubject"
              autocomplete="off"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Header</label
            >
            <input
              type="text"
              v-model="emailTextSettingForm.forgetPasswordEmailHeader"
              autocomplete="off"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Body</label>
            <textarea
              v-model="emailTextSettingForm.forgetPasswordEmailBody"
              autocomplete="off"
              rows="4"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            ></textarea>
          </div>
        </div>
        <div>
          <button
            type="submit"
            class="mt-4 w-24 rounded-md bg-gray-800 py-1.5 text-sm font-bold text-white disabled:bg-gray-300"
          >
            Update
          </button>
        </div>
      </form>
    </div>

    <!--Landing Page Form-->
    <div
      @click.stop="toggleLandingPage"
      class="mt-2 flex cursor-pointer items-center justify-between rounded-md border border-gray-300 py-3 hover:bg-gray-100"
    >
      <span class="pl-2 text-base font-semibold">Landing Page</span>
      <span class="pr-2">
        <Icon
          icon-name="mdiArrowRight"
          size="20"
          color="#3a484a"
          v-if="isLandingTextSettingsVisible"
        />
        <Icon icon-name="mdiArrowDown" size="20" color="#3a484a" v-else />
      </span>
    </div>

    <div class="px-4 py-4" :class="{ hidden: isLandingTextSettingsVisible }">
      <form @submit.prevent="saveLandingSettings" class="space-y-4">
        <div class="grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-x-4">
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Home Header Top</label
            >
            <input
              type="text"
              v-model="landingTextSettingForm.homeHeader1"
              autocomplete="off"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Home Detail Top</label
            >
            <textarea
              v-model="landingTextSettingForm.homeDetail1"
              autocomplete="off"
              rows="4"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Home Image</label
            >
            <input
              type="file"
              accept="image/*"
              @change="onHomeImageChange"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            />
          </div>
          <div class="flex items-center justify-center">
            <img :src="homeImagePreviewSrc" class="size-64 object-contain" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Home Header Bottom</label
            >
            <input
              type="text"
              v-model="landingTextSettingForm.homeHeader2"
              autocomplete="off"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Home Detail Bottom</label
            >
            <textarea
              v-model="landingTextSettingForm.homeDetail2"
              autocomplete="off"
              rows="4"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Home Box1 Header</label
            >
            <input
              type="text"
              v-model="landingTextSettingForm.homeBox1Header"
              autocomplete="off"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Home Box1 Detail</label
            >
            <textarea
              v-model="landingTextSettingForm.homeBox1Detail"
              autocomplete="off"
              rows="4"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Home Box2 Header</label
            >
            <input
              type="text"
              v-model="landingTextSettingForm.homeBox2Header"
              autocomplete="off"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Home Box2 Detail</label
            >
            <textarea
              v-model="landingTextSettingForm.homeBox2Detail"
              autocomplete="off"
              rows="4"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Home Box3 Header</label
            >
            <input
              type="text"
              v-model="landingTextSettingForm.homeBox3Header"
              autocomplete="off"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Home Box3 Detail</label
            >
            <textarea
              v-model="landingTextSettingForm.homeBox3Detail"
              autocomplete="off"
              rows="4"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Home Box4 Header</label
            >
            <input
              type="text"
              v-model="landingTextSettingForm.homeBox4Header"
              autocomplete="off"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Home Box4 Detail</label
            >
            <textarea
              v-model="landingTextSettingForm.homeBox4Detail"
              autocomplete="off"
              rows="4"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Feature1 Header</label
            >
            <input
              type="text"
              v-model="landingTextSettingForm.feature1Header"
              autocomplete="off"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Feature1 Detail</label
            >
            <textarea
              v-model="landingTextSettingForm.feature1Detail"
              autocomplete="off"
              rows="4"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Feature1 Picture</label
            >
            <input
              type="file"
              accept="image/*"
              @change="onFeature1ImageChange"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            />
          </div>
          <div class="flex items-center justify-center">
            <img :src="feature1PreviewSrc" class="size-64 object-contain" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Feature2 Header</label
            >
            <input
              type="text"
              v-model="landingTextSettingForm.feature2Header"
              autocomplete="off"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Feature2 Detail</label
            >
            <textarea
              v-model="landingTextSettingForm.feature2Detail"
              autocomplete="off"
              rows="4"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Feature2 Picture</label
            >
            <input
              type="file"
              accept="image/*"
              @change="onFeature2ImageChange"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            />
          </div>
          <div class="flex items-center justify-center">
            <img :src="feature2PreviewSrc" class="size-64 object-contain" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Feature3 Header</label
            >
            <input
              type="text"
              v-model="landingTextSettingForm.feature3Header"
              autocomplete="off"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Feature3 Detail</label
            >
            <textarea
              v-model="landingTextSettingForm.feature3Detail"
              autocomplete="off"
              rows="4"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Feature3 Picture</label
            >
            <input
              type="file"
              accept="image/*"
              @change="onFeature3ImageChange"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            />
          </div>
          <div class="flex items-center justify-center">
            <img :src="feature3PreviewSrc" class="size-64 object-contain" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Feature4 Header</label
            >
            <input
              type="text"
              v-model="landingTextSettingForm.feature4Header"
              autocomplete="off"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Feature4 Detail</label
            >
            <textarea
              v-model="landingTextSettingForm.feature4Detail"
              autocomplete="off"
              rows="4"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Feature4 Picture</label
            >
            <input
              type="file"
              accept="image/*"
              @change="onFeature4ImageChange"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            />
          </div>
          <div class="flex items-center justify-center">
            <img :src="feature4PreviewSrc" class="size-64 object-contain" />
          </div>
        </div>
        <div class="grid grid-cols-1">
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Registration Text</label
            >
            <textarea
              v-model="landingTextSettingForm.registrationText"
              autocomplete="off"
              rows="4"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            ></textarea>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-y-4 md:grid-cols-3 md:gap-x-4">
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Contact Us Text</label
            >
            <textarea
              v-model="landingTextSettingForm.contactUsText"
              autocomplete="off"
              rows="4"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Contact Us Email</label
            >
            <input
              type="text"
              v-model="landingTextSettingForm.contactUsEmail"
              autocomplete="off"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Contact Us Telephone</label
            >
            <input
              type="text"
              v-model="landingTextSettingForm.contactUsTelephone"
              autocomplete="off"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            />
          </div>
        </div>
        <div class="grid grid-cols-1">
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Landing Footer Text</label
            >
            <textarea
              v-model="landingTextSettingForm.footerText"
              autocomplete="off"
              rows="4"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            ></textarea>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-y-4 md:grid-cols-4 md:gap-x-4">
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Footer Facebook</label
            >
            <input
              type="text"
              v-model="landingTextSettingForm.footerFacebook"
              autocomplete="off"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Footer Instagram</label
            >
            <input
              type="text"
              v-model="landingTextSettingForm.footerInstagram"
              autocomplete="off"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Footer LinkedIn</label
            >
            <input
              type="text"
              v-model="landingTextSettingForm.footerLinkedin"
              autocomplete="off"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Footer Twitter</label
            >
            <input
              type="text"
              v-model="landingTextSettingForm.footerTwitter"
              autocomplete="off"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            />
          </div>
        </div>
        <div>
          <button
            type="submit"
            class="mt-4 w-24 rounded-md bg-gray-800 py-1.5 text-sm font-bold text-white disabled:bg-gray-300"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useToast } from "vue-toastification";
definePageMeta({
  layout: "root",
});

const toast = useToast();
const config = useRuntimeConfig();
const userInfo = useCookie("userInfo");
const settings = useCookie("appSettings");
useHead({
  title: `App Settings | ${settings.value?.siteTitle}`,
});
const allSettings = ref({});
const previewLogo = ref("");
const previewFavicon = ref("");
const homeImagePreviewSrc = ref("");
const feature1PreviewSrc = ref("");
const feature2PreviewSrc = ref("");
const feature3PreviewSrc = ref("");
const feature4PreviewSrc = ref("");
const isGeneralSettingsVisible = ref(true);
const isEmailSettingsVisible = ref(true);
const isEmailTextSettingsVisible = ref(true);
const isLandingTextSettingsVisible = ref(true);
const generalSettingForm = reactive({
  siteSettingsId: "",
  siteTitle: "",
  welComeMessage: "",
  copyRightText: "",
  logoPath: "",
  faviconPath: "",
  allowWelcomeEmail: false,
  allowFaq: false,
  version: "",
  lastUpdatedBy: userInfo?.value.obj.userId,
});
const emailSettingForm = reactive({
  siteSettingsId: "",
  defaultEmail: "",
  password: "",
  host: "",
  port: "",
  lastUpdatedBy: userInfo?.value.obj.userId,
});
const emailTextSettingForm = reactive({
  siteSettingsId: "",
  forgetPasswordEmailSubject: "",
  forgetPasswordEmailHeader: "",
  forgetPasswordEmailBody: "",
  welcomeEmailSubject: "",
  welcomeEmailHeader: "",
  welcomeEmailBody: "",
  lastUpdatedBy: userInfo?.value.obj.userId,
});
const landingTextSettingForm = reactive({
  siteSettingsId: "",
  homeHeader1: "",
  homeDetail1: "",
  homePicture: "",
  homeHeader2: "",
  homeDetail2: "",
  homeBox1Header: "",
  homeBox1Detail: "",
  homeBox2Header: "",
  homeBox2Detail: "",
  homeBox3Header: "",
  homeBox3Detail: "",
  homeBox4Header: "",
  homeBox4Detail: "",
  feature1Header: "",
  feature1Detail: "",
  feature1Picture: "",
  feature2Header: "",
  feature2Detail: "",
  feature2Picture: "",
  feature3Header: "",
  feature3Detail: "",
  feature3Picture: "",
  feature4Header: "",
  feature4Detail: "",
  feature4Picture: "",
  registrationText: "",
  contactUsText: "",
  contactUsTelephone: "",
  contactUsEmail: "",
  footerText: "",
  footerFacebook: "",
  footerTwitter: "",
  footerLinkedin: "",
  footerInstagram: "",
  lastUpdatedBy: userInfo?.value.obj.userId,
});
const touched = reactive({
  siteTitle: "",
  welComeMessage: "",
  copyRightText: "",
  version: "",
});

//toggle general settings visibility
const toggleGeneralForm = () => {
  isGeneralSettingsVisible.value = !isGeneralSettingsVisible.value;
};

//toggle email settings visibility
const toggleEmailForm = () => {
  isEmailSettingsVisible.value = !isEmailSettingsVisible.value;
};

//toggle email text settings visibility
const toggleEmailTextForm = () => {
  isEmailTextSettingsVisible.value = !isEmailTextSettingsVisible.value;
};

//toggle landing settings visibility
const toggleLandingPage = () => {
  isLandingTextSettingsVisible.value = !isLandingTextSettingsVisible.value;
};

//form validation check
const { $required } = useNuxtApp();
const siteTitleError = computed(() => $required(generalSettingForm.siteTitle));
const welComeMessageError = computed(() =>
  $required(generalSettingForm.welComeMessage),
);
const copyRightTextError = computed(() =>
  $required(generalSettingForm.copyRightText),
);
const versionError = computed(() => $required(generalSettingForm.version));

//exutes when key pressed of an input field
const markAsTouched = (field) => {
  touched[field] = true;
};

//check general settings form fields to enable save button
const checkGeneralformValid = computed(() => {
  if (
    siteTitleError.value == true &&
    welComeMessageError.value == true &&
    copyRightTextError.value == true
  ) {
    return false;
  } else {
    return true;
  }
});

//save logo image to db
const onLogoImageChange = async (event) => {
  if (event != null) {
    let files = event.target.files;
    let objFormData = new FormData();
    objFormData.append("image", files[0]);
    const response = await $fetch.raw(
      config.public.apiUrl + "/api/Settings/UploadLogo",
      {
        method: "POST",
        body: objFormData,
        headers: {
          Authorization: `Bearer ${userInfo?.value.token}`,
        },
      },
    );
    if (response.status == 200) {
      previewLogo.value = config.public.apiUrl + "/" + response._data.dbPath;
      generalSettingForm.logoPath = "/" + response._data.dbPath;
    }
  }
};

//save favicon image to db
const onFaviconImageChange = async (event) => {
  if (event != null) {
    let files = event.target.files;
    let objFormData = new FormData();
    objFormData.append("image", files[0]);
    const response = await $fetch.raw(
      config.public.apiUrl + "/api/Settings/UploadFavicon",
      {
        method: "POST",
        body: objFormData,
        headers: {
          Authorization: `Bearer ${userInfo?.value.token}`,
        },
      },
    );
    if (response.status == 200) {
      previewFavicon.value = config.public.apiUrl + "/" + response._data.dbPath;
      generalSettingForm.faviconPath = "/" + response._data.dbPath;
    }
  }
};

//save home image to db
const onHomeImageChange = async (event) => {
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
      homeImagePreviewSrc.value =
        config.public.apiUrl + "/" + response._data.dbPath;
      landingTextSettingForm.homePicture = "/" + response._data.dbPath;
    }
  }
};

//save feature1 image to db
const onFeature1ImageChange = async (event) => {
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
      feature1PreviewSrc.value =
        config.public.apiUrl + "/" + response._data.dbPath;
      landingTextSettingForm.feature1Picture = "/" + response._data.dbPath;
    }
  }
};

//save feature2 image to db
const onFeature2ImageChange = async (event) => {
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
      feature2PreviewSrc.value =
        config.public.apiUrl + "/" + response._data.dbPath;
      landingTextSettingForm.feature2Picture = "/" + response._data.dbPath;
    }
  }
};

//save feature3 image to db
const onFeature3ImageChange = async (event) => {
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
      feature3PreviewSrc.value =
        config.public.apiUrl + "/" + response._data.dbPath;
      landingTextSettingForm.feature3Picture = "/" + response._data.dbPath;
    }
  }
};

//save feature4 image to db
const onFeature4ImageChange = async (event) => {
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
      feature4PreviewSrc.value =
        config.public.apiUrl + "/" + response._data.dbPath;
      landingTextSettingForm.feature4Picture = "/" + response._data.dbPath;
    }
  }
};

//get all settings
const fetchSettings = async () => {
  try {
    const response = await $fetch.raw(
      config.public.apiUrl + `/api/Settings/GetSiteSettings`,
    );
    if (response.status == 200) {
      allSettings.value = response._data;
      generalSettingForm.siteSettingsId = response._data.siteSettingsId;
      generalSettingForm.siteTitle = response._data.siteTitle;
      generalSettingForm.welComeMessage = response._data.welComeMessage;
      generalSettingForm.copyRightText = response._data.copyRightText;
      generalSettingForm.version = response._data.version;
      generalSettingForm.allowWelcomeEmail = response._data.allowWelcomeEmail;
      generalSettingForm.allowFaq = response._data.allowFaq;
      generalSettingForm.logoPath = response._data.logoPath;
      previewLogo.value =
        response._data.logoPath == ""
          ? ""
          : config.public.apiUrl + response._data.logoPath;
      generalSettingForm.faviconPath = response._data.faviconPath;
      previewFavicon.value =
        response._data.faviconPath == ""
          ? ""
          : config.public.apiUrl + response._data.faviconPath;

      emailSettingForm.siteSettingsId = response._data.siteSettingsId;
      emailSettingForm.defaultEmail = response._data.defaultEmail;
      emailSettingForm.password = response._data.password;
      emailSettingForm.port = response._data.port;
      emailSettingForm.host = response._data.host;

      emailTextSettingForm.siteSettingsId = response._data.siteSettingsId;
      emailTextSettingForm.forgetPasswordEmailSubject =
        response._data.forgetPasswordEmailSubject;
      emailTextSettingForm.forgetPasswordEmailHeader =
        response._data.forgetPasswordEmailHeader;
      emailTextSettingForm.forgetPasswordEmailBody =
        response._data.forgetPasswordEmailBody;
      emailTextSettingForm.welcomeEmailSubject =
        response._data.welcomeEmailSubject;
      emailTextSettingForm.welcomeEmailHeader =
        response._data.welcomeEmailHeader;
      emailTextSettingForm.welcomeEmailBody = response._data.welcomeEmailBody;

      landingTextSettingForm.siteSettingsId = response._data.siteSettingsId;
      landingTextSettingForm.homeHeader1 = response._data.homeHeader1;
      landingTextSettingForm.homeDetail1 = response._data.homeDetail1;
      landingTextSettingForm.homePicture = response._data.homePicture;
      homeImagePreviewSrc.value =
        response._data.homePicture == ""
          ? ""
          : config.public.apiUrl + response._data.homePicture;
      landingTextSettingForm.homeHeader2 = response._data.homeHeader2;
      landingTextSettingForm.homeDetail2 = response._data.homeDetail2;
      landingTextSettingForm.homeBox1Header = response._data.homeBox1Header;
      landingTextSettingForm.homeBox1Detail = response._data.homeBox1Detail;
      landingTextSettingForm.homeBox2Header = response._data.homeBox2Header;
      landingTextSettingForm.homeBox2Detail = response._data.homeBox2Detail;
      landingTextSettingForm.homeBox3Header = response._data.homeBox3Header;
      landingTextSettingForm.homeBox3Detail = response._data.homeBox3Detail;
      landingTextSettingForm.homeBox4Header = response._data.homeBox4Header;
      landingTextSettingForm.homeBox4Detail = response._data.homeBox4Detail;
      landingTextSettingForm.feature1Header = response._data.feature1Header;
      landingTextSettingForm.feature1Detail = response._data.feature1Detail;
      feature1PreviewSrc.value =
        response._data.feature1Picture == ""
          ? ""
          : config.public.apiUrl + response._data.feature1Picture;
      landingTextSettingForm.feature1Picture = response._data.feature1Picture;
      landingTextSettingForm.feature2Header = response._data.feature2Header;
      landingTextSettingForm.feature2Detail = response._data.feature2Detail;
      feature2PreviewSrc.value =
        response._data.feature2Picture == ""
          ? ""
          : config.public.apiUrl + response._data.feature2Picture;
      landingTextSettingForm.feature2Picture = response._data.feature2Picture;
      landingTextSettingForm.feature3Header = response._data.feature3Header;
      landingTextSettingForm.feature3Detail = response._data.feature3Detail;
      feature3PreviewSrc.value =
        response._data.feature3Picture == ""
          ? ""
          : config.public.apiUrl + response._data.feature3Picture;
      landingTextSettingForm.feature3Picture = response._data.feature3Picture;
      landingTextSettingForm.feature4Header = response._data.feature4Header;
      landingTextSettingForm.feature4Detail = response._data.feature4Detail;
      feature4PreviewSrc.value =
        response._data.feature4Picture == ""
          ? ""
          : config.public.apiUrl + response._data.feature4Picture;
      landingTextSettingForm.feature4Picture = response._data.feature4Picture;
      landingTextSettingForm.registrationText = response._data.registrationText;
      landingTextSettingForm.contactUsText = response._data.contactUsText;
      landingTextSettingForm.contactUsEmail = response._data.contactUsEmail;
      landingTextSettingForm.contactUsTelephone =
        response._data.contactUsTelephone;
      landingTextSettingForm.footerText = response._data.footerText;
      landingTextSettingForm.footerFacebook = response._data.footerFacebook;
      landingTextSettingForm.footerInstagram = response._data.footerInstagram;
      landingTextSettingForm.footerLinkedin = response._data.footerLinkedin;
      landingTextSettingForm.footerTwitter = response._data.footerTwitter;
    }
  } catch (error) {
    console.error(error);
    useSiteError(error?.response);
  }
};

//update general settings
const saveGeneralSettings = async () => {
  try {
    const response = await $fetch.raw(
      config.public.apiUrl + "/api/Settings/UpdateGeneralSetting",
      {
        method: "PATCH",
        body: generalSettingForm,
        headers: {
          Authorization: `Bearer ${userInfo?.value.token}`,
        },
      },
    );
    if (response.status == 200) {
      toast.success("Successfully saved");
    }
  } catch (error) {
    console.error(error);
    useSiteError(error?.response);
  }
};

//update email settings
const saveEmailSettings = async () => {
  try {
    const response = await $fetch.raw(
      config.public.apiUrl + "/api/Settings/UpdateEmailSetting",
      {
        method: "PATCH",
        body: emailSettingForm,
        headers: {
          Authorization: `Bearer ${userInfo?.value.token}`,
        },
      },
    );
    if (response.status == 200) {
      toast.success("Successfully saved");
    }
  } catch (error) {
    console.error(error);
    useSiteError(error?.response);
  }
};

//update email text settings
const saveEmailTextSettings = async () => {
  try {
    const response = await $fetch.raw(
      config.public.apiUrl + "/api/Settings/UpdateEmailTextSetting",
      {
        method: "PATCH",
        body: emailTextSettingForm,
        headers: {
          Authorization: `Bearer ${userInfo?.value.token}`,
        },
      },
    );
    if (response.status == 200) {
      toast.success("Successfully saved");
    }
  } catch (error) {
    console.error(error);
    useSiteError(error?.response);
  }
};

//update landing text settings
const saveLandingSettings = async () => {
  try {
    const response = await $fetch.raw(
      config.public.apiUrl + "/api/Settings/UpdateLandingSetting",
      {
        method: "PATCH",
        body: landingTextSettingForm,
        headers: {
          Authorization: `Bearer ${userInfo?.value.token}`,
        },
      },
    );
    if (response.status == 200) {
      toast.success("Successfully saved");
    }
  } catch (error) {
    console.error(error);
    useSiteError(error?.response);
  }
};

//On mount life cycle hook
onMounted(() => fetchSettings());
</script>
