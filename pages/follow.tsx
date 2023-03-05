import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";

type TimeGrouped = {
  follower_changes: {
    added: number[];
    removed: number[];
  };
  following_changes: {
    added: number[];
    removed: number[];
  };
};

type User = {
  fid: number;
  username: string;
  pfp: { url: string; verified: boolean };
  profile?: {
    bio: { text: string; mentions: [] };
    location: { placeId: string; description: string };
  };
  followerCount: number;
  followingCount: number;
  referrerUsername: string;
  viewerContext: {
    following: boolean;
    followedBy: boolean;
    canSendDirectCasts: boolean;
  };
};

type Track = {
  id: number;
  created_at: string;
  follower_changes: {
    added: number[];
    removed: number[];
  };
  following_changes: {
    added: number[];
    removed: number[];
  };
};

type Tracks = Track[];

type FollowProps = {
  sessionFid: number;
};

const Follow = ({ sessionFid }: FollowProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [timeGrouped, setTimeGrouped] = useState<TimeGrouped | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showFollowing, setShowFollowing] = useState<boolean>(false); // set initial value to be false

  async function fetchTracks() {
    console.log(sessionFid);
    const res = await fetch(`/api/tracks/${sessionFid}`);
    if (res.ok) {
      return res.json();
    } else {
      throw new Error("Error fetching tracks");
    }
  }

  const toggleShowFollowing = () => {
    setShowFollowing(!showFollowing);
  };

  async function groupTracksByTimeAndFetchUsers() {
    const tracks: Tracks = await fetchTracks();

    // Calculate timestamps for the beginning of the week, two weeks, and month
    const now = Date.now();
    const weekStart = now - (now % (7 * 24 * 60 * 60 * 1000));
    const twoWeeksStart = now - (now % (14 * 24 * 60 * 60 * 1000));
    const monthStart = now - (now % (30 * 24 * 60 * 60 * 1000));

    // Group the tracks by week, two weeks, and month
    const timeGrouped: TimeGrouped = {
      follower_changes: {
        added: [],
        removed: [],
      },
      following_changes: {
        added: [],
        removed: [],
      },
    };
    for (const track of tracks) {
      // Only consider tracks created before now
      const trackTime = new Date(track.created_at).getTime();
      if (trackTime > now) {
        continue;
      }

      if (trackTime >= weekStart) {
        timeGrouped.follower_changes.added.push(
          ...track.follower_changes.added
        );
        timeGrouped.follower_changes.removed.push(
          ...track.follower_changes.removed
        );
        timeGrouped.following_changes.added.push(
          ...track.following_changes.added
        );
        timeGrouped.following_changes.removed.push(
          ...track.following_changes.removed
        );
      } else if (trackTime >= twoWeeksStart) {
        timeGrouped.follower_changes.added.push(
          ...track.follower_changes.added
        );
        timeGrouped.follower_changes.removed.push(
          ...track.follower_changes.removed
        );
        timeGrouped.following_changes.added.push(
          ...track.following_changes.added
        );
        timeGrouped.following_changes.removed.push(
          ...track.following_changes.removed
        );
      } else if (trackTime >= monthStart) {
        timeGrouped.follower_changes.added.push(
          ...track.follower_changes.added
        );
        timeGrouped.follower_changes.removed.push(
          ...track.follower_changes.removed
        );
        timeGrouped.following_changes.added.push(
          ...track.following_changes.added
        );
        timeGrouped.following_changes.removed.push(
          ...track.following_changes.removed
        );
      }
    }

    return timeGrouped;
  }

  useEffect(() => {
    setLoading(true);
    groupTracksByTimeAndFetchUsers()
      .then((timeGrouped) => {
        const fids = [
          ...timeGrouped.follower_changes.added,
          ...timeGrouped.follower_changes.removed,
          ...timeGrouped.following_changes.added,
          ...timeGrouped.following_changes.removed,
        ];
        const uniqueFids = [...new Set(fids)];
        const body = JSON.stringify({ fids: uniqueFids });
        return fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body,
        }).then((res) => {
          if (res.ok) {
            return res.json().then((users) => {
              setUsers(users);
              setTimeGrouped(timeGrouped);
              setLoading(false);
            });
          } else {
            throw new Error("Error fetching users");
          }
        });
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, []);

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

export default Follow;
