import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody<{
    userId: string;
    orderId: string;
    guidelineFilename: string;
    thesisFilename: string;
  }>(event);

  const supabase = createClient(
    config.supabaseUrl,
    config.supabaseServiceKey
  );

  // Ambil transaction id dari order_id
  const { data: trx } = await supabase
    .from("transactions")
    .select("id")
    .eq("order_id", body.orderId)
    .single();

  await supabase.from("processing_jobs").insert({
    user_id: body.userId,
    transaction_id: trx?.id ?? null,
    guideline_filename: body.guidelineFilename,
    thesis_filename: body.thesisFilename,
    status: "completed",
  });

  return { ok: true };
});
