import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { GALLERY_EVENT_TYPES, type GalleryEvent, type GalleryEventType } from '@/types/gallery';

const ADMIN_ROUTE = '/manage-events-9xk2';

type EventFormState = {
  id?: string;
  name: string;
  type: GalleryEventType;
  date: string;
  password: string;
  fotoshareUrl: string;
  visible: boolean;
};

const defaultFormState: EventFormState = {
  name: '',
  type: 'wedding',
  date: '',
  password: '',
  fotoshareUrl: '',
  visible: true,
};

type AdminPageProps = {
  onBackHome: () => void;
};

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Unable to read image file.'));
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        reject(new Error('Unexpected file reader output.'));
        return;
      }
      const comma = result.indexOf(',');
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.readAsDataURL(file);
  });
}

export function AdminPage({ onBackHome }: AdminPageProps) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [events, setEvents] = useState<GalleryEvent[]>([]);
  const [form, setForm] = useState<EventFormState>(defaultFormState);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [replaceImage, setReplaceImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const isEditing = Boolean(form.id);

  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => b.date.localeCompare(a.date)),
    [events],
  );

  async function loadSession() {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/session');
      if (!response.ok) {
        setAuthenticated(false);
        return;
      }
      const data = (await response.json()) as { authenticated: boolean };
      setAuthenticated(Boolean(data.authenticated));
    } finally {
      setLoading(false);
    }
  }

  async function loadEvents() {
    const response = await fetch('/api/admin/events');
    if (!response.ok) {
      throw new Error('Failed to load events.');
    }
    const data = (await response.json()) as { events: GalleryEvent[] };
    setEvents(data.events);
  }

  useEffect(() => {
    void loadSession();
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    void loadEvents().catch((err: unknown) => {
      setError(err instanceof Error ? err.message : 'Failed to load events.');
    });
  }, [authenticated]);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoginError('');
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: loginPassword }),
    });
    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      setLoginError(data.error ?? 'Invalid password.');
      return;
    }
    setAuthenticated(true);
    setLoginPassword('');
    await loadEvents();
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    setAuthenticated(false);
    setEvents([]);
    setForm(defaultFormState);
    setCoverImageFile(null);
  }

  function startEdit(event: GalleryEvent) {
    setForm({
      id: event.id,
      name: event.name,
      type: event.type,
      date: event.date,
      password: event.password,
      fotoshareUrl: event.fotoshareUrl,
      visible: event.visible,
    });
    setReplaceImage(false);
    setCoverImageFile(null);
    setError('');
    setFeedback('');
  }

  function resetForm() {
    setForm(defaultFormState);
    setCoverImageFile(null);
    setReplaceImage(false);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setFeedback('');
    try {
      const payload: Record<string, unknown> = {
        name: form.name.trim(),
        type: form.type,
        date: form.date,
        password: form.password,
        fotoshareUrl: form.fotoshareUrl.trim(),
        visible: form.visible,
      };

      if (coverImageFile) {
        payload.coverImageUpload = {
          fileName: coverImageFile.name,
          mimeType: coverImageFile.type,
          dataBase64: await readFileAsBase64(coverImageFile),
        };
        payload.replaceCoverImage = true;
      } else if (replaceImage) {
        throw new Error('Select an image file to replace the current cover image.');
      }

      const endpoint = isEditing ? `/api/admin/events/${form.id}` : '/api/admin/events';
      const method = isEditing ? 'PUT' : 'POST';
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? 'Save failed.');
      }
      await loadEvents();
      resetForm();
      setFeedback(isEditing ? 'Event updated.' : 'Event created.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  async function handleSoftDelete(eventId: string) {
    setError('');
    setFeedback('');
    const response = await fetch(`/api/admin/events/${eventId}`, { method: 'DELETE' });
    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? 'Unable to hide event.');
      return;
    }
    await loadEvents();
    setFeedback('Event hidden.');
  }

  if (loading) {
    return <div className="min-h-screen bg-white p-6 text-[#111111]">Loading admin...</div>;
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-[420px] bg-white rounded-xl border border-[#EAEAEA] p-6 space-y-4"
        >
          <div className="text-[22px] font-semibold text-[#111111]">Admin Login</div>
          <div className="text-[14px] text-[#6B6B6B]">{ADMIN_ROUTE}</div>
          <input
            type="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            placeholder="Admin password"
            className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#111111]"
          />
          {loginError ? <div className="text-[12px] text-red-500">{loginError}</div> : null}
          <button
            type="submit"
            className="w-full px-4 py-3 bg-[#111111] text-white rounded-lg hover:bg-black transition-colors"
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-4 md:p-6">
      <div className="max-w-[1200px] mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-[24px] font-semibold text-[#111111]">Manage Gallery Events</h1>
            <p className="text-[13px] text-[#6B6B6B]">{ADMIN_ROUTE}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBackHome}
              className="px-4 py-2 border border-[#EAEAEA] text-[#111111] rounded-lg hover:bg-white"
            >
              Back to site
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 bg-[#111111] text-white rounded-lg hover:bg-black"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6">
          <section className="bg-white rounded-xl border border-[#EAEAEA] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[18px] font-medium text-[#111111]">Events</h2>
              <span className="text-[12px] text-[#6B6B6B]">{sortedEvents.length} total</span>
            </div>
            <div className="space-y-3 max-h-[70vh] overflow-auto pr-1">
              {sortedEvents.map((event) => (
                <div key={event.id} className="border border-[#EAEAEA] rounded-lg p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[15px] font-medium text-[#111111]">{event.name}</div>
                      <div className="text-[12px] text-[#6B6B6B]">{event.date}</div>
                      <div className="text-[12px] text-[#6B6B6B]">{event.type}</div>
                    </div>
                    <span
                      className={`text-[11px] px-2 py-1 rounded ${
                        event.visible ? 'bg-[#EEF8EE] text-[#2E7D32]' : 'bg-[#F4F4F4] text-[#777777]'
                      }`}
                    >
                      {event.visible ? 'visible' : 'hidden'}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(event)}
                      className="px-3 py-1.5 border border-[#EAEAEA] rounded text-[12px] hover:bg-[#FAFAFA]"
                    >
                      Edit
                    </button>
                    {event.visible ? (
                      <button
                        type="button"
                        onClick={() => void handleSoftDelete(event.id)}
                        className="px-3 py-1.5 border border-[#EAEAEA] rounded text-[12px] hover:bg-[#FAFAFA]"
                      >
                        Hide
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
              {sortedEvents.length === 0 ? (
                <div className="text-[13px] text-[#6B6B6B]">No events yet.</div>
              ) : null}
            </div>
          </section>

          <section className="bg-white rounded-xl border border-[#EAEAEA] p-5">
            <h2 className="text-[18px] font-medium text-[#111111] mb-4">
              {isEditing ? `Edit Event (${form.id})` : 'Create Event'}
            </h2>
            <form onSubmit={handleSave} className="space-y-3">
              <input
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Event name"
                className="w-full px-3 py-2 border border-[#EAEAEA] rounded-lg"
                required
              />
              <select
                value={form.type}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, type: e.target.value as GalleryEventType }))
                }
                className="w-full px-3 py-2 border border-[#EAEAEA] rounded-lg"
              >
                {GALLERY_EVENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-[#EAEAEA] rounded-lg"
                required
              />
              <input
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="Event password"
                className="w-full px-3 py-2 border border-[#EAEAEA] rounded-lg"
                required
              />
              <input
                value={form.fotoshareUrl}
                onChange={(e) => setForm((prev) => ({ ...prev, fotoshareUrl: e.target.value }))}
                placeholder="https://fotoshare.co/e/..."
                className="w-full px-3 py-2 border border-[#EAEAEA] rounded-lg"
                required
              />
              <label className="flex items-center gap-2 text-[13px] text-[#111111]">
                <input
                  type="checkbox"
                  checked={form.visible}
                  onChange={(e) => setForm((prev) => ({ ...prev, visible: e.target.checked }))}
                />
                Visible in public gallery
              </label>
              {isEditing ? (
                <label className="flex items-center gap-2 text-[13px] text-[#111111]">
                  <input
                    type="checkbox"
                    checked={replaceImage}
                    onChange={(e) => setReplaceImage(e.target.checked)}
                  />
                  Replace cover image
                </label>
              ) : null}
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={(e) => setCoverImageFile(e.target.files?.[0] ?? null)}
                className="w-full text-[13px]"
                required={!isEditing}
              />

              {error ? <div className="text-[12px] text-red-500">{error}</div> : null}
              {feedback ? <div className="text-[12px] text-[#2E7D32]">{feedback}</div> : null}

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-[#111111] text-white rounded-lg hover:bg-black disabled:opacity-60"
                >
                  {saving ? 'Saving...' : isEditing ? 'Save changes' : 'Create event'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-[#EAEAEA] rounded-lg hover:bg-[#FAFAFA]"
                >
                  Reset
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
