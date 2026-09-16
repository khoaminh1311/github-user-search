import { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import WelcomeState from './components/WelcomeState';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import UserCard from './components/UserCard';
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
      <main className="w-full max-w-3xl mx-auto px-4 py-8 sm:py-10 flex flex-col gap-6 flex-1">
        <SearchForm
          value={username}
          onChange={setUsername}
          onSubmit={handleSearch}
        />
        
        {status === 'idle' && <WelcomeState />}
        {status === 'loading' && <LoadingState />}
        {status === 'error' && <ErrorState error={error} />}
        {status === 'success' && <UserCard user={user} />}
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
