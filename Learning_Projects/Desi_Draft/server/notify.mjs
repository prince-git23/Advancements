/**
 * Optional notification for a new enquiry.
 *
 * The backend stores every enquiry in SQLite first — that is the inbox.
 * Notification is a bonus, and it is provider-agnostic on purpose: set
 * ENQUIRY_WEBHOOK_URL to any endpoint that accepts a JSON POST (Slack incoming
 * webhook, a Zapier/Make catch hook, an n8n flow, your own mail relay) and the
 * studio hears about each enquiry. With no URL set, nothing is sent and the
 * enquiry is still saved.
 *
 * Failures never reach the visitor: the enquiry is already committed.
 */

const TIMEOUT_MS = 4000;

export async function notifyWebhook(enquiry) {
  const url = process.env.ENQUIRY_WEBHOOK_URL;
  if (!url) return { sent: false, reason: 'no webhook configured' };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        text: `new enquiry — ${enquiry.name} · ${enquiry.project}`,
        enquiry: {
          id: enquiry.id,
          at: enquiry.createdAt,
          name: enquiry.name,
          email: enquiry.email,
          project: enquiry.project,
          timeline: enquiry.timeline,
          message: enquiry.message,
          source: enquiry.source,
        },
      }),
      signal: controller.signal,
    });
    return { sent: response.ok, status: response.status };
  } catch (error) {
    return { sent: false, reason: error instanceof Error ? error.message : 'request failed' };
  } finally {
    clearTimeout(timer);
  }
}
