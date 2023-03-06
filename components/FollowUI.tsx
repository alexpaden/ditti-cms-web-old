import { User, TimeGrouped } from "../types";

type FollowUIProps = {
  users: User[] | null | undefined;
  timeGrouped: TimeGrouped | null;
  showFollowing: boolean;
  toggleShowFollowing: () => void;
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
      <ul>
        {changes.added.length > 0 && (
          <li>
            <h3>Added:</h3>
            <ul>
              {changes.added.map((fid) => {
                const user = users.find((user) => user.fid === fid);
                return user ? <li key={fid}>{user.username}</li> : null;
              })}
            </ul>
          </li>
        )}
        {changes.removed.length > 0 && (
          <li>
            <h3>Removed:</h3>
            <ul>
              {changes.removed.map((fid) => {
                const user = users.find((user) => user.fid === fid);
                return user ? <li key={fid}>{user.username}</li> : null;
              })}
            </ul>
          </li>
        )}
      </ul>
    </div>
  );
};

export default FollowUI;
