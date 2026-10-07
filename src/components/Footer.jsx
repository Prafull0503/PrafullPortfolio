import React from 'react';
import '../styles/Sections.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container footer__container--single">
        <p className="footer__copyright">
          © {new Date().getFullYear()} &nbsp;·&nbsp; All rights reserved by Taqui Alam
        </p>
      </div>
    </footer>
  );
};

export default Footer;
