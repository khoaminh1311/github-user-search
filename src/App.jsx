import { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import WelcomeState from './components/WelcomeState';
import { ThemeProvider } from './context/ThemeContext';
import { useGithubUser } from './hooks/useGithubUser';
import { useDebounce } from './hooks/useDebounce';

function AppContent() {
  const [username, setUsername] = useState('');
  const debouncedUsername = useDebounce(username, 500);
  const { user, status, error, fetchUser } = useGithubUser();

  // Auto-search when user stops typing
  useEffect(() => {
    if (debouncedUsername) {
      fetchUser(debouncedUsername);
    }
  }, [debouncedUsername, fetchUser]);

  // Immediate search on submit
  const handleSearch = (term) => {
    if (term) {
      fetchUser(term);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-gray-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Header />
      <main className="w-full max-w-2xl mx-auto px-4 py-8 sm:py-10 flex flex-col gap-6 flex-1">
        <SearchForm
          value={username}
          onChange={setUsername}
          onSubmit={handleSearch}
        />
        
        {status === 'idle' && <WelcomeState />}
        
        {status === 'loading' && (
          <div className="w-full bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700/80 shadow-sm p-8 text-center transition-colors duration-200">
            <p className="text-gray-500 dark:text-slate-400">Searching...</p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="w-full bg-white dark:bg-slate-800 rounded-xl border border-red-200 dark:border-red-900/50 shadow-sm p-8 text-center transition-colors duration-200">
            <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Error</h2>
            <p className="text-gray-600 dark:text-slate-300">{error}</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="w-full bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700/80 shadow-sm p-6 overflow-x-auto transition-colors duration-200">
            <h2 className="text-lg font-bold mb-4">Search Result (Temporary Phase 3 View)</h2>
            <pre className="text-sm text-left text-gray-700 dark:text-slate-300">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
