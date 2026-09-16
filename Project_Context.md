# Project Context — GitHub User Search

## 1. Mục tiêu

Xây dựng một single-page web app cho phép người dùng tìm kiếm thông tin công khai của GitHub user theo username. Đây là project học React nên ưu tiên code dễ đọc, dễ hiểu và cấu trúc vừa đủ.

## 2. Tech stack và ràng buộc

- React với Vite (JavaScript, không dùng TypeScript cho project này).
- Tailwind CSS; dark mode theo class `dark` và utility `dark:`.
- GitHub REST API qua native Fetch API; không dùng Axios.
- Không dùng Redux, Zustand, React Query, UI framework, icon library, date library hay backend.
- Theme global bắt buộc dùng React Context (`useContext`), lưu preference vào `localStorage`.
- Các custom hook bắt buộc: `useDebounce` và `useGithubUser`.

## 3. Chức năng bắt buộc

- Tìm GitHub user theo username.
- Hiện avatar, tên, `@username`, bio, public repositories, followers, following và ngày tham gia.
- Hiện welcome state lúc chưa tìm kiếm.
- Hiện loading state trong khi fetch.
- Hiện `No results found` khi API trả về 404.
- Hiện thông báo riêng cho lỗi mạng/rate limit; không gán chung vào no-results.
- Có dark/light toggle; refresh trang vẫn giữ theme đã chọn.
- Giao diện responsive, tham chiếu hai mockup light/dark đã cung cấp.
- Deploy trên Vercel sau khi merge vào `main`.

## 4. API contract

Chỉ dùng endpoint:

`GET https://api.github.com/users/{username}`

Header khuyến nghị: `Accept: application/vnd.github+json`.

Trường dữ liệu cần dùng:

- `avatar_url`
- `name` (fallback sang `login` nếu null)
- `login`
- `bio` (fallback text nếu null)
- `public_repos`
- `followers`
- `following`
- `created_at`
- `html_url` chỉ dùng nếu thêm link profile nhỏ

Username cần được `trim()` và `encodeURIComponent()` trước khi request. Input rỗng không được gọi API. Request cũ cần được hủy khi query mới xuất hiện để tránh kết quả cũ ghi đè kết quả mới.

Lưu ý: GitHub API không auth chỉ cho public data và có giới hạn request. Debounce 500ms là bắt buộc để tránh request thừa.

## 5. Quy ước UI và data flow

Component tree mong muốn:

```text
App
├── ThemeProvider
│   └── AppContent
│       ├── Header
│       │   └── ThemeToggle
│       └── main
│           ├── SearchForm
│           └── SearchResult
│               ├── WelcomeState
│               ├── LoadingState
│               ├── ErrorState
│               └── UserCard
│                   └── ProfileStat x 3
```

Data flow:

`SearchForm input` → `useDebounce(500ms)` → `useGithubUser` → `user/status/error` → state component hoặc `UserCard`.

Nút Search và Enter phải tìm ngay; sau khi người dùng dừng gõ, debounce cũng có thể kích hoạt tìm kiếm. Cần tránh request trùng username. Theme flow độc lập qua `ThemeContext` → `ThemeToggle` → `html.dark` + `localStorage`.

## 6. Structure dự kiến

```text
src/
├── components/
│   ├── ErrorState.jsx
│   ├── Header.jsx
│   ├── LoadingState.jsx
│   ├── ProfileStat.jsx
│   ├── SearchForm.jsx
│   ├── ThemeToggle.jsx
│   ├── UserCard.jsx
│   └── WelcomeState.jsx
├── context/ThemeContext.jsx
├── hooks/useDebounce.js
├── hooks/useGithubUser.js
├── utils/formatJoinedDate.js
├── App.jsx
├── index.css
└── main.jsx
```

Không cần tạo router, services layer, types, global store hay folder architecture phức tạp.

## 7. Git workflow

- `main` là production; không commit trực tiếp vào `main`.
- Mỗi agent chỉ làm trên branch được giao và chỉ sửa phạm vi của phase đó.
- Commit theo Conventional Commit: `feat:`, `fix:`, `chore:`, `docs:`.
- Mở Pull Request vào `main`; Vercel Preview và lint/build cần pass trước khi merge.
- Không sửa hoặc revert thay đổi ngoài phạm vi được giao.

## 8. Non-goals (tránh scope creep)

- Không hiện danh sách repositories, followers, following hay organizations.
- Không authentication/OAuth/token và không backend proxy.
- Không favorites, history, database, pagination, router, SSR/Next.js.
- Không state-management library, cache layer, UI framework hay animation library.
- Không thêm test framework trong phạm vi hiện tại; dùng checklist kiểm thử thủ công.

## 9. Tiêu chí hoàn thành

App tìm được GitHub user, hiện đủ thông tin yêu cầu, xử lý đúng welcome/loading/404/network/rate-limit states, có persisted dark/light theme, responsive, lint/build thành công, đã merge qua PR vào `main`, và có deployment Vercel hoạt động.