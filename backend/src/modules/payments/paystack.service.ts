import { env } from "../../config/env";

// Sandbox-ready Paystack integration point. Not wired into the checkout flow yet — the
// Bank module currently uses a MOCK payment provider so the Nutrition -> Grocery flow is
// fully testable without live keys (see bank.service.ts mockConfirmPayment). Swap the
// mock provider for this service once PAYSTACK_SECRET_KEY is configured.

const PAYSTACK_BASE_URL = "https://api.paystack.co";

export interface InitializeTransactionParams {
  email: string;
  amountKobo: number;
  reference: string;
}

export async function initializeTransaction(params: InitializeTransactionParams) {
  if (!env.PAYSTACK_SECRET_KEY) {
    throw new Error("PAYSTACK_SECRET_KEY is not set. Add it to backend/.env to enable live payments.");
  }

  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      amount: params.amountKobo,
      reference: params.reference,
    }),
  });

  if (!response.ok) {
    throw new Error(`Paystack initialize failed: ${response.status}`);
  }

  return response.json();
}

export async function verifyTransaction(reference: string) {
  if (!env.PAYSTACK_SECRET_KEY) {
    throw new Error("PAYSTACK_SECRET_KEY is not set. Add it to backend/.env to enable live payments.");
  }

  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}` },
  });

  if (!response.ok) {
    throw new Error(`Paystack verify failed: ${response.status}`);
  }

  return response.json();
}
