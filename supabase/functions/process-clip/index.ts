import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Cobalt v11 instances (require POST / with JSON body)
const COBALT_V11_INSTANCES = [
  "https://cobalt-backend.canine.tools",
  "https://cobalt-api.meowing.de",
  "https://capi.3kh0.net",
];

// Cobalt v7 instance (uses POST /api/json with different body format)
const COBALT_V7_INSTANCES = [
  "https://downloadapi.stuff.solutions",
];

async function tryCobaltV11(url: string, videoQuality: string, isAudioOnly: boolean): Promise<{ downloadUrl: string; filename: string } | null> {
  const payload: Record<string, unknown> = {
    url,
    videoQuality,
    ...(isAudioOnly && { downloadMode: "audio", audioFormat: "mp3" }),
  };

  for (const instance of COBALT_V11_INSTANCES) {
    try {
      console.log(`Trying v11 instance: ${instance}`);
      const res = await fetch(instance, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log(`v11 response from ${instance}:`, JSON.stringify(data).slice(0, 500));

      if (data.status === "tunnel" || data.status === "redirect") {
        return { downloadUrl: data.url, filename: data.filename || "clip" };
      }
      if (data.status === "picker" && data.picker?.length > 0) {
        return { downloadUrl: data.picker[0].url, filename: "clip" };
      }
    } catch (e) {
      console.error(`v11 instance ${instance} failed:`, e);
    }
  }
  return null;
}

async function tryCobaltV7(url: string, videoQuality: string, isAudioOnly: boolean): Promise<{ downloadUrl: string; filename: string } | null> {
  const payload: Record<string, unknown> = {
    url,
    vQuality: videoQuality,
    ...(isAudioOnly && { isAudioOnly: true, aFormat: "mp3" }),
  };

  for (const instance of COBALT_V7_INSTANCES) {
    try {
      console.log(`Trying v7 instance: ${instance}/api/json`);
      const res = await fetch(`${instance}/api/json`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log(`v7 response from ${instance}:`, JSON.stringify(data).slice(0, 500));

      if (data.status === "stream" || data.status === "redirect") {
        return { downloadUrl: data.url, filename: data.filename || "clip" };
      }
      if (data.status === "picker" && data.picker?.length > 0) {
        return { downloadUrl: data.picker[0].url, filename: "clip" };
      }
    } catch (e) {
      console.error(`v7 instance ${instance} failed:`, e);
    }
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub;

    const body = await req.json();
    const { url, quality, title, startTime, endTime, isPublic, shortsMode, gamingMode } = body;

    if (!url) {
      return new Response(JSON.stringify({ error: "URL is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const qualityMap: Record<string, string> = {
      "1080p": "1080",
      "720p": "720",
      "480p": "480",
      "360p": "360",
      "144p": "144",
      "MP3": "144",
    };

    const isAudioOnly = quality === "MP3";
    const videoQuality = qualityMap[quality] || "720";

    // Try v11 instances first, then fall back to v7
    console.log("Attempting to download video...");
    let result = await tryCobaltV11(url, videoQuality, isAudioOnly);
    if (!result) {
      console.log("All v11 instances failed, trying v7...");
      result = await tryCobaltV7(url, videoQuality, isAudioOnly);
    }

    if (!result) {
      return new Response(
        JSON.stringify({ error: "All download services are currently unavailable. Please try again later." }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Save clip record to database
    const duration = endTime - startTime;
    const { data: clip, error: dbError } = await supabase.from("clips").insert({
      user_id: userId,
      source_url: url,
      title: title || "Untitled Clip",
      quality: quality || "720p",
      start_time: startTime || 0,
      end_time: endTime || 0,
      duration,
      is_public: isPublic || false,
    }).select().single();

    if (dbError) {
      console.error("DB error:", dbError);
      return new Response(
        JSON.stringify({ error: "Failed to save clip", details: dbError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        downloadUrl: result.downloadUrl,
        filename: result.filename,
        clip,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
