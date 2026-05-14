<template>
  <div class="space-y-6">
    <div class="animate-slide-up">
      <h2 class="text-2xl font-black text-white" style="text-shadow: 2px 2px 0px #b45309;">
        🏛️ Pilih Jurusan / Program Studi
      </h2>
      <p class="mt-1 text-sm text-slate-300 font-medium">
        Panduan ini memuat aturan untuk beberapa jurusan. Pilih jurusan Anda agar
        aturan format yang diekstrak benar-benar sesuai.
      </p>
    </div>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <button
        v-for="(program, idx) in programs"
        :key="program"
        @click="$emit('select', program)"
        class="program-btn group flex items-center gap-3 rounded-xl border-4 border-white/15 bg-white/3 p-4 text-left transition-all duration-200 hover:border-yellow-400 hover:bg-yellow-400/8 hover:-translate-y-1 animate-pop-in"
        :style="{ animationDelay: idx * 70 + 'ms' }"
      >
        <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-yellow-400 bg-yellow-400/15 text-sm font-black text-yellow-400">
          {{ idx + 1 }}
        </span>
        <span class="min-w-0 flex-1 font-bold text-white group-hover:text-yellow-400">{{ program }}</span>
        <span class="text-slate-500 group-hover:text-yellow-400 transition">→</span>
      </button>
    </div>

    <button
      @click="$emit('back')"
      class="rounded-xl border-4 border-white/20 bg-white/5 px-5 py-3 text-sm font-black text-slate-300 transition-all duration-200 hover:border-red-400/60 hover:text-red-400"
    >
      ← Kembali
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ programs: string[] }>();
defineEmits<{ select: [program: string]; back: [] }>();
</script>
