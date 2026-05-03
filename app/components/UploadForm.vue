<template>
  <div class="space-y-6">
    <div class="mb-2 animate-slide-up">
      <h2 class="text-2xl font-black text-white" style="text-shadow: 2px 2px 0px #b45309;">
        📂 Upload Dokumen
      </h2>
      <p class="mt-1 text-sm text-slate-300 font-medium">Pilih jenis dokumen dan upload file untuk memulai proses formatting otomatis</p>
    </div>

    <!-- ── Document Type Selector ─────────────────────────── -->
    <div class="animate-slide-up" style="animation-delay: 40ms;">
      <p class="mb-3 text-xs font-black uppercase tracking-widest text-slate-400">Jenis Dokumen</p>
      <div class="grid grid-cols-2 gap-3">
        <button
          @click="documentType = 'skripsi'"
          class="type-btn group relative rounded-xl border-4 p-4 text-left transition-all duration-200"
          :class="documentType === 'skripsi'
            ? 'border-yellow-400 bg-yellow-400/10 shadow-[5px_5px_0px_#b45309]'
            : 'border-white/15 bg-white/3 hover:border-yellow-400/50 shadow-[3px_3px_0px_rgba(255,255,255,0.05)]'"
        >
          <div class="flex items-center gap-3">
            <span class="text-3xl">🎓</span>
            <div>
              <p class="font-black text-base" :class="documentType === 'skripsi' ? 'text-yellow-400' : 'text-white'">Skripsi</p>
              <p class="text-xs text-slate-400 font-medium">Tugas akhir, tesis, disertasi</p>
            </div>
          </div>
          <div
            v-if="documentType === 'skripsi'"
            class="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-yellow-400 bg-yellow-400 text-black text-xs font-black animate-pop-in"
          >✓</div>
        </button>

        <button
          @click="documentType = 'jurnal'"
          class="type-btn group relative rounded-xl border-4 p-4 text-left transition-all duration-200"
          :class="documentType === 'jurnal'
            ? 'border-cyan-400 bg-cyan-400/10 shadow-[5px_5px_0px_#0e7490]'
            : 'border-white/15 bg-white/3 hover:border-cyan-400/50 shadow-[3px_3px_0px_rgba(255,255,255,0.05)]'"
        >
          <div class="flex items-center gap-3">
            <span class="text-3xl">📰</span>
            <div>
              <p class="font-black text-base" :class="documentType === 'jurnal' ? 'text-cyan-400' : 'text-white'">Jurnal</p>
              <p class="text-xs text-slate-400 font-medium">Paper ilmiah, artikel jurnal</p>
            </div>
          </div>
          <div
            v-if="documentType === 'jurnal'"
            class="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-cyan-400 bg-cyan-400 text-black text-xs font-black animate-pop-in"
          >✓</div>
        </button>
      </div>
    </div>

    <!-- ── File Upload Cards ──────────────────────────────── -->
    <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
      <!-- Upload Panduan / Template -->
      <div
        class="upload-card upload-card-yellow relative rounded-2xl border-4 p-6 cursor-pointer animate-pop-in"
        :class="files.guideline
          ? 'border-yellow-400 bg-yellow-400/8'
          : dragOver.guideline
            ? 'border-yellow-400 bg-yellow-400/12 scale-105'
            : 'border-white/20 bg-white/3 hover:border-yellow-400'"
        style="animation-delay: 80ms;"
        @click="triggerGuidelineInput"
        @dragover.prevent="dragOver.guideline = true"
        @dragleave="dragOver.guideline = false"
        @drop.prevent="handleGuidanceDrop"
      >
        <input ref="guidelineInput" type="file" accept=".pdf" class="hidden" @change="handleGuidelineChange" />

        <div class="mb-4 flex items-center justify-between">
          <span class="rounded-full border-2 border-yellow-400 bg-yellow-400/15 px-2.5 py-0.5 text-xs font-black text-yellow-400">
            Step 1
          </span>
          <span class="text-xs font-bold text-slate-400">PDF · max 10MB</span>
        </div>

        <div v-if="!files.guideline" class="flex flex-col items-center text-center py-4">
          <div class="mb-3 text-4xl" :class="dragOver.guideline ? 'animate-bounce' : ''">📄</div>
          <p class="font-black text-white text-base">{{ guidelineLabel }}</p>
          <p class="mt-1 text-xs text-slate-400 font-medium">{{ guidelineHint }}</p>
        </div>

        <div v-else class="flex items-center gap-3">
          <div class="text-3xl shrink-0 animate-pop-in">📄</div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-black text-yellow-400">{{ files.guideline.name }}</p>
            <p class="text-xs text-slate-400 font-medium">{{ formatSize(files.guideline.size) }}</p>
          </div>
          <Transition name="check">
            <div
              v-if="files.guideline"
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-green-400 bg-green-400/15 text-green-400 font-black text-sm"
            >
              ✓
            </div>
          </Transition>
        </div>
      </div>

      <!-- Upload Dokumen -->
      <div
        class="upload-card upload-card-pink relative rounded-2xl border-4 p-6 cursor-pointer animate-pop-in"
        :class="files.thesis
          ? 'border-pink-400 bg-pink-400/8'
          : dragOver.thesis
            ? 'border-pink-400 bg-pink-400/12 scale-105'
            : 'border-white/20 bg-white/3 hover:border-pink-400'"
        style="animation-delay: 180ms;"
        @click="triggerThesisInput"
        @dragover.prevent="dragOver.thesis = true"
        @dragleave="dragOver.thesis = false"
        @drop.prevent="handleThesisDrop"
      >
        <input ref="thesisInput" type="file" accept=".docx" class="hidden" @change="handleThesisChange" />

        <div class="mb-4 flex items-center justify-between">
          <span class="rounded-full border-2 border-pink-400 bg-pink-400/15 px-2.5 py-0.5 text-xs font-black text-pink-400">
            Step 2
          </span>
          <span class="text-xs font-bold text-slate-400">DOCX · max 20MB</span>
        </div>

        <div v-if="!files.thesis" class="flex flex-col items-center text-center py-4">
          <div class="mb-3 text-4xl" :class="dragOver.thesis ? 'animate-bounce' : ''">📝</div>
          <p class="font-black text-white text-base">{{ documentLabel }}</p>
          <p class="mt-1 text-xs text-slate-400 font-medium">{{ documentHint }}</p>
        </div>

        <div v-else class="flex items-center gap-3">
          <div class="text-3xl shrink-0 animate-pop-in">📝</div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-black text-pink-400">{{ files.thesis.name }}</p>
            <p class="text-xs text-slate-400 font-medium">{{ formatSize(files.thesis.size) }}</p>
          </div>
          <Transition name="check">
            <div
              v-if="files.thesis"
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-green-400 bg-green-400/15 text-green-400 font-black text-sm"
            >
              ✓
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <!-- Error -->
    <Transition name="error">
      <div
        v-if="error"
        class="flex items-center gap-2 rounded-xl border-2 border-red-400 bg-red-500/10 px-4 py-3"
        style="box-shadow: 4px 4px 0px #7f1d1d;"
      >
        <span class="text-lg shrink-0">⚠️</span>
        <p class="text-sm font-bold text-red-400">{{ error }}</p>
      </div>
    </Transition>

    <!-- Actions -->
    <div class="flex gap-3 pt-2 animate-slide-up" style="animation-delay: 280ms;">
      <button
        @click="handleSubmit"
        :disabled="!isFormValid"
        class="btn-submit flex flex-1 items-center justify-center gap-2 rounded-xl border-4 border-yellow-400 bg-yellow-400 px-6 py-3.5 font-black text-black text-base transition-all duration-200 hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-40 disabled:translate-y-0"
        :class="{ 'btn-glow': isFormValid }"
      >
        ⚡ Proses Sekarang
      </button>

      <Transition name="reset-btn">
        <button
          v-if="files.guideline || files.thesis"
          @click="handleReset"
          class="reset-btn rounded-xl border-4 border-white/20 bg-white/5 px-5 py-3.5 text-sm font-black text-slate-300 transition-all duration-200 hover:border-red-400/60 hover:text-red-400 hover:-translate-y-1"
        >
          Reset
        </button>
      </Transition>
    </div>

    <!-- Hint -->
    <Transition name="hint">
      <p v-if="!isFormValid" class="text-center text-xs font-bold text-slate-500 animate-slide-up" style="animation-delay: 350ms;">
        Upload kedua file untuk mengaktifkan tombol proses 👆
      </p>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { DocumentType } from "~/utils/types";

