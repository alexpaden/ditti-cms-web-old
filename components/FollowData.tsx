import { useEffect, useState } from "react";
import { User, TimeGrouped } from "../types";
import FollowUI from "../components/FollowUI";

type FollowDataProps = {
  sessionFid: number;
};

const FollowData = ({ sessionFid }: FollowDataProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [timeGrouped, setTimeGrouped] = useState<TimeGrouped | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showFollowing, setShowFollowing] = useState<boolean>(false); // set initial value to be false

  async function fetchTracks() {
    const res = await fetch(`/api/tracks/${sessionFid}`);
    if (res.ok) {
      return res.json();
    } else throw new Error("Error fetching tracks");
  }

  async function fetchUsers(fids: number[]) {
    const body = JSON.stringify({ fids });
    const res = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });
    if (res.ok) {
      return res.json();
    } else throw new Error("Error fetching users");
  }

  const toggleShowFollowing = () => {
    setShowFollowing(!showFollowing);
  };

  async function groupTracksByTime() {
    const tracks = await fetchTracks();

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

    // Keep track of users who have been added or removed to prevent duplicates
    const addedUsers: Set<number> = new Set();
    const removedUsers: Set<number> = new Set();

    for (const track of tracks) {
      // Only consider tracks created before now
      const trackTime = new Date(track.created_at).getTime();
      if (trackTime > now) {
        continue;
      }

      // Add new users who were not previously removed
      if (
        typeof track.follower_changes.added === "object" &&
        track.follower_changes.added !== null
      ) {
        for (const added of Object.keys(track.follower_changes.added)) {
          const fid = parseInt(added, 10);
          if (!removedUsers.has(fid) && !addedUsers.has(fid)) {
            addedUsers.add(fid);
            timeGrouped.follower_changes.added.push(fid);
          }
        }
      }
      if (
        typeof track.following_changes.added === "object" &&
        track.following_changes.added !== null
      ) {
        for (const added of Object.keys(track.following_changes.added)) {
          const fid = parseInt(added, 10);
          if (!removedUsers.has(fid) && !addedUsers.has(fid)) {
            addedUsers.add(fid);
            timeGrouped.following_changes.added.push(fid);
          }
        }
      }

      // Remove users who were previously added
      if (
        typeof track.follower_changes.removed === "object" &&
        track.follower_changes.removed !== null
      ) {
        for (const removed of Object.keys(track.follower_changes.removed)) {
          const fid = parseInt(removed, 10);
          if (addedUsers.has(fid)) {
            addedUsers.delete(fid);
            const index = timeGrouped.follower_changes.added.indexOf(fid);
            if (index !== -1) {
              timeGrouped.follower_changes.added.splice(index, 1);
            }
          } else if (!removedUsers.has(fid)) {
            removedUsers.add(fid);
            timeGrouped.follower_changes.removed.push(fid);
          }
        }
      }
      for (const removed of Object.keys(track.following_changes.removed)) {
        const fid = parseInt(removed, 10);
        if (addedUsers.has(fid)) {
          addedUsers.delete(fid);
          const index = timeGrouped.following_changes.added.indexOf(fid);
          if (index !== -1) {
            timeGrouped.following_changes.added.splice(index, 1);
          }
        } else if (!removedUsers.has(fid)) {
          removedUsers.add(fid);
          timeGrouped.following_changes.removed.push(fid);
        }
      }
    }
    return timeGrouped;
  }

  useEffect(() => {
    setLoading(true);
    groupTracksByTime()
      .then((timeGrouped) => {
        const fids = showFollowing
          ? [
              ...timeGrouped.following_changes.added,
              ...timeGrouped.following_changes.removed,
            ]
          : [
              ...timeGrouped.follower_changes.added,
              ...timeGrouped.follower_changes.removed,
            ];
        const uniqueFids = [...new Set(fids)];
        fetchUsers(uniqueFids)
          .then((users) => {
            setUsers(users);
            setTimeGrouped(timeGrouped);
            setLoading(false);
          })
          .catch((err) => {
            console.error(err);
            setError(err.message);
          });
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, [showFollowing]);

  return (
    <FollowUI
      users={users}
      timeGrouped={timeGrouped}
      showFollowing={showFollowing}
      sessionFid={sessionFid}
      toggleShowFollowing={() => setShowFollowing(!showFollowing)}
    />
  );
};

export default FollowData;
