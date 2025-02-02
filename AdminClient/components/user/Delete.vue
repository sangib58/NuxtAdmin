<template>
  <Teleport to="body" v-if="show">
    <div
      class="fixed inset-0 z-50 flex min-h-dvh items-center justify-center bg-black bg-opacity-50"
    >
      <div
        class="flex min-w-64 flex-col space-y-2 rounded-md bg-white px-4 py-3"
      >
        <div class="text-lg font-semibold">
          Are you sure to delete this item?
        </div>
        <div class="flex justify-end space-x-2 text-sm font-bold text-white">
          <button
            @click.stop="cancel"
            class="test base cursor-pointer text-blue-500 hover:text-blue-600"
          >
            Cancel
          </button>
          <button @click.stop="remove" class="cursor-pointer text-gray-700">
            Delete
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { useToast } from "vue-toastification";

const toast = useToast();
const config = useRuntimeConfig();
const userInfo = useCookie("userInfo");
const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
});
const emit = defineEmits(["close", "reload"]);

//calcel action
const cancel = () => {
  emit("close", false);
};

//delete single user
const deleteUser = async () => {
  try {
    const response = await $fetch.raw(
      config.public.apiUrl + `/api/Users/DeleteSingleUser/${props.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userInfo?.value.token}`,
        },
      },
    );
    if (response.status == 200) {
      toast.success(response._data.responseMsg);
      emit("close", false);
      emit("reload", true);
    }
  } catch (error) {
    console.error(error);
    useSiteError(error?.response);
  }
};

//delete action
const remove = () => {
  deleteUser();
};
</script>
