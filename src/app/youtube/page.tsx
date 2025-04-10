"use client";

import { useState } from "react";
import axios from "axios";
import { FaYoutube } from "react-icons/fa";
import { motion } from "framer-motion";

// Interface for the YouTube API response
interface YouTubeResponse {
    status: string;
    result: {
        msg: string;
        title: string;
        metadata: {
            id: string;
            duration: string;
            thumbnail: string;
            views: string;
            description: string;
            lengthSeconds: string;
            uploadDate: string;
        };
        author: {
            name: string;
            url: string;
            bio: string;
            image: string;
            subCount: number;
        };
        url: string;
        format: string;
        quality: string;
        media: string;
        qualityOptions?: {
            quality: string;
            url: string;
        }[];
    };
    creator: string;
}

const YouTubeDownloader = () => {
    const [url, setUrl] = useState<string>("");
    const [result, setResult] = useState<YouTubeResponse["result"] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedQuality, setSelectedQuality] = useState<string>("auto");

    const qualities = ["1080p", "720p", "480p", "360p", "240p", "144p"];

    // Function to handle download button click
    const handleDownload = async () => {
        if (!url.trim() || !url.includes("youtu")) {
            setError("Please enter a valid YouTube URL");
            return;
        }
        
        setLoading(true);
        setError(null);
        
        try {
            // Format URL by removing unnecessary parameters
            let processedUrl = url.trim();
            
            if (processedUrl.includes('youtube.com/watch')) {
                const videoIdMatch = processedUrl.match(/v=([^&]+)/);
                if (videoIdMatch && videoIdMatch[1]) {
                    processedUrl = `https://www.youtube.com/watch?v=${videoIdMatch[1]}`;
                }
            } else if (processedUrl.includes('youtu.be/')) {
                const shortUrlMatch = processedUrl.match(/youtu\.be\/([^?&]+)/);
                if (shortUrlMatch && shortUrlMatch[1]) {
                    processedUrl = `https://youtu.be/${shortUrlMatch[1]}`;
                }
            }
            
            const encodedUrl = encodeURIComponent(processedUrl);
            // Convert quality format for API (remove 'p' suffix)
            const quality = selectedQuality === "auto" ? "720" : selectedQuality.replace('p', '');
            
            // Use backend proxy API to avoid CORS issues
            const proxyUrl = `/api/youtube/proxy?url=${encodedUrl}&quality=${quality}`;
            
            console.log("Requesting download:", { url: processedUrl, quality });
            
            const response = await fetch(proxyUrl);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(
                    errorData?.message || 
                    `Server error (${response.status}): ${response.statusText}`
                );
            }
            
            const data = await response.json();
            
            if (data.status === "success" && data.result && data.result.media) {
                // Store video info for display
                setResult(data.result);
                setError(null);
                
                // Redirect to download URL
                window.location.href = data.result.media;
            } else {
                throw new Error(data.message || "Failed to get video download link");
            }
        } catch (err: any) {
            console.error("Download error:", err);
            setError(`Download failed: ${err.message}`);
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
                    <FaYoutube className="mr-2 text-red-500" />
                    YouTube Video Downloader
                </span>
            </motion.h1>
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mb-6 sm:mb-8"
            >
                <div className="flex flex-col md:flex-row gap-3">
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Paste YouTube video URL here..."
                        className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-700/50 bg-black/30 text-white backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
                    />
                    <div className="flex flex-row gap-2 mt-2 md:mt-0">
                        <select
                            value={selectedQuality}
                            onChange={(e) => setSelectedQuality(e.target.value)}
                            className="bg-black/30 text-white border border-gray-700/50 rounded-lg px-2 sm:px-3 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all backdrop-blur-sm text-sm"
                        >
                            <option value="auto">Auto Quality</option>
                            {qualities.map(quality => (
                                <option key={quality} value={quality}>{quality}</option>
                            ))}
                        </select>
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            type="button"
                            onClick={handleDownload}
                            disabled={loading}
                            className="primary px-4 sm:px-6 py-2 sm:py-3"
                        >
                            {loading ? "Processing..." : "Download"}
                        </motion.button>
                    </div>
                </div>
            </motion.div>

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
                    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-red-400/70"></div>
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
                                src={result.metadata.thumbnail}
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
                                    src={result.author.image}
                                    alt={result.author.name}
                                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-2 sm:mr-3 border border-gray-700/30"
                                />
                                <h2 className="text-lg sm:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-orange-300">
                                    {result.author.name}
                                </h2>
                            </motion.div>

                            <motion.h3
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.35, duration: 0.4 }}
                                className="text-gray-100 font-medium mb-3 line-clamp-2 text-base sm:text-lg"
                            >
                                {result.title}
                            </motion.h3>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.4 }}
                                className="text-gray-200 mb-4 sm:mb-6 line-clamp-3 text-sm sm:text-base"
                            >
                                {result.metadata.description}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.8 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                                className="text-center mt-6 sm:mt-10 text-xs sm:text-sm text-gray-400/80"
                            >
                                <p>Enter a valid YouTube video URL to download videos</p>
                                <p className="mt-1">
                                    Example: https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default YouTubeDownloader;
