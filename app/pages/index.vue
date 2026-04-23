<template>
  <div class="min-h-screen bg-slate-950 text-white overflow-x-hidden">
    <!-- Background glow -->
    <div class="pointer-events-none fixed inset-0 z-0">
      <div class="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl"></div>
      <div class="absolute top-1/3 -left-20 h-72 w-72 rounded-full bg-violet-600/15 blur-3xl"></div>
      <div class="absolute top-1/2 -right-20 h-72 w-72 rounded-full bg-blue-600/15 blur-3xl"></div>
    </div>

    <!-- Navbar -->
    <nav class="relative z-10 border-b border-white/5 bg-slate-950/70 backdrop-blur-xl">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 font-black text-white shadow-lg shadow-indigo-500/30">
            R
          </div>
          <span class="text-lg font-bold tracking-tight">RAPIIN</span>
          <span class="rounded-full bg-indigo-500/15 px-2 py-0.5 text-xs font-medium text-indigo-400 ring-1 ring-indigo-500/20">v1.0</span>
        </div>

        <!-- User info -->
        <div v-if="user" class="flex items-center gap-3">
          <div class="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
            <img
              v-if="user.user_metadata?.avatar_url"
              :src="user.user_metadata.avatar_url"
              class="h-6 w-6 rounded-full"
              alt="avatar"
            />
            <span class="text-sm text-slate-300">{{ user.user_metadata?.full_name || user.email }}</span>
          </div>
          <button
            @click="signOut"
            class="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            Keluar
          </button>
        </div>
      </div>
    </nav>

    <main class="relative z-10 mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">

      <!-- Hero -->
      <div v-if="!isProcessing && !currentResult" class="mb-14 text-center">
        <div class="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-400">
          <span class="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
          Powered by AI
        </div>
        <h2 class="mb-5 text-5xl font-extrabold leading-tight tracking-tight md:text-6xl">
          Rapikan Skripsi
          <span class="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
            Otomatis
          </span>
        </h2>
        <p class="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-400">
          Upload panduan + dokumen skripsi — AI membaca aturan, memformat dokumen secara otomatis, dan menghasilkan file siap cetak.
        </p>

        <!-- Feature cards -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div class="group rounded-2xl border border-white/5 bg-white/3 p-6 backdrop-blur-sm transition hover:border-indigo-500/30 hover:bg-white/5">
            <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/15 text-2xl mx-auto group-hover:bg-indigo-500/25 transition">🤖</div>
            <h3 class="mb-1 font-semibold text-white">AI-Powered</h3>
            <p class="text-sm text-slate-400">Ekstrak aturan format dari panduan PDF secara otomatis</p>
          </div>
          <div class="group rounded-2xl border border-white/5 bg-white/3 p-6 backdrop-blur-sm transition hover:border-violet-500/30 hover:bg-white/5">
            <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15 text-2xl mx-auto group-hover:bg-violet-500/25 transition">⚡</div>
            <h3 class="mb-1 font-semibold text-white">Instan</h3>
            <p class="text-sm text-slate-400">Proses dalam hitungan detik, hasil langsung dapat diunduh</p>
          </div>
          <div class="group rounded-2xl border border-white/5 bg-white/3 p-6 backdrop-blur-sm transition hover:border-purple-500/30 hover:bg-white/5">
            <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/15 text-2xl mx-auto group-hover:bg-purple-500/25 transition">✅</div>
            <h3 class="mb-1 font-semibold text-white">Akurat</h3>
            <p class="text-sm text-slate-400">Format sempurna sesuai aturan panduan kampus Anda</p>
          </div>
        </div>
      </div>

      <!-- Processing -->
      <div v-if="isProcessing" class="mb-10">
        <div class="mx-auto max-w-lg rounded-2xl border border-white/5 bg-white/3 p-8 backdrop-blur-sm text-center">
          <div class="mb-5 flex justify-center">
            <div class="relative h-16 w-16">
              <div class="absolute inset-0 rounded-full border-4 border-indigo-500/20"></div>
              <div class="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-indigo-500"></div>
            </div>
          </div>
          <p class="mb-2 text-lg font-semibold text-white">{{ processingStep }}</p>
          <p class="mb-5 text-sm text-slate-400">Mohon tunggu sebentar...</p>
          <div class="overflow-hidden rounded-full bg-slate-800 h-2">
            <div
              class="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700"
              :style="{ width: processingProgress + '%' }"
            ></div>
          </div>
          <p class="mt-2 text-right text-xs text-slate-500">{{ processingProgress }}%</p>
        </div>
      </div>

      <!-- Main Card -->
      <div v-if="!isProcessing" class="rounded-2xl border border-white/5 bg-white/3 p-6 backdrop-blur-sm md:p-8 shadow-2xl shadow-black/20">
        <ClientOnly>
          <UploadForm v-if="!currentResult" @submit="handleFormSubmit" />
          <ResultPreview
            v-else
            :rules="currentResult.rules"
            :thesis-text="currentResult.thesisText"
            :document-base64="currentResult.documentBase64"
          />
          <template #fallback>
            <div class="flex items-center justify-center py-16">
              <div class="text-center">
                <div class="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-indigo-500 mx-auto"></div>
                <p class="text-slate-400">Memuat...</p>
              </div>
            </div>
          </template>
        </ClientOnly>
      </div>

      <!-- Back Button -->
      <div v-if="currentResult && !isProcessing" class="mt-6 flex justify-center">
        <button
          @click="handleReset"
          class="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Proses Dokumen Baru
        </button>
      </div>

      <!-- Error -->
      <div v-if="error" class="mt-6">
        <div class="mx-auto max-w-lg rounded-xl border border-red-500/20 bg-red-500/10 p-5">
          <div class="flex items-start gap-3">
            <div class="mt-0.5 text-red-400 shrink-0">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="flex-1">
              <p class="font-semibold text-red-300">Terjadi Kesalahan</p>
              <p class="mt-1 text-sm text-red-400">{{ error }}</p>
            </div>
            <button @click="error = ''" class="text-red-400 hover:text-red-300 shrink-0">
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="relative z-10 mt-20 border-t border-white/5 py-8">
      <div class="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        <p class="text-sm text-slate-500">Dibuat untuk mahasiswa Indonesia &mdash; RAPIIN v1.0</p>
        <p class="mt-1 text-xs text-slate-600">Rancang Bangun Sistem Otomatisasi Format Dokumen Skripsi &copy; 2026</p>
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

// Step 1: user submit form → ambil session segar, tampilkan payment modal
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

// Step 2: pembayaran berhasil → mulai proses dokumen
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
    if (!rulesResponse.ok) {
      const e = await rulesResponse.json();
      throw new Error(e.error || "Gagal ekstrak rules");
    }
    const { rules } = await rulesResponse.json();

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
    if (!formatResponse.ok) {
      const e = await formatResponse.json();
      throw new Error(e.error || "Gagal format dokumen");
    }
    const { document: documentBase64 } = await formatResponse.json();

    // Simpan job ke database
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

const readFile = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve((e.target?.result as string) || file.name);
    reader.onerror = reject;
    reader.readAsText(file);
  });
</script>
