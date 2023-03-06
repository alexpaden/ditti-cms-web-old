export interface User {
  fid: number;
  username: string;
  pfp: { uri: string };
  profile: {
    displayName: string;
    bio: string;
    referrer: string | null;
    registeredAt: string;
    updatedAt: string;
  };
  followerCount: number;
  followingCount: number;
}

export interface TimeGrouped {
  follower_changes: {
    added: number[];
    removed: number[];
  };
  following_changes: {
    added: number[];
    removed: number[];
  };
}
