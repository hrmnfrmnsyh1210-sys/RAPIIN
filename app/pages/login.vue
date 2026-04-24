<template>
  <div
    class="min-h-screen bg-[#0d0a2e] flex items-center justify-center px-4 py-12"
    style="background-image: radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 28px 28px;"
  >
    <!-- Background blobs -->
    <div class="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div class="blob blob-yellow" style="top:-80px; left:-80px; width:400px; height:400px;"></div>
      <div class="blob blob-pink" style="bottom:-60px; right:-60px; width:340px; height:340px;"></div>
      <div class="blob blob-cyan" style="top:50%; left:50%; transform:translate(-50%,-50%); width:250px; height:250px;"></div>
    </div>

    <!-- Decorative corner shapes -->
    <div class="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      <div class="corner-shape corner-tl"></div>
      <div class="corner-shape corner-br"></div>
    </div>

    <div class="relative z-10 w-full max-w-sm">

      <!-- Badge above card -->
      <div class="mb-5 flex justify-center animate-slide-up" style="animation-delay:0ms;">
        <div
          class="inline-flex items-center gap-2 rounded-full border-2 border-yellow-400 bg-yellow-400/10 px-4 py-1.5 text-xs font-black text-yellow-400"
          style="box-shadow: 3px 3px 0px #b45309;"
        >
          <span class="h-2 w-2 rounded-full bg-yellow-400 animate-pulse"></span>
          ✨ Format Skripsi Otomatis
        </div>
      </div>

      <!-- Main card -->
      <div class="login-card rounded-2xl border-4 border-yellow-400 bg-[#1a1040] p-8 animate-pop-in" style="animation-delay:100ms;">

        <!-- Logo -->
        <div class="mb-7 text-center">
          <div class="logo-wrap mb-4 flex justify-center">
            <div class="logo-icon-login flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-yellow-400 bg-yellow-400 font-black text-black text-5xl">
              R
            </div>
          </div>
          <h1 class="text-3xl font-black text-white" style="text-shadow: 3px 3px 0px #b45309;">RAPIIN</h1>
          <p class="mt-2 text-sm text-slate-300 font-medium">Rapikan skripsi otomatis dengan kekuatan AI</p>

          <!-- Feature pills -->
          <div class="mt-4 flex justify-center gap-2 flex-wrap">
            <span class="rounded-full border-2 border-yellow-400/50 bg-yellow-400/10 px-3 py-1 text-xs font-black text-yellow-400">🤖 AI</span>
            <span class="rounded-full border-2 border-pink-400/50 bg-pink-400/10 px-3 py-1 text-xs font-black text-pink-400">⚡ Instan</span>
            <span class="rounded-full border-2 border-cyan-400/50 bg-cyan-400/10 px-3 py-1 text-xs font-black text-cyan-400">✅ Akurat</span>
          </div>
        </div>

        <!-- Google button -->
        <button
          @click="signInWithGoogle"
          :disabled="loading"
          class="google-btn flex w-full items-center justify-center gap-3 rounded-xl border-4 border-slate-700 bg-white px-6 py-4 font-black text-gray-800 text-base transition-all duration-200 hover:-translate-y-1 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:translate-y-0"
        >
          <svg v-if="!loading" class="h-5 w-5 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <div v-else class="flex gap-1.5">
            <div class="h-2.5 w-2.5 rounded-full bg-gray-400 animate-bounce" style="animation-delay:0ms;"></div>
            <div class="h-2.5 w-2.5 rounded-full bg-gray-400 animate-bounce" style="animation-delay:150ms;"></div>
            <div class="h-2.5 w-2.5 rounded-full bg-gray-400 animate-bounce" style="animation-delay:300ms;"></div>
          </div>
          <span>{{ loading ? 'Menghubungkan...' : 'Masuk dengan Google' }}</span>
        </button>

        <!-- Error -->
        <Transition name="error">
          <div
            v-if="error"
            class="mt-4 rounded-xl border-2 border-red-400 bg-red-500/10 px-4 py-3"
            style="box-shadow: 4px 4px 0px #7f1d1d;"
          >
            <p class="text-sm font-bold text-red-400">⚠️ {{ error }}</p>
          </div>
        </Transition>

        <!-- Divider -->
        <div class="my-5 flex items-center gap-3">
          <div class="h-0.5 flex-1 rounded bg-white/10"></div>
          <span class="text-xs font-bold text-slate-500">🔒 aman & terenkripsi</span>
          <div class="h-0.5 flex-1 rounded bg-white/10"></div>
        </div>

        <!-- Price box -->
        <div class="price-box rounded-xl border-2 border-yellow-400/40 bg-yellow-400/5 p-4 text-center">
          <p class="text-xs font-bold text-slate-400 uppercase tracking-wide">Biaya per dokumen</p>
          <p class="mt-1 text-3xl font-black text-yellow-400" style="text-shadow: 2px 2px 0px #b45309;">Rp 15.000</p>
          <p class="mt-1 text-xs text-slate-500">Bayar sekali, hasil langsung bisa diunduh ✅</p>
        </div>
      </div>

      <!-- Bottom note -->
      <p class="mt-5 text-center text-xs font-medium text-slate-600 animate-slide-up" style="animation-delay:280ms;">
        Dengan masuk, kamu menyetujui syarat &amp; ketentuan penggunaan RAPIIN
      </p>
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

