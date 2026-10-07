import React from 'react';
import { MapPin, GraduationCap, Briefcase, Heart } from 'lucide-react';
import '../styles/Sections.css';

const About = () => {
  const details = [
    { icon: MapPin, label: 'Location', value: 'India' },
    { icon: GraduationCap, label: 'Education', value: 'B.Tech CSE' },
    { icon: Briefcase, label: 'Focus', value: 'Full Stack Development' },
    { icon: Heart, label: 'Interests', value: 'Web Dev, AI, Backend' },
  ];

  return (
    <section id="about" className="section section--about">
      <div className="section__container">
        <div className="section__header scroll-reveal">
          <h2 className="section__title">About Me</h2>
          <div className="section__divider" />
        </div>

        <div className="about__content">
          <div className="about__text scroll-reveal sr-delay-1">
            <p>
              Hi, I'm Prafull Shukla! I am a Computer Science student with strong programming 
              fundamentals, a problem-solving mindset, and a passion for engineering high-performance software.
            </p>
            <p>
              Skilled in writing clean, modular, and maintainable code. I enjoy building modern full-stack 
              web applications, responsive frontends, and scalable backend architectures.
            </p>
            <p>
              Constantly learning and exploring cutting-edge technologies. Actively seeking opportunities 
              to collaborate, learn, build impactful products, and contribute to innovative engineering teams.
            </p>
          </div>

          <div className="about__grid">
            {details.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className={`about__card scroll-reveal sr-scale sr-delay-${index + 1}`}>
                  <Icon className="about__card-icon" size={32} />
                  <span className="about__card-label">{item.label}</span>
                  <span className="about__card-value">{item.value}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
