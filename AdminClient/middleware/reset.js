export default defineNuxtRouteMiddleware((to, from) => {
  if ((to.fullPath = "/")) {
    useCookie("userInfo").value = null;
    if (process.client) {
      //console.log(process);
      localStorage.clear();
    }
  }
});
