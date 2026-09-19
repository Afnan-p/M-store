import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Store } from '../types/store';
import { StoreService } from '../services/stores';

interface StoreContextType {
  activeStoreId: string; // 'ALL' or store ID (e.g. 'store001')
  activeStore: Store | null;
  stores: Store[];
  loading: boolean;
  setActiveStoreId: (id: string) => void;
  refreshStores: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const LOCAL_STORAGE_ACTIVE_STORE_KEY = 'mstore_active_store_id';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stores, setStores] = useState<Store[]>(() => {
    return StoreService.getStoresSync();
  });
  const [loading, setLoading] = useState<boolean>(() => {
    const initial = StoreService.getStoresSync();
    return initial.length === 0;
  });

  // Initialize activeStoreId from URL query param `?store=...` or localStorage or fallback 'ALL'
  const [activeStoreId, setActiveStoreIdState] = useState<string>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlStore = urlParams.get('store');
      if (urlStore) {
        return urlStore;
      }
      const savedStore = localStorage.getItem(LOCAL_STORAGE_ACTIVE_STORE_KEY);
      if (savedStore) {
        return savedStore;
      }
    } catch {
      // Ignore URL parsing errors
    }
    return 'ALL';
  });

  const refreshStores = useCallback(async () => {
    const data = await StoreService.getStores();
    if (data && data.length > 0) {
      setStores(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshStores();
  }, [refreshStores]);

  // Sync state changes to localStorage and optionally URL parameter
  const setActiveStoreId = useCallback((id: string) => {
    setActiveStoreIdState(id);
    try {
      localStorage.setItem(LOCAL_STORAGE_ACTIVE_STORE_KEY, id);
      
      // Update URL search param seamlessly without full page reload
      const url = new URL(window.location.href);
      if (id === 'ALL') {
        url.searchParams.delete('store');
      } else {
        url.searchParams.set('store', id);
      }
      window.history.replaceState({}, '', url.toString());
    } catch (err) {
      console.error('Failed to sync store context:', err);
    }
  }, []);

  // Compute active store object
  const activeStore = activeStoreId === 'ALL'
    ? null
    : stores.find((s) => s.id === activeStoreId) || null;

  return (
    <StoreContext.Provider
      value={{
        activeStoreId,
        activeStore,
        stores,
        loading,
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
