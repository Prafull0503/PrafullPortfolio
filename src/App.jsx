import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Projects from './components/Projects';
import ProjectsPage from './components/ProjectsPage';
import MyBlogs from './components/MyBlogs';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AnimatedBackground from './components/AnimatedBackground';
import useScrollReveal from './hooks/useScrollReveal';
import ScrollToTop from './components/ScrollToTop';
import TaquiAI from './components/TaquiAI';
import './App.css';

function App() {
  // Light Mode is DEFAULT
  const [theme, setTheme] = useState('light');
  const [currentRoute, setCurrentRoute] = useState(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/projects')) {
      return '/projects';
    }
    return '/';
  });

  useScrollReveal(currentRoute);

  // Initialize theme with light mode default
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    if (savedTheme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, []);

  // Sync route with browser history (back/forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.startsWith('/projects') ? '/projects' : '/';
      setCurrentRoute(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleToggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      if (next === 'light') {
        document.body.classList.add('light-mode');
      } else {
        document.body.classList.remove('light-mode');
      }
      return next;
    });
  };

  const handleNavigate = (path, targetId) => {
    if (path === '/projects') {
      if (window.location.pathname !== '/projects') {
        window.history.pushState({}, '', '/projects');
      }
      setCurrentRoute('/projects');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (window.location.pathname !== '/') {
        window.history.pushState({}, '', '/');
      }
      setCurrentRoute('/');
      if (targetId) {
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="app">
      <AnimatedBackground key={currentRoute} theme={theme} />
      <Navbar
        theme={theme}
        toggleTheme={handleToggleTheme}
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
      />
      <main>
        {currentRoute === '/projects' ? (
          <ProjectsPage onNavigateHome={() => handleNavigate('/')} />
        ) : (
          <>
            <Hero />
            <About />
            <Skills />
            <Projects onNavigateToProjects={() => handleNavigate('/projects')} />
            <Experience />
            <MyBlogs />
            <Contact />
          </>
        )}
      </main>
      <Footer />
      <ScrollToTop />
      <TaquiAI />
    </div>
  );
}

export default App;
