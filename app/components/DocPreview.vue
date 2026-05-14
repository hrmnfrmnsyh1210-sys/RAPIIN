<template>
  <div class="space-y-6">
    <div class="flex items-center gap-3 animate-slide-up">
      <div class="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-cyan-400 bg-cyan-400/10 text-2xl">
        👁️
      </div>
      <div>
        <h2 class="text-xl font-black text-white" style="text-shadow: 2px 2px 0px #0e7490;">
          Preview Hasil Format
        </h2>
        <p class="text-sm text-slate-400 font-medium">
          Perkiraan tampilan dokumen. Periksa dulu — bayar hanya kalau sudah rapi.
        </p>
      </div>
    </div>

    <!-- Catatan preview -->
    <div class="flex items-start gap-2 rounded-xl border-2 border-cyan-400/30 bg-cyan-400/5 px-4 py-3">
      <span class="text-lg shrink-0">ℹ️</span>
      <p class="text-xs font-medium text-slate-300">
        Ini preview perkiraan (bukan file final). File <strong class="text-cyan-300">.docx</strong>
        yang rapi & siap submit bisa diunduh setelah pembayaran.
      </p>
    </div>

    <!-- "Kertas" preview -->
    <div class="rounded-xl border-2 border-white/10 bg-slate-800/40 p-3 sm:p-5">
      <p class="mb-3 text-xs font-black uppercase tracking-widest text-slate-500">Dokumen Terformat</p>
      <div class="max-h-[60vh] overflow-y-auto rounded-lg bg-slate-900/60 p-3 scrollbar-thin">
        <div class="doc-paper mx-auto" v-html="previewHtml"></div>
      </div>
    </div>

    <!-- Actions -->
    <div class="rounded-xl border-2 border-yellow-500/20 bg-yellow-500/5 p-5">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-sm font-black text-white">Sudah rapi? Lanjut bayar untuk unduh file .docx</p>
          <p class="text-xs text-slate-400 font-medium">Rp 15.000 — sekali bayar per dokumen</p>
        </div>
        <div class="flex gap-3">
          <button
            @click="$emit('back')"
            class="rounded-xl border-4 border-white/20 bg-white/5 px-5 py-3 text-sm font-black text-slate-300 transition-all duration-200 hover:border-red-400/60 hover:text-red-400"
          >
            ← Ubah
          </button>
          <button
            @click="$emit('pay')"
            class="btn-pay flex items-center justify-center gap-2 rounded-xl border-4 border-yellow-400 bg-yellow-400 px-6 py-3 font-black text-black text-sm transition-all duration-200 hover:-translate-y-1"
          >
            💳 Bayar & Unduh
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ previewHtml: string }>();
defineEmits<{ pay: []; back: [] }>();
</script>

<style scoped>
.btn-pay {
  box-shadow: 5px 5px 0px #b45309;
}
/* Batasi lebar "kertas" supaya proporsional & terbaca */
.doc-paper {
  max-width: 720px;
}
.doc-paper :deep(p) {
  margin: 0;
}
</style>
