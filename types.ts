
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export enum UserRole {
  CUSTOMER = 'Customer',
  ADMIN = 'Admin',
}
