export interface User {
  fid: number;
  username: string;
  name: string;
  avatar_url: string;
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
