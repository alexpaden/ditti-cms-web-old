import { User, TimeGrouped } from "../types";

type FollowUIProps = {
  users: User[] | null | undefined;
  timeGrouped: TimeGrouped | null;
  showFollowing: boolean;
  toggleShowFollowing: () => void;
};

const UserDisplay = ({ user }: { user: User }) => {
  const now = new Date().getTime();
  const registeredAt = new Date(user.profile.registeredAt).getTime();
  const age = Math.floor((now - registeredAt) / (1000 * 60 * 60 * 24 * 365));

  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
      <img src={user.pfp.uri} alt={user.username} style={{ width: 50 }} />
      <div style={{ display: "flex", flexDirection: "column", marginLeft: 10 }}>
        <div>{user.fid}</div>
        <div>{user.username}</div>
        <div>{user.profile.displayName}</div>
        <div>{age}</div>
      </div>
      <div style={{ marginLeft: 10 }}>{user.profile.bio}</div>
      <div style={{ marginLeft: 10 }}>
        <div>Followers: {user.followerCount}</div>
        <div>Following: {user.followingCount}</div>
        <div>
          F/F Ratio:{" "}
          {user.followingCount === 0
            ? "∞"
            : Math.round((user.followerCount / user.followingCount) * 100)}
          %
        </div>
      </div>
    </div>
  );
};

const FollowUI = ({
  users,
  timeGrouped,
  showFollowing,
  toggleShowFollowing,
}: FollowUIProps) => {
  if (!users || !timeGrouped) {
    return <p>Loading...</p>;
  }

  const title = showFollowing ? "Following Changes" : "Follower Changes";
  const changes = showFollowing
    ? timeGrouped.following_changes
    : timeGrouped.follower_changes;

  return (
    <div>
      <h2>{title}</h2>
      <button onClick={toggleShowFollowing}>
        {showFollowing ? "View Follower Changes" : "View Following Changes"}
      </button>
      {changes.added.length > 0 && (
        <div>
          <h3>Added:</h3>
          {changes.added.map((fid) => {
            const user = users.find((user) => user.fid === fid);
            return user ? <UserDisplay key={fid} user={user} /> : null;
          })}
        </div>
      )}
      {changes.removed.length > 0 && (
        <div>
          <h3>Removed:</h3>
          {changes.removed.map((fid) => {
            const user = users.find((user) => user.fid === fid);
            return user ? <UserDisplay key={fid} user={user} /> : null;
          })}
        </div>
      )}
    </div>
  );
};

export default FollowUI;
