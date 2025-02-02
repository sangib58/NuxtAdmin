<template>
  <div class="px-4 py-6">
    <div class="flex justify-end">
      <button
        @click.stop="openAdd"
        class="mb-1 rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600 disabled:bg-gray-300"
      >
        Add Menu Group
      </button>
    </div>
    <table class="min-w-full border-collapse rounded-md border border-gray-200">
      <thead>
        <tr class="bg-gray-100">
          <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">
            Menu Group
          </th>
          <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in paginatedData"
          :key="item.menuGroupID"
          class="border-t hover:bg-gray-50"
        >
          <td class="px-4 py-2 text-sm text-gray-700">
            {{ item.menuGroupName }}
          </td>

          <td class="flex space-x-1 px-4 py-2">
            <span class="cursor-pointer" @click.stop="openEdit(item)"
              ><Icon icon-name="mdiPencil" size="18" color="#3a484a"
            /></span>
            <span class="cursor-pointer" @click.stop="openDelete(item)"
              ><Icon icon-name="mdiDelete" size="18" color="#3a484a"
            /></span>
            <span class="cursor-pointer" @click.stop="openMenuAssign(item)"
              ><Icon icon-name="mdiMenu" size="18" color="#3a484a"
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
    <MenuGroupAddEdit
      v-if="showAddEdit"
      :show="showAddEdit"
      :obj="objMenuGroup"
      @close="closeAddEdit"
      @reload="handleReload"
    />
    <MenuGroupDelete
      v-if="showDelete"
      :show="showDelete"
      :id="menuGroupId"
      @close="closeDelete"
      @reload="handleReload"
    />
    <MenuGroupAssignMenu
      v-if="showMenuAssign"
      :show="showMenuAssign"
      :id="menuGroupId"
      @close="closeMenuAssign"
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
  title: `Menu Group | ${settings.value?.siteTitle}`,
});
const totalItems = ref([]);
const itemsPerPage = ref(10);
const currentPage = ref(1);
const showDelete = ref(false);
const showAddEdit = ref(false);
const showMenuAssign = ref(false);
const menuGroupId = ref(0);
const objMenuGroup = ref({});

const openAdd = () => {
  objMenuGroup.value = {};
  showAddEdit.value = !showAddEdit.value;
};

const openEdit = (item) => {
  objMenuGroup.value = item;
  showAddEdit.value = !showAddEdit.value;
};

const closeAddEdit = (confirmed) => {
  showAddEdit.value = confirmed;
};

const handleReload = (isReload) => {
  if (isReload) {
    fetchMenuGroups();
  }
};

const openDelete = (item) => {
  showDelete.value = !showDelete.value;
  menuGroupId.value = item.menuGroupID;
};

const openMenuAssign = (item) => {
  menuGroupId.value = item.menuGroupID;
  showMenuAssign.value = !showMenuAssign.value;
};

const closeDelete = (confirmed) => {
  showDelete.value = confirmed;
};
const closeMenuAssign = (confirmed) => {
  showMenuAssign.value = confirmed;
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

//fetch all menu group
const fetchMenuGroups = async () => {
  try {
    const response = await $fetch.raw(
      config.public.apiUrl + `/api/Menu/GetMenuGroupList`,
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

onMounted(() => fetchMenuGroups());
</script>
