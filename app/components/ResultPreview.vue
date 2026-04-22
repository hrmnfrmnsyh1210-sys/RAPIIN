<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/15 text-green-400">
        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
      </div>
      <div>
        <h2 class="text-xl font-bold text-white">Hasil Pemrosesan</h2>
        <p class="text-sm text-slate-400">Dokumen telah diformat sesuai aturan yang diekstrak</p>
      </div>
    </div>

    <!-- Rules Grid -->
    <div v-if="rules" class="rounded-xl border border-white/5 bg-white/3 p-5">
      <p class="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">Aturan Format Terdeteksi</p>
      <div class="grid grid-cols-2 gap-3 md:grid-cols-3">
        <div class="rounded-lg bg-indigo-500/10 p-3 ring-1 ring-indigo-500/20">
          <p class="text-xs text-slate-400">Font</p>
          <p class="mt-0.5 font-bold text-indigo-300">{{ rules.font }}</p>
        </div>
        <div class="rounded-lg bg-violet-500/10 p-3 ring-1 ring-violet-500/20">
          <p class="text-xs text-slate-400">Ukuran</p>
          <p class="mt-0.5 font-bold text-violet-300">{{ rules.size }} pt</p>
        </div>
        <div class="rounded-lg bg-purple-500/10 p-3 ring-1 ring-purple-500/20">
          <p class="text-xs text-slate-400">Spasi Baris</p>
          <p class="mt-0.5 font-bold text-purple-300">{{ rules.spacing }}×</p>
        </div>
        <div class="rounded-lg bg-blue-500/10 p-3 ring-1 ring-blue-500/20">
          <p class="text-xs text-slate-400">Margin Atas</p>
          <p class="mt-0.5 font-bold text-blue-300">{{ rules.margin?.top }} cm</p>
        </div>
        <div class="rounded-lg bg-cyan-500/10 p-3 ring-1 ring-cyan-500/20">
          <p class="text-xs text-slate-400">Margin Kiri</p>
          <p class="mt-0.5 font-bold text-cyan-300">{{ rules.margin?.left }} cm</p>
        </div>
        <div class="rounded-lg bg-teal-500/10 p-3 ring-1 ring-teal-500/20">
          <p class="text-xs text-slate-400">Margin Kanan</p>
          <p class="mt-0.5 font-bold text-teal-300">{{ rules.margin?.right }} cm</p>
        </div>
      </div>

      <!-- BAB Rules -->
      <div v-if="rules.bab" class="mt-4 rounded-lg border border-indigo-500/15 bg-indigo-500/5 p-4">
        <p class="mb-3 text-xs font-semibold text-slate-400">Format Judul BAB</p>
        <div class="flex flex-wrap gap-2">
          <span v-if="rules.bab.bold" class="rounded-full bg-indigo-500/15 px-3 py-1 text-xs font-medium text-indigo-300 ring-1 ring-indigo-500/20">Bold</span>
          <span v-if="rules.bab.uppercase" class="rounded-full bg-indigo-500/15 px-3 py-1 text-xs font-medium text-indigo-300 ring-1 ring-indigo-500/20">Uppercase</span>
          <span class="rounded-full bg-indigo-500/15 px-3 py-1 text-xs font-medium text-indigo-300 ring-1 ring-indigo-500/20">
            {{ rules.bab.align === "center" ? "Tengah" : rules.bab.align === "right" ? "Kanan" : "Kiri" }}
          </span>
        </div>
      </div>
    </div>

    <!-- Preview -->
    <div v-if="previewContent" class="rounded-xl border border-white/5 bg-white/3 p-5">
      <p class="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">Preview Isi Dokumen</p>
      <div class="max-h-48 overflow-y-auto rounded-lg bg-slate-900/60 p-4 font-mono text-xs leading-relaxed text-slate-300 scrollbar-thin">
        <p v-for="(line, idx) in previewLines" :key="idx" class="mb-1">{{ line }}</p>
      </div>
    </div>

    <!-- Download -->
    <div class="rounded-xl border border-green-500/15 bg-green-500/5 p-5">
      <p class="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">Unduh Dokumen</p>
      <div class="flex gap-3">
        <button
          @click="downloadDocument"
          :disabled="!documentBase64"
          class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-green-500/20 transition hover:from-green-500 hover:to-emerald-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Unduh Dokumen Terformat (.docx)
        </button>
        <button
          @click="copyToClipboard"
          class="rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          Salin Rules
        </button>
      </div>
      <p v-if="downloadMessage" class="mt-3 text-center text-sm" :class="downloadMessage.includes('gagal') ? 'text-red-400' : 'text-green-400'">
        {{ downloadMessage }}
      </p>
    </div>

    <!-- Next steps -->
    <div class="rounded-xl border border-white/5 bg-white/3 p-5">
      <p class="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">Langkah Selanjutnya</p>
      <ul class="space-y-2">
        <li v-for="step in nextSteps" :key="step" class="flex items-start gap-2 text-sm text-slate-300">
          <svg class="mt-0.5 h-4 w-4 shrink-0 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          {{ step }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { FormattingRules } from "~/app/utils/types";

interface ResultPreviewProps {
  rules?: FormattingRules;
  thesisText?: string;
  documentBase64?: string;
}

const props = defineProps<ResultPreviewProps>();

const downloadMessage = ref("");

const nextSteps = [
  "Unduh dokumen yang telah diformat",
  "Buka dan periksa hasil formatting di Microsoft Word",
  "Jika perlu penyesuaian, upload ulang dengan panduan yang diperbarui",
  "Gunakan dokumen ini sebagai template untuk BAB berikutnya",
];

const previewContent = computed(() => props.thesisText?.substring(0, 500) ?? "");
const previewLines = computed(() => previewContent.value.split("\n").filter((l) => l.trim()));

const downloadDocument = () => {
  if (!props.documentBase64) return;
  try {
    const binaryString = atob(props.documentBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    const blob = new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `skripsi-terformat-${Date.now()}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    downloadMessage.value = "Download berhasil!";
  } catch {
    downloadMessage.value = "Download gagal, coba lagi";
  }
  setTimeout(() => { downloadMessage.value = ""; }, 3000);
};

const copyToClipboard = () => {
  if (!props.rules) return;
  navigator.clipboard.writeText(JSON.stringify(props.rules, null, 2)).then(() => {
    downloadMessage.value = "Rules disalin ke clipboard!";
    setTimeout(() => { downloadMessage.value = ""; }, 2000);
  });
};
</script>
