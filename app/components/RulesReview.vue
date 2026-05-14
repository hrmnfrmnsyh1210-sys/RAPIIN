<template>
  <div class="space-y-6">
    <div class="animate-slide-up">
      <h2 class="text-2xl font-black text-white" style="text-shadow: 2px 2px 0px #b45309;">
        📋 Review Aturan Format
      </h2>
      <p class="mt-1 text-sm text-slate-300 font-medium">
        Periksa aturan hasil analisa AI. Anda bisa mengoreksi sebelum lanjut.
      </p>
      <span
        v-if="selectedProgram"
        class="mt-2 inline-flex items-center gap-1.5 rounded-full border-2 border-yellow-400 bg-yellow-400/10 px-3 py-1 text-xs font-black text-yellow-400"
      >
        🏛️ {{ selectedProgram }}
      </span>
    </div>

    <!-- Aturan Dasar -->
    <div class="rounded-xl border-2 border-white/10 bg-white/3 p-5">
      <p class="mb-4 text-xs font-black uppercase tracking-widest text-slate-500">Aturan Dasar</p>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label class="block">
          <span class="text-xs font-bold text-slate-400">Font</span>
          <input
            v-model="local.font"
            type="text"
            class="mt-1 w-full rounded-lg border-2 border-white/15 bg-slate-900/60 px-3 py-2 text-sm font-bold text-white focus:border-yellow-400 focus:outline-none"
          />
        </label>
        <label class="block">
          <span class="text-xs font-bold text-slate-400">Ukuran Font (pt)</span>
          <input
            v-model.number="local.size"
            type="number" min="6" max="36" step="1"
            class="mt-1 w-full rounded-lg border-2 border-white/15 bg-slate-900/60 px-3 py-2 text-sm font-bold text-white focus:border-yellow-400 focus:outline-none"
          />
        </label>
        <label class="block">
          <span class="text-xs font-bold text-slate-400">Spasi Baris</span>
          <select
            v-model.number="local.spacing"
            class="mt-1 w-full rounded-lg border-2 border-white/15 bg-slate-900/60 px-3 py-2 text-sm font-bold text-white focus:border-yellow-400 focus:outline-none"
          >
            <option :value="1">1 (Single)</option>
            <option :value="1.5">1.5</option>
            <option :value="2">2 (Double)</option>
          </select>
        </label>
      </div>
    </div>

    <!-- Margin -->
    <div class="rounded-xl border-2 border-white/10 bg-white/3 p-5">
      <p class="mb-4 text-xs font-black uppercase tracking-widest text-slate-500">Margin (cm)</p>
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <label v-for="side in marginSides" :key="side.key" class="block">
          <span class="text-xs font-bold text-slate-400">{{ side.label }}</span>
          <input
            v-model.number="local.margin[side.key]"
            type="number" min="0" max="10" step="0.1"
            class="mt-1 w-full rounded-lg border-2 border-white/15 bg-slate-900/60 px-3 py-2 text-sm font-bold text-white focus:border-yellow-400 focus:outline-none"
          />
        </label>
      </div>
    </div>

    <!-- Format BAB -->
    <div class="rounded-xl border-2 border-white/10 bg-white/3 p-5">
      <p class="mb-4 text-xs font-black uppercase tracking-widest text-slate-500">Format Judul BAB</p>
      <div class="flex flex-wrap items-center gap-4">
        <label class="flex items-center gap-2 cursor-pointer">
          <input v-model="local.bab.bold" type="checkbox" class="h-4 w-4 accent-yellow-400" />
          <span class="text-sm font-bold text-slate-300">Bold</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input v-model="local.bab.uppercase" type="checkbox" class="h-4 w-4 accent-yellow-400" />
          <span class="text-sm font-bold text-slate-300">Uppercase</span>
        </label>
        <label class="flex items-center gap-2">
          <span class="text-sm font-bold text-slate-400">Perataan</span>
          <select
            v-model="local.bab.align"
            class="rounded-lg border-2 border-white/15 bg-slate-900/60 px-3 py-1.5 text-sm font-bold text-white focus:border-yellow-400 focus:outline-none"
          >
            <option value="left">Kiri</option>
            <option value="center">Tengah</option>
            <option value="right">Kanan</option>
          </select>
        </label>
      </div>
    </div>

    <!-- Format Paragraf -->
    <div class="rounded-xl border-2 border-white/10 bg-white/3 p-5">
      <p class="mb-4 text-xs font-black uppercase tracking-widest text-slate-500">Format Paragraf</p>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label class="block">
          <span class="text-xs font-bold text-slate-400">Indent Baris Pertama (cm)</span>
          <input
            v-model.number="local.paragraf.indent"
            type="number" min="0" max="5" step="0.05"
            class="mt-1 w-full rounded-lg border-2 border-white/15 bg-slate-900/60 px-3 py-2 text-sm font-bold text-white focus:border-yellow-400 focus:outline-none"
          />
        </label>
        <label class="block">
          <span class="text-xs font-bold text-slate-400">Perataan</span>
          <select
            v-model="local.paragraf.align"
            class="mt-1 w-full rounded-lg border-2 border-white/15 bg-slate-900/60 px-3 py-2 text-sm font-bold text-white focus:border-yellow-400 focus:outline-none"
          >
            <option value="left">Kiri</option>
            <option value="justify">Rata Kiri-Kanan</option>
            <option value="center">Tengah</option>
            <option value="right">Kanan</option>
          </select>
        </label>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-3">
      <button
        @click="$emit('back')"
        class="rounded-xl border-4 border-white/20 bg-white/5 px-5 py-3.5 text-sm font-black text-slate-300 transition-all duration-200 hover:border-red-400/60 hover:text-red-400"
      >
        ← Kembali
      </button>
      <button
        @click="$emit('confirm', cloned())"
        class="btn-confirm flex flex-1 items-center justify-center gap-2 rounded-xl border-4 border-yellow-400 bg-yellow-400 px-6 py-3.5 font-black text-black text-base transition-all duration-200 hover:-translate-y-1"
      >
        Konfirmasi & Upload Skripsi →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import type { FormattingRules } from "~/utils/types";

const props = defineProps<{
  rules: FormattingRules;
  selectedProgram?: string | null;
}>();

defineEmits<{ confirm: [rules: FormattingRules]; back: [] }>();

const marginSides = [
  { key: "top" as const, label: "Atas" },
  { key: "bottom" as const, label: "Bawah" },
  { key: "left" as const, label: "Kiri" },
  { key: "right" as const, label: "Kanan" },
];

// Salinan lokal yang bisa diedit tanpa mengubah prop langsung.
const local = reactive<FormattingRules>({
  font: props.rules.font || "Times New Roman",
  size: props.rules.size || 12,
  spacing: props.rules.spacing || 1.5,
  margin: {
    top: props.rules.margin?.top ?? 4,
    bottom: props.rules.margin?.bottom ?? 3,
    left: props.rules.margin?.left ?? 4,
    right: props.rules.margin?.right ?? 3,
  },
  bab: {
    bold: props.rules.bab?.bold ?? true,
    uppercase: props.rules.bab?.uppercase ?? true,
    align: props.rules.bab?.align ?? "center",
  },
  paragraf: {
    indent: props.rules.paragraf?.indent ?? 0.75,
    align: props.rules.paragraf?.align ?? "justify",
  },
});

// Kirim objek polos (lepas dari reactive) saat konfirmasi.
const cloned = (): FormattingRules => JSON.parse(JSON.stringify(local));
</script>

<style scoped>
.btn-confirm {
  box-shadow: 5px 5px 0px #b45309;
}
</style>
