'use client';

import { useState } from 'react';
import { Loader2, Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { MpesaIcon } from './mpesa-icon';
import { PayPalIcon } from './paypal-icon';
import {
  initiateMpesaPayment,
  pollMpesaStatus,
  initiatePayPalPayment,
  type CartLineInput,
} from '../actions';

type Method = 'mpesa' | 'paypal' | null;

type Status = 'idle' | 'loading' | 'polling' | 'success' | 'error';

interface PaymentFormProps {
  lines: CartLineInput[];
  totalAmount: number;
  currencyCode: string;
  disabled?: boolean;
}

export function PaymentForm({ lines, totalAmount, currencyCode, disabled }: PaymentFormProps) {
  const [method, setMethod] = useState<Method>(null);
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  async function handleMpesa() {
    if (!phone.trim()) {
      setMessage('Please enter your M-Pesa phone number.');
      return;
    }
    setStatus('loading');
    setMessage('');

    const res = await initiateMpesaPayment({ phone, lines, totalAmount, currencyCode });

    if (!res.success || !res.checkoutRequestId || !res.orderId) {
      setStatus('error');
      setMessage(res.error ?? 'Failed to initiate M-Pesa payment.');
      return;
    }

    setStatus('polling');
    setMessage('Check your phone and enter your M-Pesa PIN to complete payment...');

    // Poll up to 10 times (30s total)
    const { checkoutRequestId, orderId } = res;
    let attempts = 0;

    const interval = setInterval(async () => {
      attempts++;
      const poll = await pollMpesaStatus(checkoutRequestId, orderId);

      if (poll.paid) {
        clearInterval(interval);
        setStatus('success');
        setMessage('Payment confirmed! Your order is being processed.');
        return;
      }

      if (attempts >= 10) {
        clearInterval(interval);
        setStatus('error');
        setMessage('Payment timed out. Please try again or check your M-Pesa messages.');
      }
    }, 3000);
  }

  async function handlePayPal() {
    setStatus('loading');
    setMessage('');

    const res = await initiatePayPalPayment({ lines, totalAmount, currencyCode });

    if (!res.success || !res.approveUrl) {
      setStatus('error');
      setMessage(res.error ?? 'Failed to create PayPal order.');
      return;
    }

    // Redirect to PayPal approval page — append our orderId so the capture route can use it
    const approveUrl = new URL(res.approveUrl);
    approveUrl.searchParams.set('orderId', res.orderId!);
    window.location.assign(approveUrl.toString());
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <CheckCircle2 className="size-10 text-green-500" />
        <p className="font-medium">{message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Method selector */}
      <p className="text-sm font-medium text-muted-foreground">Select payment method</p>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={disabled || status === 'loading' || status === 'polling'}
          onClick={() => setMethod('mpesa')}
          className={cn(
            'flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all',
            method === 'mpesa'
              ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
              : 'border-border hover:border-muted-foreground/40',
            (disabled || status === 'loading' || status === 'polling') && 'cursor-not-allowed opacity-50',
          )}
        >
          <MpesaIcon className="h-8 w-auto" />
          <span className="text-xs font-medium">M-Pesa</span>
        </button>

        <button
          type="button"
          disabled={disabled || status === 'loading' || status === 'polling'}
          onClick={() => setMethod('paypal')}
          className={cn(
            'flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all',
            method === 'paypal'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
              : 'border-border hover:border-muted-foreground/40',
            (disabled || status === 'loading' || status === 'polling') && 'cursor-not-allowed opacity-50',
          )}
        >
          <PayPalIcon className="h-8 w-auto" />
          <span className="text-xs font-medium">PayPal</span>
        </button>
      </div>

      {/* M-Pesa phone input */}
      {method === 'mpesa' && (
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="tel"
              placeholder="07XXXXXXXX or 2547XXXXXXXX"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="pl-9"
              disabled={status === 'loading' || status === 'polling'}
            />
          </div>
          <Button
            size="lg"
            className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white"
            disabled={status === 'loading' || status === 'polling' || !phone.trim()}
            onClick={handleMpesa}
          >
            {(status === 'loading' || status === 'polling') && (
              <Loader2 className="size-4 animate-spin" />
            )}
            {status === 'polling' ? 'Waiting for payment...' : 'Pay with M-Pesa'}
          </Button>
        </div>
      )}

      {/* PayPal button */}
      {method === 'paypal' && (
        <Button
          size="lg"
          className="w-full gap-2 bg-[#003087] hover:bg-[#002070] text-white"
          disabled={status === 'loading'}
          onClick={handlePayPal}
        >
          {status === 'loading' && <Loader2 className="size-4 animate-spin" />}
          Pay with PayPal
        </Button>
      )}

      {/* Status message */}
      {message && status !== 'success' && (
        <div
          className={cn(
            'flex items-start gap-2 rounded-lg p-3 text-sm',
            status === 'error'
              ? 'bg-destructive/10 text-destructive'
              : 'bg-muted text-muted-foreground',
          )}
        >
          {status === 'error' && <AlertCircle className="mt-0.5 size-4 shrink-0" />}
          {message}
        </div>
      )}
    </div>
  );
}
