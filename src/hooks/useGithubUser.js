import { useState, useRef, useCallback } from 'react';
import { fetchGithubUser } from '../services/githubApi';
import { STATUS } from '../utils/constants';

export function useGithubUser() {
  const [status, setStatus] = useState(STATUS.IDLE);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  
  const abortControllerRef = useRef(null);
  const lastSearchedRef = useRef('');

  const resetUser = useCallback(() => {
    setStatus(STATUS.IDLE);
    setUser(null);
    setError(null);
    lastSearchedRef.current = '';
  }, []);

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

    setStatus(STATUS.LOADING);
    setError(null);

    try {
      const data = await fetchGithubUser(trimmedUsername, abortController.signal);
      
      // Ignore if a newer search was initiated
      if (lastSearchedRef.current !== trimmedUsername) {
        return;
      }
      
      setUser(data);
      setStatus(STATUS.SUCCESS);
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
      setStatus(STATUS.ERROR);
      setUser(null);
      lastSearchedRef.current = ''; // Allow retry on failure
    }
  }, []);

  return { user, status, error, fetchUser, resetUser };
}