<style scoped>
/* ── Background ──────────────────────────────────────── */
.blob {
  position: absolute;
  border-radius: 9999px;
  filter: blur(80px);
}
.blob-yellow { background: rgba(250, 204, 21, 0.08); }
.blob-pink   { background: rgba(244, 114, 182, 0.08); }
.blob-cyan   { background: rgba(34, 211, 238, 0.08); }

/* Decorative corner zigzag shapes */
.corner-shape {
  position: absolute;
  width: 180px;
  height: 180px;
  opacity: 0.06;
}
.corner-tl {
  top: 0; left: 0;
  border-right: 4px solid #facc15;
  border-bottom: 4px solid #facc15;
  border-bottom-right-radius: 40px;
}
.corner-br {
  bottom: 0; right: 0;
  border-left: 4px solid #f472b6;
  border-top: 4px solid #f472b6;
  border-top-left-radius: 40px;
}

/* ── Card ────────────────────────────────────────────── */
.login-card {
  box-shadow: 8px 8px 0px #b45309;
}

/* ── Logo ────────────────────────────────────────────── */
.logo-icon-login {
  box-shadow: 5px 5px 0px #b45309;
  transition: transform 0.2s ease;
}
.logo-icon-login:hover {
  animation: logoWiggle 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}
@keyframes logoWiggle {
  0%, 100% { transform: rotate(0deg) scale(1); }
  20%      { transform: rotate(-9deg) scale(1.15); }
  60%      { transform: rotate(7deg) scale(1.12); }
  80%      { transform: rotate(-3deg) scale(1.05); }
}

/* ── Google button ───────────────────────────────────── */
.google-btn {
  box-shadow: 5px 5px 0px #1e293b;
}
.google-btn:not(:disabled):hover {
  box-shadow: 7px 8px 0px #1e293b;
}
.google-btn:not(:disabled):active {
  box-shadow: 2px 2px 0px #1e293b;
  transform: translateY(3px) !important;
}

/* ── Price box pulse border ──────────────────────────── */
.price-box {
  transition: border-color 0.3s ease;
}
.price-box:hover {
  border-color: rgba(250, 204, 21, 0.7);
}

/* ── Error transition ────────────────────────────────── */
.error-enter-active {
  animation: errorIn 0.45s ease both;
}
.error-leave-active {
  animation: errorOut 0.2s ease both;
}
@keyframes errorIn {
  0%       { transform: translateX(-8px); opacity: 0; }
  20%      { opacity: 1; }
  35%, 65% { transform: translateX(-5px); }
  50%, 80% { transform: translateX(5px); }
  100%     { transform: translateX(0); }
}
@keyframes errorOut {
  to { opacity: 0; transform: scale(0.95); }
}
</style>
