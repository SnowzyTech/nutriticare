import { NextResponse } from "next/server"

// TEMPORARY: Remove this endpoint after debugging
export async function GET() {
  const paystackKey = process.env.PAYSTACK_SECRET_KEY
  const paystackPublicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
  const appUrl = process.env.NEXT_PUBLIC_APP_URL

  return NextResponse.json({
    paystack_secret_key_exists: !!paystackKey,
    paystack_secret_key_length: paystackKey?.length ?? 0,
    paystack_secret_key_prefix: paystackKey?.substring(0, 10) ?? "NOT SET",
    paystack_public_key_exists: !!paystackPublicKey,
    paystack_public_key_prefix: paystackPublicKey?.substring(0, 10) ?? "NOT SET",
    app_url: appUrl ?? "NOT SET",
    node_env: process.env.NODE_ENV,
  })
}
