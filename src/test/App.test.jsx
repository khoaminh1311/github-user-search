import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { mockOctocat, mockUserWithBio, mockUserMinimal } from './fixtures';

// Helper to setup fetch mock
function mockFetchSuccess(data) {
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve(data),
  });
}

function mockFetchError(status) {
  return vi.fn().mockResolvedValue({
    ok: false,
    status,
    json: () => Promise.resolve({ message: 'Not Found' }),
  });
}

describe('Search Happy Path', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  it('shows loading state while fetch is in progress then shows UserCard with all fields', async () => {
    let resolveFetch;
    const fetchPromise = new Promise((resolve) => {
      resolveFetch = resolve;
    });
    global.fetch = vi.fn().mockReturnValue(fetchPromise);

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    const input = screen.getByRole('textbox', { name: /github username/i });
    await user.type(input, 'octocat');

    // Advance debounce timer inside act to avoid warnings
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    // Should show loading
    expect(await screen.findByText(/searching/i)).toBeInTheDocument();

    // Resolve fetch with mock data
    resolveFetch({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockOctocat),
    });

    // Wait for UserCard
    await waitFor(() => {
      expect(screen.getByText('The Octocat')).toBeInTheDocument();
    });

    // Verify all UserCard fields
    expect(screen.getByAltText(/octocat's avatar/i)).toBeInTheDocument();
    expect(screen.getByText('@octocat')).toBeInTheDocument();
    expect(screen.getByText('This profile has no bio')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();     // public_repos
    expect(screen.getByText('24076')).toBeInTheDocument(); // followers
    expect(screen.getByText('9')).toBeInTheDocument();     // following
    expect(screen.getByText(/joined/i)).toBeInTheDocument();
    expect(screen.getByText(/26 Jan 2011/i)).toBeInTheDocument();
  });

  it('shows UserCard with bio when user has one', async () => {
    global.fetch = mockFetchSuccess(mockUserWithBio);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    const input = screen.getByRole('textbox', { name: /github username/i });
    await user.type(input, 'torvalds');
    await vi.advanceTimersByTimeAsync(500);

    await waitFor(() => {
      expect(screen.getByText('Linus Torvalds')).toBeInTheDocument();
    });

    expect(screen.getByText('Just a random Linux and Git hacker')).toBeInTheDocument();
  });
});

describe('Invalid Input and Debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    global.fetch = vi.fn();
  });

  it('does not call fetch for empty string', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    const input = screen.getByRole('textbox', { name: /github username/i });
    await user.click(input);
    await vi.advanceTimersByTimeAsync(600);

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('does not call fetch for whitespace-only input', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    const input = screen.getByRole('textbox', { name: /github username/i });
    await user.type(input, '   ');
    await vi.advanceTimersByTimeAsync(600);

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('encodes special characters in username to produce a safe URL', async () => {
    global.fetch = mockFetchError(404);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    const input = screen.getByRole('textbox', { name: /github username/i });
    await user.type(input, 'user name+test');
    await vi.advanceTimersByTimeAsync(600);

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    const calledUrl = global.fetch.mock.calls[0][0];
    // Should NOT contain raw spaces or +
    expect(calledUrl).not.toContain(' ');
    expect(calledUrl).toContain(encodeURIComponent('user name+test'));
  });

  it('Search button triggers immediate search without waiting for debounce', async () => {
    global.fetch = mockFetchSuccess(mockOctocat);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    const input = screen.getByRole('textbox', { name: /github username/i });
    await user.type(input, 'octocat');

    // Click search immediately (no timer advance)
    const searchBtn = screen.getByRole('button', { name: /search/i });
    await user.click(searchBtn);

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('Enter key triggers immediate search', async () => {
    global.fetch = mockFetchSuccess(mockOctocat);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    const input = screen.getByRole('textbox', { name: /github username/i });
    await user.type(input, 'octocat');
    await user.keyboard('{Enter}');

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('debounce waits 500ms before triggering search', async () => {
    global.fetch = mockFetchSuccess(mockOctocat);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    const input = screen.getByRole('textbox', { name: /github username/i });
    await user.type(input, 'octocat');

    // At 499ms, fetch should NOT be called yet
    await vi.advanceTimersByTimeAsync(499);
    expect(global.fetch).not.toHaveBeenCalled();

    // At 500ms+, fetch should be called
    await vi.advanceTimersByTimeAsync(1);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  });

  it('debounce + submit does not create duplicate requests for same username', async () => {
    global.fetch = mockFetchSuccess(mockOctocat);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    const input = screen.getByRole('textbox', { name: /github username/i });
    await user.type(input, 'octocat');

    // Press Enter (immediate search)
    await user.keyboard('{Enter}');
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    // Now advance debounce timer - should NOT trigger a second call for same username
    await vi.advanceTimersByTimeAsync(600);
    // Still only 1 call because lastSearchedRef prevents duplicate
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});

describe('API and Async Edge Cases', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  it('shows "No results found" on 404', async () => {
    global.fetch = mockFetchError(404);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    const input = screen.getByRole('textbox', { name: /github username/i });
    await user.type(input, 'nonexistentuser12345xyz');
    await vi.advanceTimersByTimeAsync(600);

    await waitFor(() => {
      expect(screen.getByText('No results found')).toBeInTheDocument();
    });
  });

  it('shows network error message on fetch rejection', async () => {
    global.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    const input = screen.getByRole('textbox', { name: /github username/i });
    await user.type(input, 'someuser');
    await vi.advanceTimersByTimeAsync(600);

    await waitFor(() => {
      // Should show error state - not "No results found"
      const errorEl = screen.getByText(/failed to fetch/i);
      expect(errorEl).toBeInTheDocument();
    });
  });

  it('shows rate-limit error for 403 response', async () => {
    global.fetch = mockFetchError(403);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    const input = screen.getByRole('textbox', { name: /github username/i });
    await user.type(input, 'someuser');
    await vi.advanceTimersByTimeAsync(600);

    await waitFor(() => {
      expect(screen.getByText(/rate limit/i)).toBeInTheDocument();
    });
  });

  it('shows rate-limit error for 429 response', async () => {
    global.fetch = mockFetchError(429);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    const input = screen.getByRole('textbox', { name: /github username/i });
    await user.type(input, 'someuser');
    await vi.advanceTimersByTimeAsync(600);

    await waitFor(() => {
      expect(screen.getByText(/rate limit/i)).toBeInTheDocument();
    });
  });

  it('does not crash on JSON parse failure', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.reject(new SyntaxError('Unexpected token')),
    });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    const input = screen.getByRole('textbox', { name: /github username/i });
    await user.type(input, 'someuser');
    await vi.advanceTimersByTimeAsync(600);

    // App should not crash; it should show an error state
    await waitFor(() => {
      expect(screen.getByText('Received an invalid response from the server.')).toBeInTheDocument();
    });
  });

  it('response from aborted request A does not overwrite results from request B', async () => {
    let resolveA;
    const fetchA = new Promise((resolve) => { resolveA = resolve; });

    global.fetch = vi.fn()
      .mockImplementationOnce(() => fetchA) // call A: slow
      .mockImplementationOnce(() => Promise.resolve({ // call B: fast
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockUserWithBio),
      }));

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    const input = screen.getByRole('textbox', { name: /github username/i });
    // Type 'octo', debounce fires -> call A
    await user.type(input, 'octo');
    await vi.advanceTimersByTimeAsync(600);
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    // Clear and type different username -> call B
    await user.clear(input);
    await user.type(input, 'torvalds');
    await vi.advanceTimersByTimeAsync(600);

    // B finishes first
    await waitFor(() => {
      expect(screen.getByText('Linus Torvalds')).toBeInTheDocument();
    });

    // Now resolve A - it should be ignored (AbortError or lastSearchedRef guard)
    resolveA({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockOctocat),
    });

    // Result should still show Linus Torvalds, not octocat
    await vi.advanceTimersByTimeAsync(100);
    expect(screen.getByText('Linus Torvalds')).toBeInTheDocument();
    expect(screen.queryByText('The Octocat')).not.toBeInTheDocument();
  });

  it('success after error clears previous error message', async () => {
    global.fetch = mockFetchError(404);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    const input = screen.getByRole('textbox', { name: /github username/i });
    await user.type(input, 'nobody1234xyz');
    await vi.advanceTimersByTimeAsync(600);

    await waitFor(() => {
      expect(screen.getByText('No results found')).toBeInTheDocument();
    });

    // Now search for a valid user
    global.fetch = mockFetchSuccess(mockUserWithBio);
    await user.clear(input);
    await user.type(input, 'torvalds');
    await vi.advanceTimersByTimeAsync(600);

    await waitFor(() => {
      expect(screen.getByText('Linus Torvalds')).toBeInTheDocument();
    });

    // Error message should be gone
    expect(screen.queryByText('No results found')).not.toBeInTheDocument();
  });

  it('error after success does not show stale user data as a new result', async () => {
    global.fetch = mockFetchSuccess(mockUserWithBio);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    const input = screen.getByRole('textbox', { name: /github username/i });
    await user.type(input, 'torvalds');
    await vi.advanceTimersByTimeAsync(600);

    await waitFor(() => {
      expect(screen.getByText('Linus Torvalds')).toBeInTheDocument();
    });

    // Now search for a nonexistent user
    global.fetch = mockFetchError(404);
    await user.clear(input);
    await user.type(input, 'nobody99999xyz');
    await vi.advanceTimersByTimeAsync(600);

    await waitFor(() => {
      expect(screen.getByText('No results found')).toBeInTheDocument();
    });

    // Stale user data should NOT be visible as a successful result
    expect(screen.queryByText('Linus Torvalds')).not.toBeInTheDocument();
  });
});

