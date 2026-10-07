import React from 'react';
import '../styles/Sections.css';

const skillCategories = [
  {
    title: 'Programming & Skills',
    skills: ['Java', 'C', 'Python', 'Go', 'DSA', 'System Design', 'Data Modelling'],
    colorClass: 'skills__icon-box--blue',
    bgImage: '/skills_programming.png',
  },
  {
    title: 'Frameworks',
    skills: ['SpringBoot', 'LangChain', 'LangGraph'],
    colorClass: 'skills__icon-box--purple',
    bgImage: '/skills_frameworks.png',
  },
  {
    title: 'AI & Data',
    skills: ['Agentic AI', 'Generative AI', 'LLM', 'Vector Embeddings', 'RAG', 'Design Pattern'],
    colorClass: 'skills__icon-box--green',
    bgImage: '/skills_ai_data.png',
  },
  {
    title: 'Tools & DB',
    skills: ['PostgreSQL', 'Query Writing', 'Git', 'GitHub', 'Eclipse IDE', 'Visual Studio', 'Uvicorn', 'Pytest'],
    colorClass: 'skills__icon-box--orange',
    bgImage: '/skills_tools_db.png',
  },
];

const Skills = () => {
  return (
    <section id="skills" className="section section--skills">
      <div className="section__container">
        <div className="section__header scroll-reveal">
          <h2 className="section__title">Skills</h2>
          <div className="section__divider" />
        </div>

        <div className="skills__grid">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className={`skills__card scroll-reveal sr-scale sr-delay-${index + 1}`}
              style={{
                backgroundImage: `linear-gradient(160deg, rgba(10,10,20,0.82) 0%, rgba(10,10,20,0.68) 100%), url(${category.bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className={`skills__icon-box ${category.colorClass}`}>
                <span className="skills__icon-text">{category.title[0]}</span>
              </div>
              <h3 className="skills__card-title">{category.title}</h3>
              <div className="skills__list">
                {category.skills.map((skill, i) => (
                  <span key={i} className="skills__tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
