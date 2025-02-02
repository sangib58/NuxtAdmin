<template>
  <Pie v-if="loaded" :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { Pie } from "vue-chartjs";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);
const loaded = ref(false);
const config = useRuntimeConfig();
const chartData = ref(null);
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
});

onMounted(async () => {
  try {
    const response = await $fetch.raw(
      config.public.apiUrl + `/api/Users/GetRoleWiseUser`,
    );
    if (response.status == 200) {
      //console.log(response._data);
      chartData.value = {
        labels: response._data.map((x) => x.roleName),
        datasets: [
          {
            label: "Login(Year Wise)",
            backgroundColor: "#212121",
            data: response._data.map((x) => x.count),
          },
        ],
      };
      loaded.value = true;
    }
  } catch (error) {
    console.log(error);
    useSiteError(error?.response);
  }
});
</script>
