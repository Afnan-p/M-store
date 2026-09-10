import type { IPhoneSegment } from '../types/product';

const SEGMENTS_STORAGE_KEY = 'mstore_iphone_segments_v1';

export const DEFAULT_SEGMENTS: IPhoneSegment[] = [
  {
    id: 'seg_16pro',
    name: 'iPhone 16 Pro',
    slug: 'iphone-16-pro',
    thumbnail: '/images/featured-p5-desert.jpg',
    categoryType: 'BOTH',
    displayOrder: 1,
    isActive: true,
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-01T00:00:00Z',
  },
  {
    id: 'seg_16',
    name: 'iPhone 16',
    slug: 'iphone-16',
    thumbnail: '/images/featured-p4-blue.jpg',
    categoryType: 'BOTH',
    displayOrder: 2,
    isActive: true,
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-01T00:00:00Z',
  },
  {
    id: 'seg_15promax',
    name: 'iPhone 15 Pro Max',
    slug: 'iphone-15-pro-max',
    thumbnail: '/images/featured-p7-row2.jpg',
    categoryType: 'BOTH',
    displayOrder: 3,
    isActive: true,
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-01T00:00:00Z',
  },
  {
    id: 'seg_15pro',
    name: 'iPhone 15 Pro',
    slug: 'iphone-15-pro',
    thumbnail: '/images/featured-p1-natural.jpg',
    categoryType: 'BOTH',
    displayOrder: 4,
    isActive: true,
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-01T00:00:00Z',
  },
  {
    id: 'seg_15',
    name: 'iPhone 15',
    slug: 'iphone-15',
    thumbnail: '/images/featured-p2-black.jpg',
    categoryType: 'BOTH',
    displayOrder: 5,
    isActive: true,
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-01T00:00:00Z',
  },
  {
    id: 'seg_14pro',
    name: 'iPhone 14 Pro',
    slug: 'iphone-14-pro',
    thumbnail: '/images/featured-p3-purple.jpg',
    categoryType: 'BOTH',
    displayOrder: 6,
    isActive: true,
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-01T00:00:00Z',
  },
  {
    id: 'seg_14',
    name: 'iPhone 14',
    slug: 'iphone-14',
    thumbnail: '/images/featured-p4-blue.jpg',
    categoryType: 'BOTH',
    displayOrder: 7,
    isActive: true,
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-01T00:00:00Z',
  },
  {
    id: 'seg_13pro',
    name: 'iPhone 13 Pro',
    slug: 'iphone-13-pro',
    thumbnail: '/images/featured-p5-row2.jpg',
    categoryType: 'BOTH',
    displayOrder: 8,
    isActive: true,
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-01T00:00:00Z',
  },
  {
    id: 'seg_13',
    name: 'iPhone 13',
    slug: 'iphone-13',
    thumbnail: '/images/featured-p6-row2.jpg',
    categoryType: 'BOTH',
    displayOrder: 9,
    isActive: true,
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-01T00:00:00Z',
  },
  {
    id: 'seg_12',
    name: 'iPhone 12',
    slug: 'iphone-12',
    thumbnail: '/images/featured-p8-row2.jpg',
    categoryType: 'BOTH',
    displayOrder: 10,
    isActive: true,
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-01T00:00:00Z',
  },
  {
    id: 'seg_11',
    name: 'iPhone 11',
    slug: 'iphone-11',
    thumbnail: '/images/featured-p4-blue.jpg',
    categoryType: 'BOTH',
    displayOrder: 11,
    isActive: true,
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-01T00:00:00Z',
  },
];

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function loadSegmentsFromStorage(): IPhoneSegment[] {
  try {
    const data = localStorage.getItem(SEGMENTS_STORAGE_KEY);
    if (data) {
      const parsed: IPhoneSegment[] = JSON.parse(data);
      // Ensure all segments have categoryType BOTH so model lists are equal
      let updated = false;
      parsed.forEach((item) => {
        if (item.categoryType !== 'BOTH') {
          item.categoryType = 'BOTH';
          updated = true;
        }
      });
      // Check if iPhone 11 exists
      if (!parsed.some((item) => item.slug === 'iphone-11')) {
        parsed.push({
          id: 'seg_11',
          name: 'iPhone 11',
          slug: 'iphone-11',
          thumbnail: '/images/featured-p4-blue.jpg',
          categoryType: 'BOTH',
          displayOrder: 11,
          isActive: true,
          createdAt: '2026-09-01T00:00:00Z',
          updatedAt: '2026-09-01T00:00:00Z',
        });
        updated = true;
      }
      if (updated) {
        localStorage.setItem(SEGMENTS_STORAGE_KEY, JSON.stringify(parsed));
      }
      return parsed;
    }
  } catch (err) {
    console.error('Failed to load segments from localStorage:', err);
  }
  localStorage.setItem(SEGMENTS_STORAGE_KEY, JSON.stringify(DEFAULT_SEGMENTS));
  return DEFAULT_SEGMENTS;
}

