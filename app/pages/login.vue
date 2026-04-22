<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-950 px-4">
    <!-- Background glow -->
    <div class="pointer-events-none fixed inset-0 z-0">
      <div class="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl"></div>
      <div class="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-violet-600/15 blur-3xl"></div>
    </div>

    <div class="relative z-10 w-full max-w-md">
      <!-- Card -->
      <div class="rounded-2xl border border-white/5 bg-white/3 p-8 backdrop-blur-sm shadow-2xl shadow-black/30">
        <!-- Logo -->
        <div class="mb-8 text-center">
          <div class="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-3xl font-black text-white shadow-lg shadow-indigo-500/30">
            R
          </div>
          <h1 class="text-2xl font-bold text-white">Masuk ke RAPIIN</h1>
          <p class="mt-2 text-sm text-slate-400">
            Rapikan skripsi otomatis dengan AI
          </p>
        </div>

        <!-- Google Login Button -->
        <button
          @click="signInWithGoogle"
          :disabled="loading"
          class="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white px-6 py-3.5 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg v-if="!loading" class="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <svg v-else class="h-5 w-5 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <span>{{ loading ? 'Menghubungkan...' : 'Lanjutkan dengan Google' }}</span>
        </button>

        <!-- Error -->
        <div v-if="error" class="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3">
          <p class="text-sm text-red-400">{{ error }}</p>
        </div>

        <!-- Divider -->
        <div class="my-6 flex items-center gap-3">
          <div class="h-px flex-1 bg-white/5"></div>
          <span class="text-xs text-slate-600">aman & terenkripsi</span>
          <div class="h-px flex-1 bg-white/5"></div>
        </div>

        <!-- Info -->
        <div class="space-y-2 text-center">
          <p class="text-xs text-slate-500">
            Setiap pemrosesan dokumen dikenakan biaya
            <span class="font-semibold text-indigo-400">Rp 10.000</span>
          </p>
          <p class="text-xs text-slate-600">
            Dengan masuk, kamu menyetujui syarat & ketentuan penggunaan RAPIIN
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false });

const supabase = useSupabaseClient();
const loading = ref(false);
const error = ref("");

const signInWithGoogle = async () => {
  loading.value = true;
  error.value = "";
  try {
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/confirm`,
      },
    });
    if (authError) throw authError;
  } catch (err) {
    error.value = "Gagal login dengan Google. Coba lagi.";
    loading.value = false;
  }
};
</script>
