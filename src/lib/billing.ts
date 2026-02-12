import "server-only";

export type BillingStatus = {
  mode: "readwrite" | "readonly";
  reason?: "free_week" | "unpaid";
  weekStart: string;
};

export async function checkBillingAccess(
  idToken: string,
): Promise<BillingStatus> {
  const billingApiUrl = process.env.BILLING_API_URL;

  if (!billingApiUrl) {
    console.warn("BILLING_API_URL not set -- defaulting to readwrite");
    return { mode: "readwrite", weekStart: "" };
  }

  try {
    const res = await fetch(`${billingApiUrl}/api/billing/tasks/access`, {
      headers: { Authorization: `Bearer ${idToken}` },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Billing check failed: ${res.status}`);
      return { mode: "readwrite", weekStart: "" };
    }

    return res.json();
  } catch (e) {
    console.error("Billing check error:", e);
    return { mode: "readwrite", weekStart: "" };
  }
}

export function billingGuard(
  billing: BillingStatus,
): { error: string; code: number } | null {
  if (billing.mode === "readonly") {
    return {
      error: "Insufficient credits. Purchase credits to continue.",
      code: 402,
    };
  }
  return null;
}
