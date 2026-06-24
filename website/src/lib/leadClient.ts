import type { LeadPayload } from '@/types/lead';

const leadEndpoint = import.meta.env.PROD ? '/api/lead.php' : '/api/lead';

export async function submitLead(payload: LeadPayload): Promise<void> {
  const response = await fetch(leadEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const raw = await response.text();
  let data: { ok?: boolean; error?: string } = {};
  try {
    data = raw ? (JSON.parse(raw) as { ok?: boolean; error?: string }) : {};
  } catch {
    throw new Error(
      response.ok
        ? 'Invalid response from server.'
        : `Server error (${response.status}). Check that api/lead.php is deployed.`,
    );
  }

  if (!response.ok || !data.ok) {
    throw new Error(data.error ?? `Unable to send request (${response.status}).`);
  }
}
