import React, { useState } from 'react';
import '../styles/MyBlogs.css';
import '../styles/Sections.css';

const blogs = [
  {
    id: 1,
    title: 'Your First Agentic AI — From Concepts to Production',
    tagline: 'Understand the architecture. Master the patterns. Build your own agents.',
    author: 'Mohammad Taqui Alam',
    authorRole: 'AI Engineer',
    platform: 'Medium',
    date: 'Aug 2026',
    readTime: '15 min read',
    thumbnail: '/blog_agentic_ai.jpg',
    url: 'https://medium.com/@alamtaqui/your-first-agentic-ai-from-concepts-to-production-7400b4589a5e',
    tags: ['Agentic AI', 'LangGraph', 'Docker', 'AWS', 'CI/CD', 'RAG'],
    summary:
      'A practical deep dive into the foundations of Agentic AI, covering how agents are structured, how state and memory are managed, and how common workflow patterns shape their behavior. The article also explores production-oriented capabilities such as persistence, threading, streaming, RAG, Human-in-the-Loop, and observability, followed by a high-level look at taking an agent from code to production using Docker, AWS, and CI/CD. The focus is on building the right mental models and architectural understanding so readers can confidently design and build their own agentic systems.',
  },
];

const BlogCard = ({ blog }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => setIsFlipped((prev) => !prev);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleFlip();
    }
  };

  return (
    <div
      className={`blog-card ${isFlipped ? 'blog-card--flipped' : ''}`}
      onClick={handleFlip}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`${blog.title}. Click to ${isFlipped ? 'see details' : 'read summary'}`}
    >
      <div className="blog-card__inner">
        {/* ===== FRONT SIDE ===== */}
        <div className="blog-card__front">
          <div className="blog-card__thumbnail-wrapper">
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="blog-card__thumbnail"
              loading="lazy"
            />
            <div className="blog-card__thumbnail-overlay">
              <span className="blog-card__platform-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
                </svg>
                {blog.platform}
              </span>
            </div>
          </div>

          <div className="blog-card__details">
            <h3 className="blog-card__title">{blog.title}</h3>

            {blog.tagline && (
              <p className="blog-card__tagline">{blog.tagline}</p>
            )}

            <div className="blog-card__author-box">
              <span className="blog-card__author-name">Written by <strong>{blog.author}</strong></span>
              <span className="blog-card__author-role">{blog.authorRole}</span>
            </div>

            <div className="blog-card__meta">
              <span className="blog-card__meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
                </svg>
                {blog.date}
              </span>
              <span className="blog-card__meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                {blog.readTime}
              </span>
            </div>

            <div className="blog-card__tags">
              {blog.tags.map((tag, i) => (
                <span key={i} className="blog-card__tag">{tag}</span>
              ))}
            </div>

            <div className="blog-card__flip-hint">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 014-4h14" /><path d="M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 01-4 4H3" />
              </svg>
              Click to read summary
            </div>
          </div>
        </div>

        {/* ===== BACK SIDE ===== */}
        <div className="blog-card__back">
          <div className="blog-card__back-content">
            <div className="blog-card__back-header">
              <div className="blog-card__back-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5v-15A2.5 2.5 0 016.5 2H20v20H6.5a2.5 2.5 0 010-5H20" />
                  <path d="M8 7h6" /><path d="M8 11h8" />
                </svg>
              </div>
              <h3 className="blog-card__back-title">Summary</h3>
            </div>

            <p className="blog-card__summary">{blog.summary}</p>

            <a
              href={blog.url}
              target="_blank"
              rel="noopener noreferrer"
              className="blog-card__read-btn"
              onClick={(e) => e.stopPropagation()}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" x2="21" y1="14" y2="3" />
              </svg>
              Read Full Article on Medium
            </a>

            <div className="blog-card__flip-hint blog-card__flip-hint--back">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 014-4h14" /><path d="M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 01-4 4H3" />
              </svg>
              Click to flip back
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MyBlogs = () => {
  return (
    <section id="blogs" className="section section--blogs">
      <div className="section__container">
        <div className="section__header scroll-reveal">
          <h2 className="section__title">My Blogs</h2>
          <div className="section__divider" />
          <p className="section__subtitle">
            I write about AI, engineering, and the journey from concept to production.
          </p>
        </div>

        <div className="blogs__grid">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MyBlogs;
