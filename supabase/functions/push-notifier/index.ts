import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";
import webpush from "npm:web-push";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const vapidPublic = Deno.env.get("VAPID_PUBLIC_KEY") ?? "";
    const vapidPrivate = Deno.env.get("VAPID_PRIVATE_KEY") ?? "";
    if (!vapidPublic || !vapidPrivate) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY must be set in Edge Function secrets.",
          sent: 0,
          failed: 0,
          subscribers: 0,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    webpush.setVapidDetails("mailto:info@namamivindhyavasini.org", vapidPublic, vapidPrivate);

    const bodyJson = await req.json();
    const { record, table, type } = bodyJson;

    let title = "Jai Maa Vindhyavasini";
    let body = "New content added.";
    let url = "/";

    if (type === "MANUAL") {
      title = bodyJson.title || title;
      body = bodyJson.body || body;
      url = bodyJson.url || url;
    } else {
      if (type !== "INSERT") {
        return new Response(
          JSON.stringify({ status: "skipped", sent: 0, failed: 0, subscribers: 0 }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      if (table === "sandesh") {
        title = "आज का संदेश (Daily Sandesh)";
        body = record.message.substring(0, 100) + "...";
        url = "/sandesh";
      } else if (table === "events") {
        title = `Upcoming Event: ${record.title}`;
        body = record.description.substring(0, 100) + "...";
        url = "/events";
      } else if (table === "youtube_videos") {
        title = record.type === "short" ? "New YouTube Short" : "New Devotional Video";
        body = record.title;
        url = record.type === "short" ? "/shorts" : "/videos";
      } else if (table === "gallery") {
        title = "Maa ka Divya Shringar";
        body = record.caption || "New darshan photo added to gallery.";
        url = "/gallery";
      }
    }

    const payload = JSON.stringify({ title, body, url });

    const { data: subs, error: subsError } = await supabase
      .from("push_subscriptions")
      .select("id, endpoint, p256dh, auth");

    if (subsError) {
      throw new Error(subsError.message);
    }

    const subscribers = subs?.length ?? 0;
    let sent = 0;
    let failed = 0;

    const promises = (subs || []).map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload,
        );
        sent += 1;
      } catch (err: any) {
        failed += 1;
        if (err.statusCode === 410 || err.statusCode === 404) {
          await supabase.from("push_subscriptions").delete().eq("id", sub.id);
        }
      }
    });

    await Promise.all(promises);

    return new Response(JSON.stringify({ success: true, sent, failed, subscribers }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message, success: false, sent: 0, failed: 0, subscribers: 0 }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});
