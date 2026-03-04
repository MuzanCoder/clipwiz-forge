import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Use a public cobalt instance that doesn't require auth
const COBALT_API = "https://cobalt-api.meowing.de";

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

    // Map quality labels to cobalt videoQuality values
    const qualityMap: Record<string, string> = {
      "1080p": "1080",
      "720p": "720",
      "480p": "480",
      "360p": "360",
      "144p": "144",
      "MP3": "144", // will use audio mode
    };

    const isAudioOnly = quality === "MP3";
    const cobaltPayload: Record<string, unknown> = {
      url,
      videoQuality: qualityMap[quality] || "720",
      ...(isAudioOnly && { downloadMode: "audio", audioFormat: "mp3" }),
    };

    // Call Cobalt API
    const cobaltRes = await fetch(COBALT_API, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cobaltPayload),
    });

    const cobaltData = await cobaltRes.json();

    if (cobaltData.status === "error") {
      return new Response(
        JSON.stringify({ error: "Failed to process video", details: cobaltData.error }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get download URL from cobalt response
    let downloadUrl: string | null = null;
    if (cobaltData.status === "tunnel" || cobaltData.status === "redirect") {
      downloadUrl = cobaltData.url;
    } else if (cobaltData.status === "picker" && cobaltData.picker?.length > 0) {
      downloadUrl = cobaltData.picker[0].url;
    }

    if (!downloadUrl) {
      return new Response(
        JSON.stringify({ error: "Could not get download URL from service" }),
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
        downloadUrl,
        filename: cobaltData.filename || "clip",
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
