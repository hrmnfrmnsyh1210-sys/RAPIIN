<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();

useHead({
  titleTemplate: "%s | RAPIIN",
  meta: [
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    {
      name: "description",
      content:
        "Sistem otomasi format dokumen skripsi & jurnal berbasis AI. Upload panduan/template dan dokumen, AI akan membaca aturan dan format otomatis.",
    },
    { name: "theme-color", content: "#3B82F6" },
  ],
  script: [
    {
      src: "https://app.sandbox.midtrans.com/snap/snap.js",
      "data-client-key": config.public.midtransClientKey,
      defer: true,
    },
  ],
});
</script>
