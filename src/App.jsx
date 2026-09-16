import { useState } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import WelcomeState from './components/WelcomeState';

function App() {
  const [username, setUsername] = useState('');

  const handleSearch = () => {
    // API logic will be integrated in Phase 2
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 flex flex-col font-sans">
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

export default App;
