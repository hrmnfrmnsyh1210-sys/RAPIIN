import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody<{
    userId: string;
    userEmail: string;
    userName: string;
  }>(event);

  if (!body?.userId || !body?.userEmail) {
    throw createError({ statusCode: 400, message: "userId dan userEmail diperlukan" });
  }

  const orderId = `RAPIIN-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  // Buat transaksi di Midtrans Snap API
  const midtransAuth = Buffer.from(`${config.midtransServerKey}:`).toString("base64");

  const midtransRes = await fetch(
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

  if (!midtransRes.ok) {
    const errData = await midtransRes.json();
    throw createError({
      statusCode: 500,
      message: errData?.error_messages?.[0] || "Gagal membuat transaksi Midtrans",
    });
  }

  const { token, redirect_url } = await midtransRes.json();

  // Simpan transaksi ke Supabase
  const supabase = createClient(
    process.env.SUPABASE_URL!,
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
