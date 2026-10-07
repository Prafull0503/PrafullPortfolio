import React, { useState, useEffect, useCallback } from 'react';
import '../styles/Navbar.css';

function Navbar({ theme, toggleTheme, currentRoute = '/', onNavigate }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('home');

  const isDarkMode = theme === 'dark';

  const navLinks = [
    { id: 'home', label: 'Home', href: '#home', route: '/', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    )},
    { id: 'about', label: 'About', href: '#about', route: '/', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    )},
    { id: 'skills', label: 'Skills', href: '#skills', route: '/', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    )},
    { id: 'projects', label: 'Projects', href: '/projects', route: '/projects', isPage: true, icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    )},
    { id: 'experience', label: 'Experience', href: '#experience', route: '/', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
      </svg>
    )},
    { id: 'blogs', label: 'Blogs', href: '#blogs', route: '/', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5v-15A2.5 2.5 0 016.5 2H20v20H6.5a2.5 2.5 0 010-5H20"/><path d="M8 7h6"/><path d="M8 11h8"/>
      </svg>
    )},
    { id: 'contact', label: 'Contact', href: '#contact', route: '/', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      </svg>
    )},
  ];

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 10);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Sync active link with route
  useEffect(() => {
    if (currentRoute === '/projects') {
      setActiveLink('projects');
    } else if (activeLink === 'projects') {
      setActiveLink('home');
    }
  }, [currentRoute]);

  const handleNavClick = (e, link) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (link.id === 'projects') {
      setActiveLink('projects');
      if (onNavigate) {
        onNavigate('/projects');
      } else {
        window.history.pushState({}, '', '/projects');
        window.dispatchEvent(new PopStateEvent('popstate'));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    // Navigating to in-page section
    if (currentRoute === '/projects') {
      // Return to homepage first, then scroll
      if (onNavigate) {
        onNavigate('/', link.id);
      } else {
        window.history.pushState({}, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
        setTimeout(() => {
          const element = document.querySelector(link.href);
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      setActiveLink(link.id);
      const element = document.querySelector(link.href);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  return (
    <header className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__container">
        <a
          href="/"
          className="navbar__logo"
          onClick={(e) => handleNavClick(e, { id: 'home', href: '#home', route: '/' })}
        >
          <div className="navbar__logo-box">PS</div>
        </a>

        <nav className="navbar__desktop">
          <ul className="navbar__links">
            {navLinks.map((link) => {
              const isActive =
                currentRoute === '/projects'
                  ? link.id === 'projects'
                  : activeLink === link.id && link.id !== 'projects';

              return (
                <li key={link.id} className="navbar__item">
                  <a
                    href={link.href}
                    className={`navbar__link ${isActive ? 'navbar__link--active' : ''}`}
                    onClick={(e) => handleNavClick(e, link)}
                  >
                    <span className="navbar__link-icon">{link.icon}</span>
                    <span className="navbar__link-text">{link.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="navbar__actions">
          <button className="navbar__theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {isDarkMode ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
              </svg>
            )}
          </button>

          <button
            className={`navbar__hamburger ${isMobileMenuOpen ? 'navbar__hamburger--open' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="navbar__hamburger-line" />
            <span className="navbar__hamburger-line" />
            <span className="navbar__hamburger-line" />
          </button>
        </div>
      </div>

      <div className={`navbar__mobile ${isMobileMenuOpen ? 'navbar__mobile--open' : ''}`}>
        <nav className="navbar__mobile-nav">
          <ul className="navbar__mobile-links">
            {navLinks.map((link, index) => {
              const isActive =
                currentRoute === '/projects'
                  ? link.id === 'projects'
                  : activeLink === link.id && link.id !== 'projects';

              return (
                <li key={link.id} className="navbar__mobile-item" style={{ animationDelay: `${index * 0.08}s` }}>
                  <a
                    href={link.href}
                    className={`navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`}
                    onClick={(e) => handleNavClick(e, link)}
                  >
                    <span className="navbar__mobile-link-icon">{link.icon}</span>
                    <span className="navbar__mobile-link-text">{link.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
