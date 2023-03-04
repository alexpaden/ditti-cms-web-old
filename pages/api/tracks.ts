import { NextApiRequest, NextApiResponse } from "next";

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

const fetchTracks = async () => {
  try {
    const url = `https://ditti-cms-api-production.up.railway.app/follow-trackers/533`;
    const headers = new Headers();
    const DITTI_API_KEY = process.env.NEXT_DITTI_API_KEY!;
    headers.append("Authorization", `${DITTI_API_KEY}`);

    const options = {
      method: "GET",
      headers: headers,
    };

    const res = await fetch(url, options);
    const data: Tracks = await res.json();
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { fids } = req.body;
    const tracks: Tracks = await fetchTracks();
    res.status(200).json(tracks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tracks" });
  }
}
