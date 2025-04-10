"use client";

import { useState } from "react";
import axios from "axios";
import { FaTiktok } from "react-icons/fa";
import { motion } from "framer-motion";

// Update the interface to match the new API response structure
interface TiktokResponse {
    succes: boolean;
    status: number;
    author: string;
    data: {
        type: string;
        uniqueId: string;
        nickname: string;
        username: string;
        description: string;
        dlink: {
            nowm: string;
            wm: string;
            audio: string;
            profilePic: string;
            cover: string;
        };
        stats: {
            plays: string;
            likes: string;
            comments: string;
            shares: string;
        };
        songTitle: string;
        slides: any[];
        videoInfo: {
            nowm: string;
            wm: string;
            ttdlAudio: string;
        };
    };
}

const TiktokDownloader = () => {
    const [url, setUrl] = useState<string>("");
    const [result, setResult] = useState<TiktokResponse["data"] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!url.trim() || !url.includes("tiktok.com")) {
            setError("Please enter a valid TikTok URL");
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const encodedUrl = encodeURIComponent(url);

            // Using the correct API endpoint
            const response = await axios.get<TiktokResponse>(
                `https://api.ferdev.my.id/downloader/tiktok?link=${encodedUrl}`,
                {
                    headers: {
                        Accept: "application/json",
                    },
                    timeout: 15000, // 15 seconds timeout
                }
            );

            if (
                response.data.succes &&
                response.data.status === 200 &&
                response.data.data
            ) {
                setResult(response.data.data);
            } else {
                setError(
                    "Failed to fetch video data. Please try again with a different video."
                );
            }
        } catch (err: any) {
            // More detailed error handling
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
                setError(
                    "An error occurred while fetching the video. Please try again."
                );
            }
            console.error("TikTok API Error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto p-4 sm:p-6 rounded-lg backdrop-blur-xl bg-black/15 z-10 relative border border-gray-800/30"
        >
            <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8"
            >
                <span className="flex items-center justify-center">
                    <FaTiktok className="mr-2" />
                    Tiktok Video Downloader
                </span>
            </motion.h1>

            <motion.form 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                onSubmit={handleSubmit}
                className="mb-6 sm:mb-8"
            >
                <div className="flex flex-col md:flex-row gap-3">
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Paste TikTok video URL here..."
                        className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-700/50 bg-black/30 text-white backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
                    />
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        disabled={loading}
                        className="primary px-4 sm:px-6 py-2 sm:py-3 mt-2 md:mt-0"
                    >
                        {loading ? "Processing..." : "Download"}
                    </motion.button>
                </div>
            </motion.form>

            {error && (
                <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="p-3 sm:p-4 mb-6 bg-red-900/30 backdrop-blur-sm border-l-4 border-red-500/70 text-red-100 text-sm sm:text-base"
                >
                    {error}
                </motion.div>
            )}

            {loading && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-center items-center py-8 sm:py-12"
                >
                    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-pink-400/70"></div>
                </motion.div>
            )}

            {result && (
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-black/30 backdrop-blur-md rounded-xl p-4 sm:p-6 transition-all duration-300 ease-in-out border border-gray-800/40"
                >
                    <div className="flex flex-col md:flex-row gap-5 sm:gap-6">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                            className="md:w-1/3 w-full"
                        >
                            <img
                                src={result.dlink.cover}
                                alt="Video thumbnail"
                                className="rounded-lg w-full h-auto object-cover shadow-md mx-auto max-w-[240px] md:max-w-none"
                            />
                        </motion.div>
                        <div className="md:w-2/3 w-full mt-4 md:mt-0">
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.4 }}
                                className="flex items-center mb-3 sm:mb-4"
                            >
                                <img
                                    src={result.dlink.profilePic}
                                    alt={result.nickname || "Creator"}
                                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-2 sm:mr-3 border border-gray-700/30"
                                />
                                <h2 className="text-lg sm:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">
                                    {result.nickname || result.username || "TikTok Creator"}
                                </h2>
                            </motion.div>

                            <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.4 }}
                                className="text-gray-200 mb-4 sm:mb-6 line-clamp-3 text-sm sm:text-base"
                            >
                                {result.description}
                            </motion.p>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.4 }}
                                className="space-y-2 sm:space-y-3"
                            >
                                <h3 className="text-base sm:text-lg font-medium mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-blue-200">
                                    Download Options
                                </h3>

                                <motion.a
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    href={result.dlink.nowm}
                                    download
                                    className="flex items-center justify-between bg-gradient-to-r from-pink-600/40 to-purple-600/40 text-white px-3 sm:px-5 py-2 sm:py-3 rounded-lg hover:from-pink-600/60 hover:to-purple-600/60 backdrop-blur-sm transition-all w-full mb-2 border border-pink-500/20 text-sm sm:text-base"
                                >
                                    <span>Download Without Watermark</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 sm:h-5 sm:w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </motion.a>

                                <motion.a
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    href={result.dlink.wm}
                                    download
                                    className="flex items-center justify-between bg-gradient-to-r from-gray-800/40 to-gray-700/40 text-white px-3 sm:px-5 py-2 sm:py-3 rounded-lg hover:from-gray-800/60 hover:to-gray-700/60 backdrop-blur-sm transition-all w-full mb-2 border border-gray-600/20 text-sm sm:text-base"
                                >
                                    <span>Download With Watermark</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 sm:h-5 sm:w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </motion.a>

                                <motion.a
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    href={result.dlink.audio}
                                    download
                                    className="flex items-center justify-between bg-gradient-to-r from-cyan-600/40 to-blue-600/40 text-white px-3 sm:px-5 py-2 sm:py-3 rounded-lg hover:from-cyan-600/60 hover:to-blue-600/60 backdrop-blur-sm transition-all w-full border border-cyan-500/20 text-sm sm:text-base"
                                >
                                    <span>Download Audio Only</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 sm:h-5 sm:w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </motion.a>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            )}

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-center mt-6 sm:mt-10 text-xs sm:text-sm text-gray-400/80"
            >
                <p>
                    Enter a valid TikTok video URL to download videos without watermark
                </p>
                <p className="mt-1">
                    Example: https://www.tiktok.com/@username/video/123456789
                </p>
            </motion.div>
        </motion.div>
    );
};

export default TiktokDownloader;
