import { useEffect, useState } from "react";
import { User, TimeGrouped } from "../types";
import FollowUI from "./FollowUI";

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
    console.log(sessionFid);
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
      for (const added of track.follower_changes.added) {
        if (!removedUsers.has(added) && !addedUsers.has(added)) {
          addedUsers.add(added);
          timeGrouped.follower_changes.added.push(added);
        }
      }
      for (const added of track.following_changes.added) {
        if (!removedUsers.has(added) && !addedUsers.has(added)) {
          addedUsers.add(added);
          timeGrouped.following_changes.added.push(added);
        }
      }

      // Remove users who were previously added
      for (const removed of track.follower_changes.removed) {
        if (addedUsers.has(removed)) {
          addedUsers.delete(removed);
          const index = timeGrouped.follower_changes.added.indexOf(removed);
          if (index !== -1) {
            timeGrouped.follower_changes.added.splice(index, 1);
          }
        } else if (!removedUsers.has(removed)) {
          removedUsers.add(removed);
          timeGrouped.follower_changes.removed.push(removed);
        }
      }
      for (const removed of track.following_changes.removed) {
        if (addedUsers.has(removed)) {
          addedUsers.delete(removed);
          const index = timeGrouped.following_changes.added.indexOf(removed);
          if (index !== -1) {
            timeGrouped.following_changes.added.splice(index, 1);
          }
        } else if (!removedUsers.has(removed)) {
          removedUsers.add(removed);
          timeGrouped.following_changes.removed.push(removed);
        }
      }
    }
    return timeGrouped;
  }

  useEffect(() => {
    setLoading(true);
    groupTracksByTime().then((timeGrouped) => {
      const fids = [
        ...timeGrouped.follower_changes.added,
        ...timeGrouped.follower_changes.removed,
        ...timeGrouped.following_changes.added,
        ...timeGrouped.following_changes.removed,
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
    });
  }, []);

  return (
    <FollowUI
      users={users}
      timeGrouped={timeGrouped}
      showFollowing={showFollowing}
      toggleShowFollowing={toggleShowFollowing}
    />
  );
};

export default FollowData;
