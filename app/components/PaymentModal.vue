<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center px-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="$emit('cancel')"></div>

      <!-- Modal -->
      <div class="relative z-10 w-full max-w-sm rounded-2xl border border-white/5 bg-slate-900 p-6 shadow-2xl shadow-black/50">
        <!-- Header -->
        <div class="mb-5 text-center">
          <div class="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/15 text-2xl">
            💳
          </div>
          <h3 class="text-lg font-bold text-white">Konfirmasi Pembayaran</h3>
          <p class="mt-1 text-sm text-slate-400">Format dokumen skripsi otomatis</p>
        </div>

        <!-- Price -->
        <div class="mb-5 rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-4 text-center">
          <p class="text-xs text-slate-400">Total yang dibayarkan</p>
          <p class="mt-1 text-3xl font-extrabold text-indigo-300">Rp 10.000</p>
          <p class="mt-1 text-xs text-slate-500">Sekali bayar per dokumen</p>
        </div>

        <!-- File info -->
        <div class="mb-5 space-y-2">
          <div class="flex items-center gap-2 rounded-lg bg-white/3 px-3 py-2">
            <span class="text-xs text-slate-500">Panduan:</span>
            <span class="truncate text-xs font-medium text-slate-300">{{ guidelineName }}</span>
          </div>
          <div class="flex items-center gap-2 rounded-lg bg-white/3 px-3 py-2">
            <span class="text-xs text-slate-500">Skripsi:</span>
            <span class="truncate text-xs font-medium text-slate-300">{{ thesisName }}</span>
          </div>
        </div>

        <!-- Error -->
        <div v-if="error" class="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2">
          <p class="text-xs text-red-400">{{ error }}</p>
        </div>

        <!-- Actions -->
        <div class="flex gap-3">
          <button
            @click="$emit('cancel')"
            :disabled="loading"
            class="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 disabled:opacity-40"
          >
            Batal
          </button>
          <button
            @click="handlePay"
            :disabled="loading"
            class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            <svg v-if="loading" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            {{ loading ? 'Memproses...' : 'Bayar Sekarang' }}
          </button>
        </div>

        <!-- Security note -->
        <p class="mt-4 text-center text-xs text-slate-600">
          🔒 Pembayaran aman via Midtrans
        </p>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  guidelineName: string;
  thesisName: string;
}>();

const emit = defineEmits<{
  success: [orderId: string];
  cancel: [];
}>();

const user = useSupabaseUser();
const loading = ref(false);
const error = ref("");

const handlePay = async () => {
  if (!user.value) return;
  loading.value = true;
  error.value = "";

  try {
    const { token, orderId } = await $fetch<{ token: string; orderId: string }>(
      "/api/payment/create",
      {
        method: "POST",
        body: {
          userId: user.value.id,
          userEmail: user.value.email ?? user.value.user_metadata?.email ?? "",
          userName: user.value.user_metadata?.full_name ?? user.value.email ?? "",
        },
      }
    );

    // Open Midtrans Snap
    if (!(window as any).snap) {
      error.value = "Payment gateway belum siap. Refresh halaman dan coba lagi.";
      loading.value = false;
      return;
    }
    (window as any).snap.pay(token, {
      onSuccess: () => {
        emit("success", orderId);
      },
      onPending: () => {
        error.value = "Pembayaran pending. Selesaikan pembayaran untuk melanjutkan.";
        loading.value = false;
      },
      onError: () => {
        error.value = "Pembayaran gagal. Coba lagi.";
        loading.value = false;
      },
      onClose: () => {
        loading.value = false;
      },
    });
  } catch (err: any) {
    const msg = err?.data?.message || err?.message || "Gagal membuat transaksi. Coba lagi.";
    error.value = msg;
    loading.value = false;
  }
};
</script>
