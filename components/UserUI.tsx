import { User } from "../types";

type UserProps = {
  user: User;
};

const UserUI = ({ user }: UserProps) => {
  const { pfp, fid, username, profile, followerCount, followingCount } = user;

  // Calculate age in years
  const now = new Date();
  const age = Math.floor(
    (now.getTime() - new Date(profile.registeredAt).getTime()) /
      (1000 * 60 * 60 * 24 * 365)
  );

  // Calculate follower/following ratio
  const ratio =
    followingCount > 0 ? followerCount / followingCount : followerCount;

  return (
    <div className="user">
      <div className="pfp">
        <img src={pfp.uri} alt={`${username}'s profile picture`} />
      </div>
      <div className="info">
        <div className="column">
          <div className="row">{fid}</div>
          <div className="row">{username}</div>
          <div className="row">{profile.displayName}</div>
          <div className="row">{age}</div>
        </div>
        <div className="column">{profile.bio}</div>
        <div className="column">
          <div className="row">{followerCount}</div>
          <div className="row">{followingCount}</div>
          <div className="row">{Math.min(100, Math.round(ratio * 100))}%</div>
        </div>
      </div>
      <style jsx>{`
        .user {
          display: flex;
          align-items: center;
          padding: 8px;
          border: 1px solid black;
          margin: 8px;
        }

        .pfp {
          width: 64px;
          height: 64px;
          margin-right: 16px;
        }

        .pfp img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .info {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          flex-grow: 1;
        }

        .column {
          display: flex;
          flex-direction: column;
          flex-basis: 100%;
          margin: 8px;
        }

        .row {
          margin: 4px 0;
        }
      `}</style>
    </div>
  );
};

export default UserUI;
