<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <div class="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-green-400 bg-green-400/10 text-2xl">
        {{ documentType === 'jurnal' ? '📰' : '🎓' }}
      </div>
      <div>
        <h2 class="text-xl font-black text-white" style="text-shadow: 2px 2px 0px #065f46;">Hasil Pemrosesan</h2>
        <p class="text-sm text-slate-400 font-medium">
          {{ documentType === 'jurnal'
            ? 'Naskah jurnal telah diformat sesuai template'
            : 'Dokumen skripsi telah diformat sesuai aturan yang diekstrak'
          }}
        </p>
      </div>
    </div>

    <!-- Document Type Badge -->
    <div class="flex items-center gap-2">
      <span
        class="inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-xs font-black"
        :class="documentType === 'jurnal'
          ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400'
          : 'border-yellow-400 bg-yellow-400/10 text-yellow-400'"
      >
        <span class="h-2 w-2 rounded-full" :class="documentType === 'jurnal' ? 'bg-cyan-400' : 'bg-yellow-400'"></span>
        {{ documentType === 'jurnal' ? 'Format Jurnal' : 'Format Skripsi' }}
      </span>
    </div>

    <!-- ─── SKRIPSI RULES ───────────────────────────────── -->
    <div v-if="rules && documentType !== 'jurnal'" class="rounded-xl border-2 border-white/10 bg-white/3 p-5">
      <p class="mb-4 text-xs font-black uppercase tracking-widest text-slate-500">Aturan Format Terdeteksi</p>
      <div class="grid grid-cols-2 gap-3 md:grid-cols-3">
        <div class="rounded-lg border-2 border-indigo-500/20 bg-indigo-500/10 p-3">
          <p class="text-xs text-slate-400 font-medium">Font</p>
          <p class="mt-0.5 font-black text-indigo-300">{{ rules.font }}</p>
        </div>
        <div class="rounded-lg border-2 border-violet-500/20 bg-violet-500/10 p-3">
          <p class="text-xs text-slate-400 font-medium">Ukuran</p>
          <p class="mt-0.5 font-black text-violet-300">{{ rules.size }} pt</p>
        </div>
        <div class="rounded-lg border-2 border-purple-500/20 bg-purple-500/10 p-3">
          <p class="text-xs text-slate-400 font-medium">Spasi Baris</p>
          <p class="mt-0.5 font-black text-purple-300">{{ rules.spacing }}×</p>
        </div>
        <div class="rounded-lg border-2 border-blue-500/20 bg-blue-500/10 p-3">
          <p class="text-xs text-slate-400 font-medium">Margin Atas</p>
          <p class="mt-0.5 font-black text-blue-300">{{ rules.margin?.top }} cm</p>
        </div>
        <div class="rounded-lg border-2 border-cyan-500/20 bg-cyan-500/10 p-3">
          <p class="text-xs text-slate-400 font-medium">Margin Kiri</p>
          <p class="mt-0.5 font-black text-cyan-300">{{ rules.margin?.left }} cm</p>
        </div>
        <div class="rounded-lg border-2 border-teal-500/20 bg-teal-500/10 p-3">
          <p class="text-xs text-slate-400 font-medium">Margin Kanan</p>
          <p class="mt-0.5 font-black text-teal-300">{{ rules.margin?.right }} cm</p>
        </div>
      </div>

      <!-- BAB Rules -->
      <div v-if="rules.bab" class="mt-4 rounded-lg border-2 border-indigo-500/15 bg-indigo-500/5 p-4">
        <p class="mb-3 text-xs font-black text-slate-400">Format Judul BAB</p>
        <div class="flex flex-wrap gap-2">
          <span v-if="rules.bab.bold" class="rounded-full border border-indigo-500/30 bg-indigo-500/15 px-3 py-1 text-xs font-bold text-indigo-300">Bold</span>
          <span v-if="rules.bab.uppercase" class="rounded-full border border-indigo-500/30 bg-indigo-500/15 px-3 py-1 text-xs font-bold text-indigo-300">Uppercase</span>
          <span class="rounded-full border border-indigo-500/30 bg-indigo-500/15 px-3 py-1 text-xs font-bold text-indigo-300">
            {{ rules.bab.align === "center" ? "Tengah" : rules.bab.align === "right" ? "Kanan" : "Kiri" }}
          </span>
        </div>
      </div>
    </div>

    <!-- ─── JURNAL RULES ────────────────────────────────── -->
    <div v-if="rules && documentType === 'jurnal'" class="space-y-4">
      <!-- Basic Rules -->
      <div class="rounded-xl border-2 border-white/10 bg-white/3 p-5">
        <p class="mb-4 text-xs font-black uppercase tracking-widest text-slate-500">Aturan Dasar</p>
        <div class="grid grid-cols-2 gap-3 md:grid-cols-3">
          <div class="rounded-lg border-2 border-indigo-500/20 bg-indigo-500/10 p-3">
            <p class="text-xs text-slate-400 font-medium">Font</p>
            <p class="mt-0.5 font-black text-indigo-300">{{ rules.font }}</p>
          </div>
          <div class="rounded-lg border-2 border-violet-500/20 bg-violet-500/10 p-3">
            <p class="text-xs text-slate-400 font-medium">Ukuran</p>
            <p class="mt-0.5 font-black text-violet-300">{{ rules.size }} pt</p>
          </div>
          <div class="rounded-lg border-2 border-purple-500/20 bg-purple-500/10 p-3">
            <p class="text-xs text-slate-400 font-medium">Spasi Baris</p>
            <p class="mt-0.5 font-black text-purple-300">{{ rules.spacing }}×</p>
          </div>
          <div class="rounded-lg border-2 border-blue-500/20 bg-blue-500/10 p-3">
            <p class="text-xs text-slate-400 font-medium">Margin</p>
            <p class="mt-0.5 font-black text-blue-300">{{ rules.margin?.top }}/{{ rules.margin?.left }}/{{ rules.margin?.right }}/{{ rules.margin?.bottom }} cm</p>
          </div>
          <div v-if="rules.pageSize" class="rounded-lg border-2 border-cyan-500/20 bg-cyan-500/10 p-3">
            <p class="text-xs text-slate-400 font-medium">Halaman</p>
            <p class="mt-0.5 font-black text-cyan-300">{{ rules.pageSize }}</p>
          </div>
          <div v-if="rules.columns" class="rounded-lg border-2 border-teal-500/20 bg-teal-500/10 p-3">
            <p class="text-xs text-slate-400 font-medium">Kolom</p>
            <p class="mt-0.5 font-black text-teal-300">{{ rules.columns.count }} kolom</p>
          </div>
        </div>
      </div>

      <!-- Title & Author -->
      <div v-if="rules.title" class="rounded-xl border-2 border-white/10 bg-white/3 p-5">
        <p class="mb-4 text-xs font-black uppercase tracking-widest text-slate-500">Format Judul & Penulis</p>
        <div class="grid grid-cols-2 gap-3">
          <div class="rounded-lg border-2 border-amber-500/20 bg-amber-500/10 p-3">
            <p class="text-xs text-slate-400 font-medium">Judul — Font</p>
            <p class="mt-0.5 font-black text-amber-300">{{ rules.title.font || rules.font }} · {{ rules.title.size || 14 }}pt</p>
          </div>
          <div class="rounded-lg border-2 border-amber-500/20 bg-amber-500/10 p-3">
            <p class="text-xs text-slate-400 font-medium">Judul — Style</p>
            <div class="mt-0.5 flex flex-wrap gap-1">
              <span v-if="rules.title.bold" class="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">Bold</span>
              <span v-if="rules.title.uppercase" class="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">CAPS</span>
              <span class="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">{{ rules.title.align }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Abstract -->
      <div v-if="rules.abstract" class="rounded-xl border-2 border-white/10 bg-white/3 p-5">
        <p class="mb-4 text-xs font-black uppercase tracking-widest text-slate-500">Format Abstrak</p>
        <div class="grid grid-cols-2 gap-3 md:grid-cols-3">
          <div class="rounded-lg border-2 border-emerald-500/20 bg-emerald-500/10 p-3">
            <p class="text-xs text-slate-400 font-medium">Font · Ukuran</p>
            <p class="mt-0.5 font-black text-emerald-300">{{ rules.abstract.font || rules.font }} · {{ rules.abstract.size || 10 }}pt</p>
          </div>
          <div class="rounded-lg border-2 border-emerald-500/20 bg-emerald-500/10 p-3">
            <p class="text-xs text-slate-400 font-medium">Batas Kata</p>
            <p class="mt-0.5 font-black text-emerald-300">{{ rules.abstract.minWords || '—' }} – {{ rules.abstract.maxWords || '—' }}</p>
          </div>
          <div v-if="rules.abstract.languages" class="rounded-lg border-2 border-emerald-500/20 bg-emerald-500/10 p-3">
            <p class="text-xs text-slate-400 font-medium">Bahasa</p>
            <p class="mt-0.5 font-black text-emerald-300">{{ rules.abstract.languages.join(', ').toUpperCase() }}</p>
          </div>
        </div>
      </div>

      <!-- References -->
      <div v-if="rules.references" class="rounded-xl border-2 border-white/10 bg-white/3 p-5">
        <p class="mb-4 text-xs font-black uppercase tracking-widest text-slate-500">Format Referensi</p>
        <div class="grid grid-cols-2 gap-3 md:grid-cols-3">
          <div class="rounded-lg border-2 border-rose-500/20 bg-rose-500/10 p-3">
            <p class="text-xs text-slate-400 font-medium">Gaya Sitasi</p>
            <p class="mt-0.5 font-black text-rose-300">{{ rules.references.style || 'APA' }}</p>
          </div>
          <div class="rounded-lg border-2 border-rose-500/20 bg-rose-500/10 p-3">
            <p class="text-xs text-slate-400 font-medium">Font · Ukuran</p>
            <p class="mt-0.5 font-black text-rose-300">{{ rules.references.font || rules.font }} · {{ rules.references.size || 10 }}pt</p>
          </div>
          <div v-if="rules.references.hangingIndent" class="rounded-lg border-2 border-rose-500/20 bg-rose-500/10 p-3">
            <p class="text-xs text-slate-400 font-medium">Hanging Indent</p>
            <p class="mt-0.5 font-black text-rose-300">{{ rules.references.hangingIndent }} cm</p>
          </div>
        </div>
      </div>

      <!-- Sections -->
      <div v-if="rules.sections" class="rounded-xl border-2 border-white/10 bg-white/3 p-5">
        <p class="mb-4 text-xs font-black uppercase tracking-widest text-slate-500">Format Heading</p>
        <div class="space-y-2">
          <div v-if="rules.sections.level1" class="flex items-center gap-3 rounded-lg border border-white/5 bg-white/3 p-3">
            <span class="rounded-md border-2 border-sky-400 bg-sky-400/10 px-2 py-0.5 text-xs font-black text-sky-400">H1</span>
            <div class="flex flex-wrap gap-1">
              <span v-if="rules.sections.level1.bold" class="rounded-full bg-sky-500/15 px-2 py-0.5 text-[10px] font-bold text-sky-300">Bold</span>
              <span v-if="rules.sections.level1.uppercase" class="rounded-full bg-sky-500/15 px-2 py-0.5 text-[10px] font-bold text-sky-300">CAPS</span>
              <span v-if="rules.sections.level1.numbering" class="rounded-full bg-sky-500/15 px-2 py-0.5 text-[10px] font-bold text-sky-300">Numbered</span>
              <span class="rounded-full bg-sky-500/15 px-2 py-0.5 text-[10px] font-bold text-sky-300">{{ rules.sections.level1.size || rules.size }}pt</span>
            </div>
          </div>
          <div v-if="rules.sections.level2" class="flex items-center gap-3 rounded-lg border border-white/5 bg-white/3 p-3">
            <span class="rounded-md border-2 border-sky-400/70 bg-sky-400/5 px-2 py-0.5 text-xs font-black text-sky-400/80">H2</span>
            <div class="flex flex-wrap gap-1">
              <span v-if="rules.sections.level2.bold" class="rounded-full bg-sky-500/10 px-2 py-0.5 text-[10px] font-bold text-sky-300/80">Bold</span>
              <span v-if="rules.sections.level2.italic" class="rounded-full bg-sky-500/10 px-2 py-0.5 text-[10px] font-bold text-sky-300/80">Italic</span>
              <span v-if="rules.sections.level2.numbering" class="rounded-full bg-sky-500/10 px-2 py-0.5 text-[10px] font-bold text-sky-300/80">Numbered</span>
            </div>
          </div>
          <div v-if="rules.sections.level3" class="flex items-center gap-3 rounded-lg border border-white/5 bg-white/3 p-3">
            <span class="rounded-md border-2 border-sky-400/50 bg-sky-400/3 px-2 py-0.5 text-xs font-black text-sky-400/60">H3</span>
            <div class="flex flex-wrap gap-1">
              <span v-if="rules.sections.level3.bold" class="rounded-full bg-sky-500/8 px-2 py-0.5 text-[10px] font-bold text-sky-300/60">Bold</span>
              <span v-if="rules.sections.level3.italic" class="rounded-full bg-sky-500/8 px-2 py-0.5 text-[10px] font-bold text-sky-300/60">Italic</span>
              <span v-if="rules.sections.level3.numbering" class="rounded-full bg-sky-500/8 px-2 py-0.5 text-[10px] font-bold text-sky-300/60">Numbered</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview -->
    <div v-if="previewContent" class="rounded-xl border-2 border-white/10 bg-white/3 p-5">
      <p class="mb-3 text-xs font-black uppercase tracking-widest text-slate-500">Preview Isi Dokumen</p>
      <div class="max-h-48 overflow-y-auto rounded-lg bg-slate-900/60 p-4 font-mono text-xs leading-relaxed text-slate-300 scrollbar-thin">
        <p v-for="(line, idx) in previewLines" :key="idx" class="mb-1">{{ line }}</p>
      </div>
    </div>

    <!-- Download -->
    <div class="rounded-xl border-2 border-green-500/20 bg-green-500/5 p-5">
      <p class="mb-4 text-xs font-black uppercase tracking-widest text-slate-500">Unduh Dokumen</p>
      <div class="flex gap-3">
        <button
          @click="downloadDocument"
          :disabled="!documentBase64"
          class="download-btn flex flex-1 items-center justify-center gap-2 rounded-xl border-4 border-green-500 bg-green-500 px-6 py-3.5 font-black text-black text-sm transition-all duration-200 hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-40 disabled:translate-y-0"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Unduh {{ documentType === 'jurnal' ? 'Jurnal' : 'Skripsi' }} Terformat (.docx)
        </button>
        <button
          @click="copyToClipboard"
          class="rounded-xl border-4 border-white/15 bg-white/5 px-5 py-3.5 text-sm font-black text-slate-300 transition-all duration-200 hover:bg-white/10 hover:text-white hover:-translate-y-1"
          style="box-shadow: 3px 3px 0px rgba(255,255,255,0.05);"
        >
          Salin Rules
        </button>
      </div>
      <p v-if="downloadMessage" class="mt-3 text-center text-sm font-bold" :class="downloadMessage.includes('gagal') ? 'text-red-400' : 'text-green-400'">
        {{ downloadMessage }}
      </p>
    </div>

    <!-- Next steps -->
    <div class="rounded-xl border-2 border-white/10 bg-white/3 p-5">
      <p class="mb-3 text-xs font-black uppercase tracking-widest text-slate-500">Langkah Selanjutnya</p>
      <ul class="space-y-2">
        <li v-for="step in activeNextSteps" :key="step" class="flex items-start gap-2 text-sm text-slate-300 font-medium">
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
import type { AnyFormattingRules, DocumentType } from "~/utils/types";

interface ResultPreviewProps {
  rules?: AnyFormattingRules;
  thesisText?: string;
  documentBase64?: string;
  documentType?: DocumentType;
}

const props = withDefaults(defineProps<ResultPreviewProps>(), {
  documentType: "skripsi",
});

const downloadMessage = ref("");

const skripsiSteps = [
  "Unduh dokumen yang telah diformat",
  "Buka dan periksa hasil formatting di Microsoft Word",
  "Jika perlu penyesuaian, upload ulang dengan panduan yang diperbarui",
  "Gunakan dokumen ini sebagai template untuk BAB berikutnya",
];

const jurnalSteps = [
  "Unduh naskah jurnal yang telah diformat",
  "Buka dan periksa hasil formatting di Microsoft Word",
  "Pastikan abstrak, judul, dan referensi sudah sesuai template jurnal",
  "Cek ulang format sitasi dan daftar pustaka",
  "Submit naskah ke sistem jurnal target",
];

const activeNextSteps = computed(() =>
  props.documentType === "jurnal" ? jurnalSteps : skripsiSteps,
);

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
    const prefix = props.documentType === "jurnal" ? "jurnal" : "skripsi";
    a.download = `${prefix}-terformat-${Date.now()}.docx`;
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

<style scoped>
.download-btn {
  box-shadow: 5px 5px 0px #065f46;
}
</style>
