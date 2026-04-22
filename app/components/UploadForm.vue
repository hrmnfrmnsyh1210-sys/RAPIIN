<template>
  <div class="space-y-6">
    <div class="mb-2">
      <h2 class="text-xl font-bold text-white">Upload Dokumen</h2>
      <p class="mt-1 text-sm text-slate-400">Upload dua file berikut untuk memulai proses formatting otomatis</p>
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <!-- Upload Panduan -->
      <div
        class="group relative rounded-xl border-2 border-dashed p-6 transition-all cursor-pointer"
        :class="files.guideline
          ? 'border-indigo-500/50 bg-indigo-500/5'
          : 'border-white/10 bg-white/3 hover:border-indigo-500/40 hover:bg-indigo-500/5'"
        @click="triggerGuidelineInput"
        @dragover.prevent="dragOver.guideline = true"
        @dragleave="dragOver.guideline = false"
        @drop.prevent="handleGuidanceDrop"
        :data-drag="dragOver.guideline"
      >
        <input
          ref="guidelineInput"
          type="file"
          accept=".pdf"
          class="hidden"
          @change="handleGuidelineChange"
        />

        <!-- Step badge -->
        <div class="mb-4 flex items-center justify-between">
          <span class="rounded-full bg-indigo-500/15 px-2.5 py-0.5 text-xs font-semibold text-indigo-400 ring-1 ring-indigo-500/25">
            Step 1
          </span>
          <span class="text-xs text-slate-500">PDF · max 10MB</span>
        </div>

        <div v-if="!files.guideline" class="flex flex-col items-center text-center py-4">
          <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 transition group-hover:bg-indigo-500/20">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p class="font-semibold text-white text-sm">Panduan Skripsi</p>
          <p class="mt-1 text-xs text-slate-400">Klik atau seret file PDF panduan kampus</p>
        </div>

        <div v-else class="flex items-center gap-3">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-white">{{ files.guideline.name }}</p>
            <p class="text-xs text-slate-400">{{ formatSize(files.guideline.size) }}</p>
          </div>
          <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500/15 text-green-400">
            <svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Upload Skripsi -->
      <div
        class="group relative rounded-xl border-2 border-dashed p-6 transition-all cursor-pointer"
        :class="files.thesis
          ? 'border-violet-500/50 bg-violet-500/5'
          : 'border-white/10 bg-white/3 hover:border-violet-500/40 hover:bg-violet-500/5'"
        @click="triggerThesisInput"
        @dragover.prevent="dragOver.thesis = true"
        @dragleave="dragOver.thesis = false"
        @drop.prevent="handleThesisDrop"
      >
        <input
          ref="thesisInput"
          type="file"
          accept=".docx"
          class="hidden"
          @change="handleThesisChange"
        />

        <div class="mb-4 flex items-center justify-between">
          <span class="rounded-full bg-violet-500/15 px-2.5 py-0.5 text-xs font-semibold text-violet-400 ring-1 ring-violet-500/25">
            Step 2
          </span>
          <span class="text-xs text-slate-500">DOCX · max 20MB</span>
        </div>

        <div v-if="!files.thesis" class="flex flex-col items-center text-center py-4">
          <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 transition group-hover:bg-violet-500/20">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <p class="font-semibold text-white text-sm">Dokumen Skripsi</p>
          <p class="mt-1 text-xs text-slate-400">Klik atau seret file DOCX skripsi Anda</p>
        </div>

        <div v-else class="flex items-center gap-3">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-violet-400">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-white">{{ files.thesis.name }}</p>
            <p class="text-xs text-slate-400">{{ formatSize(files.thesis.size) }}</p>
          </div>
          <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500/15 text-green-400">
            <svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-if="error" class="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3">
      <svg class="h-4 w-4 shrink-0 text-red-400" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
      <p class="text-sm text-red-400">{{ error }}</p>
    </div>

    <!-- Actions -->
    <div class="flex gap-3 pt-2">
      <button
        @click="handleSubmit"
        :disabled="!isFormValid"
        class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Proses Sekarang
      </button>

      <button
        v-if="files.guideline || files.thesis"
        @click="handleReset"
        class="rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
      >
        Reset
      </button>
    </div>

    <!-- Hint -->
    <p v-if="!isFormValid" class="text-center text-xs text-slate-500">
      Upload kedua file untuk mengaktifkan tombol proses
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const emit = defineEmits<{
  submit: [files: { guideline: File; thesis: File }];
}>();

const guidelineInput = ref<HTMLInputElement | null>(null);
const thesisInput = ref<HTMLInputElement | null>(null);

const files = ref({ guideline: null as File | null, thesis: null as File | null });
const error = ref("");
const dragOver = ref({ guideline: false, thesis: false });

const isFormValid = computed(() => files.value.guideline && files.value.thesis);

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
  if (file.size > 20 * 1024 * 1024) { error.value = "File skripsi terlalu besar (max 20MB)"; return; }
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
  if (!file || !file.name.endsWith(".docx")) { error.value = "Hanya file DOCX yang diterima untuk skripsi"; return; }
  if (file.size > 20 * 1024 * 1024) { error.value = "File skripsi terlalu besar (max 20MB)"; return; }
  files.value.thesis = file;
  error.value = "";
};

const handleSubmit = () => {
  if (!isFormValid.value) return;
  emit("submit", files.value as { guideline: File; thesis: File });
};

const handleReset = () => {
  files.value.guideline = null;
  files.value.thesis = null;
  error.value = "";
};
</script>
