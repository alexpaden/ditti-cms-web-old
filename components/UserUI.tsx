import { User } from "../types";

const UserDisplay = ({ user }: { user: User }) => {
  const now = new Date().getTime();
  const registeredAt = new Date(user.profile.registeredAt).getTime();
  const age = Math.floor((now - registeredAt) / (1000 * 60 * 60 * 24 * 365));

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: 10,
        borderBottom: "1px solid black",
        paddingBottom: 10,
        width: 800,
      }}
    >
      <img src={user.pfp.uri} alt={user.username} style={{ width: 50 }} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginLeft: 10,
          width: 200,
          paddingBottom: 5,
        }}
      >
        <span style={{ fontWeight: "lighter", fontStyle: "italic" }}>
          {user.profile.displayName}
        </span>
        <div>
          <span style={{ fontWeight: "bold", fontSize: 12 }}>FID:</span>{" "}
          {user.fid}
        </div>
        <div>
          <span style={{ fontWeight: "bold", fontSize: 12 }}>Username:</span>{" "}
          <a
            href={`https://warpcast.com/${user.username}`}
            style={{ color: "blue", textDecoration: "underline" }}
          >
            {user.username}
          </a>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginLeft: 25,
          width: 300,
          paddingBottom: 5,
        }}
      >
        <span style={{ fontWeight: "bold", marginBottom: 5 }}>Biography:</span>
        <span style={{ fontSize: 12 }}>{user.profile.bio}</span>
      </div>

      <div
        style={{
          marginLeft: 50,
          paddingBottom: 5,
          fontSize: 12,
        }}
      >
        <div>
          <span style={{ fontWeight: "bold" }}>Followers:</span>{" "}
          {user.followerCount}
        </div>
        <div>
          <span style={{ fontWeight: "bold" }}>Following:</span>{" "}
          {user.followingCount}
        </div>
        <div>
          <span style={{ fontWeight: "bold" }}>F/F Ratio:</span>{" "}
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
