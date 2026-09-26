import type { StoreSettings } from '../types/settings';
import { BRAND_CONFIG } from './config';

const STORAGE_KEY = 'mstore_settings_v1';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const DEFAULT_SETTINGS: StoreSettings = {
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || BRAND_CONFIG.whatsappNumber || '+91 88910 03031',
  phone: import.meta.env.VITE_STORE_PHONE || BRAND_CONFIG.phone || '+91 99463 36587',
  email: BRAND_CONFIG.email || 'admin@mstore.in',
  address: 'Kootanad, Palakkad',
  workingHours: '10:00 AM - 9:00 PM Daily',
  instagram: BRAND_CONFIG.instagram || 'https://instagram.com/m_store_official',
};

export const SettingsService = {
  getSettingsSync(): StoreSettings {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      // Ignore fallback
    }
    return DEFAULT_SETTINGS;
  },

  async getSettings(): Promise<StoreSettings> {
    try {
      const res = await fetch(`${API_URL}/settings`);
      if (res.ok) {
        const data = await res.json();
        const merged = { ...DEFAULT_SETTINGS, ...data };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        return merged;
      }
    } catch (err) {
      console.warn('API unavailable for settings, using local fallback:', err);
    }
    return this.getSettingsSync();
  },

  async updateSettings(newSettings: Partial<StoreSettings>): Promise<StoreSettings> {
    const current = this.getSettingsSync();
    const updated = { ...current, ...newSettings };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('mstore_settings_updated', { detail: updated }));
    }

    try {
      const res = await fetch(`${API_URL}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        const savedData = await res.json();
        const finalObj = { ...updated, ...savedData };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(finalObj));
        return finalObj;
      }
    } catch (err) {
      console.error('Failed updating backend settings, kept in local state:', err);
    }

    return updated;
  },
};
