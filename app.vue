<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
// Global app configuration
useHead({
  titleTemplate: "%s | RAPIIN",
  meta: [
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1",
    },
    {
      name: "description",
      content:
        "Sistem otomasi format dokumen skripsi berbasis AI. Upload panduan dan dokumen, AI akan membaca aturan dan format otomatis.",
    },
    {
      name: "theme-color",
      content: "#3B82F6",
    },
  ],
});
</script>
