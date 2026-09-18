import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';


describe('Theme and Storage Failure', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('defaults to light theme when localStorage is empty', () => {
    render(<App />);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('applies dark theme after render when localStorage has "dark"', () => {
    localStorage.setItem('theme', 'dark');
    render(<App />);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('applies light theme when localStorage has "light"', () => {
    localStorage.setItem('theme', 'light');
    render(<App />);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('falls back to light when localStorage has an invalid value ("banana")', () => {
    localStorage.setItem('theme', 'banana');
    render(<App />);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('renders in light mode and does not crash when localStorage.getItem throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('localStorage unavailable');
    });

    // Should not throw
    expect(() => render(<App />)).not.toThrow();
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('toggles UI theme even when localStorage.setItem throws', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('localStorage full');
    });

    const user = userEvent.setup();
    render(<App />);

    // Initially light
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    const toggleBtn = screen.getByRole('button', { name: /switch to dark mode/i });
    await user.click(toggleBtn);

    // UI should update despite setItem failing
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('html element has "dark" class when dark theme is active', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(document.documentElement.classList.contains('dark')).toBe(false);

    const toggleBtn = screen.getByRole('button', { name: /switch to dark mode/i });
    await user.click(toggleBtn);

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('html element removes "dark" class when switching back to light', async () => {
    localStorage.setItem('theme', 'dark');
    const user = userEvent.setup();
    render(<App />);

    expect(document.documentElement.classList.contains('dark')).toBe(true);

    const toggleBtn = screen.getByRole('button', { name: /switch to light mode/i });
    await user.click(toggleBtn);

    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('persists theme preference to localStorage on toggle', async () => {
    const user = userEvent.setup();
    render(<App />);

    const toggleBtn = screen.getByRole('button', { name: /switch to dark mode/i });
    await user.click(toggleBtn);

    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
