<template>
  <div class="card mx-auto mt-7 max-w-sm text-center">
    <p class="my-7 text-7xl">{{ error.statusCode }}</p>
    <p class="my-7 text-5xl">Opps...</p>
    <p class="my-7 font-semibold">{{ error.message }}</p>
    <button class="btn" @click="handleErrorPage">Go Home</button>
  </div>
</template>

<script setup>
const props = defineProps(["error"]);
//console.log(props);
const handleErrorPage = () => clearError({ redirect: "/" });
</script>
