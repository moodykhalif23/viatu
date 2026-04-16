import { NextRequest, NextResponse } from 'next/server';
import { capturePayPal } from '@/app/checkout/actions';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const paypalOrderId = searchParams.get('token');
  const orderId = searchParams.get('orderId');

  if (!paypalOrderId || !orderId) {
    return NextResponse.redirect(new URL('/checkout?error=missing_params', req.url));
  }

  const result = await capturePayPal(paypalOrderId, orderId);

  if (result.success) {
    return NextResponse.redirect(new URL(`/checkout/success?orderId=${orderId}`, req.url));
  }

  return NextResponse.redirect(new URL(`/checkout?error=payment_failed`, req.url));
}
