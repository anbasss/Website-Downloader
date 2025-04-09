"use client";

import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';

interface TeraboxData {
  file_name: string;
  file_id: string;
  size: string;
  thumbnail: string;
  download: string;
  bytes: number;
}

interface TeraboxResponse {
  succes: boolean;
  status: number;
  author: string;
  data: TeraboxData;
}

export default function Terabox() {
  const [url, setUrl] = useState<string>('');
  const [result, setResult] = useState<TeraboxData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    if (!url) {
      toast.error('Please enter a TeraBox URL');
      setError('Please enter a valid TeraBox URL');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const encodedUrl = encodeURIComponent(url);
      const response = await fetch(`https://api.ferdev.my.id/downloader/terabox?link=${encodedUrl}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const data: TeraboxResponse = await response.json();
      
      if (data.succes && data.data) {
        setResult(data.data);
      } else {
        setError('Unable to process this link. Please check the URL and try again.');
        toast.error('Unable to process this link. Please check the URL and try again.');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred. Please try again later.');
      toast.error('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6 rounded-lg backdrop-blur-xl bg-black/15 z-10 relative border border-gray-800/30"
    >
      <ToastContainer position="top-center" theme="dark" />
      
      <motion.h1 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-3xl font-bold text-center mb-8"
      >
        <span className="flex items-center justify-center">
          TeraBox Downloader
        </span>
      </motion.h1>
      
      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        onSubmit={(e) => { e.preventDefault(); handleDownload(); }} 
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Paste TeraBox link here..."
            className="flex-1 px-4 py-3 border border-gray-700/50 bg-black/30 text-white backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="primary px-6 py-3"
          >
            {loading ? 'Processing...' : 'Download'}
          </motion.button>
        </div>
      </motion.form>

      {error && (
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400/70"></div>
        </motion.div>
      )}

      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-black/30 backdrop-blur-md rounded-xl p-6 transition-all duration-300 ease-in-out border border-gray-800/40"
        >
          <div className="flex flex-col md:flex-row gap-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="md:w-1/3"
            >
              <img 
                src={result.thumbnail} 
                alt={result.file_name} 
                className="rounded-lg w-full h-auto object-cover shadow-md" 
              />
            </motion.div>
            
            <div className="md:w-2/3">
              <motion.h2 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300"
              >
                {result.file_name}
              </motion.h2>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="mb-6 text-gray-300"
              >
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="col-span-1 font-medium">File ID:</div>
                  <div className="col-span-1">{result.file_id}</div>
                  
                  <div className="col-span-1 font-medium">Size:</div>
                  <div className="col-span-1">{result.size} ({formatBytes(result.bytes)})</div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="space-y-3"
              >
                <h3 className="text-lg font-medium mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-blue-200">
                  Download Options
                </h3>
                
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={result.download}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between bg-gradient-to-r from-blue-600/40 to-cyan-600/40 text-white px-5 py-3 rounded-lg hover:from-blue-600/60 hover:to-cyan-600/60 backdrop-blur-sm transition-all w-full border border-blue-500/20"
                >
                  <span>Download File</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
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
                
                <div className="text-xs text-gray-500 mt-3 dark:text-gray-400">
                  If the download doesn't start automatically, right-click the button and select "Save link as..."
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="text-center mt-10 text-sm text-gray-400/80"
      >
        <p>Enter a valid TeraBox file URL to download your files</p>
        <p className="mt-1">
          Example: https://terabox.com/s/xxxxx or https://1024terabox.com/s/xxxxx
        </p>
      </motion.div>
    </motion.div>
  );
}
