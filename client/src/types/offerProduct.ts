export interface OfferProduct {
  id: string;
  name: string;
  image: string;
  storeId: string; // 'ALL' or specific storeId (e.g. 'store001', 'store002')
  stock?: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt?: string;
}

export interface OfferItem {
  offerProductId: string;
  quantity: number;
}

export interface ProductOffer {
  enabled: boolean;
  title?: string;
  description?: string;
  status: 'active' | 'disabled';
  items: OfferItem[];
}
