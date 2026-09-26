import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Store } from '../types/store';
import { StoreService } from '../services/stores';

interface StoreContextType {
  activeStoreId: string;
  activeStore: Store | null;
  stores: Store[];
  loading: boolean;
  isMultiStoreEnabled: boolean;
  setIsMultiStoreEnabled: (enabled: boolean) => void;
  setActiveStoreId: (id: string) => void;
  refreshStores: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stores, setStores] = useState<Store[]>(() => StoreService.getStoresSync());
  const [loading, setLoading] = useState<boolean>(false);
  const [activeStoreId, setActiveStoreIdState] = useState<string>('ALL');

  const isMultiStoreEnabled = false;

  const setIsMultiStoreEnabled = useCallback((_enabled: boolean) => {
    // No-op for single store mode
  }, []);

  const refreshStores = useCallback(async () => {
    try {
      setLoading(true);
      const updatedStores = await StoreService.getStores();
      setStores(updatedStores);
    } catch (err) {
      console.error('Failed to refresh stores in context:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshStores();

    const handleStoresUpdated = () => {
      refreshStores();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('mstore_stores_updated', handleStoresUpdated);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('mstore_stores_updated', handleStoresUpdated);
      }
    };
  }, [refreshStores]);

  const setActiveStoreId = useCallback((id: string) => {
    setActiveStoreIdState(id);
  }, []);

  const activeStore = stores.find((s) => s.id === activeStoreId) || null;

  return (
    <StoreContext.Provider
      value={{
        activeStoreId,
        activeStore,
        stores,
        loading,
        isMultiStoreEnabled,
        setIsMultiStoreEnabled,
        setActiveStoreId,
        refreshStores,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
