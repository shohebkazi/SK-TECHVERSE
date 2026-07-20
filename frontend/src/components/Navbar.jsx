import { useState, useEffect } from 'react';

const LINKS = [
  ['Home','home'],['About','about'],['Services','services'],['Projects','projects'],
  ['AI Solutions','ai'],['Pricing','pricing'],['Blog','blog'],['Contact','contact'],
  
];

export default function Navbar({ page, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive:true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const go = (p) => { setPage(p); setOpen(false); };

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-logo" onClick={() => go('home')}>
          <img src="/assets/logo.png" alt="SK TECHVERSE" className="nav-logo-img" />
          <div className="nav-logo-text">
            <span className="nav-logo-name">SK TECHVERSE</span>
            <span className="nav-logo-tag">INNOVATE · BUILD · GROW</span>
          </div>
        </div>

        <ul className="nav-links">
          {LINKS.map(([label, id]) => (
            <li key={id} className={`nav-link${page === id ? ' active' : ''}`} onClick={() => go(id)}>{label}</li>
          ))}
        </ul>
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
          <button className="nav-cta" onClick={() => go('order')}>Hire Us</button>
          <div className="hamburger" onClick={() => setOpen(!open)}>
            <span /><span /><span />
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`mobile-drawer${open ? ' open' : ''}`}>
        <div
          onClick={() => setOpen(false)}
          style={{ position:'absolute', top:'1.5rem', right:'1.75rem', cursor:'pointer', fontSize:'1.5rem', color:'var(--text-2)' }}
        >✕</div>
        {LINKS.map(([label, id]) => (
          <div key={id} className="m-nav-link" onClick={() => go(id)}>{label}</div>
        ))}
        <button className="btn-primary" onClick={() => go('order')}>🚀 Hire Us</button>
      </div>
      
    </>
  );
}
