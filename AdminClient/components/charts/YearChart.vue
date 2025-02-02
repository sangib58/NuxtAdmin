<template>
  <Bar v-if="loaded" :data="chartData" :options="chartOptions" :style="style" />
</template>

<script setup>
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
);
const loaded = ref(false);
const userInfo = useCookie("userInfo");
const config = useRuntimeConfig();
const chartData = ref(null);
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: true,
});
const style = computed(() => {
  return {
    height: "400px",
    width: "600px",
    position: "relative",
  };
});

onMounted(async () => {
  try {
    const response = await $fetch.raw(
      config.public.apiUrl +
        `/api/Users/GetLogInSummaryByYear/${userInfo?.value.obj.userId}`,
    );
    if (response.status == 200) {
      //console.log(response._data);
      chartData.value = {
        labels: response._data.map((x) => x.year),
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
