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
- QA là scope bắt buộc. Được phép thêm dev dependencies chỉ cho testing: Vitest, jsdom, React Testing Library, user-event, jest-dom và @sa11y/vitest. Không dùng MSW; mock native Fetch bằng Vitest để giữ setup nhẹ.

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

Khi đến QA phase, thêm test files riêng cạnh source file và một shared setup file:

```text
src/
├── test/setup.js
├── components/
│   ├── SearchForm.test.jsx
│   ├── ThemeToggle.test.jsx
│   └── UserCard.test.jsx
├── context/ThemeContext.test.jsx
├── hooks/
│   ├── useDebounce.test.js
│   └── useGithubUser.test.js
└── utils/formatJoinedDate.test.js
```

Không tạo một file test monolithic. `src/test/setup.js` chỉ chứa setup chung (cleanup, matchers, mock reset); mỗi `.test.*` chỉ test một component, hook hoặc utility rõ ràng.

## 7. Testing and quality gate

Trước deployment, project phải có một QA phase riêng. Test suite phải bao phủ happy path, edge cases, invalid input, corrupted state, storage failure, accessibility, hidden assumptions và regression.

Cần có cả unit/component tests và checklist kiểm thử thủ công. Browser APIs (Fetch, AbortController, localStorage) phải được mock và restore giữa các test. Test không được gọi GitHub API thật.

Case tối thiểu:

- Input rỗng/chỉ có khoảng trắng, username có ký tự cần encode, submit bằng Enter/button, debounce và submit không tạo request trùng.
- Success, 404, network failure, 403/429 rate limit, JSON response lỗi và request cũ bị abort.
- Bio/name null, ngày invalid, response thiếu field và avatar URL không làm app crash.
- localStorage rỗng, giá trị theme sai, getItem/setItem ném lỗi và DOM class `dark` vẫn nhất quán.
- Keyboard-only navigation, visible focus, label accessible, button có accessible name, icon decorative không được đọc, heading/landmark hợp lý và automated accessibility scan.
- Regression: theme persistence, response cũ không ghi đè query mới, mọi test độc lập và lint/build/test đều pass.

## 8. Git workflow

- `main` là production; không commit trực tiếp vào `main`.
- Mỗi agent chỉ làm trên branch được giao và chỉ sửa phạm vi của phase đó.
- Commit theo Conventional Commit: `feat:`, `fix:`, `chore:`, `docs:`.
- Mở Pull Request vào `main`; Vercel Preview và lint/build cần pass trước khi merge.
- Không sửa hoặc revert thay đổi ngoài phạm vi được giao.

## 9. Visual and responsive quality gate

Sau functional QA và trước release, phải có một visual/responsive QA phase riêng. So sánh UI với hai mockup light/dark ban đầu; không cần pixel-perfect, nhưng phải giữ đúng hierarchy, layout và cảm giác thị giác.

Viewport tối thiểu cần kiểm tra: 320px, 375px, 768px, 1024px và 1440px. Kiểm tra cả light/dark cho welcome, loading, error và user-card states. Không được có horizontal overflow, text cut-off, overlapping controls, touch target quá nhỏ, focus ring bị cắt hoặc thay đổi layout gây nhảy khó chịu.

Phase này chỉ sửa CSS/markup/accessibility nhỏ khi cần; không thêm feature, animation library hay dependency.

## 10. Non-goals (tránh scope creep)

- Không hiện danh sách repositories, followers, following hay organizations.
- Không authentication/OAuth/token và không backend proxy.
- Không favorites, history, database, pagination, router, SSR/Next.js.
- Không state-management library, cache layer, UI framework hay animation library.
- Không thêm end-to-end browser automation, visual-regression SaaS hay coverage target phức tạp; Vitest component/unit tests và manual QA là đủ cho project học tập này.

## 11. Tiêu chí hoàn thành

App tìm được GitHub user, hiện đủ thông tin yêu cầu, xử lý đúng welcome/loading/404/network/rate-limit states, có persisted dark/light theme, responsive, test suite/lint/build thành công, đã merge qua PR vào `main`, và có deployment Vercel hoạt động.
