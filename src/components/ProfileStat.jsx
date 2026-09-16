export default function ProfileStat({ label, value }) {
  return (
    <div className="flex flex-col items-center sm:items-start flex-1 text-center sm:text-left">
      <span className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mb-1">{label}</span>
      <span className="text-base sm:text-xl font-bold text-gray-800 dark:text-white">
        {value !== undefined && value !== null ? value : '-'}
      </span>
    </div>
  );
}
