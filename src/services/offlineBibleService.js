/**
 * Offline Bible Service
 *
 * Handles downloading and storing Bible translations for offline reading.
 * Uses IndexedDB for efficient storage of large Bible texts.
 */

// IndexedDB database name and version
const DB_NAME = 'SwordDrillBible';
const DB_VERSION = 1;
const STORE_NAME = 'translations';

/**
 * Initialize IndexedDB
 */
export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Create object store for translations if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        objectStore.createIndex('name', 'name', { unique: false });
        objectStore.createIndex('downloadedAt', 'downloadedAt', { unique: false });
      }
    };
  });
};

/**
 * Available Bible translations for download
 */
export const AVAILABLE_TRANSLATIONS = [
  {
    id: 'kjv',
    name: 'King James Version (KJV)',
    abbreviation: 'KJV',
    description: 'Classic English translation from 1611',
    size: '12.7 MB',
    url: `${process.env.PUBLIC_URL || ''}/bibles/kjv.json`,
    language: 'English',
    year: 1611
  },
  {
    id: 'asv',
    name: 'American Standard Version (ASV)',
    abbreviation: 'ASV',
    description: 'American revision of the KJV from 1901',
    size: '12.6 MB',
    url: `${process.env.PUBLIC_URL || ''}/bibles/asv.json`,
    language: 'English',
    year: 1901
  },
  {
    id: 'web',
    name: 'World English Bible (WEB)',
    abbreviation: 'WEB',
    description: 'Modern English public domain translation',
    size: '12.4 MB',
    url: `${process.env.PUBLIC_URL || ''}/bibles/web.json`,
    language: 'English',
    year: 2000
  },
  {
    id: 'ylt',
    name: "Young's Literal Translation (YLT)",
    abbreviation: 'YLT',
    description: 'Literal word-for-word translation from 1898',
    size: '4.5 MB',
    url: `${process.env.PUBLIC_URL || ''}/bibles/ylt.json`,
    language: 'English',
    year: 1898
  }
];

/**
 * Download a Bible translation with progress tracking
 * @param {string} translationId - ID of the translation to download
 * @param {Function} onProgress - Callback for progress updates (0-100)
 * @returns {Promise<Object>} - Downloaded translation data
 */
export const downloadTranslation = async (translationId, onProgress) => {
  const translation = AVAILABLE_TRANSLATIONS.find(t => t.id === translationId);

  if (!translation) {
    throw new Error('Translation not found');
  }

  try {
    // Fetch with progress tracking
    const response = await fetch(translation.url);

    if (!response.ok) {
      throw new Error(`Failed to download: ${response.statusText}`);
    }

    const contentLength = response.headers.get('content-length');
    const total = parseInt(contentLength, 10);

    let loaded = 0;
    const reader = response.body.getReader();
    const chunks = [];

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      chunks.push(value);
      loaded += value.length;

      if (total && onProgress) {
        const progress = Math.round((loaded / total) * 100);
        onProgress(progress);
      }
    }

    // Combine chunks
    const chunksAll = new Uint8Array(loaded);
    let position = 0;
    for (const chunk of chunks) {
      chunksAll.set(chunk, position);
      position += chunk.length;
    }

    // Convert to text and parse JSON
    const text = new TextDecoder('utf-8').decode(chunksAll);
    const data = JSON.parse(text);

    // Store in IndexedDB
    const translationData = {
      id: translationId,
      name: translation.name,
      abbreviation: translation.abbreviation,
      description: translation.description,
      language: translation.language,
      year: translation.year,
      data: data,
      downloadedAt: Date.now(),
      size: loaded
    };

    await saveTranslation(translationData);

    if (onProgress) {
      onProgress(100);
    }

    return translationData;
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
};

/**
 * Save translation to IndexedDB
 */
const saveTranslation = async (translationData) => {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(translationData);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Get a downloaded translation from IndexedDB
 */
export const getTranslation = async (translationId) => {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(translationId);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Get all downloaded translations
 */
export const getAllDownloadedTranslations = async () => {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Check if a translation is downloaded
 */
export const isTranslationDownloaded = async (translationId) => {
  try {
    const translation = await getTranslation(translationId);
    return !!translation;
  } catch (error) {
    console.error('Error checking translation:', error);
    return false;
  }
};

/**
 * Delete a downloaded translation
 */
export const deleteTranslation = async (translationId) => {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(translationId);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

/**
 * Get storage usage information
 */
export const getStorageInfo = async () => {
  if (!navigator.storage || !navigator.storage.estimate) {
    return { usage: 0, quota: 0, percentage: 0 };
  }

  try {
    const estimate = await navigator.storage.estimate();
    return {
      usage: estimate.usage || 0,
      quota: estimate.quota || 0,
      percentage: estimate.quota ? Math.round((estimate.usage / estimate.quota) * 100) : 0,
      usageMB: ((estimate.usage || 0) / (1024 * 1024)).toFixed(2),
      quotaMB: ((estimate.quota || 0) / (1024 * 1024)).toFixed(2)
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return { usage: 0, quota: 0, percentage: 0 };
  }
};

/**
 * Format bytes to human readable size
 */
export const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export default {
  initDB,
  downloadTranslation,
  getTranslation,
  getAllDownloadedTranslations,
  isTranslationDownloaded,
  deleteTranslation,
  getStorageInfo,
  formatBytes,
  AVAILABLE_TRANSLATIONS
};
