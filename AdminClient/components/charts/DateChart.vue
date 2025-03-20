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
  Filler, // Import Filler for filling the area under the line
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler, // Register Filler
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
            backgroundColor: "#212121", // Set the fill color with transparency
            borderColor: "#212121", // Set the line color
            data: response._data.map((x) => x.count),
            fill: true, // Enable filling the area under the line
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
