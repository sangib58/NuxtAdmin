export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:error", (err) => {
    //console.log("app:error", err);
    //console.log("app:error", err?.response);
  });
});
