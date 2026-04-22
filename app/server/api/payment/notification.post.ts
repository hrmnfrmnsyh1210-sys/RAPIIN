import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody<{
    order_id: string;
    status_code: string;
    gross_amount: string;
    signature_key: string;
    transaction_status: string;
    fraud_status?: string;
  }>(event);

  // Verifikasi signature dari Midtrans
  const expectedSignature = createHash("sha512")
    .update(`${body.order_id}${body.status_code}${body.gross_amount}${config.midtransServerKey}`)
    .digest("hex");

  if (expectedSignature !== body.signature_key) {
    throw createError({ statusCode: 403, message: "Invalid signature" });
  }

  // Tentukan status transaksi
  let status = "pending";
  const ts = body.transaction_status;
  const fs = body.fraud_status;

  if (ts === "capture") {
    status = fs === "accept" ? "success" : "failed";
  } else if (ts === "settlement") {
    status = "success";
  } else if (ts === "pending") {
    status = "pending";
  } else if (["deny", "cancel", "expire", "failure"].includes(ts)) {
    status = "failed";
  }

  // Update status di Supabase
  const supabase = createClient(
    config.supabaseUrl,
    config.supabaseServiceKey
  );

  await supabase
    .from("transactions")
    .update({
      status,
      paid_at: status === "success" ? new Date().toISOString() : null,
    })
    .eq("order_id", body.order_id);

  return { status: "ok" };
});
