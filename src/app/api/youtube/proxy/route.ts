import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const youtubeUrl = searchParams.get("url");
    const quality = searchParams.get("quality") || "720";
    
    if (!youtubeUrl) {
      return NextResponse.json({ status: "error", message: "URL parameter is required" }, { status: 400 });
    }

    // Construct the external API URL
    const apiKey = "free";
    const format = "mp4";
    const externalApiUrl = `https://restapi.rizk.my.id/ytdown?url=${youtubeUrl}&format=${format}&quality=${quality}&apikey=${apiKey}`;
    
    console.log(`Proxying request to: ${externalApiUrl}`);
    
    // Make the request to the external API
    const response = await fetch(externalApiUrl, {
      headers: {
        "Accept": "application/json"
      }
    });
    
    // Get the response data
    const data = await response.json();
    
    // Return the response from the external API
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("YouTube proxy error:", error);
    return NextResponse.json(
      { 
        status: "error", 
        message: "Failed to fetch video data", 
        error: error.message 
      }, 
      { status: 500 }
    );
  }
}
