<template>
  <div>Password Reset</div>
</template>

<script setup>
definePageMeta({
  layout: false,
});
const config = useRuntimeConfig();
const route = useRoute();

const { data, status } = await useFetch(
  config.public.apiUrl + `/api/Users/GetSingleUserByHash/${route.params.id}`,
);

console.log(data.value);
</script>
