import React, { createContext, useContext, useState, useEffect } from 'react';
import type { StoreSettings } from '../types/settings';
import { SettingsService, DEFAULT_SETTINGS } from '../services/settings';

interface SettingsContextType {
  settings: StoreSettings;
  loading: boolean;
  whatsappCleanNumber: string;
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<StoreSettings>;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULT_SETTINGS,
  loading: false,
  whatsappCleanNumber: '918891003031',
  updateSettings: async () => DEFAULT_SETTINGS,
  refreshSettings: async () => {},
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StoreSettings>(() => SettingsService.getSettingsSync());
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await SettingsService.getSettings();
      setSettings(data);
    } catch (err) {
      console.error('Error fetching settings in context:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();

    const handleLocalUpdate = (e: any) => {
      if (e.detail) {
        setSettings(e.detail);
      } else {
        fetchSettings();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('mstore_settings_updated', handleLocalUpdate);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('mstore_settings_updated', handleLocalUpdate);
      }
    };
  }, []);

  const updateSettings = async (newSettings: Partial<StoreSettings>): Promise<StoreSettings> => {
    const updated = await SettingsService.updateSettings(newSettings);
    setSettings(updated);
    return updated;
  };

  const whatsappCleanNumber = (settings.whatsappNumber || '918891003031').replace(/\D/g, '');

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        whatsappCleanNumber,
        updateSettings,
        refreshSettings: fetchSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
