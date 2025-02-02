export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path !== "/" && to.path !== "/signIn") {
    const userInfo = useCookie("userInfo");
    if (userInfo?.value == undefined) {
      return navigateTo({ path: "/" });
    }
  }
});
