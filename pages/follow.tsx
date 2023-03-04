import { Box, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

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

type Tracks = Track[];

const Follow = () => {
  const { data: session } = useSession();
  const [tracks, setTracks] = useState<Tracks>([]); // set initial value to be an empty array of Tracks
  const [timeGrouped, setTimeGrouped] = useState<TimeGrouped[]>([]); // set initial value to be an empty array of TimeGrouped objects
  const [showFollowing, setShowFollowing] = useState<boolean>(false); // set initial value to be false

  useEffect(() => {
    async function fetchTracks() {
      if (session?.fid) {
        console.log(session.fid);
      }
      const url = `https://ditti-cms-api-production.up.railway.app/follow-trackers/533`;
      const headers = new Headers();
      const DITTI_API_KEY =
        "LA-jhOu/dOX0alsdihDSFd9s9d8sdi6sTuYr/3ryO9uE0PBYOs01Ln6STGlAT/Bz69Csd07dSsuhueztvh7waE1w==";
      headers.append("Authorization", `${DITTI_API_KEY}`);

      const options = {
        method: "GET",
        headers: headers,
      };

      const res = await fetch(url, options);
      const data: Tracks = await res.json();
      setTracks(data);
    }

    fetchTracks();
  }, [session?.fid]);

  useEffect(() => {
    const weekInMillis = 7 * 24 * 60 * 60 * 1000; // number of milliseconds in a week
    const twoWeeksInMillis = 2 * weekInMillis; // number of milliseconds in two weeks
    const now = Date.now(); // current time in milliseconds

    const timeGrouped: TimeGrouped[] = tracks.reduce(
      (acc: TimeGrouped[], track: Track) => {
        const createdAtInMillis = new Date(track.created_at).getTime(); // convert created_at string to milliseconds
        const diff = now - createdAtInMillis; // calculate time difference from now to created_at
        const weekDiff = Math.floor(diff / weekInMillis); // calculate the number of weeks since created_at
        const twoWeeksDiff = Math.floor(diff / twoWeeksInMillis); // calculate the number of two-week intervals since created_at

        if (weekDiff === 0 || twoWeeksDiff === 0) {
          // If the track is within the last two weeks, add its changes to the latest group in the accumulator
          if (twoWeeksDiff === 0 && acc.length > 0) {
            acc[acc.length - 1].follower_changes.added.push(
              ...track.follower_changes.added
            );
            acc[acc.length - 1].follower_changes.removed.push(
              ...track.follower_changes.removed
            );
            acc[acc.length - 1].following_changes.added.push(
              ...track.following_changes.added
            );
            acc[acc.length - 1].following_changes.removed.push(
              ...track.following_changes.removed
            );
          } else {
            // Otherwise, create a new group for the current time interval and add the changes to it
            const newGroup: TimeGrouped = {
              follower_changes: {
                added: [...track.follower_changes.added],
                removed: [...track.follower_changes.removed],
              },
              following_changes: {
                added: [...track.following_changes.added],
                removed: [...track.following_changes.removed],
              },
            };
            acc.push(newGroup);
          }
        }

        return acc;
      },
      []
    );

    setTimeGrouped(timeGrouped);
  }, [tracks]);

  const toggleShowFollowing = () => {
    setShowFollowing(!showFollowing);
  };

  return (
    <div>
      <h1>Follow Tracker</h1>
      <Box>
        <Typography variant="h4">Changes in the Last Week</Typography>
        <Typography variant="h6">Followers</Typography>
        <ul>
          <li>Added: {timeGrouped[0]?.follower_changes.added.join(", ")}</li>
          <li>
            Removed: {timeGrouped[0]?.follower_changes.removed.join(", ")}
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
            <li>Added: {timeGrouped[0]?.following_changes.added.join(", ")}</li>
            <li>
              Removed: {timeGrouped[0]?.following_changes.removed.join(", ")}
            </li>
          </ul>
        )}
      </Box>
      <Box>
        <Typography variant="h4">Changes in the Last Two Weeks</Typography>
        {timeGrouped.slice(0, 2).map((group, index) => (
          <div key={index}>
            <Typography variant="h6">Week {index + 1}</Typography>
            <Typography variant="subtitle1">Followers</Typography>
            <ul>
              <li>Added: {group.follower_changes.added.join(", ")}</li>
              <li>Removed: {group.follower_changes.removed.join(", ")}</li>
            </ul>
            <Typography
              variant="subtitle1"
              onClick={toggleShowFollowing}
              style={{ cursor: "pointer" }}
            >
              Following
            </Typography>
            {showFollowing && (
              <ul>
                <li>Added: {group.following_changes.added.join(", ")}</li>
                <li>Removed: {group.following_changes.removed.join(", ")}</li>
              </ul>
            )}
          </div>
        ))}
      </Box>
    </div>
  );
};

export default Follow;
