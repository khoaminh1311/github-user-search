import { useState, useRef, useCallback } from 'react';

export function useGithubUser() {
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  
  const abortControllerRef = useRef(null);
  const lastSearchedRef = useRef('');

  const fetchUser = useCallback(async (username) => {
    const trimmedUsername = username?.trim();
    if (!trimmedUsername) return;

    // Prevent duplicate requests for the same username
    if (trimmedUsername === lastSearchedRef.current) {
      return;
    }

    // Cancel previous request if still running
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    lastSearchedRef.current = trimmedUsername;

    setStatus('loading');
    setError(null);

    try {
      const encodedUsername = encodeURIComponent(trimmedUsername);
      const response = await fetch(`https://api.github.com/users/${encodedUsername}`, {
        headers: {
          'Accept': 'application/vnd.github+json'
        },
        signal: abortController.signal
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('No results found');
        } else if (response.status === 403 || response.status === 429) {
          throw new Error('API rate limit exceeded');
        } else {
          throw new Error('An error occurred while fetching user data');
        }
      }

      const data = await response.json();
      
      // Ignore if a newer search was initiated
      if (lastSearchedRef.current !== trimmedUsername) {
        return;
      }
      
      setUser(data);
      setStatus('success');
    } catch (err) {
      if (err.name === 'AbortError') {
        // Ignored because request was aborted intentionally
        return;
      }
      if (err instanceof SyntaxError) {
        setError('Received an invalid response from the server.');
      } else {
        setError(err.message || 'An error occurred');
      }
      setStatus('error');
      setUser(null);
    }
  }, []);

  return { user, status, error, fetchUser };
}
