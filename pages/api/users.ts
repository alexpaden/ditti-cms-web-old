import { createClient } from "@supabase/supabase-js";
import { NextApiRequest, NextApiResponse } from "next";

async function fetchUsersByFids(fids: number[]) {
  try {
    // Create a single supabase client for interacting with your database
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_KEY!
    );

    const users = [];

    // Divide the ids into chunks of 500 and fetch each chunk separately
    for (let i = 0; i < fids.length; i += 500) {
      const chunkIds = fids.slice(i, i + 500);

      // Fetch the profiles with matching ids
      const { data, error } = await supabase
        .from("profile")
        .select("*")
        .in("id", chunkIds);

      if (error) {
        throw new Error(error.message);
      }

      // Map the response data to User objects
      const chunkUsers = data.map((profile: any) => ({
        fid: profile.id,
        username: profile.username,
        pfp: { uri: profile.avatar_url },
        profile: {
          displayName: profile.display_name,
          bio: profile.bio,
          referrer: profile.referrer,
          registeredAt: profile.registered_at,
          updatedAt: profile.updated_at,
        },
        followerCount: profile.followers,
        followingCount: profile.following,
      }));

      // Add the chunk users to the users array
      users.push(...chunkUsers);
    }

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
