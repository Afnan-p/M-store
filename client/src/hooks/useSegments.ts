import { useState, useEffect } from 'react';
import type { IPhoneSegment } from '../types/product';
import { SegmentService } from '../services/segments';

export function useSegments() {
  const [segments, setSegments] = useState<IPhoneSegment[]>(() => {
    return SegmentService.getSegmentsSync();
  });
  const [loading, setLoading] = useState<boolean>(() => {
    return SegmentService.getSegmentsSync().length === 0;
  });

  const refreshSegments = async (showLoading: boolean = false) => {
    if (showLoading && segments.length === 0) {
      setLoading(true);
    }
    const data = await SegmentService.getSegments();
    if (data && JSON.stringify(data) !== JSON.stringify(segments)) {
      setSegments(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshSegments(false);

    const handleUpdate = () => {
      refreshSegments(false);
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('mstore_segments_updated', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('mstore_segments_updated', handleUpdate);
    };
  }, []);

  const activeSegments = segments.filter((s) => s.isActive !== false);

  const newSegments = activeSegments.filter(
    (s) => s.categoryType === 'NEW' || s.categoryType === 'BOTH'
  );

  const usedSegments = activeSegments.filter(
    (s) => s.categoryType === 'USED' || s.categoryType === 'BOTH'
  );

  return {
    segments,
    activeSegments,
    newSegments,
    usedSegments,
    loading,
    refreshSegments,
  };
}
