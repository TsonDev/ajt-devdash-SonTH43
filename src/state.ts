import type {
  AppState,
  DetailState,
  FilterState,
  FilterUpdate,
  Product,
  ProductCard,
  SortOption,
  CategoryCount,
} from './types.ts';

let appState: AppState = { status: 'idle' };

let detailState: DetailState = { status: 'idle' };

let filterState: FilterState = {
  searchTerm: '',
  category: '',
  sortBy: 'default',
};

type RenderCallback = () => void;
let onStateChange: RenderCallback = () => {};

export function setOnStateChange(callback: RenderCallback): void {
  onStateChange = callback;
}

export function getAppState(): AppState {
  return appState;
}

export function setAppState(newState: AppState): void {
  appState = newState;
  onStateChange();
}

export function getDetailState(): DetailState {
  return detailState;
}

export function setDetailState(newState: DetailState): void {
  detailState = newState;
  onStateChange();
}

export function getFilterState(): FilterState {
  return filterState;
}

export function updateFilter(update: FilterUpdate): void {
  filterState = { ...filterState, ...update };
  onStateChange();
}

export function getFilteredProducts(products: Product[]): ProductCard[] {
  const { searchTerm, category, sortBy } = filterState;
  const searchLower = searchTerm.toLowerCase();

  const filtered = products.filter((product) => {
    const matchSearch =
      searchLower === '' ||
      product.title.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower);

    const matchCategory = category === '' || product.category === category;

    return matchSearch && matchCategory;
  });

  const sorted = sortProducts(filtered, sortBy);

  const cards: ProductCard[] = sorted.map((product) => ({
    id: product.id,
    title: product.title,
    price: product.price,
    category: product.category,
    thumbnail: product.thumbnail,
    rating: product.rating,
  }));

  return cards;
}

function sortProducts(products: Product[], sortBy: SortOption): Product[] {
  const copy = [...products];

  switch (sortBy) {
    case 'price-asc':
      return copy.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return copy.sort((a, b) => b.price - a.price);
    case 'name-asc':
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    case 'name-desc':
      return copy.sort((a, b) => b.title.localeCompare(a.title));
    case 'rating-desc':
      return copy.sort((a, b) => b.rating - a.rating);
    case 'default':
      return copy;
  }
}

export function getCategoryCounts(products: Product[]): CategoryCount {
  return products.reduce<CategoryCount>((counts, product) => {
    counts[product.category] = (counts[product.category] ?? 0) + 1;
    return counts;
  }, {});
}
