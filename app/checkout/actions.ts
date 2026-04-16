'use server';

import { db } from '@/lib/db';
import { stkPush, queryStkStatus } from '@/lib/payments/mpesa';
import { createPayPalOrder, capturePayPalOrder } from '@/lib/payments/paypal';

export type CartLineInput = {
  title: string;
  variantTitle?: string;
  quantity: number;
  unitPrice: number;
};

// ---------------------------------------------------------------------------
// Shared: create a PENDING order in DB
// ---------------------------------------------------------------------------
async function createPendingOrder(
  lines: CartLineInput[],
  totalAmount: number,
  currencyCode: string,
  customerPhone?: string,
  customerEmail?: string,
) {
  const order = await db.order.create({
    data: {
      status: 'PENDING',
      totalAmount,
      currencyCode,
      notes: customerPhone ? `Phone: ${customerPhone}` : undefined,
      items: {
        create: lines.map(l => ({
          title: l.title,
          variantTitle: l.variantTitle,
          quantity: l.quantity,
          unitPrice: l.unitPrice,
        })),
      },
    },
  });
  return order;
}

// ---------------------------------------------------------------------------
// M-Pesa: initiate STK push
// ---------------------------------------------------------------------------
export async function initiateMpesaPayment({
  phone,
  lines,
  totalAmount,
  currencyCode,
}: {
  phone: string;
  lines: CartLineInput[];
  totalAmount: number;
  currencyCode: string;
}): Promise<{ success: boolean; checkoutRequestId?: string; orderId?: string; error?: string }> {
  try {
    const order = await createPendingOrder(lines, totalAmount, currencyCode, phone);
    const result = await stkPush({ phone, amount: totalAmount, orderId: order.id });

    if (result.ResponseCode !== '0') {
      return { success: false, error: result.CustomerMessage || 'STK push failed' };
    }

    return { success: true, checkoutRequestId: result.CheckoutRequestID, orderId: order.id };
  } catch (err) {
    console.error('M-Pesa initiation error:', err);
    return { success: false, error: (err as Error).message };
  }
}

// ---------------------------------------------------------------------------
// M-Pesa: poll STK status
// ---------------------------------------------------------------------------
export async function pollMpesaStatus(
  checkoutRequestId: string,
  orderId: string,
): Promise<{ success: boolean; paid: boolean; error?: string }> {
  try {
    const result = await queryStkStatus(checkoutRequestId);
    const paid = result.ResultCode === '0';

    if (paid) {
      await db.order.update({
        where: { id: orderId },
        data: { status: 'PROCESSING' },
      });
    }

    return { success: true, paid };
  } catch (err) {
    return { success: false, paid: false, error: (err as Error).message };
  }
}

// ---------------------------------------------------------------------------
// PayPal: create order
// ---------------------------------------------------------------------------
export async function initiatePayPalPayment({
  lines,
  totalAmount,
  currencyCode,
}: {
  lines: CartLineInput[];
  totalAmount: number;
  currencyCode: string;
}): Promise<{ success: boolean; paypalOrderId?: string; approveUrl?: string; orderId?: string; error?: string }> {
  try {
    const order = await createPendingOrder(lines, totalAmount, currencyCode);
    const paypalOrder = await createPayPalOrder({ amount: totalAmount, currencyCode, orderId: order.id });

    const approveUrl = paypalOrder.links.find(l => l.rel === 'approve')?.href;

    return { success: true, paypalOrderId: paypalOrder.id, approveUrl, orderId: order.id };
  } catch (err) {
    console.error('PayPal initiation error:', err);
    return { success: false, error: (err as Error).message };
  }
}

// ---------------------------------------------------------------------------
// PayPal: capture after approval
// ---------------------------------------------------------------------------
export async function capturePayPal(
  paypalOrderId: string,
  orderId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await capturePayPalOrder(paypalOrderId);
    const captured = result.status === 'COMPLETED';

    if (captured) {
      await db.order.update({
        where: { id: orderId },
        data: { status: 'PROCESSING' },
      });
    }

    return { success: captured, error: captured ? undefined : 'Payment not completed' };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}
