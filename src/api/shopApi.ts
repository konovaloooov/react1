import axiosInstance from './axiosInstance';
import { EntityId, Order, OrderForm, Product, ProductFormData } from '../types/shop';

export async function getProducts(): Promise<Product[]> {
  const response = await axiosInstance.get<Product[]>('/products');
  return response.data;
}

export async function createOrder(order: OrderForm & Pick<Order, 'items' | 'total'>): Promise<Order> {
  const response = await axiosInstance.post<Order>('/orders', order);
  return response.data;
}

export async function getOrders(): Promise<Order[]> {
  const response = await axiosInstance.get<Order[]>('/orders');
  return response.data;
}

export async function createProduct(product: ProductFormData): Promise<Product> {
  const response = await axiosInstance.post<Product>('/products', product);
  return response.data;
}

export async function replaceProduct(product: Product): Promise<Product> {
  const response = await axiosInstance.put<Product>(`/products/${product.id}`, product);
  return response.data;
}

export async function updateProduct(id: EntityId, product: Partial<Product>): Promise<Product> {
  const response = await axiosInstance.patch<Product>(`/products/${id}`, product);
  return response.data;
}

export async function deleteProduct(id: EntityId): Promise<EntityId> {
  await axiosInstance.delete(`/products/${id}`);
  return id;
}
