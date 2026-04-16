import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const callback = body?.Body?.stkCallback;

    if (!callback) return NextResponse.json({ ok: true });

    const resultCode: number = callback.ResultCode;
    const accountRef: string = callback.CallbackMetadata?.Item?.find(
      (i: { Name: string }) => i.Name === 'AccountReference',
    )?.Value ?? '';

    if (resultCode === 0 && accountRef) {
      await db.order.updateMany({
        where: { id: accountRef, status: 'PENDING' },
        data: { status: 'PROCESSING' },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('M-Pesa callback error:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
