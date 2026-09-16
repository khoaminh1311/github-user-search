import ProfileStat from './ProfileStat';
import { formatJoinedDate } from '../utils/formatJoinedDate';

export default function UserCard({ user }) {
  if (!user) return null;

  const displayName = user.name || user.login;
  const joinedDate = user.created_at ? `Joined ${formatJoinedDate(user.created_at)}` : '';
  const bioText = user.bio || 'This profile has no bio';

  return (
    <div className="w-full bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 sm:p-10 flex flex-col sm:flex-row gap-4 sm:gap-8 transition-colors duration-200">
      {/* Avatar (Mobile: Top, Desktop: Left) */}
      <div className="flex-shrink-0 flex gap-4 sm:block items-center">
        <img
          src={user.avatar_url}
          alt={`${user.login}'s avatar`}
          className="w-20 h-20 sm:w-28 sm:h-28 rounded-full"
        />
        {/* Mobile Header: Name, Login, Date (Shows next to avatar on mobile) */}
        <div className="flex flex-col sm:hidden">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">{displayName}</h1>
          <a
            href={user.html_url || `https://github.com/${user.login}`}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 mb-1"
          >
            @{user.login}
          </a>
          <span className="text-sm text-gray-500 dark:text-slate-300">{joinedDate}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full">
        {/* Desktop Header */}
        <div className="hidden sm:flex justify-between items-start mb-4">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{displayName}</h1>
            <a
              href={user.html_url || `https://github.com/${user.login}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 hover:underline"
            >
              @{user.login}
            </a>
          </div>
          <span className="text-gray-500 dark:text-slate-300 pt-2">{joinedDate}</span>
        </div>

        {/* Bio */}
        <p className={`mb-6 ${user.bio ? 'text-gray-600 dark:text-slate-300' : 'text-gray-400 dark:text-slate-400'}`}>
          {bioText}
        </p>

        {/* Stats */}
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 sm:p-6 flex justify-between">
          <ProfileStat label="Repos" value={user.public_repos} />
          <ProfileStat label="Followers" value={user.followers} />
          <ProfileStat label="Following" value={user.following} />
        </div>
      </div>
    </div>
  );
}
