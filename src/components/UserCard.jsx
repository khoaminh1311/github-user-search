import ProfileStat from './ProfileStat';
import { formatJoinedDate } from '../utils/formatJoinedDate';

const LocationIcon = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const LinkIcon = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>;
const TwitterIcon = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-5 h-5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>;
const CompanyIcon = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg>;

function InfoItem({ icon, text, isLink }) {
  const isAvailable = Boolean(text);
  const displayClass = isAvailable ? 'text-gray-600 dark:text-slate-300' : 'text-gray-400 dark:text-slate-500 opacity-50';
  
  let content = (
    <span className={`truncate ${displayClass}`}>
      {isAvailable ? text : 'Not Available'}
    </span>
  );

  if (isAvailable && isLink) {
    const safeUrl = text.startsWith('http') ? text : `https://${text}`;
    content = (
      <a 
        href={safeUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className={`truncate hover:underline ${displayClass}`}
        title={text}
      >
        {text}
      </a>
    );
  }

  return (
    <div className="flex items-center gap-4 min-w-0">
      <div className={`shrink-0 ${isAvailable ? 'text-gray-500 dark:text-slate-300' : 'text-gray-400 dark:text-slate-500 opacity-50'}`}>
        {icon}
      </div>
      {content}
    </div>
  );
}

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
              rel="noopener noreferrer"
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

        {/* Metadata Footer */}
        <div className="col-span-2 sm:col-span-1 sm:col-start-2 mt-4 sm:mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <InfoItem icon={LocationIcon} text={user.location} />
          <InfoItem icon={TwitterIcon} text={user.twitter_username} />
          <InfoItem icon={LinkIcon} text={user.blog} isLink={true} />
          <InfoItem icon={CompanyIcon} text={user.company} />
        </div>
      </div>
    </div>
  );
}
