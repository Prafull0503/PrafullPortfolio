import React, { useEffect, useRef, useState } from 'react';
import '../styles/Hero.css';

function Hero() {
  const blobRef = useRef(null);
  const textRef = useRef(null);
  const roles = [
    'Prafull Shukla',
    'Backend Developer',
    'Software Engineer',
    'Backend & AI'
  ];
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [scrollTranslateY, setScrollTranslateY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const newOpacity = Math.max(0, 1 - scrolled / 300);
      const newTranslateY = scrolled * 0.45; // 0.45x scroll speed downward slide
      setScrollOpacity(newOpacity);
      setScrollTranslateY(newTranslateY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    let currentRoleIdx = 0;
    let currentCharIdx = 0;
    let isDeleting = false;
    let timeoutId = null;

    const tick = () => {
      const currentRole = roles[currentRoleIdx];

      if (!isDeleting) {
        element.textContent = currentRole.substring(0, currentCharIdx + 1);
        currentCharIdx++;

        if (currentCharIdx === currentRole.length) {
          isDeleting = true;
          timeoutId = setTimeout(tick, 2000);
          return;
        }
        timeoutId = setTimeout(tick, 80);
      } else {
        element.textContent = currentRole.substring(0, currentCharIdx - 1);
        currentCharIdx--;

        if (currentCharIdx === 0) {
          isDeleting = false;
          currentRoleIdx = (currentRoleIdx + 1) % roles.length;
          timeoutId = setTimeout(tick, 500);
          return;
        }
        timeoutId = setTimeout(tick, 40);
      }
    };

    tick();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const techStack = [
    {
      name: 'Java', icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m18 16 4-4-4-4" /><path d="m6 8-4 4 4 4" /><path d="m14.5 4-5 16" />
        </svg>
      )
    },
    {
      name: 'SpringBoot', icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      )
    },
    {
      name: 'C', icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" strokeWidth="1.5" />
          <path d="M14 9a3 3 0 1 0 0 6" strokeWidth="2" />
        </svg>
      )
    },
    {
      name: 'Go', icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
        </svg>
      )
    },
    {
      name: 'System Design', icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="9" rx="1" />
          <rect x="14" y="3" width="7" height="5" rx="1" />
          <rect x="14" y="12" width="7" height="9" rx="1" />
          <rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
      )
    },
  ];

  return (
    <section id="home" className="hero">
      <div className="hero__container">
        <div className="hero__content">
          <h1 className="hero__intro">
            <span className="hero__greeting-text">Hello, I'm</span>
            <br />
            <span className="hero__dynamic-wrapper">
              <span ref={textRef} className="hero__role-text"></span>
              <span className="hero__role-cursor">|</span>
            </span>
          </h1>

          <div className="hero__tech-stack">
            {techStack.map((tech) => (
              <span key={tech.name} className="hero__tech-tag">
                <span className="hero__tech-icon">{tech.icon}</span>
                {tech.name}
              </span>
            ))}
          </div>

          <p className="hero__description">
            Computer Science engineer passionate about building modern web applications,
            scalable backend systems, and innovative software solutions.
          </p>

          <div className="hero__cta">
            <a href="#contact" className="hero__btn hero__btn--primary">
              <span className="hero__btn-text">Hire Me</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </a>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="hero__btn hero__btn--secondary">
              <span className="hero__btn-text">Resume</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hero__btn-icon">
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                <path d="M10 9H8" />
                <path d="M16 13H8" />
                <path d="M16 17H8" />
              </svg>
            </a>
          </div>

          <div className="hero__social">
            {/* GitHub */}
            <a href="https://github.com/Prafull0503" target="_blank" rel="noopener noreferrer" className="hero__social-link" aria-label="GitHub">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>
            {/* Email */}
            <a href="mailto:prafullshukla11@gmail.com" className="hero__social-link" aria-label="Email">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </a>
          </div>
        </div>

        <div className="hero__image-wrapper">
          <div className="hero__blob-container" ref={blobRef}>
            {/* Glow Effect Behind Photo */}
            <div className="hero__blob-glow"></div>

            {/* Photo Container with natural background blend */}
            <div className="hero__blob hero__blob--transparent">
              <img
                src="/pfp_cutout.png"
                alt="Prafull Shukla"
                className="hero__blob-image"
                draggable="false"
                onDragStart={(e) => e.preventDefault()}
                onContextMenu={(e) => e.preventDefault()}
              />

              {/* Bottom Fade Overlay */}
              <div className="hero__blob-fade"></div>
            </div>



            <div className="hero__particle hero__particle--1"></div>
            <div className="hero__particle hero__particle--2"></div>
            <div className="hero__particle hero__particle--3"></div>
            <div className="hero__particle hero__particle--4"></div>
          </div>
        </div>
      </div>

      <div className="hero__scroll">
        <a
          href="#about"
          className="hero__scroll-link"
          style={{
            opacity: scrollOpacity,
            transform: `translateY(${scrollTranslateY}px)`,
            pointerEvents: scrollOpacity === 0 ? 'none' : 'auto',
            display: 'block',
            transition: 'opacity 0.05s linear, transform 0.05s linear'
          }}
        >
          <div className="hero__scroll-mouse">
            <div className="hero__scroll-wheel" />
          </div>
        </a>
      </div>
    </section>
  );
}

export default Hero;
