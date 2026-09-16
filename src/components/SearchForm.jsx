import { useState } from 'react';

function SearchForm({ value, onChange, onSubmit }) {
  const [internalValue, setInternalValue] = useState('');

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleChange = (e) => {
    if (isControlled && onChange) {
      onChange(e.target.value);
    } else {
      setInternalValue(e.target.value);
      if (onChange) {
        onChange(e.target.value);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(currentValue);
    }
  };

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
      <form onSubmit={handleSubmit} role="search" className="flex flex-col sm:flex-row gap-3">
        <label htmlFor="search-input" className="sr-only">
          GitHub username
        </label>
        <input
          id="search-input"
          type="text"
          value={currentValue}
          onChange={handleChange}
          placeholder="Enter GitHub username..."
          className="flex-1 px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
          autoComplete="off"
          spellCheck="false"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-white bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 rounded-lg transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/40 shrink-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <span>Search</span>
        </button>
      </form>
    </div>
  );
}

export default SearchForm;
