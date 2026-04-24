<template>
  <div
    class="min-h-screen bg-[#0d0a2e] text-white overflow-x-hidden"
    style="background-image: radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 28px 28px;"
  >
    <!-- Floating background blobs -->
    <div class="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div class="blob blob-yellow animate-float" style="top: -80px; left: -80px; width: 380px; height: 380px; animation-delay: 0s;"></div>
      <div class="blob blob-pink animate-float-slow" style="top: 35%; right: -60px; width: 280px; height: 280px; animation-delay: 1.5s;"></div>
      <div class="blob blob-cyan animate-float" style="bottom: 5%; left: 20%; width: 240px; height: 240px; animation-delay: 0.8s;"></div>
    </div>

    <!-- Floating decorative stars -->
    <div class="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      <span class="star animate-float" style="top:12%; left:10%; color:rgba(250,204,21,0.25); font-size:20px; animation-delay:0s;">★</span>
      <span class="star animate-float-slow" style="top:22%; right:14%; color:rgba(244,114,182,0.25); font-size:13px; animation-delay:0.7s;">✦</span>
      <span class="star animate-float" style="top:55%; left:5%; color:rgba(34,211,238,0.2); font-size:16px; animation-delay:1.2s;">◆</span>
      <span class="star animate-float-slow" style="top:70%; right:8%; color:rgba(250,204,21,0.2); font-size:22px; animation-delay:2s;">★</span>
      <span class="star animate-float" style="bottom:15%; left:38%; color:rgba(244,114,182,0.2); font-size:11px; animation-delay:0.4s;">✦</span>
      <span class="star animate-star-spin" style="top:40%; left:90%; color:rgba(34,211,238,0.2); font-size:18px;">✦</span>
    </div>

    <!-- Navbar -->
    <nav class="fixed top-0 left-0 right-0 z-50 w-full border-b-4 border-yellow-400 bg-[#0d0a2e]/90 backdrop-blur-xl">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:py-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-2 sm:gap-3">
          <div class="logo-icon flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border-4 border-yellow-400 bg-yellow-400 font-black text-black text-base sm:text-lg">
            R
          </div>
          <span class="text-lg sm:text-xl font-black tracking-tight text-white" style="text-shadow: 2px 2px 0px #b45309;">RAPIIN</span>
          <span class="hidden sm:inline-block rounded-full border-2 border-yellow-400 bg-yellow-400/15 px-2.5 py-0.5 text-xs font-black text-yellow-400 animate-float" style="animation-duration: 4s;">v1.0</span>
        </div>

        <div v-if="user" class="flex items-center gap-2 sm:gap-3">
          <div class="flex items-center gap-2 rounded-xl border-2 border-white/20 bg-white/5 px-2 sm:px-3 py-1.5 min-w-0 max-w-[120px] sm:max-w-[220px]">
            <img
              v-if="user.user_metadata?.avatar_url"
              :src="user.user_metadata.avatar_url"
              class="h-6 w-6 rounded-full border-2 border-yellow-400 shrink-0"
              alt="avatar"
            />
            <span class="text-xs sm:text-sm font-bold text-slate-200 truncate">{{ user.user_metadata?.full_name || user.email }}</span>
          </div>
          <button
            @click="signOut"
            class="rounded-xl border-2 border-white/20 bg-white/5 px-3 sm:px-4 py-1.5 text-xs font-bold text-slate-300 transition-all duration-200 hover:border-red-400 hover:text-red-400 hover:scale-105 whitespace-nowrap shrink-0"
          >
            Keluar
          </button>
        </div>
      </div>
    </nav>

    <main class="relative z-10 mx-auto max-w-6xl px-4 pt-[76px] pb-12 sm:pt-[84px] sm:pb-12 sm:px-6 lg:px-8">

      <!-- Animated section switcher: upload / processing / result -->
      <Transition name="section" mode="out-in">

        <!-- Processing state -->
        <div v-if="isProcessing" key="processing" class="mb-10">
          <div class="processing-card mx-auto max-w-lg rounded-2xl border-4 border-yellow-400 bg-[#1a1040] p-8 text-center">
            <!-- Bouncing dots loader -->
            <div class="mb-6 flex justify-center gap-3">
              <div class="h-5 w-5 rounded-full bg-yellow-400 animate-bounce" style="animation-delay: 0ms;"></div>
              <div class="h-5 w-5 rounded-full bg-pink-400 animate-bounce" style="animation-delay: 150ms;"></div>
              <div class="h-5 w-5 rounded-full bg-cyan-400 animate-bounce" style="animation-delay: 300ms;"></div>
            </div>
            <p class="mb-2 text-xl font-black text-yellow-400">{{ processingStep }}</p>
            <p class="mb-6 text-sm text-slate-300 font-medium">Mohon tunggu sebentar...</p>
            <div class="overflow-hidden rounded-full border-2 border-yellow-400 bg-slate-900 h-4">
              <div
                class="h-full rounded-full bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400 transition-all duration-700"
                :style="{ width: processingProgress + '%' }"
              ></div>
            </div>
            <p class="mt-2 text-right text-sm font-black text-yellow-400">{{ processingProgress }}%</p>
          </div>
        </div>

        <!-- Result state -->
        <div v-else-if="currentResult" key="result">
          <div class="main-card rounded-2xl border-4 border-white/20 bg-[#1a1040] p-6 md:p-8">
            <ClientOnly>
              <ResultPreview
                :rules="currentResult.rules"
                :thesis-text="currentResult.thesisText"
                :document-base64="currentResult.documentBase64"
              />
              <template #fallback>
                <div class="flex items-center justify-center py-16">
                  <div class="text-center">
                    <div class="flex justify-center gap-3 mb-4">
                      <div class="h-4 w-4 rounded-full bg-yellow-400 animate-bounce" style="animation-delay:0ms"></div>
                      <div class="h-4 w-4 rounded-full bg-pink-400 animate-bounce" style="animation-delay:150ms"></div>
                      <div class="h-4 w-4 rounded-full bg-cyan-400 animate-bounce" style="animation-delay:300ms"></div>
                    </div>
                    <p class="text-slate-300 font-bold">Memuat...</p>
                  </div>
                </div>
              </template>
            </ClientOnly>
          </div>
          <div class="mt-6 flex justify-center">
            <button
              @click="handleReset"
              class="back-btn flex items-center gap-2 rounded-xl border-4 border-white/25 bg-[#1a1040] px-6 py-3 text-sm font-black text-white"
            >
              ← Proses Dokumen Baru
            </button>
          </div>
        </div>

        <!-- Upload / hero state -->
        <div v-else key="upload">
          <!-- Hero -->
          <div class="mb-14 text-center">
            <div
              class="mb-5 inline-flex items-center gap-2 rounded-full border-2 border-yellow-400 bg-yellow-400/10 px-4 py-1.5 text-xs font-black text-yellow-400 animate-slide-up"
              style="box-shadow: 3px 3px 0px #b45309; animation-delay: 0ms;"
            >
              <span class="h-2 w-2 rounded-full bg-yellow-400 animate-pulse"></span>
              ✨ Powered by AI
            </div>

            <h2 class="mb-5 text-5xl font-black leading-tight tracking-tight md:text-6xl animate-slide-up" style="animation-delay: 80ms;">
              Rapikan Skripsi
              <br />
              <span class="text-yellow-400" style="text-shadow: 4px 4px 0px #b45309;">
                Otomatis! 🚀
              </span>
            </h2>

            <p class="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-slate-300 font-medium animate-slide-up" style="animation-delay: 160ms;">
              Upload panduan + dokumen skripsi — AI baca aturan, format otomatis, file siap cetak! 🎓
            </p>

            <!-- Feature cards with stagger pop-in -->
            <div class="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div class="card-yellow rounded-2xl border-4 border-yellow-400 bg-[#1a1040] p-6 animate-pop-in" style="animation-delay: 250ms;">
                <div class="mb-3 text-4xl">🤖</div>
                <h3 class="mb-1 font-black text-yellow-400 text-lg">AI-Powered</h3>
                <p class="text-sm text-slate-300 font-medium">Ekstrak aturan format dari panduan PDF secara otomatis</p>
              </div>
              <div class="card-pink rounded-2xl border-4 border-pink-400 bg-[#1a1040] p-6 animate-pop-in" style="animation-delay: 370ms;">
                <div class="mb-3 text-4xl">⚡</div>
                <h3 class="mb-1 font-black text-pink-400 text-lg">Super Instan</h3>
                <p class="text-sm text-slate-300 font-medium">Proses dalam hitungan detik, langsung bisa diunduh</p>
              </div>
              <div class="card-cyan rounded-2xl border-4 border-cyan-400 bg-[#1a1040] p-6 animate-pop-in" style="animation-delay: 490ms;">
                <div class="mb-3 text-4xl">✅</div>
                <h3 class="mb-1 font-black text-cyan-400 text-lg">Super Akurat</h3>
                <p class="text-sm text-slate-300 font-medium">Format sempurna sesuai aturan panduan kampus Anda</p>
              </div>
            </div>
          </div>

          <!-- Main upload card -->
          <div class="main-card rounded-2xl border-4 border-white/20 bg-[#1a1040] p-6 md:p-8 animate-slide-up" style="animation-delay: 550ms;">
            <ClientOnly>
              <UploadForm @submit="handleFormSubmit" />
              <template #fallback>
                <div class="flex items-center justify-center py-16">
                  <div class="text-center">
                    <div class="flex justify-center gap-3 mb-4">
                      <div class="h-4 w-4 rounded-full bg-yellow-400 animate-bounce" style="animation-delay:0ms"></div>
                      <div class="h-4 w-4 rounded-full bg-pink-400 animate-bounce" style="animation-delay:150ms"></div>
                      <div class="h-4 w-4 rounded-full bg-cyan-400 animate-bounce" style="animation-delay:300ms"></div>
                    </div>
                    <p class="text-slate-300 font-bold">Memuat...</p>
                  </div>
                </div>
              </template>
            </ClientOnly>
          </div>
        </div>

      </Transition>

      <!-- Error (outside transition, can show in any state) -->
      <Transition name="error">
        <div v-if="error" class="mt-6">
          <div class="error-card mx-auto max-w-lg rounded-xl border-4 border-red-400 bg-[#1a0a0a] p-5">
            <div class="flex items-start gap-3">
              <span class="text-2xl shrink-0 animate-wiggle">⚠️</span>
              <div class="flex-1">
                <p class="font-black text-red-400 text-lg">Terjadi Kesalahan!</p>
                <p class="mt-1 text-sm text-red-300 font-medium">{{ error }}</p>
              </div>
              <button @click="error = ''" class="text-red-400 hover:text-red-300 text-xl font-black shrink-0 leading-none transition hover:scale-125">✕</button>
            </div>
          </div>
        </div>
      </Transition>
    </main>

    <!-- Footer -->
    <footer class="relative z-10 mt-20 border-t-4 border-yellow-400/30 py-8">
      <div class="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        <p class="text-sm font-bold text-slate-400">Dibuat untuk mahasiswa Indonesia 🇮🇩 — RAPIIN v1.0</p>
        <p class="mt-1 text-xs text-slate-500">Rancang Bangun Sistem Otomatisasi Format Dokumen Skripsi &copy; 2026</p>
      </div>
    </footer>

    <!-- Payment Modal -->
    <PaymentModal
      v-if="showPaymentModal && pendingFiles && pendingUserId"
      :guideline-name="pendingFiles.guideline.name"
      :thesis-name="pendingFiles.thesis.name"
      :user-id="pendingUserId"
      :user-email="pendingUserEmail"
      :user-name="pendingUserName"
      @success="handlePaymentSuccess"
      @cancel="handlePaymentCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { FormattingRules } from "~/utils/types";

interface ProcessingResult {
  rules: FormattingRules;
  thesisText: string;
  documentBase64: string;
}

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const currentResult = ref<ProcessingResult | null>(null);
const isProcessing = ref(false);
const error = ref("");
const processingStep = ref("");
const processingProgress = ref(0);

const showPaymentModal = ref(false);
const pendingFiles = ref<{ guideline: File; thesis: File } | null>(null);
const pendingUserId = ref("");
const pendingUserEmail = ref("");
const pendingUserName = ref("");

const signOut = async () => {
  await supabase.auth.signOut();
  await navigateTo("/login");
};

const handleFormSubmit = async (files: { guideline: File; thesis: File }) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user?.id) {
    error.value = "Sesi login tidak valid. Silakan refresh dan login ulang.";
    return;
  }
  pendingUserId.value = session.user.id;
  pendingUserEmail.value = session.user.email ?? session.user.user_metadata?.email ?? "";
  pendingUserName.value = session.user.user_metadata?.full_name ?? session.user.email ?? "";
  pendingFiles.value = files;
  showPaymentModal.value = true;
};

