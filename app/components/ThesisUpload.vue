<template>
  <div class="space-y-6">
    <div class="animate-slide-up">
      <h2 class="text-2xl font-black text-white" style="text-shadow: 2px 2px 0px #b45309;">
        📝 Upload Dokumen Skripsi
      </h2>
      <p class="mt-1 text-sm text-slate-300 font-medium">
        Upload naskah skripsi (.docx) Anda. Dokumen akan diformat sesuai aturan
        yang sudah dikonfirmasi — Anda bisa lihat preview-nya gratis dulu.
      </p>
    </div>

    <div
      class="upload-card relative rounded-2xl border-4 p-6 cursor-pointer"
      :class="file
        ? 'border-pink-400 bg-pink-400/8'
        : dragOver
          ? 'border-pink-400 bg-pink-400/12 scale-105'
          : 'border-white/20 bg-white/3 hover:border-pink-400'"
      @click="triggerInput"
      @dragover.prevent="dragOver = true"
      @dragleave="dragOver = false"
      @drop.prevent="handleDrop"
    >
      <input ref="fileInput" type="file" accept=".docx" class="hidden" @change="handleChange" />

      <div class="mb-4 flex items-center justify-between">
        <span class="rounded-full border-2 border-pink-400 bg-pink-400/15 px-2.5 py-0.5 text-xs font-black text-pink-400">
          Naskah Skripsi
        </span>
        <span class="text-xs font-bold text-slate-400">DOCX · max 20MB</span>
      </div>

      <div v-if="!file" class="flex flex-col items-center text-center py-4">
        <div class="mb-3 text-4xl" :class="dragOver ? 'animate-bounce' : ''">📝</div>
        <p class="font-black text-white text-base">Dokumen Skripsi</p>
        <p class="mt-1 text-xs text-slate-400 font-medium">Klik atau seret file DOCX skripsi Anda</p>
      </div>

      <div v-else class="flex items-center gap-3">
        <div class="text-3xl shrink-0">📝</div>
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-black text-pink-400">{{ file.name }}</p>
          <p class="text-xs text-slate-400 font-medium">{{ formatSize(file.size) }}</p>
        </div>
        <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-green-400 bg-green-400/15 text-green-400 font-black text-sm">
          ✓
        </div>
      </div>
    </div>

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

    <div class="flex gap-3">
      <button
        @click="$emit('back')"
        class="rounded-xl border-4 border-white/20 bg-white/5 px-5 py-3.5 text-sm font-black text-slate-300 transition-all duration-200 hover:border-red-400/60 hover:text-red-400"
      >
        ← Kembali
      </button>
      <button
        @click="handleSubmit"
        :disabled="!file"
        class="btn-submit flex flex-1 items-center justify-center gap-2 rounded-xl border-4 border-yellow-400 bg-yellow-400 px-6 py-3.5 font-black text-black text-base transition-all duration-200 hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-40 disabled:translate-y-0"
      >
        👁️ Lihat Preview Hasil
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{ upload: [file: File]; back: [] }>();

const fileInput = ref<HTMLInputElement | null>(null);
const file = ref<File | null>(null);
const error = ref("");
const dragOver = ref(false);

const formatSize = (bytes: number) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

const triggerInput = () => fileInput.value?.click();

const acceptFile = (f: File | undefined | null) => {
  if (!f) return;
  if (!f.name.toLowerCase().endsWith(".docx")) {
    error.value = "Hanya file DOCX yang diterima";
    return;
  }
  if (f.size > 20 * 1024 * 1024) {
    error.value = "File dokumen terlalu besar (max 20MB)";
    return;
  }
  file.value = f;
  error.value = "";
};

const handleChange = (e: Event) => {
  acceptFile((e.target as HTMLInputElement).files?.[0]);
};

const handleDrop = (e: DragEvent) => {
  dragOver.value = false;
  acceptFile(e.dataTransfer?.files?.[0]);
};

const handleSubmit = () => {
  if (!file.value) return;
  emit("upload", file.value);
};
</script>

<style scoped>
.upload-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
  box-shadow: 5px 5px 0px rgba(157, 23, 77, 0.5);
}
.upload-card:hover {
  transform: translateY(-5px);
  box-shadow: 8px 9px 0px #9d174d;
}
.btn-submit {
  box-shadow: 5px 5px 0px #b45309;
}
.error-enter-active { transition: opacity 0.3s ease; }
.error-enter-from { opacity: 0; }
</style>
