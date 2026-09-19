export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin';
}

export interface AdminStats {
  totalProducts: number;
  availableProducts: number;
  soldProducts: number;
  newIphones: number;
  usedIphones: number;
  accessoriesCount: number;
}
