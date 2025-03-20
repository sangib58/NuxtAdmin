<template>
  <div ref="fullscreenElement">
    <NuxtLoadingIndicator :duration="5000" />
    <NuxtLayout
      :isFullScreen="fullScreenStatus"
      @toggle-screen="toggleFullScreen"
    >
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<script setup>
const fullscreenElement = ref(null);
const fullScreenStatus = ref(false);

//toggle full screen
const toggleFullScreen = async (isFullScreen) => {
  if (!isFullScreen) {
    await fullscreenElement.value.requestFullscreen();
  } else {
    await document.exitFullscreen();
  }
};

//full screen status update
const handleFullscreenChange = () => {
  fullScreenStatus.value = !!document.fullscreenElement;
};

//Mount life cycle hook
onMounted(() => {
  document.addEventListener("fullscreenchange", handleFullscreenChange);
});

//Un-Mount life cycle hook
onUnmounted(() => {
  document.removeEventListener("fullscreenchange", handleFullscreenChange);
});
</script>
