import { useState, useEffect, useCallback } from 'react';
import type { CategoryItem } from '../types/category';
import { CategoryService } from '../services/categories';

export function useCategories() {
  const [categories, setCategories] = useState<CategoryItem[]>(() => CategoryService.getCategoriesSync());
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await CategoryService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();

    const handleCategoriesUpdated = () => {
      fetchCategories();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('mstore_categories_updated', handleCategoriesUpdated);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('mstore_categories_updated', handleCategoriesUpdated);
      }
    };
  }, [fetchCategories]);

  const activeCategories = categories.filter((c) => c.status === 'active');

  return {
    categories,
    activeCategories,
    loading,
    refreshCategories: fetchCategories,
  };
}
