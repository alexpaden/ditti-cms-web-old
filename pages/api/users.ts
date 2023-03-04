import { MerkleAPIClient, UserProfile } from "@standard-crypto/farcaster-js";
import { NextApiRequest, NextApiResponse } from "next";

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

async function fetchUsersByFids(fids: number[]) {
  const client = new MerkleAPIClient({ secret: process.env.NEXT_WARP_SECRET! });
  const promises = fids.map((fid) => client.lookupUserByFid(fid));
  const responses = await Promise.all(promises);
  try {
    const users = responses.map((response) => ({
      fid: response?.fid,
      username: response?.username || "",
      pfp: response?.pfp || { url: "", verified: false },
      profile: response?.profile as UserProfile,
      followerCount: response?.followerCount,
      followingCount: response?.followingCount,
      referrerUsername: response?.referrerUsername || "",
      viewerContext: response?.viewerContext || {
        following: false,
        followedBy: false,
        canSendDirectCasts: false,
      },
    }));
    return users;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { fids } = req.body;
    const users = await fetchUsersByFids(fids);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
}
