export default defineNuxtRouteMiddleware((to, from) => {
  if ((to.fullPath = "/")) {
    useCookie("userInfo").value = null;
    if (!import.meta.env.SSR) {
      localStorage.clear();
    }
  }
});