const handlePaymentSuccess = async (orderId: string) => {
  showPaymentModal.value = false;
  if (!pendingFiles.value) return;
  await processDocuments(pendingFiles.value, orderId);
};

const handlePaymentCancel = () => {
  showPaymentModal.value = false;
};

const processDocuments = async (
  files: { guideline: File; thesis: File },
  orderId: string
) => {
  isProcessing.value = true;
  error.value = "";
  processingProgress.value = 0;

  try {
    processingStep.value = "📖 Membaca panduan...";
    processingProgress.value = 20;
    await new Promise((r) => setTimeout(r, 500));
    const guidelineText = await readFile(files.guideline);

    processingStep.value = "🤖 Ekstrak aturan dari panduan...";
    processingProgress.value = 40;
    await new Promise((r) => setTimeout(r, 500));

    const rulesResponse = await fetch("/api/extractRules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guidelineText: guidelineText.slice(0, 4000) }),
    });
    const rulesData = await rulesResponse.json();
    if (!rulesResponse.ok || !rulesData.success) {
      throw new Error(rulesData.error || "Gagal ekstrak rules");
    }
    const { rules } = rulesData;

    processingStep.value = "📝 Membaca dokumen skripsi...";
    processingProgress.value = 60;
    await new Promise((r) => setTimeout(r, 500));
    const thesisText = await readFile(files.thesis);

    processingStep.value = "✨ Format dokumen...";
    processingProgress.value = 80;
    await new Promise((r) => setTimeout(r, 500));

    const formatResponse = await fetch("/api/formatDoc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ thesisText, rules }),
    });
    const formatData = await formatResponse.json();
    if (!formatResponse.ok || !formatData.success || !formatData.document) {
      throw new Error(formatData.error || "Gagal format dokumen");
    }
    const documentBase64 = formatData.document as string;

    if (pendingUserId.value) {
      await $fetch("/api/payment/job", {
        method: "POST",
        body: {
          userId: pendingUserId.value,
          orderId,
          guidelineFilename: files.guideline.name,
          thesisFilename: files.thesis.name,
        },
      }).catch(() => {});
    }

    processingStep.value = "✅ Selesai!";
    processingProgress.value = 100;
    currentResult.value = { rules, thesisText, documentBase64 };
    pendingFiles.value = null;
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Proses gagal";
  } finally {
    isProcessing.value = false;
  }
};

