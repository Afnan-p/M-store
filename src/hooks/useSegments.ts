import { useState, useEffect } from 'react';
import type { IPhoneSegment } from '../types/product';
import { SegmentService } from '../services/segments';

export function useSegments() {
  const [segments, setSegments] = useState<IPhoneSegment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshSegments = async () => {
    setLoading(true);
    const data = await SegmentService.getSegments();
    setSegments(data);
    setLoading(false);
  };

  useEffect(() => {
    refreshSegments();
  }, []);

  const newSegments = segments.filter(
    (s) => s.isActive && (s.categoryType === 'NEW' || s.categoryType === 'BOTH')
  );

  const usedSegments = segments.filter(
    (s) => s.isActive && (s.categoryType === 'USED' || s.categoryType === 'BOTH')
  );

  return {
    segments,
    newSegments,
    usedSegments,
    loading,
    refreshSegments,
  };
}
