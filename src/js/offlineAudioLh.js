// src/js/offlineAudioLh.js
// Administrador de descargas y caché offline para audios de la Liturgia de las Horas
// Basado en la arquitectura offline de Resucitó con CacheStorage y localStorage

const OFFLINE_AUDIO_CACHE = 'lh-audio-offline-cache';
const STORAGE_KEY_REGISTRY = 'lh_offline_audio_registry';

class OfflineAudioLhManager {
    constructor() {
        this.registry = this.loadRegistry();
        this.activeDownloads = new Set();
        this.blobUrlMap = new Map();
        this.initCacheVerification();
    }

    loadRegistry() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY_REGISTRY);
            if (raw) return JSON.parse(raw);
        } catch (e) {
            console.warn('[OfflineAudioLH] Error cargando registro offline:', e);
        }
        return {};
    }

    saveRegistry() {
        try {
            localStorage.setItem(STORAGE_KEY_REGISTRY, JSON.stringify(this.registry));
        } catch (e) {
            console.warn('[OfflineAudioLH] Error guardando registro offline:', e);
        }
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('lh_offline_audio_changed', {
                detail: { registry: this.registry }
            }));
        }
    }

    async initCacheVerification() {
        if (typeof caches === 'undefined') return;
        try {
            const cache = await caches.open(OFFLINE_AUDIO_CACHE);
            const keys = await cache.keys();
            const cachedUrls = new Set(keys.map(k => k.url));

            let changed = false;
            for (const [id, item] of Object.entries(this.registry)) {
                if (item && item.audioSrc) {
                    let fullUrl = item.audioSrc;
                    try {
                        fullUrl = new URL(item.audioSrc, window.location.origin).href;
                    } catch (e) {}
                    if (!cachedUrls.has(fullUrl) && !cachedUrls.has(item.audioSrc)) {
                        delete this.registry[id];
                        changed = true;
                    }
                }
            }
            if (changed) {
                this.saveRegistry();
            }
        } catch (e) {
            console.warn('[OfflineAudioLH] Error verificando caché offline:', e);
        }
    }

    isDownloaded(urlOrId) {
        if (!urlOrId) return false;
        const key = String(urlOrId);
        return !!this.registry[key];
    }

    isDownloading(urlOrId) {
        if (!urlOrId) return false;
        const key = String(urlOrId);
        return this.activeDownloads.has(key);
    }

    getItem(urlOrId) {
        if (!urlOrId) return null;
        return this.registry[String(urlOrId)] || null;
    }

    async downloadAudio({ id, title, audioSrc, modo = '' }) {
        if (!audioSrc) {
            throw new Error('No hay URL de audio disponible para descargar');
        }
        const key = String(id || audioSrc);
        if (this.activeDownloads.has(key)) return false;

        this.activeDownloads.add(key);
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('lh_offline_audio_changed', {
                detail: { id: key, state: 'downloading' }
            }));
        }

        try {
            let safeSrc = audioSrc;
            try {
                safeSrc = encodeURI(decodeURI(safeSrc));
            } catch (e) {
                safeSrc = encodeURI(safeSrc);
            }

            const response = await fetch(safeSrc, { mode: 'cors' });
            if (!response.ok) {
                throw new Error(`El servidor respondió con error (${response.status})`);
            }

            if (typeof caches !== 'undefined') {
                const cache = await caches.open(OFFLINE_AUDIO_CACHE);
                await cache.put(safeSrc, response.clone());
                try {
                    const fullUrl = new URL(safeSrc, window.location.origin).href;
                    if (fullUrl !== safeSrc) {
                        await cache.put(fullUrl, response.clone());
                    }
                } catch (e) {}
            }

            const contentLength = response.headers.get('content-length');
            const sizeBytes = contentLength ? parseInt(contentLength, 10) : 0;

            this.registry[key] = {
                id: key,
                title: title || 'Audio Litúrgico',
                audioSrc: safeSrc,
                modo: modo || '',
                sizeBytes,
                downloadedAt: Date.now()
            };
            this.saveRegistry();
            return true;
        } finally {
            this.activeDownloads.delete(key);
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('lh_offline_audio_changed', {
                    detail: { id: key, state: 'idle' }
                }));
            }
        }
    }

    async deleteAudio(urlOrId) {
        if (!urlOrId) return false;
        const key = String(urlOrId);
        const item = this.registry[key];
        const audioSrc = item ? item.audioSrc : key;

        delete this.registry[key];
        this.saveRegistry();

        if (audioSrc && this.blobUrlMap.has(audioSrc)) {
            try {
                URL.revokeObjectURL(this.blobUrlMap.get(audioSrc));
                this.blobUrlMap.delete(audioSrc);
            } catch (e) {}
        }

        if (typeof caches !== 'undefined' && audioSrc) {
            try {
                const cache = await caches.open(OFFLINE_AUDIO_CACHE);
                await cache.delete(audioSrc);
                try {
                    const fullUrl = new URL(audioSrc, window.location.origin).href;
                    await cache.delete(fullUrl);
                } catch (e) {}
            } catch (e) {
                console.warn('[OfflineAudioLH] Error al borrar de caché offline:', e);
            }
        }

        return true;
    }

    async getPlayableAudioUrl(audioSrc) {
        if (!audioSrc) return audioSrc;
        if (typeof caches === 'undefined') return audioSrc;

        try {
            if (this.blobUrlMap.has(audioSrc)) {
                return this.blobUrlMap.get(audioSrc);
            }

            const cache = await caches.open(OFFLINE_AUDIO_CACHE);
            let match = await cache.match(audioSrc);
            if (!match) {
                try {
                    match = await cache.match(new URL(audioSrc, window.location.origin).href);
                } catch (e) {}
            }

            if (match) {
                const blob = await match.blob();
                if (blob && blob.size > 0) {
                    if (this.blobUrlMap.size > 15) {
                        const oldestKey = this.blobUrlMap.keys().next().value;
                        try {
                            URL.revokeObjectURL(this.blobUrlMap.get(oldestKey));
                        } catch (e) {}
                        this.blobUrlMap.delete(oldestKey);
                    }

                    const objUrl = URL.createObjectURL(blob);
                    this.blobUrlMap.set(audioSrc, objUrl);
                    return objUrl;
                }
            }
        } catch (e) {
            console.warn('[OfflineAudioLH] Aviso al recuperar audio offline:', e);
        }

        return audioSrc;
    }
}

export const offlineAudioLh = new OfflineAudioLhManager();

if (typeof window !== 'undefined') {
    window.OfflineAudioLh = offlineAudioLh;
}