const handleReset = () => {
  currentResult.value = null;
  error.value = "";
  processingStep.value = "";
  processingProgress.value = 0;
};

const readFile = async (file: File): Promise<string> => {
  const { parseFile } = await import("~/utils/fileParser");
  return parseFile(file);
};
</script>

<style scoped>
/* ── Background decorations ─────────────────────────── */
.blob {
  position: absolute;
  border-radius: 9999px;
  filter: blur(80px);
}
.blob-yellow { background: rgba(250, 204, 21, 0.07); }
.blob-pink   { background: rgba(244, 114, 182, 0.07); }
.blob-cyan   { background: rgba(34, 211, 238, 0.07); }

.star {
  position: absolute;
  line-height: 1;
}

/* ── Vue Section transitions ─────────────────────────── */
.section-enter-active {
  animation: sectionIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
.section-leave-active {
  animation: sectionOut 0.22s ease both;
}

@keyframes sectionIn {
  from { transform: translateY(24px) scale(0.97); opacity: 0; }
  to   { transform: translateY(0) scale(1); opacity: 1; }
}
@keyframes sectionOut {
  to { transform: translateY(-16px) scale(0.97); opacity: 0; }
}

/* ── Error transition ────────────────────────────────── */
.error-enter-active {
  animation: errorIn 0.5s ease both;
}
.error-leave-active {
  animation: errorOut 0.2s ease both;
}
@keyframes errorIn {
  0%       { transform: translateX(-8px); opacity: 0; }
  20%      { opacity: 1; }
  30%, 50%, 70%, 90% { transform: translateX(-6px); }
  40%, 60%, 80%      { transform: translateX(6px); }
  100%     { transform: translateX(0); }
}
@keyframes errorOut {
  to { transform: translateX(12px); opacity: 0; }
}

/* ── Card hover physics ──────────────────────────────── */
.card-yellow {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 6px 6px 0px #b45309;
}
.card-yellow:hover {
  transform: translateY(-7px);
  box-shadow: 10px 12px 0px #b45309;
}

.card-pink {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 6px 6px 0px #9d174d;
}
.card-pink:hover {
  transform: translateY(-7px);
  box-shadow: 10px 12px 0px #9d174d;
}

.card-cyan {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 6px 6px 0px #0e7490;
}
.card-cyan:hover {
  transform: translateY(-7px);
  box-shadow: 10px 12px 0px #0e7490;
}

/* ── Logo wiggle on hover ────────────────────────────── */
.logo-icon {
  cursor: default;
  transition: transform 0.15s ease;
}
.logo-icon:hover {
  animation: logoWiggle 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}
@keyframes logoWiggle {
  0%, 100% { transform: rotate(0deg) scale(1); }
  20%      { transform: rotate(-9deg) scale(1.15); }
  60%      { transform: rotate(7deg) scale(1.12); }
  80%      { transform: rotate(-3deg) scale(1.05); }
}

/* ── Main card ───────────────────────────────────────── */
.main-card {
  box-shadow: 8px 8px 0px rgba(255, 215, 0, 0.2);
  transition: box-shadow 0.2s ease;
}

/* ── Processing card ─────────────────────────────────── */
.processing-card {
  box-shadow: 8px 8px 0px #b45309;
}

/* ── Error card ──────────────────────────────────────── */
.error-card {
  box-shadow: 6px 6px 0px #7f1d1d;
}

/* ── Back button ─────────────────────────────────────── */
.back-btn {
  box-shadow: 4px 4px 0px rgba(255, 255, 255, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.back-btn:hover {
  transform: translateY(-3px);
  box-shadow: 6px 7px 0px rgba(255, 255, 255, 0.15);
}
</style>
