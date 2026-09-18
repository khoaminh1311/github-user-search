export const mockOctocat = {
  login: 'octocat',
  id: 583231,
  avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4',
  html_url: 'https://github.com/octocat',
  name: 'The Octocat',
  bio: null,
  public_repos: 8,
  followers: 24076,
  following: 9,
  created_at: '2011-01-25T18:44:36Z',
};

export const mockUserWithBio = {
  login: 'torvalds',
  id: 1024025,
  avatar_url: 'https://avatars.githubusercontent.com/u/1024025?v=4',
  html_url: 'https://github.com/torvalds',
  name: 'Linus Torvalds',
  bio: 'Just a random Linux and Git hacker',
  public_repos: 7,
  followers: 231000,
  following: 0,
  created_at: '2011-09-03T15:26:22Z',
};

export const mockUserMinimal = {
  login: 'ghostuser',
  id: 999999,
  avatar_url: 'https://avatars.githubusercontent.com/u/999999?v=4',
  html_url: 'https://github.com/ghostuser',
  name: null,
  bio: null,
  public_repos: 0,
  followers: 0,
  following: 0,
  created_at: '2020-01-01T00:00:00Z',
};

export const mockUserCorrupted = {
  login: 'corruptuser',
  id: 111111,
  avatar_url: 'https://avatars.githubusercontent.com/u/111111?v=4',
  html_url: 'https://github.com/corruptuser',
  name: null,
  bio: null,
  // Missing: public_repos, followers, following (optional fields)
  created_at: 'not-a-valid-date',
};