const emit = defineEmits<{
  submit: [payload: { guideline: File; thesis: File; documentType: DocumentType }];
}>();

const guidelineInput = ref<HTMLInputElement | null>(null);
const thesisInput = ref<HTMLInputElement | null>(null);

const documentType = ref<DocumentType>("skripsi");
const files = ref({ guideline: null as File | null, thesis: null as File | null });
const error = ref("");
const dragOver = ref({ guideline: false, thesis: false });

const isFormValid = computed(() => files.value.guideline && files.value.thesis);

// Dynamic labels based on document type
const guidelineLabel = computed(() =>
  documentType.value === "jurnal" ? "Template / Panduan Jurnal" : "Panduan Skripsi",
);
const guidelineHint = computed(() =>
  documentType.value === "jurnal"
    ? "Klik atau seret file PDF template/panduan jurnal"
    : "Klik atau seret file PDF panduan kampus",
);
const documentLabel = computed(() =>
  documentType.value === "jurnal" ? "Naskah Jurnal" : "Dokumen Skripsi",
);
const documentHint = computed(() =>
  documentType.value === "jurnal"
    ? "Klik atau seret file DOCX naskah jurnal Anda"
    : "Klik atau seret file DOCX skripsi Anda",
);

const formatSize = (bytes: number) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

