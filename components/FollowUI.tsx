import { User, TimeGrouped } from "../types";
import UserDisplay from "./UserUI";
import { useState } from "react";
import { Switch, Button, Box, Container, Typography } from "@material-ui/core";

type FollowUIProps = {
  users: User[] | null | undefined;
  timeGrouped: TimeGrouped | null;
  showFollowing: boolean;
  toggleShowFollowing: () => void;
  sessionFid: number;
};

const FollowUI = ({
  users,
  timeGrouped,
  showFollowing,
  toggleShowFollowing,
  sessionFid,
}: FollowUIProps) => {
  if (!users || !timeGrouped) {
    return <p>Loading...</p>;
  }

  const title = showFollowing ? "Following Changes" : "Follower Changes";
  const changes = showFollowing
    ? timeGrouped.following_changes
    : timeGrouped.follower_changes;

  const [showAdded, setShowAdded] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const handleCheckChanges = async () => {
    try {
      await fetch(`/api/tracks/${sessionFid}`, { method: "POST" });
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container maxWidth="md">
      <Box my={2} textAlign="center">
        <Typography variant="h4">{title}</Typography>
        <Box my={1}>
          <Button
            variant="contained"
            color="primary"
            onClick={toggleShowFollowing}
          >
            {showFollowing ? "View Follower Changes" : "View Following Changes"}
          </Button>
        </Box>
        <Box my={1}>
          <Switch
            checked={showAdded}
            onChange={() => setShowAdded(!showAdded)}
            name="showAdded"
            inputProps={{ "aria-label": "showAdded" }}
          />
          <span>{showAdded ? "Follows" : "Unfollows"}</span>
        </Box>
        <Box my={1}>
          <Button variant="contained" onClick={handleCheckChanges}>
            Check for Changes
          </Button>
        </Box>
      </Box>

      <Box my={2} textAlign="center">
        {showAdded ? (
          <div>
            {changes.added.length > 0 ? (
              <>
                <h3>Added:</h3>
                {changes.added
                  .map((fid) => {
                    const user = users.find((user) => user.fid === fid);
                    return user ? <UserDisplay key={fid} user={user} /> : null;
                  })
                  .slice(startIndex, endIndex)}
              </>
            ) : (
              <p>No added changes found.</p>
            )}
          </div>
        ) : (
          <div>
            {changes.removed.length > 0 ? (
              <>
                <h3>Removed:</h3>
                {changes.removed
                  .map((fid) => {
                    const user = users.find((user) => user.fid === fid);
                    return user ? <UserDisplay key={fid} user={user} /> : null;
                  })
                  .slice(startIndex, endIndex)}
              </>
            ) : (
              <p>No removed changes found.</p>
            )}
          </div>
        )}
      </Box>

      <Box my={2} textAlign="center">
        {(showAdded ? changes.added.length : changes.removed.length) >
          itemsPerPage && (
          <Box display="inline-block">
            {Array.from(
              {
                length: Math.ceil(
                  (showAdded ? changes.added.length : changes.removed.length) /
                    itemsPerPage
                ),
              },
              (_, i) => (
                <Button
                  key={i}
                  style={{
                    margin: "0 5px",
                    fontWeight: currentPage === i + 1 ? "bold" : "normal",
                  }}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </Button>
              )
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default FollowUI;
