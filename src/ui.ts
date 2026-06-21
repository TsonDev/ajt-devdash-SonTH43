import type { ProductCard, AppState, DetailState, CategoryCount } from './types.ts';
import { getFilterState } from './state.ts';

function getElement(id: string): HTMLElement {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Khong tim thay element #${id}`);
  }
  return element;
}

export function renderApp(state: AppState, cards: ProductCard[], _categoryCounts: CategoryCount): void {
  const app = getElement('app');

  switch (state.status) {
    case 'idle':
      app.innerHTML = `<p class="message">Chao mung den DevDash. Dang tai du lieu...</p>`;
      break;

    case 'loading':
      app.innerHTML = `
        <div class="message">
          <div class="spinner"></div>
          <p>Dang tai san pham...</p>
        </div>`;
      break;

    case 'success':
      app.innerHTML = `
        <header>
          <h1>DevDash - Product Dashboard</h1>
        </header>
        <div class="controls">
          ${renderSearchBox()}
          ${renderCategoryFilter(state.categories)}
          ${renderSortSelect()}
        </div>
        <p class="result-count">${cards.length} san pham</p>
        <div class="grid" id="product-grid">
          ${cards.map(renderProductCard).join('')}
        </div>
        <div id="detail-overlay" class="overlay hidden"></div>
      `;
      break;

    case 'error':
      app.innerHTML = `
        <div class="message error">
          <p>Loi: ${state.message}</p>
          <button id="retry-btn">Thu lai</button>
        </div>`;
      break;
  }
}

function renderSearchBox(): string {
  const { searchTerm } = getFilterState();
  return `
    <input
      type="text"
      id="search-input"
      placeholder="Tim kiem san pham..."
      value="${searchTerm}"
    />`;
}

function renderCategoryFilter(categories: string[]): string {
  const { category: selected } = getFilterState();

  const options = categories
    .map((cat) => `<option value="${cat}" ${cat === selected ? 'selected' : ''}>${cat}</option>`)
    .join('');

  return `
    <select id="category-select">
      <option value="">Tat ca</option>
      ${options}
    </select>`;
}

function renderSortSelect(): string {
  const { sortBy } = getFilterState();

  const options = [
    { value: 'default', label: 'Mac dinh' },
    { value: 'price-asc', label: 'Gia: Thap den Cao' },
    { value: 'price-desc', label: 'Gia: Cao den Thap' },
    { value: 'name-asc', label: 'Ten: A - Z' },
    { value: 'name-desc', label: 'Ten: Z - A' },
    { value: 'rating-desc', label: 'Danh gia cao nhat' },
  ];

  const optionHtml = options
    .map(({ value, label }) =>
      `<option value="${value}" ${value === sortBy ? 'selected' : ''}>${label}</option>`
    )
    .join('');

  return `<select id="sort-select">${optionHtml}</select>`;
}

function renderProductCard(card: ProductCard): string {
  const { id, title, price, category, thumbnail, rating } = card;

  return `
    <div class="card" data-id="${id}">
      <img src="${thumbnail}" alt="${title}" />
      <div class="card-body">
        <h3>${title}</h3>
        <span class="badge">${category}</span>
        <p class="price">$${price.toFixed(2)}</p>
        <p class="rating">⭐ ${rating.toFixed(1)}</p>
      </div>
    </div>`;
}

export function renderDetail(state: DetailState): void {
  const overlay = document.getElementById('detail-overlay');
  if (!overlay) return;

  switch (state.status) {
    case 'idle':
      overlay.classList.add('hidden');
      overlay.innerHTML = '';
      break;

    case 'loading':
      overlay.classList.remove('hidden');
      overlay.innerHTML = `
        <div class="detail-card">
          <div class="spinner"></div>
          <p>Dang tai chi tiet...</p>
        </div>`;
      break;

    case 'success': {
      const { product } = state;
      overlay.classList.remove('hidden');
      overlay.innerHTML = `
        <div class="detail-card">
          <button class="close-btn" id="close-detail">X</button>
          <img src="${product.thumbnail}" alt="${product.title}" />
          <h2>${product.title}</h2>
          <span class="badge">${product.category}</span>
          <p class="description">${product.description}</p>
          <div class="detail-info">
            <p><strong>Gia:</strong> $${product.price.toFixed(2)}</p>
            <p><strong>Danh gia:</strong> ${product.rating.toFixed(1)}/5</p>
            <p><strong>Ton kho:</strong> ${product.stock}</p>
            <p><strong>Thuong hieu:</strong> ${product.brand}</p>
            <p><strong>Giam gia:</strong> ${product.discountPercentage}%</p>
          </div>
          <div class="detail-images">
            ${product.images.map((url) => `<img src="${url}" alt="${product.title}" />`).join('')}
          </div>
        </div>`;
      break;
    }

    case 'error':
      overlay.classList.remove('hidden');
      overlay.innerHTML = `
        <div class="detail-card">
          <button class="close-btn" id="close-detail">X</button>
          <p class="error">Loi: ${state.message}</p>
        </div>`;
      break;
  }
}
