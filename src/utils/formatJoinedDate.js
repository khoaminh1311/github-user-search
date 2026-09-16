export function formatJoinedDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
}
