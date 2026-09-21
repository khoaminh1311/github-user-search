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

