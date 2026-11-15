// Cross-Device Cloud Sync Engine for Soumili's Makeover
// Synchronizes photos, packages, and settings across Laptop, Mobile, and all devices worldwide!

const KV_BUCKET = process.env.KV_BUCKET_ID || 'soumili_makeover_live_db_2026';
const KV_BASE_URL = `https://kvdb.io/${KV_BUCKET}`;

export async function syncCloudData(key: string, data: any): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${KV_BASE_URL}/${key}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    return res.ok;
  } catch (err) {
    // Graceful fallback when offline or in restricted sandbox
    return false;
  }
}

export async function loadCloudData<T>(key: string): Promise<T | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${KV_BASE_URL}/${key}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    if (!res.ok) return null;

    const text = await res.text();
    if (!text) return null;
    return JSON.parse(text) as T;
  } catch (err) {
    // Offline or network error fallback
    return null;
  }
}
