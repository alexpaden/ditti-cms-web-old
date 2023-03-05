import { getSession, GetSessionParams } from "next-auth/react";
import Follow from "./follow";

export default function Test({ fid }: { fid: number }) {
  return (
    <div>
      <Follow sessionFid={fid} />
    </div>
  );
}

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
