import React, { useState, useMemo } from 'react';
import {
  ExternalLink,
  ArrowLeft,
  Shield,
  CreditCard,
  ShoppingCart,
  Store,
  BarChart3,
  Truck,
  Layers,
  Search,
  Code2,
  Database,
  Lock,
  Cpu,
  CheckCircle2,
  FileText,
  Sparkles,
} from 'lucide-react';
import { projects } from '../data/projectsData';
import '../styles/Sections.css';
import '../styles/ProjectsPage.css';

const ProjectsPage = ({ onNavigateHome }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const aureza = projects.find((p) => p.id === 'aureza') || projects[0];
  const otherProjects = projects.filter((p) => p.id !== 'aureza');

  const categories = ['All', 'AI / GenAI', 'RAG', 'Backend'];

  const featureIcons = {
    shield: Shield,
    'credit-card': CreditCard,
    'shopping-cart': ShoppingCart,
    store: Store,
    'bar-chart': BarChart3,
    truck: Truck,
  };

  const filteredOtherProjects = useMemo(() => {
    return otherProjects.filter((project) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        (project.categories && project.categories.includes(selectedCategory)) ||
        project.category === selectedCategory;

      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.primaryTags &&
          project.primaryTags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())));

      return matchesCategory && matchesSearch;
    });
  }, [otherProjects, selectedCategory, searchQuery]);

  const handleBackHome = (e) => {
    e.preventDefault();
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="projects-page">
      <div className="section__container">
        {/* Hero Section */}
        <div className="projects-hero">
          <a href="/" onClick={handleBackHome} className="projects-hero__back-link">
            <ArrowLeft size={16} />
            <span>Back to Home Portfolio</span>
          </a>
          <h1 className="projects-hero__title">Projects I've Built</h1>
          <p className="projects-hero__lead">
            Real-world full-stack platforms, autonomous multi-agent systems, and production RAG architectures.
          </p>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* AUREZA MAIN SPOTLIGHT SHOWCASE                                */}
        {/* ------------------------------------------------------------- */}
        <section className="aureza-spotlight" id="aureza-showcase">
          <div className="spotlight-card">
            {/* Header */}
            <div className="featured-card__header">
              <div className="featured-card__title-group">
                <div className="featured-project__badge-row">
                  <span className="featured-project__badge featured-project__badge--primary">
                    <Sparkles size={13} />
                    Primary Flagship Project
                  </span>
                  <span className="featured-project__badge featured-project__badge--live">
                    <span className="featured-project__badge-pulse" />
                    Live Production App
                  </span>
                </div>
                <h2 className="featured-card__title">
                  {aureza.title}
                  <span style={{ fontSize: '1.05rem', fontWeight: 600, color: '#818cf8', opacity: 0.9 }}>
                    — E-Commerce Application
                  </span>
                </h2>
                <div className="featured-card__subtitle">{aureza.subtitle}</div>
              </div>

              <div className="featured-card__actions" style={{ border: 'none', padding: 0 }}>
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
                  <span>GitHub</span>
                </a>

                {aureza.liveDemo && (
                  <a
                    href={aureza.liveDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    <ExternalLink size={16} />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>
            </div>

            {/* Description / Overview */}
            <p className="featured-card__desc">
              {aureza.description}
            </p>

            {/* Quick Metrics */}
            <div className="featured-card__stats">
              {aureza.stats.map((stat, idx) => (
                <div key={idx} className="featured-card__stat-item">
                  <span className="featured-card__stat-label">{stat.label}</span>
                  <span className="featured-card__stat-val">{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Architecture Flow Visualization */}
            <h3 className="spotlight-section-heading">
              <Layers size={20} color="#8b5cf6" />
              <span>Decoupled System Architecture Flow</span>
            </h3>
            <div className="architecture-box">
              <div className="architecture-flow">
                {aureza.architecture.layers.map((layer, index) => (
                  <React.Fragment key={index}>
                    <div className="architecture-step">
                      <div className="architecture-step__index">Layer 0{index + 1}</div>
                      <div className="architecture-step__title">{layer.name}</div>
                      <div className="architecture-step__desc">{layer.tech}</div>
                    </div>
                    {index < aureza.architecture.layers.length - 1 && (
                      <div className="architecture-arrow">→</div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Key Features Grid */}
            <h3 className="spotlight-section-heading">
              <Cpu size={20} color="#8b5cf6" />
              <span>Key Implemented Features</span>
            </h3>
            <div className="featured-card__features">
              {aureza.keyFeatures.map((feat, idx) => {
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

            {/* Grouped Tech Stack */}
            <h3 className="spotlight-section-heading">
              <Code2 size={20} color="#8b5cf6" />
              <span>Comprehensive Technology Stack</span>
            </h3>
            <div className="tech-groups-grid">
              <div className="tech-group-card">
                <div className="tech-group-card__title">
                  <Cpu size={15} /> Backend (Spring Boot 4)
                </div>
                <div className="tech-group-card__badges">
                  {aureza.techStack.backend.map((t, i) => (
                    <span key={i} className="tech-mini-badge">{t}</span>
                  ))}
                </div>
              </div>

              <div className="tech-group-card">
                <div className="tech-group-card__title">
                  <Layers size={15} /> Frontend (React 19)
                </div>
                <div className="tech-group-card__badges">
                  {aureza.techStack.frontend.map((t, i) => (
                    <span key={i} className="tech-mini-badge">{t}</span>
                  ))}
                </div>
              </div>

              <div className="tech-group-card">
                <div className="tech-group-card__title">
                  <Database size={15} /> Database & ORM
                </div>
                <div className="tech-group-card__badges">
                  {aureza.techStack.database.map((t, i) => (
                    <span key={i} className="tech-mini-badge">{t}</span>
                  ))}
                </div>
              </div>

              <div className="tech-group-card">
                <div className="tech-group-card__title">
                  <Lock size={15} /> Security & Auth
                </div>
                <div className="tech-group-card__badges">
                  {aureza.techStack.security.map((t, i) => (
                    <span key={i} className="tech-mini-badge">{t}</span>
                  ))}
                </div>
              </div>

              <div className="tech-group-card">
                <div className="tech-group-card__title">
                  <CreditCard size={15} /> Payment Gateways
                </div>
                <div className="tech-group-card__badges">
                  {aureza.techStack.payment.map((t, i) => (
                    <span key={i} className="tech-mini-badge">{t}</span>
                  ))}
                </div>
              </div>

              <div className="tech-group-card">
                <div className="tech-group-card__title">
                  <CheckCircle2 size={15} /> DevOps & Tooling
                </div>
                <div className="tech-group-card__badges">
                  {aureza.techStack.tools.map((t, i) => (
                    <span key={i} className="tech-mini-badge">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Engineering Highlights */}
            <h3 className="spotlight-section-heading">
              <CheckCircle2 size={20} color="#10b981" />
              <span>Engineering Highlights & Design Decisions</span>
            </h3>
            <ul className="highlights-list">
              {aureza.architecture.highlights.map((item, i) => (
                <li key={i} className="highlights-item">
                  <CheckCircle2 size={16} className="highlights-bullet" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* OTHER ENGINEERING PROJECTS (ResearchAgent & IntelliRAG)        */}
        {/* ------------------------------------------------------------- */}
        <section className="other-projects-section" id="other-projects">
          <div className="section__header" style={{ marginBottom: '32px' }}>
            <h2 className="section__title">Other Engineering Projects</h2>
            <div className="section__divider" />
            <p className="section__subtitle">
              Specialized systems exploring Agentic AI workflows, autonomous research loops, and dense RAG retrieval.
            </p>
          </div>

          {/* Filter & Search Bar */}
          <div className="projects-controls">
            <div className="projects-filter-pills">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`filter-pill ${selectedCategory === cat ? 'filter-pill--active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="projects-search-box">
              <Search className="projects-search-icon" size={17} />
              <input
                type="text"
                placeholder="Search projects by name, tech..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="projects-search-input"
              />
            </div>
          </div>

          {/* Other Projects Grid */}
          {filteredOtherProjects.length > 0 ? (
            <div className="project-card-grid">
              {filteredOtherProjects.map((proj) => (
                <div key={proj.id} className="standard-project-card">
                  <div className="standard-project-card__top">
                    <span className="standard-project-card__cat">{proj.category}</span>
                    {proj.liveDemo && (
                      <span className="featured-project__badge featured-project__badge--live">
                        <span className="featured-project__badge-pulse" />
                        Live
                      </span>
                    )}
                  </div>

                  <h3 className="standard-project-card__title">{proj.title}</h3>
                  <div className="standard-project-card__subtitle">{proj.subtitle}</div>
                  <p className="standard-project-card__desc">{proj.description}</p>

                  {/* Highlights */}
                  {proj.highlights && (
                    <ul className="standard-project-card__highlights">
                      {proj.highlights.map((h, idx) => (
                        <li key={idx} className="standard-project-card__highlight-item">
                          <CheckCircle2 size={14} color="#6366f1" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Tags */}
                  <div className="standard-project-card__tags">
                    {proj.primaryTags.map((tag, idx) => (
                      <span key={idx} className="standard-project-card__tag">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="standard-project-card__actions">
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                        <path d="M9 18c-4.51 2-5-2-7-2" />
                      </svg>
                      <span>Code</span>
                    </a>

                    {proj.liveDemo && (
                      <a
                        href={proj.liveDemo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline"
                      >
                        <ExternalLink size={15} />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              No projects found matching your search or category filter.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProjectsPage;
