// PayPal Orders API v2 integration

const SANDBOX_BASE = 'https://api-m.sandbox.paypal.com';
const PROD_BASE = 'https://api-m.paypal.com';

function getBase() {
  return process.env.PAYPAL_ENV === 'production' ? PROD_BASE : SANDBOX_BASE;
}

export async function getPayPalToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID!;
  const secret = process.env.PAYPAL_CLIENT_SECRET!;
  const credentials = Buffer.from(`${clientId}:${secret}`).toString('base64');

  const res = await fetch(`${getBase()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`PayPal auth failed: ${res.statusText}`);
  const data = await res.json();
  return data.access_token as string;
}

export async function createPayPalOrder({
  amount,
  currencyCode,
  orderId,
}: {
  amount: number;
  currencyCode: string;
  orderId: string;
}): Promise<{ id: string; status: string; links: { href: string; rel: string }[] }> {
  const token = await getPayPalToken();

  const res = await fetch(`${getBase()}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': orderId,
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: orderId,
          amount: {
            currency_code: currencyCode,
            value: amount.toFixed(2),
          },
        },
      ],
    }),
    cache: 'no-store',
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PayPal order creation failed: ${err}`);
  }

  return res.json();
}

export async function capturePayPalOrder(paypalOrderId: string) {
  const token = await getPayPalToken();

  const res = await fetch(`${getBase()}/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PayPal capture failed: ${err}`);
  }

  return res.json();
}
