import { Box, Typography } from "@mui/material";
import { User, TimeGrouped } from "../types";

type FollowUIProps = {
  users: User[];
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
  return (
    <div>
      <h1>Follow Tracker</h1>
      {timeGrouped && (
        <Box>
          <Typography variant="h4">Changes in the Last Week</Typography>
          <Typography variant="h6">Followers</Typography>
          <ul>
            <li>
              Added:{" "}
              {users
                .filter((user) =>
                  timeGrouped.follower_changes.added.includes(user.fid)
                )
                .map((user) => user.username)
                .join(", ")}
            </li>
            <li>
              Removed:{" "}
              {users
                .filter((user) =>
                  timeGrouped.follower_changes.removed.includes(user.fid)
                )
                .map((user) => user.username)
                .join(", ")}
            </li>
          </ul>
          <Typography
            variant="h6"
            onClick={toggleShowFollowing}
            style={{ cursor: "pointer" }}
          >
            Following
          </Typography>
          {showFollowing && (
            <ul>
              <li>
                Added:{" "}
                {users
                  .filter((user) =>
                    timeGrouped.following_changes.added.includes(user.fid)
                  )
                  .map((user) => user.username)
                  .join(", ")}
              </li>
              <li>
                Removed:{" "}
                {users
                  .filter((user) =>
                    timeGrouped.following_changes.removed.includes(user.fid)
                  )
                  .map((user) => user.username)
                  .join(", ")}
              </li>
            </ul>
          )}
        </Box>
      )}
    </div>
  );
};

export default FollowUI;
