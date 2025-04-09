"use client";

import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface DouyinResult {
  title: string;
  thumbnail: string;
  download: {
    no_watermark: string;
    with_watermark: string;
    mp3: string;
  };
}

interface ApiResponse {
  success: boolean;
  status: number;
  author: string;
  result: DouyinResult;
}

export default function DouyinPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DouyinResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url) {
      setError('Please enter a valid Douyin URL');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const encodedUrl = encodeURIComponent(url);
      const response = await axios.get<ApiResponse>(
        `https://api.ferdev.my.id/downloader/douyin?link=${encodedUrl}`,
        {
          headers: {
            'Accept': 'application/json',
          },
          timeout: 15000
        }
      );

      if (response.data.success && response.data.status === 200) {
        setResult(response.data.result);
      } else {
        setError('Failed to fetch video data. Please try again with a different video.');
      }
    } catch (err: any) {
      // More detailed error handling
      if (err.code === 'ECONNABORTED') {
        setError('Request timed out. The server might be busy, please try again later.');
      } else if (err.message === 'Network Error') {
        setError('Network connection issue. Please check your internet connection and try again.');
      } else if (err.response) {
        setError(`Server error: ${err.response.status}. Please try again later.`);
      } else {
        setError('An error occurred while fetching the video. Please try again.');
      }
      console.error('Douyin API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 rounded-lg backdrop-blur-xl bg-black/15 z-10 relative border border-gray-800/30">
      <h1 className="text-3xl font-bold text-center mb-8">
        <span>Douyin Video Downloader</span>
      </h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste Douyin video URL here..."
            className="flex-1 px-4 py-3 border border-gray-700/50 bg-black/30 text-white backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="primary px-6 py-3"
          >
            {loading ? 'Processing...' : 'Download'}
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-400/70"></div>
        </div>
      )}

      {result && (
        <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 transition-all duration-300 ease-in-out border border-gray-800/40">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <img
                src={result.thumbnail}
                alt="Video thumbnail"
                className="rounded-lg w-full h-auto object-cover shadow-md"
              />
            </div>
            <div className="md:w-2/3">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">
                  Douyin Video
                </h2>
              </div>

              <p className="text-gray-200 mb-6 line-clamp-3">{result.title}</p>

              <div className="space-y-3">
                <h3 className="text-lg font-medium mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-blue-200">Download Options</h3>

                <a
                  href={result.download.no_watermark}
                  download
                  className="flex items-center justify-between bg-gradient-to-r from-pink-600/40 to-purple-600/40 text-white px-5 py-3 rounded-lg hover:from-pink-600/60 hover:to-purple-600/60 backdrop-blur-sm transition-all w-full mb-2 border border-pink-500/20"
                >
                  <span>Download Without Watermark</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>

                <a
                  href={result.download.with_watermark}
                  download
                  className="flex items-center justify-between bg-gradient-to-r from-gray-800/40 to-gray-700/40 text-white px-5 py-3 rounded-lg hover:from-gray-800/60 hover:to-gray-700/60 backdrop-blur-sm transition-all w-full mb-2 border border-gray-600/20"
                >
                  <span>Download With Watermark</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>

                <a
                  href={result.download.mp3}
                  download
                  className="flex items-center justify-between bg-gradient-to-r from-cyan-600/40 to-blue-600/40 text-white px-5 py-3 rounded-lg hover:from-cyan-600/60 hover:to-blue-600/60 backdrop-blur-sm transition-all w-full border border-cyan-500/20"
                >
                  <span>Download Audio Only</span>
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
        <p>Enter a valid Douyin video URL to download videos without watermark</p>
        <p className="mt-1">Example: https://v.douyin.com/Q9iU_9dJvGI/</p>
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  );
}
