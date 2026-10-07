import React from 'react';
import {
  ExternalLink,
  ArrowRight,
  Shield,
  CreditCard,
  ShoppingCart,
  Store,
  BarChart3,
  Truck,
  Sparkles,
} from 'lucide-react';
import { projects } from '../data/projectsData';
import '../styles/Sections.css';
import '../styles/ProjectsPage.css';

const Projects = ({ onNavigateToProjects }) => {
  // Homepage only showcases Aureza
  const aureza = projects.find((p) => p.id === 'aureza') || projects[0];

  const featureIcons = {
    shield: Shield,
    'credit-card': CreditCard,
    'shopping-cart': ShoppingCart,
    store: Store,
    'bar-chart': BarChart3,
    truck: Truck,
  };

  const handleExploreClick = (e) => {
    e.preventDefault();
    if (onNavigateToProjects) {
      onNavigateToProjects();
    } else {
      window.history.pushState({}, '', '/projects');
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section id="projects" className="section featured-project">
      <div className="section__container">
        {/* Section Header */}
        <div className="section__header scroll-reveal">
          <div className="featured-project__badge-row" style={{ justifyContent: 'center' }}>
            <span className="featured-project__badge featured-project__badge--primary">
              <Sparkles size={13} />
              Primary Engineering Showcase
            </span>
            <span className="featured-project__badge featured-project__badge--live">
              <span className="featured-project__badge-pulse" />
              Live Deployment
            </span>
          </div>
          <h2 className="section__title">Featured Project</h2>
          <div className="section__divider" />
          <p className="section__subtitle">
            A production-grade full-stack monolithic e-commerce application built with modern Spring Boot 4,
            React 19, and scalable architecture.
          </p>
        </div>

        {/* Featured Card */}
        <div className="featured-card scroll-reveal sr-delay-1">
          {/* Header */}
          <div className="featured-card__header">
            <div className="featured-card__title-group">
              <h3 className="featured-card__title">
                {aureza.title}
                <span style={{ fontSize: '1rem', fontWeight: 600, color: '#818cf8', opacity: 0.85 }}>
                  — E-Commerce Application
                </span>
              </h3>
              <div className="featured-card__subtitle">{aureza.subtitle}</div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="featured-project__badge featured-project__badge--primary">
                Java 21 • Spring Boot 4
              </span>
              <span className="featured-project__badge featured-project__badge--primary">
                React 19 • Tailwind v4
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="featured-card__desc">
            {aureza.description}
          </p>

          {/* Quick Technical Architecture Metrics */}
          <div className="featured-card__stats">
            {aureza.stats.map((stat, idx) => (
              <div key={idx} className="featured-card__stat-item">
                <span className="featured-card__stat-label">{stat.label}</span>
                <span className="featured-card__stat-val">{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Core Feature Highlights */}
          <div className="featured-card__features">
            {aureza.keyFeatures.slice(0, 4).map((feat, idx) => {
              const IconComp = featureIcons[feat.icon] || Shield;
              return (
                <div key={idx} className="featured-card__feature-chip">
                  <IconComp className="featured-card__feature-icon" size={20} />
                  <div className="featured-card__feature-text">
                    <strong>{feat.title}</strong>
                    <span>{feat.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Primary Tech Stack Badges */}
          <div className="featured-card__tags">
            {aureza.primaryTags.map((tag, idx) => (
              <span key={idx} className="featured-card__tag">
                {tag}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="featured-card__actions">
            {/* View Full Project Button */}
            <button
              onClick={handleExploreClick}
              className="btn-primary"
              aria-label="Explore Full Aureza Project and all projects"
            >
              <span>Explore Full Project & All Works</span>
              <ArrowRight size={17} />
            </button>

            {/* GitHub Button */}
            <a
              href={aureza.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
              <span>GitHub Repository</span>
            </a>

            {/* Live Demo Button */}
            {aureza.liveDemo && (
              <a
                href={aureza.liveDemo}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <ExternalLink size={16} />
                <span>Live Demo</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
