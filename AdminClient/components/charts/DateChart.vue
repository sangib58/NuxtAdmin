<template>
  <Line v-if="loaded" :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);
const loaded = ref(false);
const userInfo = useCookie("userInfo");
const config = useRuntimeConfig();
const chartData = ref(null);
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: true,
});

onMounted(async () => {
  try {
    const response = await $fetch.raw(
      config.public.apiUrl +
        `/api/Users/GetLogInSummaryByDate/${userInfo?.value.obj.userId}`,
    );
    if (response.status == 200) {
      //console.log(response._data);
      chartData.value = {
        labels: response._data.map((x) => x.date.substr(0, 10)),
        datasets: [
          {
            label: "Login(Date Wise)",
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
