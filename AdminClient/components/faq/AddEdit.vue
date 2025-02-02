<template>
  <Teleport to="body" v-if="show">
    <div
      class="fixed inset-0 z-50 flex min-h-dvh items-center justify-center bg-black bg-opacity-50"
    >
      <div
        class="flex min-w-[680px] flex-col space-y-10 rounded-md bg-white px-4 py-6"
      >
        <div v-if="isEdit == true" class="text-xl font-semibold">Edit Faq</div>
        <div v-else class="text-xl font-semibold">Add Faq</div>
        <form @submit.prevent="saveFaq" class="space-y-8">
          <div>
            <label
              class="block text-sm font-medium text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']"
              >Title</label
            >
            <input
              type="text"
              v-model="faqForm.title"
              @keyup="markAsTouched('title')"
              autocomplete="off"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
            />
            <p
              v-if="touched.title && titleError != true"
              class="mt-2 text-sm text-red-500"
            >
              {{ titleError }}
            </p>
          </div>
          <div>
            <label
              class="block text-sm font-medium text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']"
              >Description</label
            >
            <textarea
              v-model="faqForm.description"
              @keyup="markAsTouched('description')"
              class="mt-1 w-full border-b border-gray-300 outline-none focus:border-blue-600"
              rows="6"
            ></textarea>
            <p
              v-if="touched.description && descriptionError != true"
              class="mt-2 text-sm text-red-500"
            >
              {{ descriptionError }}
            </p>
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
const faqForm = reactive({
  faqId: "",
  title: "",
  description: "",
});
const touched = reactive({
  title: "",
  description: "",
});

//check add or edit
const isEdit = computed(() => {
  if (props.obj?.faqId == undefined) {
    return false;
  } else {
    faqForm.faqId = props.obj.faqId;
    faqForm.title = props.obj.title;
    faqForm.description = props.obj.description;
    return true;
  }
});

//form validation check
const { $required, $minLength } = useNuxtApp();
const titleError = computed(() => $required(faqForm.title));
const descriptionError = computed(() => $minLength(faqForm.description, 10));

//exutes when key pressed of an input field
const markAsTouched = (field) => {
  touched[field] = true;
};

//check form fields to enable submit button
const checkformValid = computed(() => {
  if (titleError.value == true && descriptionError.value == true) {
    return false;
  } else {
    return true;
  }
});

//calcel action
const cancel = () => {
  emit("close", false);
};

//faq add/edit
const saveFaq = async () => {
  if (isEdit.value) {
    try {
      const updateObj = {
        faqId: faqForm.faqId,
        title: faqForm.title,
        description: faqForm.description,
        lastUpdatedBy: userInfo?.value.obj.userId,
      };
      const response = await $fetch.raw(
        config.public.apiUrl + "/api/Settings/UpdateFaq",
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
        title: faqForm.title,
        description: faqForm.description,
        addedBy: userInfo?.value.obj.userId,
      };
      const response = await $fetch.raw(
        config.public.apiUrl + "/api/Settings/CreateFaq",
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
</script>
