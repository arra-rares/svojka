import type { GalleryEventPublic } from '@/types/gallery';

const useStaticGallery = import.meta.env.PROD;

export async function fetchGalleryEvents(): Promise<GalleryEventPublic[]> {
  if (!useStaticGallery) {
    const response = await fetch('/api/gallery/events');
    if (!response.ok) {
      throw new Error('Unable to load gallery events.');
    }
    const data = (await response.json()) as { events: GalleryEventPublic[] };
    return data.events;
  }

  const response = await fetch('/data/gallery-events.json');
  if (!response.ok) {
    throw new Error('Unable to load gallery events.');
  }
  const data = (await response.json()) as { events: GalleryEventPublic[] };
  return data.events;
}

export async function verifyGalleryAccess(
  eventId: string,
  password: string,
): Promise<string | null> {
  if (!useStaticGallery) {
    const response = await fetch('/api/gallery/access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: eventId, password }),
    });
    if (!response.ok) {
      return null;
    }
    const data = (await response.json()) as { fotoshareUrl: string };
    return data.fotoshareUrl;
  }

  const response = await fetch('/data/gallery-access.json');
  if (!response.ok) {
    return null;
  }
  const data = (await response.json()) as {
    events: Array<{ id: string; password: string; fotoshareUrl: string }>;
  };
  const match = data.events.find((event) => event.id === eventId && event.password === password);
  return match?.fotoshareUrl ?? null;
}
