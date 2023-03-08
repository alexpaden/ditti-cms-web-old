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
      // Handle follower changes

      for (const added of track.follower_changes.added) {
        if (
          !timeGrouped.follower_changes.added.includes(added) &&
          !timeGrouped.follower_changes.removed.includes(added)
        ) {
          timeGrouped.follower_changes.added.push(added);
        }
      }
      for (const removed of track.follower_changes.removed) {
        if (
          !timeGrouped.follower_changes.removed.includes(removed) &&
          !timeGrouped.follower_changes.added.includes(removed)
        ) {
          timeGrouped.follower_changes.removed.push(removed);
        }
      }
      // Handle following changes
      for (const added of track.following_changes.added) {
        if (
          !timeGrouped.following_changes.added.includes(added) &&
          !timeGrouped.following_changes.removed.includes(added)
        ) {
          timeGrouped.following_changes.added.push(added);
        }
      }
      for (const removed of track.following_changes.removed) {
        if (
          !timeGrouped.following_changes.removed.includes(removed) &&
          !timeGrouped.following_changes.added.includes(removed)
        ) {
          timeGrouped.following_changes.removed.push(removed);
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
