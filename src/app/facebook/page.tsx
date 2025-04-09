"use client";

import { useState } from "react";
import { FaFacebookSquare } from "react-icons/fa";
import axios from "axios";

interface FacebookVideoData {
  url: string;
  duration_ms: number;
  sd: string;
  hd: string;
  title: string;
  thumbnail: string;
}

interface FacebookResponse {
  succes: boolean;
  status: number;
  author: string;
  data: FacebookVideoData;
}

export default function FacebookPage() {
  const [url, setUrl] = useState<string>("");
  const [videoData, setVideoData] = useState<FacebookVideoData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      setError("Please enter a Facebook video URL");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setVideoData(null);

      const encodedUrl = encodeURIComponent(url);

      const response = await axios.get<FacebookResponse>(
        `https://api.ferdev.my.id/downloader/facebook?link=${encodedUrl}`,
        {
          headers: {
            Accept: "application/json",
          },
          timeout: 15000,
        }
      );

      if (response.data.succes && response.data.status === 200 && response.data.data) {
        setVideoData(response.data.data);
      } else {
        throw new Error("Failed to fetch video data");
      }
    } catch (err: any) {
      console.error("Error fetching video:", err);
      if (err.code === "ECONNABORTED") {
        setError(
          "Request timed out. The server might be busy, please try again later."
        );
      } else if (err.message === "Network Error") {
        setError(
          "Network connection issue. Please check your internet connection and try again."
        );
      } else if (err.response) {
        setError(
          `Server error: ${err.response.status}. Please try again later.`
        );
      } else {
        setError("Failed to download video. Please check the URL and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 rounded-lg backdrop-blur-xl bg-black/15 z-10 relative border border-gray-800/30">
      <h1 className="text-3xl font-bold text-center mb-8">
        <span className="flex items-center justify-center">
          <FaFacebookSquare className="mr-2 text-blue-400" />
          Facebook Video Downloader
        </span>
      </h1>

      <form onSubmit={handleDownload} className="mb-8">
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste Facebook video URL here..."
            className="flex-1 px-4 py-3 border border-gray-700/50 bg-black/30 text-white backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="primary px-6 py-3"
          >
            {loading ? "Processing..." : "Download"}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 mb-6 bg-red-900/30 backdrop-blur-sm border-l-4 border-red-500/70 text-red-100">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400/70"></div>
        </div>
      )}

      {videoData && (
        <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 transition-all duration-300 ease-in-out border border-gray-800/40">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 relative">
              <img
                src={videoData.thumbnail}
                alt="Video thumbnail"
                className="rounded-lg w-full h-auto object-cover shadow-md"
              />
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-sm">
                {formatDuration(videoData.duration_ms)}
              </div>
            </div>
            <div className="md:w-2/3">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-100">
                  Facebook Video
                </h2>
              </div>

              <p className="text-gray-200 mb-6 line-clamp-3">{videoData.title}</p>

              <div className="space-y-3">
                <h3 className="text-lg font-medium mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-blue-200">
                  Download Options
                </h3>

                <a
                  href={videoData.hd}
                  download
                  className="flex items-center justify-between bg-gradient-to-r from-blue-600/40 to-blue-700/40 text-white px-5 py-3 rounded-lg hover:from-blue-600/60 hover:to-blue-700/60 backdrop-blur-sm transition-all w-full mb-2 border border-blue-500/20"
                >
                  <span>Download HD Quality</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>

                <a
                  href={videoData.sd}
                  download
                  className="flex items-center justify-between bg-gradient-to-r from-gray-800/40 to-gray-700/40 text-white px-5 py-3 rounded-lg hover:from-gray-800/60 hover:to-gray-700/60 backdrop-blur-sm transition-all w-full border border-gray-600/20"
                >
                  <span>Download SD Quality</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-center mt-10 text-sm text-gray-400/80">
        <p>Enter a valid Facebook video URL to download videos</p>
        <p className="mt-1">Example: https://www.facebook.com/watch?v=1234567890</p>
      </div>
    </div>
  );
}