const triggerGuidelineInput = () => guidelineInput.value?.click();
const triggerThesisInput = () => thesisInput.value?.click();

const handleGuidelineChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  if (file.size > 10 * 1024 * 1024) { error.value = "File panduan terlalu besar (max 10MB)"; return; }
  files.value.guideline = file;
  error.value = "";
};

const handleThesisChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  if (file.size > 20 * 1024 * 1024) { error.value = "File dokumen terlalu besar (max 20MB)"; return; }
  files.value.thesis = file;
  error.value = "";
};

const handleGuidanceDrop = (e: DragEvent) => {
  dragOver.value.guideline = false;
  const file = e.dataTransfer?.files?.[0];
  if (!file || !file.name.endsWith(".pdf")) { error.value = "Hanya file PDF yang diterima untuk panduan"; return; }
  if (file.size > 10 * 1024 * 1024) { error.value = "File panduan terlalu besar (max 10MB)"; return; }
  files.value.guideline = file;
  error.value = "";
};

const handleThesisDrop = (e: DragEvent) => {
  dragOver.value.thesis = false;
  const file = e.dataTransfer?.files?.[0];
  if (!file || !file.name.endsWith(".docx")) { error.value = "Hanya file DOCX yang diterima untuk dokumen"; return; }
  if (file.size > 20 * 1024 * 1024) { error.value = "File dokumen terlalu besar (max 20MB)"; return; }
  files.value.thesis = file;
  error.value = "";
};

const handleSubmit = () => {
  if (!isFormValid.value) return;
  emit("submit", {
    guideline: files.value.guideline!,
    thesis: files.value.thesis!,
    documentType: documentType.value,
  });
};

const handleReset = () => {
  files.value.guideline = null;
  files.value.thesis = null;
  error.value = "";
};
</script>

<style scoped>
/* ── Type selector hover ────────────────────────────────── */
.type-btn {
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
}
.type-btn:hover {
  transform: translateY(-3px);
}

/* ── Upload card hover physics ───────────────────────── */
.upload-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
}
.upload-card-yellow {
  box-shadow: 5px 5px 0px rgba(180, 83, 9, 0.5);
}
.upload-card-yellow:hover {
  transform: translateY(-5px);
  box-shadow: 8px 9px 0px #b45309;
}
.upload-card-pink {
  box-shadow: 5px 5px 0px rgba(157, 23, 77, 0.5);
}
.upload-card-pink:hover {
  transform: translateY(-5px);
  box-shadow: 8px 9px 0px #9d174d;
}

/* ── Submit button glow when active ──────────────────── */
.btn-submit {
  box-shadow: 5px 5px 0px #b45309;
}
.btn-glow {
  animation: glowPulse 2s ease-in-out infinite;
}
@keyframes glowPulse {
  0%, 100% { box-shadow: 5px 5px 0px #b45309; }
  50%       { box-shadow: 5px 5px 0px #b45309, 0 0 28px rgba(250, 204, 21, 0.55); }
}

/* ── Reset button ────────────────────────────────────── */
.reset-btn {
  box-shadow: 4px 4px 0px rgba(255, 255, 255, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.reset-btn:hover {
  box-shadow: 5px 5px 0px rgba(248, 113, 113, 0.3);
}

/* ── Check bounce-in ─────────────────────────────────── */
.check-enter-active {
  animation: checkIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
.check-leave-active {
  animation: checkOut 0.2s ease both;
}
@keyframes checkIn {
  0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
  60%  { transform: scale(1.35) rotate(5deg); opacity: 1; }
  80%  { transform: scale(0.85) rotate(-2deg); }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}
@keyframes checkOut {
  to { transform: scale(0); opacity: 0; }
}

/* ── Error shake ─────────────────────────────────────── */
.error-enter-active {
  animation: errorShake 0.5s ease both;
}
.error-leave-active {
  animation: errorFade 0.2s ease both;
}
@keyframes errorShake {
  0%       { transform: translateX(-10px); opacity: 0; }
  20%      { opacity: 1; }
  30%, 70% { transform: translateX(-6px); }
  50%, 90% { transform: translateX(6px); }
  100%     { transform: translateX(0); opacity: 1; }
}
@keyframes errorFade {
  to { transform: translateX(8px); opacity: 0; }
}

/* ── Reset button pop-in ─────────────────────────────── */
.reset-btn-enter-active {
  animation: popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
.reset-btn-leave-active {
  animation: popOut 0.2s ease both;
}
@keyframes popIn {
  from { transform: scale(0.5) rotate(-5deg); opacity: 0; }
  to   { transform: scale(1) rotate(0deg); opacity: 1; }
}
@keyframes popOut {
  to { transform: scale(0.5); opacity: 0; }
}

/* ── Hint fade ───────────────────────────────────────── */
.hint-enter-active { transition: opacity 0.3s ease; }
.hint-leave-active { transition: opacity 0.2s ease; }
.hint-enter-from, .hint-leave-to { opacity: 0; }
</style>
