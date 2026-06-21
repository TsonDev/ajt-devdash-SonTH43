import type { SortOption, Product } from './types.ts';
import { fetchAllData, fetchProductById } from './api.ts';
import {
  setOnStateChange,
  getAppState,
  setAppState,
  getDetailState,
  setDetailState,
  updateFilter,
  getFilteredProducts,
  getCategoryCounts,
} from './state.ts';
import { renderApp, renderDetail } from './ui.ts';
import { debounce, AsyncCache } from './utils.ts';

const productCache = new AsyncCache<string, Product>(
  async (idStr) => fetchProductById(Number(idStr))
);

function render(): void {
  const appState = getAppState();

  if (appState.status === 'success') {
    const cards = getFilteredProducts(appState.products);
    const counts = getCategoryCounts(appState.products);
    renderApp(appState, cards, counts);
    attachEventListeners();
  } else {
    renderApp(appState, [], {});

    if (appState.status === 'error') {
      const retryBtn = document.getElementById('retry-btn');
      retryBtn?.addEventListener('click', loadData);
    }
  }

  const detailState = getDetailState();
  if (detailState.status !== 'idle') {
    renderDetail(detailState);
    attachDetailListeners();
  }
}

setOnStateChange(render);

async function loadData(): Promise<void> {
  setAppState({ status: 'loading' });

  try {
    const { products, categories } = await fetchAllData();
    setAppState({ status: 'success', products, categories });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Loi khong xac dinh';
    setAppState({ status: 'error', message });
  }
}

async function openDetail(id: number): Promise<void> {
  setDetailState({ status: 'loading' });

  try {
    const product = await productCache.get(String(id));
    setDetailState({ status: 'success', product });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Loi khong xac dinh';
    setDetailState({ status: 'error', message });
  }
}

function closeDetail(): void {
  setDetailState({ status: 'idle' });
}

const handleSearch = debounce((value: string): void => {
  updateFilter({ searchTerm: value });
}, 300);

function attachEventListeners(): void {
  const searchInput = document.getElementById('search-input') as HTMLInputElement | null;
  searchInput?.addEventListener('input', (e: Event) => {
    const target = e.target as HTMLInputElement;
    handleSearch(target.value);
  });

  const categorySelect = document.getElementById('category-select') as HTMLSelectElement | null;
  categorySelect?.addEventListener('change', (e: Event) => {
    const target = e.target as HTMLSelectElement;
    updateFilter({ category: target.value });
  });

  const sortSelect = document.getElementById('sort-select') as HTMLSelectElement | null;
  sortSelect?.addEventListener('change', (e: Event) => {
    const target = e.target as HTMLSelectElement;
    updateFilter({ sortBy: target.value as SortOption });
  });

  const cards = document.querySelectorAll('.card');
  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const id = Number(card.getAttribute('data-id'));
      if (!isNaN(id)) {
        openDetail(id);
      }
    });
  });
}

function attachDetailListeners(): void {
  const closeBtn = document.getElementById('close-detail');
  closeBtn?.addEventListener('click', closeDetail);

  const overlay = document.getElementById('detail-overlay');
  overlay?.addEventListener('click', (e: Event) => {
    if (e.target === overlay) {
      closeDetail();
    }
  });
}

loadData();
