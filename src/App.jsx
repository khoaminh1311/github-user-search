import { useState } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import WelcomeState from './components/WelcomeState';
import { ThemeProvider } from './context/ThemeContext';

function AppContent() {
  const [username, setUsername] = useState('');

  const handleSearch = () => {
    // API logic will be integrated in Phase 3
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
        <WelcomeState />
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
