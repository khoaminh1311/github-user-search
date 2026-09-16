export default function ErrorState({ error }) {
  // Determine if it's a 404 vs other errors to show appropriate icon or message
  const isNotFound = error === 'No results found';

  return (
    <div className="w-full bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 sm:p-12 text-center flex flex-col items-center justify-center transition-colors duration-200">
      <svg
        className={`w-16 h-16 sm:w-20 sm:h-20 mb-4 transition-colors duration-200 ${
          isNotFound ? 'text-gray-400 dark:text-gray-500' : 'text-red-500 dark:text-red-400'
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        {isNotFound ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        )}
      </svg>
      <h2
        className={`text-xl sm:text-2xl font-bold mb-2 transition-colors duration-200 ${
          isNotFound ? 'text-gray-900 dark:text-white' : 'text-red-600 dark:text-red-400'
        }`}
      >
        {isNotFound ? 'No results found' : 'Oops! Something went wrong'}
      </h2>
      <p className="text-sm sm:text-base text-gray-500 dark:text-slate-400 max-w-md mx-auto transition-colors duration-200">
        {isNotFound
          ? 'We could not find any GitHub user matching that username. Please check the spelling and try again.'
          : error}
      </p>
    </div>
  );
}
