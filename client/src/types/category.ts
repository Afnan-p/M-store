export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  link?: string;
  type?: string;
  description?: string;
  status: 'active' | 'inactive';
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}
