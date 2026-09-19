export interface Store {
  id: string;
  name: string;
  code: string; // e.g. "STORE-01"
  location: string; // e.g. "Main Road, Near Bus Stand, Kootanad"
  phone?: string;
  image?: string;
  maps?: string;
  status: 'active' | 'inactive';
  description?: string;
  createdAt: string;
  updatedAt: string;
}
