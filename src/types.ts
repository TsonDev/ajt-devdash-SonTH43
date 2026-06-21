export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export type ProductCard = Pick<Product, 'id' | 'title' | 'price' | 'category' | 'thumbnail' | 'rating'>;

export type FilterUpdate = Partial<FilterState>;

export type ProductSummary = Omit<Product, 'images'>;

export type CategoryCount = Record<string, number>;

export type AppState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; products: Product[]; categories: string[] }
  | { status: 'error'; message: string };

export type DetailState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; product: Product }
  | { status: 'error'; message: string };

export interface FilterState {
  searchTerm: string;
  category: string;
  sortBy: SortOption;
}

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'rating-desc';
