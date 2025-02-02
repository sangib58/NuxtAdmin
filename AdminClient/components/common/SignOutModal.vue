<template>
  <Teleport to="body" v-if="show">
    <div
      class="fixed inset-0 z-50 flex min-h-dvh items-center justify-center bg-black bg-opacity-50"
    >
      <div class="flex min-w-64 flex-col rounded-md bg-gray-900 px-4 py-2">
        <div class="text-xl font-bold text-white">Want to leave?</div>
        <div class="pt-2 text-sm text-gray-200">Press Signout to leave</div>
        <div
          class="flex justify-end space-x-2 pt-12 text-sm font-bold text-white"
        >
          <button
            @click.stop="cancel"
            class="test base cursor-pointer text-blue-500 hover:text-blue-600"
          >
            Stay Here
          </button>
          <button @click.stop="signOut" class="cursor-pointer">Sign Out</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const config = useRuntimeConfig();
defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(["close"]);

//stay here action
const cancel = () => {
  emit("close", false);
};

//update logout datetime
const historyUpdate = async () => {
  await $fetch.raw(
    config.public.apiUrl +
      `/api/Users/UpdateLoginHistory/${localStorage.getItem("logCode")}`,
    {
      method: "PATCH",
    },
  );
};

//singout action
const signOut = () => {
  historyUpdate();
  navigateTo("/");
};
</script>
