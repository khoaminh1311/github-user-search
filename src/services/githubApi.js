export const fetchGithubUser = async (username, signal) => {
  const encodedUsername = encodeURIComponent(username);
  const response = await fetch(`https://api.github.com/users/${encodedUsername}`, {
    headers: {
      'Accept': 'application/vnd.github+json'
    },
    signal
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('No results found');
    } else if (response.status === 403 || response.status === 429) {
      throw new Error('API rate limit exceeded');
    } else {
      throw new Error('An error occurred while fetching user data');
    }
  }

  return response.json();
};
