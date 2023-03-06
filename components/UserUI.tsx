import { User } from "../types";

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

export default UserDisplay;
