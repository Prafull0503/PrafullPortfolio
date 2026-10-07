import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import '../styles/Sections.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: false,
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, success: false, error: false, message: '' });

    // Use Web3Forms API key from env variable or fallback placeholder key
    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || 'YOUR_WEB3FORMS_ACCESS_KEY';

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          from_name: `${formData.name} via Portfolio`,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus({
          submitting: false,
          success: true,
          error: false,
          message: "Thank you! Your message has been sent successfully. I'll get back to you soon.",
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus({
          submitting: false,
          success: false,
          error: true,
          message: result.message || 'Failed to send message. Please check your Web3Forms access key or try again.',
        });
      }
    } catch (error) {
      setStatus({
        submitting: false,
        success: false,
        error: true,
        message: 'Something went wrong. Please check your network connection or email directly.',
      });
    }
  };

  return (
    <section id="contact" className="section section--contact">
      <div className="section__container">
        <div className="section__header scroll-reveal">
          <h2 className="section__title">Get in Touch</h2>
          <div className="section__divider" />
          <p className="section__subtitle">
            Looking for a Java Full Stack Developer, Backend Developer, or AI/ML Engineer? Let's connect and build something amazing together.
          </p>
        </div>

        <div className="contact__content scroll-reveal sr-delay-1">
          <div className="contact__info">
            {/* Clickable Email Button Card */}
            <a href="mailto:alamtaqui@gmail.com" className="contact__button-card contact__button-card--blue">
              <Mail size={22} className="contact__card-icon" />
              <span className="contact__card-text">alamtaqui@gmail.com</span>
            </a>

            {/* Clickable Phone Button Card */}
            <a href="tel:+916306597320" className="contact__button-card contact__button-card--purple">
              <Phone size={22} className="contact__card-icon" />
              <span className="contact__card-text">+91 - 6306597320</span>
            </a>

            {/* Location */}
            <div className="contact__info-item">
              <div className="contact__info-icon contact__info-icon--green">
                <MapPin size={22} />
              </div>
              <div>
                <h3 className="contact__info-title">Location</h3>
                <p className="contact__info-text">Meerut, Uttar Pradesh, India</p>
              </div>
            </div>
          </div>

          <form className="contact__form" onSubmit={handleSubmit}>
            <div className="contact__form-row">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                className="contact__input"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                className="contact__input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              className="contact__input"
              value={formData.subject}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              rows={4}
              placeholder="Your Message"
              className="contact__textarea"
              value={formData.message}
              onChange={handleChange}
              required
            />

            {status.message && (
              <div className={`contact__status-msg ${status.success ? 'contact__status-msg--success' : 'contact__status-msg--error'}`}>
                {status.success ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                <span>{status.message}</span>
              </div>
            )}

            <button type="submit" className="contact__submit-btn" disabled={status.submitting}>
              {status.submitting ? (
                <>
                  <Loader2 size={18} className="contact__spinner" /> Sending...
                </>
              ) : (
                <>
                  <Send size={18} /> Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;

