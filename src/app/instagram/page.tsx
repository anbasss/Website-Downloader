"use client";

import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import AnimatedContainer from '@/components/AnimatedContainer';

// Instagram API response interface
interface InstagramResponse {
  succes: boolean;
  status: number;
  author: string;
  data: {
    success: boolean;
    type: string;
    videoUrls: {
      url: string;
      type: string;
      name: string;
      ext: string;
    }[];
    thumbnailUrl: string;
    metadata: {
      title: string;
      source: string;
      shortcode: string;
      username: string;
      takenAt: number;
      likeCount: number;
      commentCount: number;
      comments: {
        text: string;
        username: string;
      }[];
    };
    hosting: string;
    timestamp: number;
    rawResponse: any;
  };
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 }
};

const InstagramDownloader = () => {
  const [url, setUrl] = useState<string>('');
  const [result, setResult] = useState<InstagramResponse['data'] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url.trim() || !url.includes('instagram.com')) {
      setError('Please enter a valid Instagram URL');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const encodedUrl = encodeURIComponent(url);

      const response = await axios.get<InstagramResponse>(
        `https://api.ferdev.my.id/downloader/instagram?link=${encodedUrl}`,
        {
          headers: {
            'Accept': 'application/json',
          },
          timeout: 15000 // 15 seconds timeout
        }
      );

      if (response.data.succes && response.data.status === 200 && response.data.data) {
        setResult(response.data.data);
      } else {
        setError('Failed to fetch Instagram content. Please try again with a different link.');
      }
    } catch (err: any) {
      // Detailed error handling
      if (err.code === 'ECONNABORTED') {
        setError('Request timed out. The server might be busy, please try again later.');
      } else if (err.message === 'Network Error') {
        setError('Network connection issue. Please check your internet connection and try again.');
      } else if (err.response) {
        setError(`Server error: ${err.response.status}. Please try again later.`);
      } else {
        setError('An error occurred while fetching the content. Please try again.');
      }
      console.error('Instagram API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedContainer>
      <motion.h1 
        className="text-3xl font-bold text-center mb-8"
        variants={itemVariants}
      >
        <span>Instagram Content Downloader</span>
      </motion.h1>

      <motion.form 
        onSubmit={handleSubmit} 
        className="mb-8"
        variants={itemVariants}
      >
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste Instagram post or reel URL here..."
            className="flex-1 px-4 py-3 border border-gray-700/50 bg-black/30 text-white backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="primary px-6 py-3"
          >
            {loading ? 'Processing...' : 'Download'}
          </button>
        </div>
      </motion.form>

      {error && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          className="p-4 mb-6 bg-red-900/30 backdrop-blur-sm border-l-4 border-red-500/70 text-red-100"
        >
          {error}
        </motion.div>
      )}

      {loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex justify-center items-center py-12"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400/70"></div>
        </motion.div>
      )}

      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-black/30 backdrop-blur-md rounded-xl p-6 transition-all duration-300 ease-in-out border border-gray-800/40"
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <img
                src={result.thumbnailUrl}
                alt="Content thumbnail"
                className="rounded-lg w-full h-auto object-cover shadow-md"
              />
            </div>
            <div className="md:w-2/3">
              <div className="flex items-center mb-4">
                <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                  @{result.metadata.username}
                </h2>
              </div>

              <p className="text-gray-200 mb-6 line-clamp-3">{result.metadata.title}</p>

              <div className="flex flex-wrap gap-3 mb-6">
                <div className="bg-black/40 px-3 py-1 rounded-full text-sm text-gray-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  {result.metadata.likeCount.toLocaleString()}
                </div>
                <div className="bg-black/40 px-3 py-1 rounded-full text-sm text-gray-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  {result.metadata.commentCount.toLocaleString()}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-medium mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-blue-200">Download Options</h3>

                {result.videoUrls.map((video, index) => (
                  <a
                    key={index}
                    href={video.url}
                    download
                    className="flex items-center justify-between bg-gradient-to-r from-purple-600/40 to-pink-600/40 text-white px-5 py-3 rounded-lg hover:from-purple-600/60 hover:to-pink-600/60 backdrop-blur-sm transition-all w-full mb-2 border border-purple-500/20"
                  >
                    <span>Download {video.name} Video</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </a>
                ))}
              </div>

              {result.metadata.comments && result.metadata.comments.length > 0 && (
                <div className="mt-6 mx-auto">
                  <h3 className="text-lg font-medium mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-blue-200">Top Comments</h3>
                  <div className="bg-black/40 rounded-lg p-3 max-h-40 overflow-y-auto space-y-2">
                    {result.metadata.comments.slice(0, 5).map((comment, index) => (
                      <div key={index} className="border-b border-gray-700/30 pb-2">
                        <span className="text-purple-300 font-medium">@{comment.username}</span>
                        <p className="text-gray-300 text-sm">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      <motion.div 
        className="text-center mt-10 text-sm text-gray-400/80 mx-auto"
        variants={itemVariants}
      >
        <p>Enter a valid Instagram post or reel URL to download content</p>
        <p className="mt-1">Example: https://www.instagram.com/reel/XXXXX/ or https://www.instagram.com/p/XXXXX/</p>
      </motion.div>
    </AnimatedContainer>
  );
};

export default InstagramDownloader;
