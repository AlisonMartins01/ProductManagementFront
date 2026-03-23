export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductForm {
  name: string;
  description: string;
  price: number | null;
  stockQuantity: number | null;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProductFilter {
  name?: string;
  page: number;
  pageSize: number;
}
