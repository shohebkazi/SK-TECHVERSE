import { FaXTwitter, FaLinkedinIn, FaInstagram, FaYoutube, FaWhatsapp } from 'react-icons/fa6';
import { FiMail, FiPhone, FiGlobe, FiMapPin } from 'react-icons/fi';

export default function Footer({ setPage }) {
  const grad = { background:'linear-gradient(135deg,var(--neon-blue),var(--neon-purple))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' };

  const SOCIALS = [
    { Icon: FaXTwitter,   href: '#', label: 'X (Twitter)' },
    { Icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
    { Icon: FaInstagram,  href: '#', label: 'Instagram' },
    { Icon: FaYoutube,    href: '#', label: 'YouTube' },
    { Icon: FaWhatsapp,   href: 'https://wa.me/917410721438', label: 'WhatsApp' },
  ];

  return (
    <footer className="footer">
      <div className="footer-grid">
        {/* Brand */}
        <div>
          <div className="footer-brand" style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
            <img src="/assets/logo.png" alt="SK TECHVERSE" style={{ height:32, width:'auto' }} />
            <span style={{ color:'var(--neon-blue)' }}>SK </span>
            <span style={{ color:'var(--neon-purple)' }}>TECHVERSE</span>
          </div>
          <p className="footer-desc">
            Building smart digital solutions with cutting-edge AI, web, and mobile technologies.
            Your trusted tech partner for innovative, scalable software.
          </p>
          <div className="footer-socials">
            {SOCIALS.map(({ Icon, href, label }, i) => (
              <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="social-btn" aria-label={label} title={label}>
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Services */}
        <div>
          <div className="footer-heading">Services</div>
          <ul className="footer-links">
            {['AI Projects','Web Development','Mobile Apps','ERP Systems','E-Commerce','UI/UX Design'].map(s => (
              <li key={s}><a onClick={() => setPage('services')}>{s}</a></li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <div className="footer-heading">Company</div>
          <ul className="footer-links">
            {[['About Us','about'],['Projects','projects'],['Blog','blog'],['Pricing','pricing'],['Contact','contact'],['Order Project','order']].map(([l,p]) => (
              <li key={p}><a onClick={() => setPage(p)}>{l}</a></li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <div className="footer-heading">Contact</div>
          <ul className="footer-links footer-links-icon">
            <li><a href="mailto:skteckverse@gmail.com"><FiMail /> skteckverse@gmail.com</a></li>
            <li><a href="tel:+917410721438"><FiPhone /> +91-7410721438</a></li>
            <li><a href="https://wa.me/917410721438" target="_blank" rel="noopener noreferrer"><FaWhatsapp /> WhatsApp (24/7)</a></li>
            <li><a href="https://sktechverse.com" target="_blank" rel="noopener noreferrer"><FiGlobe /> sktechverse.com</a></li>
            <li><a><FiMapPin /> India (Remote + On-site)</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2024 SK TECHVERSE. All rights reserved.</span>
        <span style={grad}>Building Smart Digital Solutions with AI ✦</span>
      </div>
    </footer>
  );
}
