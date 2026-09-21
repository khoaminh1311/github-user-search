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
import { STATUS } from './utils/constants';

function AppContent() {
  const [username, setUsername] = useState('');
  const debouncedUsername = useDebounce(username, 500);
  const { user, status, error, fetchUser, resetUser } = useGithubUser();

  // Auto-search when user stops typing
  useEffect(() => {
    if (debouncedUsername) {
      fetchUser(debouncedUsername);
    } else {
      resetUser();
    }
  }, [debouncedUsername, fetchUser, resetUser]);

  // Immediate search on submit
  const handleSearch = (term) => {
    if (term) {
      fetchUser(term);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="w-full max-w-3xl mx-auto px-4 py-8 sm:py-10 flex flex-col gap-6 flex-1">
        <SearchForm
          value={username}
          onChange={setUsername}
          onSubmit={handleSearch}
        />
        
        {status === STATUS.IDLE && <WelcomeState />}
        {status === STATUS.LOADING && <LoadingState />}
        {status === STATUS.ERROR && <ErrorState error={error} />}
        {status === STATUS.SUCCESS && <UserCard user={user} />}
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
