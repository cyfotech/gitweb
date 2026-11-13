const CHANNEL_NAME = 'preferred-tax-cms-content';
const STORAGE_KEY = 'preferred-tax-cms-content-update';

export interface CmsContentUpdate {
  slug: string;
}

export function publishCmsContentUpdate(slug: string): void {
  const message: CmsContentUpdate = { slug };

  if ('BroadcastChannel' in window) {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.postMessage(message);
    channel.close();
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...message, timestamp: Date.now() }));
  } catch (error) {
    console.warn('[CMS] Could not persist cross-tab update signal:', error);
  }
}

export function subscribeToCmsContentUpdates(onUpdate: (update: CmsContentUpdate) => void): () => void {
  const handleMessage = (event: MessageEvent<CmsContentUpdate>) => {
    if (event.data && typeof event.data.slug === 'string') onUpdate(event.data);
  };
  const handleStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY || !event.newValue) return;
    try {
      const update = JSON.parse(event.newValue) as CmsContentUpdate;
      if (typeof update.slug === 'string') onUpdate(update);
    } catch (error) {
      console.warn('[CMS] Ignoring malformed cross-tab update signal:', error);
    }
  };

  const channel = 'BroadcastChannel' in window ? new BroadcastChannel(CHANNEL_NAME) : null;
  channel?.addEventListener('message', handleMessage);
  window.addEventListener('storage', handleStorage);

  return () => {
    channel?.removeEventListener('message', handleMessage);
    channel?.close();
    window.removeEventListener('storage', handleStorage);
  };
}