function saveSegmentsToStorage(segments: IPhoneSegment[]): void {
  try {
    localStorage.setItem(SEGMENTS_STORAGE_KEY, JSON.stringify(segments));
  } catch (err) {
    console.error('Failed to save segments to localStorage:', err);
  }
}

export const SegmentService = {
  async getSegments(): Promise<IPhoneSegment[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const segments = loadSegmentsFromStorage();
        segments.sort((a, b) => a.displayOrder - b.displayOrder);
        resolve(segments);
      }, 50);
    });
  },

  async getSegmentsForCategory(type: 'NEW' | 'USED'): Promise<IPhoneSegment[]> {
    const all = await this.getSegments();
    return all.filter(
      (s) => s.isActive && (s.categoryType === 'BOTH' || s.categoryType === type)
    );
  },

  async addSegment(segmentData: {
    name: string;
    thumbnail: string;
    categoryType: 'NEW' | 'USED' | 'BOTH';
    displayOrder?: number;
    isActive?: boolean;
  }): Promise<IPhoneSegment> {
    const segments = loadSegmentsFromStorage();
    const slug = slugify(segmentData.name);
    const newSegment: IPhoneSegment = {
      id: 'seg_' + Date.now(),
      name: segmentData.name,
      slug,
      thumbnail: segmentData.thumbnail || '/images/featured-p1-natural.jpg',
      categoryType: segmentData.categoryType,
      displayOrder: segmentData.displayOrder || segments.length + 1,
      isActive: segmentData.isActive ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [...segments, newSegment];
    saveSegmentsToStorage(updated);
    return newSegment;
  },

  async updateSegment(id: string, updates: Partial<IPhoneSegment>): Promise<IPhoneSegment | null> {
    const segments = loadSegmentsFromStorage();
    const index = segments.findIndex((s) => s.id === id);
    if (index === -1) return null;

    if (updates.name && !updates.slug) {
      updates.slug = slugify(updates.name);
    }

    const updated = {
      ...segments[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    segments[index] = updated;
    saveSegmentsToStorage(segments);
    return updated;
  },

  async deleteSegment(id: string): Promise<boolean> {
    const segments = loadSegmentsFromStorage();
    const filtered = segments.filter((s) => s.id !== id);
    if (filtered.length === segments.length) return false;
    saveSegmentsToStorage(filtered);
    return true;
  },

  async toggleSegmentStatus(id: string): Promise<IPhoneSegment | null> {
    const segments = loadSegmentsFromStorage();
    const index = segments.findIndex((s) => s.id === id);
    if (index === -1) return null;
    segments[index].isActive = !segments[index].isActive;
    segments[index].updatedAt = new Date().toISOString();
    saveSegmentsToStorage(segments);
    return segments[index];
  },

  async moveSegment(id: string, direction: 'up' | 'down'): Promise<IPhoneSegment[]> {
    const segments = loadSegmentsFromStorage();
    segments.sort((a, b) => a.displayOrder - b.displayOrder);
    const index = segments.findIndex((s) => s.id === id);
    if (index === -1) return segments;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= segments.length) return segments;

    // Swap display order
    const tempOrder = segments[index].displayOrder;
    segments[index].displayOrder = segments[targetIndex].displayOrder;
    segments[targetIndex].displayOrder = tempOrder;

    saveSegmentsToStorage(segments);
    return segments;
  },
};
