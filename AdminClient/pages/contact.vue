<template>
  <div class="px-4 py-6">
    <table class="min-w-full border-collapse rounded-md border border-gray-200">
      <thead>
        <tr class="bg-gray-100">
          <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">
            Name
          </th>
          <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">
            Email
          </th>
          <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">
            Message
          </th>
          <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">
            Date Added
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in paginatedData"
          :key="item.contactId"
          class="border-t hover:bg-gray-50"
        >
          <td class="px-4 py-2 text-sm text-gray-700">{{ item.name }}</td>
          <td class="px-4 py-2 text-sm text-gray-700">
            {{ item.email }}
          </td>
          <td class="px-4 py-2 text-sm text-gray-700">
            {{ item.message }}
          </td>
          <td class="px-4 py-2 text-sm text-gray-700">
            {{ item.dateAdded }}
          </td>
        </tr>
        <tr v-if="paginatedData.length === 0">
          <td colspan="4" class="px-4 py-2 text-center text-sm text-gray-500">
            No data available.
          </td>
        </tr>
      </tbody>
    </table>
    <HelperTableFooter
      :total-items="totalItems.length"
      :items-per-page="itemsPerPage"
      :current-page="currentPage"
      @current-page-change="updateCurrentPage"
    />
  </div>
</template>

<script setup>
definePageMeta({
  layout: "root",
});
const config = useRuntimeConfig();
const userInfo = useCookie("userInfo");
const settings = useCookie("appSettings");
useHead({
  title: `Contacts | ${settings.value?.siteTitle}`,
});
const totalItems = ref([]);
const itemsPerPage = ref(5);
const currentPage = ref(1);

//get paginated data
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return totalItems.value.slice(start, end);
});

//current page number update
const updateCurrentPage = (page) => {
  currentPage.value = page;
};

//get all contact
const fetchContacts = async () => {
  try {
    const response = await $fetch.raw(
      config.public.apiUrl + `/api/Settings/GetContacts`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userInfo?.value.token}`,
        },
      },
    );
    if (response.status == "200") {
      totalItems.value = response._data;
    }
  } catch (error) {
    useSiteError(error?.response);
  }
};

onMounted(() => fetchContacts());
</script>