describe('Corrupted or Missing API Data', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  it('falls back to login when name is null', async () => {
    global.fetch = mockFetchSuccess(mockUserMinimal);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    const input = screen.getByRole('textbox', { name: /github username/i });
    await user.type(input, 'ghostuser');
    await vi.advanceTimersByTimeAsync(600);

    await waitFor(() => {
      // Should show login as name fallback
      expect(screen.getByText('ghostuser')).toBeInTheDocument();
    });
  });

  it('shows fallback text when bio is null', async () => {
    global.fetch = mockFetchSuccess(mockUserMinimal);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    const input = screen.getByRole('textbox', { name: /github username/i });
    await user.type(input, 'ghostuser');
    await vi.advanceTimersByTimeAsync(600);

    await waitFor(() => {
      expect(screen.getByText('This profile has no bio')).toBeInTheDocument();
    });
  });

  it('shows 0 for public_repos, followers, following when they are 0', async () => {
    global.fetch = mockFetchSuccess(mockUserMinimal);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    const input = screen.getByRole('textbox', { name: /github username/i });
    await user.type(input, 'ghostuser');
    await vi.advanceTimersByTimeAsync(600);

    await waitFor(() => {
      expect(screen.getByText('ghostuser')).toBeInTheDocument();
    });

    // All stats should show '0'
    const zeroValues = screen.getAllByText('0');
    expect(zeroValues.length).toBeGreaterThanOrEqual(3);
  });

  it('does not crash when created_at is an invalid date string', async () => {
    const { mockUserCorrupted } = await import('./fixtures');
    global.fetch = mockFetchSuccess(mockUserCorrupted);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    const input = screen.getByRole('textbox', { name: /github username/i });
    await user.type(input, 'corruptuser');
    await vi.advanceTimersByTimeAsync(600);

    // App should not crash
    await waitFor(() => {
      expect(screen.getByText('@corruptuser')).toBeInTheDocument();
    });
  });

  it('does not crash when optional fields are missing from API response', async () => {
    const { mockUserCorrupted } = await import('./fixtures');
    global.fetch = mockFetchSuccess(mockUserCorrupted);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    const input = screen.getByRole('textbox', { name: /github username/i });
    await user.type(input, 'corruptuser');
    await vi.advanceTimersByTimeAsync(600);

    await waitFor(() => {
      expect(screen.getByText('@corruptuser')).toBeInTheDocument();
    });

    // Stats with undefined values should show '-'
    const dashValues = screen.getAllByText('-');
    expect(dashValues.length).toBeGreaterThanOrEqual(1);
  });
});
