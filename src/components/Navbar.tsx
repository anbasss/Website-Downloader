"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: 'TikTok', href: '/' },
    { name: 'Instagram', href: '/instagram' },
    { name: 'Douyin', href: '/douyin' },
    { name: 'Facebook', href: '/facebook' },
    { name: 'Terabox', href: '/terabox' },
  ];

  // Handle navigation with loading indicator
  const handleNavigation = (href: string) => {
    if (pathname !== href) {
      setIsNavigating(true);
      router.push(href);
      // Reset navigation state after navigation completes
      setTimeout(() => setIsNavigating(false), 500);
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      {isNavigating && (
        <div className="absolute top-0 left-0 w-full h-1">
        </div>
      )}
      <div className="px-2 py-1.5 bg-black/30 backdrop-blur-xl rounded-full border border-white/10 shadow-lg">
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              prefetch={true}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation(item.href);
              }}
              className={`px-5 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                pathname === item.href 
                  ? 'bg-white/10 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="px-4 py-2 text-white flex items-center justify-between w-36"
          >
            <span>{pathname === '/' ? 'Menu' : navItems.find(item => item.href === pathname)?.name || 'Menu'}</span>
            <svg 
              className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Mobile dropdown */}
          {isOpen && (
            <div className="absolute left-0 right-0 mt-2 py-2 bg-black/60 backdrop-blur-xl rounded-3xl border border-white/10">
              {navItems.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  prefetch={true}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation(item.href);
                  }}
                  className={`block px-4 py-2 text-sm font-bold ${
                    pathname === item.href 
                      ? 'text-white bg-white/10' 
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
