// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
    },
  },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
  plugins: [
    "~/plugins/icon.js",
    "~/plugins/toastification.client.js",
    "~/plugins/validation.js",
  ],
  routeRules: {
    "/": { prerender: true },
    "/user/**": { ssr: false },
    "/dashboard": { ssr: false },
  },
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL,
    },
    apiSecret: "",
  },
  tailwindcss: {
    cssPath: "~/assets/css/tailwind.css",
    configPath: "tailwind.config",
    exposeConfig: true,
    config: {},
    viewer: true,
  },
  router: {
    options: {
      scrollBehaviorType: "smooth",
    },
  },
});
