/**
 * The one place the contact form talks to the backend.
 *
 * POST /api/enquiries is served by `server/index.mjs` (and proxied by Vite in
 * development). The UI never renders a raw response: it shows the message the
 * server sent, or its own fallback sentence.
 */

export type EnquiryPayload = {
  name: string;
  email: string;
  project: string;
  timeline?: string;
  message: string;
  /** Honeypot: people never see it, bots fill it. */
  website?: string;
  source?: string;
};

export type EnquiryResult =
  | { ok: true; id: string }
  | { ok: false; error: string; fields?: Record<string, string> };

export async function sendEnquiry(payload: EnquiryPayload): Promise<EnquiryResult> {
  try {
    const response = await fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = (await response.json().catch(() => null)) as
      | { ok?: boolean; id?: string; error?: string; fields?: Record<string, string> }
      | null;

    if (response.ok) return { ok: true, id: data?.id ?? '' };

    return {
      ok: false,
      error: data?.error ?? 'That did not go through. Please try again.',
      fields: data?.fields,
    };
  } catch {
    return {
      ok: false,
      error: 'The message could not reach the studio. Check your connection and try again.',
    };
  }
}
