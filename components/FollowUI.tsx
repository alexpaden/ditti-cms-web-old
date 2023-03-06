import { User, TimeGrouped } from "../types";
import UserDisplay from "./UserUI";

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
