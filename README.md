# GitHub User Search

A single-page React app for searching GitHub user profiles by username. Built with React 19, Vite, and Tailwind CSS.

## Features

- Search GitHub user by username via the [GitHub REST API](https://docs.github.com/en/rest/users/users)
- Displays avatar, name, bio, stats (repos, followers, following), and join date
- Dark/Light theme toggle with persistence via `localStorage`
- Debounced search (500ms) to minimize API calls
- Welcome / Loading / Error / Success states
- Responsive layout for mobile and desktop
- Accessible: labeled inputs, aria attributes, keyboard navigation

## Tech Stack

- **React 19** with Vite
- **Tailwind CSS v4** (dark mode via `class`)
- **GitHub REST API** — native Fetch, no Axios
- **React Context** for theme management

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |
| `npm run test` | Run all tests once (no watch) |
| `npm run test:watch` | Run tests in watch mode |

## Testing

Tests are written with [Vitest](https://vitest.dev) + [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro).

```bash
# Run all tests once
npm run test

# Watch mode (re-runs on file change)
npm run test:watch
```

### Test Coverage Areas

- **Happy path**: search valid user, verify all UserCard fields render
- **Input validation**: empty/whitespace input, URL encoding, debounce timing
- **API edge cases**: 404, network failure, 403/429 rate-limit, JSON parse failure, race conditions
- **Data edge cases**: null name/bio fallbacks, zero stats, invalid date, missing optional fields
- **Theme**: default light, saved dark, invalid value fallback, localStorage error recovery
- **Accessibility**: labeling, ARIA, landmarks, keyboard, focus

### Manual QA Checklist

The following must be verified by a human reviewer before merging to production:

| # | Check |
|---|-------|
| 1 | Tab order: Header → Search input → Search button via Tab key |
| 2 | Visible focus indicator on all interactive elements (light & dark mode) |
| 3 | Mobile viewport (375px): UserCard layout adapts correctly |
| 4 | Color contrast ≥ 4.5:1 in light mode |
| 5 | Color contrast ≥ 4.5:1 in dark mode |
| 6 | Screen reader announces search results after submit |
| 7 | On throttled (3G) network: loading spinner is visible |
| 8 | Enter key submits the form without clicking Search button |
| 9 | Dark mode persists after page refresh |
| 10 | Rate-limit error shows distinct message from "No results found" |
