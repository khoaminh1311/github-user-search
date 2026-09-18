import ProfileStat from './ProfileStat';
import { formatJoinedDate } from '../utils/formatJoinedDate';

export default function UserCard({ user }) {
  if (!user) return null;

  const displayName = user.name || user.login;
  const joinedDate = user.created_at ? `Joined ${formatJoinedDate(user.created_at)}` : '';
  const bioText = user.bio || 'This profile has no bio';

  return (
    <div className="w-full bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 sm:p-10 transition-colors duration-200">
      <div className="grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-8 gap-y-6">
        {/* Avatar */}
        <div className="col-span-1 row-span-1 sm:row-span-2">
          <img
            src={user.avatar_url}
            alt={`${user.login}'s avatar`}
            className="w-20 h-20 sm:w-28 sm:h-28 rounded-full"
          />
        </div>

        {/* Header: Name, Username, Date */}
        <div className="col-span-1 min-w-0 flex flex-col sm:flex-row sm:justify-between sm:items-start self-center sm:self-auto pt-1 sm:pt-0">
          <div className="flex flex-col min-w-0">
            <h2 
              className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white truncate"
              title={displayName}
            >
              {displayName}
            </h2>
            <a
              href={user.html_url || `https://github.com/${user.login}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 hover:underline mb-1 truncate"
              title={`@${user.login}`}
            >
              {`@${user.login}`}
            </a>
          </div>
          <span className="text-sm text-gray-500 dark:text-slate-300 sm:pt-2 whitespace-nowrap sm:ml-4">
            {joinedDate}
          </span>
        </div>

        {/* Bio */}
        <div className="col-span-2 sm:col-span-1 sm:col-start-2 min-w-0">
          <p className={`leading-relaxed break-words ${user.bio ? 'text-gray-600 dark:text-slate-300' : 'text-gray-400 dark:text-slate-400'}`}>
            {bioText}
          </p>
        </div>

        {/* Stats */}
        <div className="col-span-2 sm:col-span-1 sm:col-start-2 bg-slate-50 dark:bg-slate-900 rounded-xl p-4 sm:p-6 flex justify-between mt-2 sm:mt-0">
          <ProfileStat label="Repos" value={user.public_repos} />
          <ProfileStat label="Followers" value={user.followers} />
          <ProfileStat label="Following" value={user.following} />
        </div>
      </div>
    </div>
  );
}
