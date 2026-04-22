import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const rawBody = await readRawBody(event);
  console.log("[payment/create] raw body:", rawBody);

  let body: { userId?: string; userEmail?: string; userName?: string } | null = null;
  try {
    body = rawBody ? JSON.parse(rawBody) : null;
  } catch {
    throw createError({ statusCode: 400, message: `Body bukan JSON valid: ${rawBody}` });
  }

  console.log("[payment/create] parsed body:", body);

  if (!body?.userId) {
    throw createError({ statusCode: 400, message: `userId diperlukan. Body: ${JSON.stringify(body)}` });
  }
  if (!body?.userEmail) {
    throw createError({ statusCode: 400, message: `userEmail diperlukan. Body: ${JSON.stringify(body)}` });
  }

  if (!config.midtransServerKey) {
    throw createError({ statusCode: 500, message: "Konfigurasi payment gateway belum lengkap" });
  }

  const orderId = `RAPIIN-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  const midtransAuth = Buffer.from(`${config.midtransServerKey}:`).toString("base64");

  let midtransRes: Response;
  try {
    midtransRes = await fetch(
      "https://app.sandbox.midtrans.com/snap/v1/transactions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${midtransAuth}`,
        },
        body: JSON.stringify({
          transaction_details: {
            order_id: orderId,
            gross_amount: 10000,
          },
          item_details: [
            {
              id: "RAPIIN-FORMAT-DOC",
              price: 10000,
              quantity: 1,
              name: "Format Dokumen Skripsi",
            },
          ],
          customer_details: {
            email: body.userEmail,
            first_name: body.userName || body.userEmail,
          },
        }),
      }
    );
  } catch (fetchErr) {
    throw createError({
      statusCode: 503,
      message: "Tidak dapat terhubung ke payment gateway. Periksa koneksi internet server.",
    });
  }

  if (!midtransRes.ok) {
    const errText = await midtransRes.text();
    let errMsg = "Gagal membuat transaksi Midtrans";
    try {
      const errData = JSON.parse(errText);
      errMsg = errData?.error_messages?.[0] || errData?.message || errMsg;
    } catch {}
    throw createError({ statusCode: 500, message: errMsg });
  }

  const { token, redirect_url } = await midtransRes.json();

  // Simpan transaksi ke Supabase
  const supabase = createClient(
    config.supabaseUrl,
    config.supabaseServiceKey
  );

  const { error: dbError } = await supabase.from("transactions").insert({
    user_id: body.userId,
    order_id: orderId,
    amount: 10000,
    status: "pending",
    snap_token: token,
    snap_redirect_url: redirect_url,
  });

  if (dbError) {
    console.error("DB insert error:", dbError);
  }

  return { token, orderId };
});
