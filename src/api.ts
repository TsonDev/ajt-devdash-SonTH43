import type { Product, ProductListResponse } from './types.ts';

export async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Loi HTTP ${response.status}: ${response.statusText}`);
  }

  const data: T = await response.json();
  return data;
}

const BASE_URL = 'https://dummyjson.com';

export async function fetchProducts(): Promise<Product[]> {
  const result = await fetchJson<ProductListResponse>(`${BASE_URL}/products?limit=100`);
  return result.products;
}

export async function fetchCategories(): Promise<string[]> {
  const list = await fetchJson<Array<{ slug: string; name: string }>>(`${BASE_URL}/products/categories`);
  return list.map((item) => item.slug);
}

export async function fetchProductById(id: number): Promise<Product> {
  return fetchJson<Product>(`${BASE_URL}/products/${id}`);
}

export async function fetchAllData(): Promise<{ products: Product[]; categories: string[] }> {
  const [products, categories] = await Promise.all([
    fetchProducts(),
    fetchCategories(),
  ]);
  return { products, categories };
}
