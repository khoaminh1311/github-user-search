export default function LoadingState() {
  return (
    <div className="w-full bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 sm:p-12 text-center flex flex-col items-center justify-center transition-colors duration-200">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-200">
        Searching...
      </h2>
      <p className="text-sm sm:text-base text-gray-500 dark:text-slate-400 max-w-md mx-auto transition-colors duration-200">
        Please wait while we fetch the user profile.
      </p>
    </div>
  );
}
