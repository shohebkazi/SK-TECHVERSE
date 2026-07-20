export default function Footer({ setPage }) {
  const grad = { background:'linear-gradient(135deg,var(--neon-blue),var(--neon-purple))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' };

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
            {[['𝕏','#'],['in','#'],['🐙','#'],['📘','#'],['📺','#']].map(([icon, href], i) => (
              <a key={i} href={href} className="social-btn" onClick={e => e.preventDefault()}>{icon}</a>
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
          <ul className="footer-links">
            <li><a>📧 skteckverse@gmail.com</a></li>
            <li><a>📞 +91-7410724138</a></li>
            <li><a>💬 WhatsApp (24/7)</a></li>
            <li><a>🌐 sktechverse.com</a></li>
            <li><a>📍 India (Remote + On-site)</a></li>
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
