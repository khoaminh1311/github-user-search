import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import { setup } from '@sa11y/vitest';

// Setup @sa11y accessibility matchers
setup();

// Cleanup DOM after each test
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.clearAllTimers();
  // Reset localStorage
  localStorage.clear();
  // Remove 'dark' class from html element
  document.documentElement.classList.remove('dark');
});
