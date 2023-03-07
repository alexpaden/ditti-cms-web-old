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

const fetchTracks = async (fid: number) => {
  try {
    const url = `https://ditti-cms-api-production.up.railway.app/follow-trackers/${fid}`;
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

const requestNewTrack = async (fid: number) => {
  try {
    const url = `https://ditti-cms-api-production.up.railway.app/follow-trackers/${fid}`;
    const headers = new Headers();
    const DITTI_API_KEY = process.env.NEXT_DITTI_API_KEY!;
    headers.append("Authorization", `${DITTI_API_KEY}`);

    const options = {
      method: "POST",
      headers: headers,
    };

    const res = await fetch(url, options);
    return res;
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
    const { slug } = req.query;
    const trackId = Number(slug);
    console.log(trackId);

    if (req.method === "POST") {
      try {
        await requestNewTrack(trackId);
        res.status(200).json({ message: "Track added successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add track" });
      }
    } else {
      try {
        const tracks: Tracks = await fetchTracks(trackId);
        res.status(200).json(tracks);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch tracks" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unknown error occurred in /tracks/[slug]" });
  }
}
