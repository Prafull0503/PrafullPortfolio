import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import '../styles/ScrollToTop.css';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`scroll-to-top ${isVisible ? 'scroll-to-top--visible' : ''}`}
      aria-label="Scroll to top"
    >
      {/* Hand icon using custom SVG representing a hand pointing up */}
      <svg
        className="scroll-to-top__hand"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        width="20"
        height="20"
      >
        <path d="M18 13v-6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v6" />
        <path d="M14 11V3a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8" />
        <path d="M10 12V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v6" />
        <path d="M6 14v-2a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7a6 6 0 0 0 6 6h4a6 6 0 0 0 6-6V13" />
      </svg>
      <ArrowUp size={14} className="scroll-to-top__arrow" />
    </button>
  );
};

export default ScrollToTop;
