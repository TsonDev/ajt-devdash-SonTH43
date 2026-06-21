# DevDash - Product Dashboard
Link demo: https://tsondev.github.io/ajt-devdash-SonTH43/
Ứng dụng web dashboard hiển thị sản phẩm, được xây dựng bằng **TypeScript** thuần với **Vite** làm build tool. Dữ liệu được lấy từ [DummyJSON API](https://dummyjson.com/).

## Mục lục

- [Tính năng](#tính-năng)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Cài đặt và chạy](#cài-đặt-và-chạy)
- [Chi tiết kiến trúc](#chi-tiết-kiến-trúc)
- [API sử dụng](#api-sử-dụng)
- [Tác giả](#tác-giả)

## Tính năng

- **Hiển thị danh sách sản phẩm**: Tải và hiển thị 100 sản phẩm dưới dạng lưới card responsive.
- **Tìm kiếm sản phẩm**: Tìm kiếm theo tên hoặc mô tả với debounce 300ms để tối ưu hiệu suất.
- **Lọc theo danh mục**: Dropdown chọn category để lọc sản phẩm theo nhóm.
- **Sắp xếp đa tiêu chí**: Sắp xếp theo giá (tăng/giảm), tên (A-Z/Z-A), hoặc đánh giá cao nhất.
- **Xem chi tiết sản phẩm**: Click vào card để xem popup chi tiết với đầy đủ thông tin (giá, đánh giá, tồn kho, thương hiệu, giảm giá, ảnh gallery).
- **Cache dữ liệu chi tiết**: Sử dụng `AsyncCache` để lưu trữ kết quả API đã fetch, tránh gọi lại API cho cùng sản phẩm.
- **Xử lý lỗi**: Hiển thị thông báo lỗi và nút "Thử lại" khi API gặp sự cố.
- **Loading state**: Hiển thị spinner khi đang tải dữ liệu.

## Công nghệ sử dụng

| Công nghệ | Mục đích |
|---|---|
| **TypeScript** | Ngôn ngữ lập trình chính với strict mode |
| **Vite** | Build tool và dev server |
| **DummyJSON API** | Nguồn dữ liệu sản phẩm |
| **Vanilla CSS** | Styling giao diện |
| **ES Modules** | Module system |

## Cấu trúc dự án

```
devdash-app/
├── index.html          # Entry HTML
├── style.css           # Stylesheet chính
├── package.json        # Cấu hình npm
├── tsconfig.json       # Cấu hình TypeScript
├── .gitignore          # Danh sách file bỏ qua khi push
└── src/
    ├── types.ts        # Định nghĩa kiểu dữ liệu (interfaces, type aliases, utility types)
    ├── api.ts          # Các hàm gọi API (fetch products, categories, product detail)
    ├── utils.ts        # Hàm tiện ích (debounce, AsyncCache)
    ├── state.ts        # Quản lý trạng thái ứng dụng (app state, filter state, detail state)
    ├── ui.ts           # Render giao diện DOM (dashboard, cards, popup chi tiết)
    └── main.ts         # Điểm khởi động, kết nối state + UI + sự kiện
```

## Cài đặt và chạy

### Yêu cầu

- [Node.js](https://nodejs.org/) phiên bản 18 trở lên
- npm (đi kèm Node.js)

### Cài đặt

```bash
git clone https://github.com/TsonDev/ajt-devdash-SonTH43.git
cd ajt-devdash-SonTH43
npm install
```

### Chạy development server

```bash
npm run dev
```

Mở trình duyệt tại `http://localhost:5173`

### Build production

```bash
npm run build
```

### Preview bản build

```bash
npm run preview
```

## Chi tiết kiến trúc

### 1. Type System (`types.ts`)

Sử dụng các tính năng TypeScript nâng cao:

- **Interface**: Định nghĩa cấu trúc `Product`, `ProductListResponse`, `FilterState`
- **Utility Types**: `Pick` (ProductCard), `Partial` (FilterUpdate), `Omit` (ProductSummary), `Record` (CategoryCount)
- **Discriminated Union**: `AppState` và `DetailState` phân biệt trạng thái qua trường `status`
- **Literal Union Type**: `SortOption` giới hạn các giá trị sắp xếp hợp lệ

### 2. API Layer (`api.ts`)

- **Generic function**: `fetchJson<T>()` dùng generics để tái sử dụng cho mọi kiểu response
- **Promise.all**: `fetchAllData()` tải products và categories song song để tối ưu tốc độ
- **Error handling**: Kiểm tra `response.ok` và throw Error khi API trả về lỗi

### 3. Utilities (`utils.ts`)

- **Debounce (Closure)**: Hàm `debounce()` sử dụng closure để lưu timer giữa các lần gọi, tránh gọi API quá nhiều khi user gõ tìm kiếm
- **AsyncCache (Generic Class)**: Class `AsyncCache<K, V>` dùng `Map` để cache kết quả API, sử dụng private fields (`#cache`, `#fetchFn`)

### 4. State Management (`state.ts`)

- **Centralized state**: 3 state chính (`appState`, `detailState`, `filterState`) được quản lý tập trung
- **Observer pattern**: `setOnStateChange()` đăng ký callback render, tự động gọi khi state thay đổi
- **Higher-Order Functions**: Sử dụng `filter()`, `sort()`, `map()`, `reduce()` để lọc, sắp xếp và biến đổi danh sách sản phẩm
- **Exhaustive switch**: Hàm `sortProducts()` xử lý tất cả các case của `SortOption`

### 5. UI Rendering (`ui.ts`)

- **Exhaustive Narrowing**: Hàm `renderApp()` và `renderDetail()` dùng switch trên discriminated union, TypeScript tự động narrow kiểu trong mỗi case
- **Template Literals**: Tạo HTML bằng template string
- **DOM manipulation**: Render toàn bộ giao diện bằng `innerHTML`

### 6. Main Entry (`main.ts`)

- **Orchestration**: Kết nối state, UI và event listeners
- **AsyncCache instance**: Cache chi tiết sản phẩm để tránh fetch lại
- **Event delegation**: Gắn sự kiện cho search, filter, sort, card click, popup close
- **Error recovery**: Nút "Thử lại" khi gặp lỗi tải dữ liệu

## API sử dụng

| Endpoint | Mục đích |
|---|---|
| `GET /products?limit=100` | Lấy danh sách 100 sản phẩm |
| `GET /products/categories` | Lấy danh sách danh mục |
| `GET /products/{id}` | Lấy chi tiết 1 sản phẩm |

Base URL: `https://dummyjson.com`

## Tác giả

**SonTH43** - FPT Software
