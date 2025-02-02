<template>
  <div class="px-4 py-6">
    <div class="flex justify-end">
      <button
        @click.stop="openAdd"
        class="mb-1 rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600 disabled:bg-gray-300"
      >
        Add User
      </button>
    </div>
    <table class="min-w-full border-collapse rounded-md border border-gray-200">
      <thead>
        <tr class="bg-gray-100">
          <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">
            Name
          </th>
          <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">
            Role
          </th>
          <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">
            Mobile
          </th>
          <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">
            Email
          </th>
          <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">
            Date Of Birth
          </th>
          <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in paginatedData"
          :key="item.userId"
          class="border-t hover:bg-gray-50"
        >
          <td class="px-4 py-2 text-sm text-gray-700">{{ item.fullName }}</td>
          <td class="px-4 py-2 text-sm text-gray-700">{{ item.roleName }}</td>
          <td class="px-4 py-2 text-sm text-gray-700">{{ item.mobile }}</td>
          <td class="px-4 py-2 text-sm text-gray-700">{{ item.email }}</td>
          <td class="px-4 py-2 text-sm text-gray-700">
            {{ item.dateOfBirth }}
          </td>
          <td class="flex space-x-1 px-4 py-2">
            <span class="cursor-pointer" @click.stop="openEdit(item)"
              ><Icon icon-name="mdiPencil" size="18" color="#3a484a"
            /></span>
            <span class="cursor-pointer" @click.stop="openDelete(item)"
              ><Icon icon-name="mdiDelete" size="18" color="#3a484a"
            /></span>
          </td>
        </tr>
        <tr v-if="paginatedData.length === 0">
          <td colspan="3" class="px-4 py-2 text-center text-sm text-gray-500">
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
    <UserAddEdit
      v-if="showAddEdit"
      :show="showAddEdit"
      :obj="objUser"
      @close="closeAddEdit"
      @reload="handleReload"
    />
    <UserDelete
      v-if="showDelete"
      :show="showDelete"
      :id="userId"
      @close="closeDelete"
      @reload="handleReload"
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
  title: `User | ${settings.value?.siteTitle}`,
});
const totalItems = ref([]);
const itemsPerPage = ref(5);
const currentPage = ref(1);
const showDelete = ref(false);
const showAddEdit = ref(false);
const userId = ref(0);
const objUser = ref({});

const openAdd = () => {
  objUser.value = {};
  showAddEdit.value = !showAddEdit.value;
};

const openEdit = (item) => {
  objUser.value = item;
  showAddEdit.value = !showAddEdit.value;
};

const closeAddEdit = (confirmed) => {
  showAddEdit.value = confirmed;
};

const handleReload = (isReload) => {
  if (isReload) {
    fetchUsers();
  }
};

const openDelete = (item) => {
  showDelete.value = !showDelete.value;
  userId.value = item.userId;
};

const closeDelete = (confirmed) => {
  showDelete.value = confirmed;
};

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

//fetch all user
const fetchUsers = async () => {
  try {
    const response = await $fetch.raw(
      config.public.apiUrl + `/api/Users/GetUserList`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userInfo?.value.token}`,
        },
      },
    );
    if (response.status == 200) {
      totalItems.value = response._data.data;
    }
  } catch (error) {
    console.error(error);
    useSiteError(error?.response);
  }
};

onMounted(() => fetchUsers());
</script>
