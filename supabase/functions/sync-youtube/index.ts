import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const apiKey = Deno.env.get("YOUTUBE_API_KEY");
    if (!apiKey) throw new Error("YOUTUBE_API_KEY secret is not configured.");

    const handle = "@astroyogiumesh";

    // 1. Resolve handle to get channel details
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?key=${apiKey}&forHandle=${handle}&part=contentDetails`,
    );
    const channelData = await channelRes.json();
    const uploadsPlaylistId = channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsPlaylistId) throw new Error("Could not resolve uploads playlist for handle.");

    // 2. Fetch latest 50 items from the uploads playlist
    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&playlistId=${uploadsPlaylistId}&part=snippet&maxResults=50`,
    );
    const playlistData = await playlistRes.json();

    const items = playlistData.items || [];
    const insertedVideos = [];

    // 3. Map and UPSERT into public.youtube_videos
    for (const item of items) {
      const videoId = item.snippet?.resourceId?.videoId;
      const title = item.snippet?.title || "Devotional Video";
      const description = item.snippet?.description || "";
      if (!videoId) continue;

      const isShort =
        title.toLowerCase().includes("#shorts") || description.toLowerCase().includes("#short");
      const videoType = isShort ? "short" : "video";

      const { data, error } = await supabase
        .from("youtube_videos")
        .upsert(
          {
            id: videoId,
            title,
            type: videoType,
            embed: `https://www.youtube.com/embed/${videoId}`,
          },
          { onConflict: "id" },
        )
        .select()
        .single();

      if (!error && data) {
        insertedVideos.push(data);
      }
    }

    return new Response(JSON.stringify({ success: true, synced: insertedVideos.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
