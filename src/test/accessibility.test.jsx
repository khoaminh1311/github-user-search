import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../App';
import { ThemeProvider } from '../context/ThemeContext';
import SearchForm from '../components/SearchForm';
import ThemeToggle from '../components/ThemeToggle';

describe('Accessibility', () => {
  it('search input has an accessible label', () => {
    render(
      <ThemeProvider>
        <SearchForm value="" onChange={() => {}} onSubmit={() => {}} />
      </ThemeProvider>
    );
    // The label is visually hidden (sr-only) but still accessible
    const input = screen.getByRole('textbox', { name: /github username/i });
    expect(input).toBeInTheDocument();
  });

  it('Search button has accessible name', () => {
    render(
      <ThemeProvider>
        <SearchForm value="" onChange={() => {}} onSubmit={() => {}} />
      </ThemeProvider>
    );
    const button = screen.getByRole('button', { name: /search/i });
    expect(button).toBeInTheDocument();
  });

  it('Theme toggle button has accessible name for light mode', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    const toggleBtn = screen.getByRole('button', { name: /switch to dark mode/i });
    expect(toggleBtn).toBeInTheDocument();
  });

  it('Theme toggle aria-label updates when theme is dark', async () => {
    localStorage.setItem('theme', 'dark');
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    const toggleBtn = screen.getByRole('button', { name: /switch to light mode/i });
    expect(toggleBtn).toBeInTheDocument();
  });

  it('app has a main landmark element', () => {
    render(<App />);
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });

  it('page has a heading (h1 or similar) at render', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it('decorative SVGs in SearchForm have aria-hidden', () => {
    render(
      <ThemeProvider>
        <SearchForm value="" onChange={() => {}} onSubmit={() => {}} />
      </ThemeProvider>
    );
    const svgs = document.querySelectorAll('svg[aria-hidden="true"]');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('decorative SVG in ThemeToggle has aria-hidden', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    const svgs = document.querySelectorAll('svg[aria-hidden="true"]');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('Enter key submits the search form', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <SearchForm value="octocat" onChange={() => {}} onSubmit={onSubmit} />
      </ThemeProvider>
    );

    const input = screen.getByRole('textbox', { name: /github username/i });
    await user.click(input);
    await user.keyboard('{Enter}');

    expect(onSubmit).toHaveBeenCalledWith('octocat');
  });

  it('search input is focusable (has tabIndex >= 0 or is naturally focusable)', () => {
    render(
      <ThemeProvider>
        <SearchForm value="" onChange={() => {}} onSubmit={() => {}} />
      </ThemeProvider>
    );
    const input = screen.getByRole('textbox', { name: /github username/i });
    // native input elements are focusable by default (tabIndex = 0)
    expect(input.tabIndex).toBeGreaterThanOrEqual(0);
  });

  it('search button is focusable', () => {
    render(
      <ThemeProvider>
        <SearchForm value="" onChange={() => {}} onSubmit={() => {}} />
      </ThemeProvider>
    );
    const button = screen.getByRole('button', { name: /search/i });
    expect(button.tabIndex).toBeGreaterThanOrEqual(0);
  });

  it('theme toggle button is focusable', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    const button = screen.getByRole('button', { name: /switch/i });
    expect(button.tabIndex).toBeGreaterThanOrEqual(0);
  });

  it('automated accessibility scan passes on App (WelcomeState)', async () => {
    render(<App />);
    // Run automated a11y scan - reports violations
    await expect(document.body).toBeAccessible();
  });
});
