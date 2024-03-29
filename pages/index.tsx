import { useState } from "react";
import { getSession, GetSessionParams } from "next-auth/react";
import FollowData from "../components/FollowData";

const FollowPage = ({ fid }: { fid: number }) => {
  const [sessionFid, setSessionFid] = useState<number | null>(fid);

  return (
    <div>
      <h1>Follow Change Tracker</h1>
      {sessionFid ? (
        <FollowData sessionFid={sessionFid} />
      ) : (
        <p>Please connect your wallet to view follow changes.</p>
      )}
    </div>
  );
};

export async function getServerSideProps(
  context: GetSessionParams | undefined
) {
  const session = await getSession(context);

  if (!session) {
    return { props: {} }; // return an empty props object if there is no session
  }

  return {
    props: {
      fid: session.fid,
    },
  };
}

export default FollowPage;
