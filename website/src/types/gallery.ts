export const GALLERY_EVENT_TYPES = [
  'wedding',
  'corporate',
  'party',
  'stuzkova',
  'other',
] as const;

export type GalleryEventType = (typeof GALLERY_EVENT_TYPES)[number];

export type GalleryEvent = {
  id: string;
  name: string;
  type: GalleryEventType;
  date: string; // YYYY-MM-DD
  coverImage: string;
  password: string;
  fotoshareUrl: string;
  visible: boolean;
};

export type GalleryEventPublic = Omit<GalleryEvent, 'password'>;
