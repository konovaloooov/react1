export type Category = 'cakes' | 'pastry' | 'cookies' | 'chocolate' | 'sets';

export type EntityId = string;

export interface Product {
  id: EntityId;
  name: string;
  category: Category;
  price: number;
  image: string;
  description: string;
  weight: string;
  rating: number;
  inStock: boolean;
  isHit?: boolean;
}

export type ProductFormData = Omit<Product, 'id' | 'rating' | 'isHit'> & {
  rating?: number;
  isHit?: boolean;
};

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderForm {
  customerName: string;
  phone: string;
  address: string;
  comment: string;
}

export interface Order extends OrderForm {
  id: EntityId;
  items: Array<{
    productId: EntityId;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  createdAt: string;
}

// export type SortType = 'popular' | 'priceAsc' | 'priceDesc';

export type UserRole = 'admin' | 'user';

export interface User {
  id: EntityId;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  name: string;
  phone: string;
}
