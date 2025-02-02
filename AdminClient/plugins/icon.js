import Icon from "~/components/helper/Icon.vue";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("Icon", Icon);
});
