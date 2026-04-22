<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-950">
    <div class="text-center">
      <div class="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-indigo-500 mx-auto"></div>
      <p class="text-slate-400">Memverifikasi login...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false });

const supabase = useSupabaseClient();
const route = useRoute();

onMounted(async () => {
  const code = route.query.code as string;
  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }
  await navigateTo("/");
});
</script>
