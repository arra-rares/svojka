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
    throw new Error(summarizeRawResponse(raw, response.status));
  }

  if (!response.ok || !data.ok) {
    throw new Error(data.error ?? `Unable to send request (${response.status}).`);
  }
}

function summarizeRawResponse(raw: string, status: number): string {
  const trimmed = raw.trim();
  if (!trimmed) {
    return `Server error (${status}) with empty response.`;
  }
  if (trimmed.startsWith('{')) {
    return `Server error (${status}).`;
  }
  const snippet = trimmed.replace(/\s+/g, ' ').slice(0, 160);
  return `Server error (${status}): ${snippet}`;
}
