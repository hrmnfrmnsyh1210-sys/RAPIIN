// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  // Modules
  modules: ["@nuxtjs/tailwindcss"],

  // TailwindCSS configuration
  tailwindcss: {
    configPath: "tailwind.config.ts",
  },

  // Server configuration
  nitro: {
    prerender: {
      crawlLinks: false,
    },
  },

  // Runtime configuration
  runtimeConfig: {
    openaiApiKey: process.env.OPENAI_API_KEY || "",
    public: {
      appName: "RAPIIN",
      appVersion: "1.0.0",
      openaiApiKey: process.env.NUXT_PUBLIC_OPENAI_API_KEY || "",
    },
  },
});
