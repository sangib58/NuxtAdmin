<template>
  <div class="mt-4 flex items-center justify-center space-x-4">
    <button
      class="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600 disabled:bg-gray-300"
      :disabled="currentPage === 1"
      @click="goToPage(currentPage - 1)"
    >
      Previous
    </button>
    <span class="text-sm text-gray-600">
      Page {{ currentPage }} of {{ totalPages }}
    </span>
    <button
      class="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600 disabled:bg-gray-300"
      :disabled="currentPage === totalPages"
      @click="goToPage(currentPage + 1)"
    >
      Next
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  totalItems: {
    type: Number,
    required: true,
  },
  itemsPerPage: {
    type: Number,
    required: true,
  },
  currentPage: {
    type: Number,
    required: true,
  },
});
const emits = defineEmits(["current-page-change"]);

//calculate total page
const totalPages = computed(() =>
  Math.ceil(props.totalItems / props.itemsPerPage),
);

// Emit page change event
const goToPage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    emits("current-page-change", page);
  }
};
</script>
