// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/supabase"],

  supabase: {
    url: process.env.NUXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
    key: process.env.NUXT_PUBLIC_SUPABASE_KEY || process.env.SUPABASE_KEY,
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      exclude: ["/login"],
    },
  },

  tailwindcss: {
    configPath: "tailwind.config.ts",
  },

  nitro: {
    prerender: {
      crawlLinks: false,
    },
  },

  runtimeConfig: {
    openaiApiKey: process.env.OPENAI_API_KEY || "",
    supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "",
    supabaseServiceKey: process.env.NUXT_SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_KEY || "",
    midtransServerKey: process.env.MIDTRANS_SERVER_KEY || "",
    public: {
      appName: "RAPIIN",
      appVersion: "1.0.0",
      openaiApiKey: process.env.NUXT_PUBLIC_OPENAI_API_KEY || "",
      midtransClientKey: process.env.NUXT_PUBLIC_MIDTRANS_CLIENT_KEY || "",
    },
  },
});
