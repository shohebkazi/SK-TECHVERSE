import { useState, useEffect } from 'react';
import Reveal from '../components/Reveal';
import { resolveImageUrl } from '../utils/image';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const FILE_BASE = API.replace('/api', '');

function placeholderThumb(title = '') {
  const initials = title.trim().slice(0, 2).toUpperCase() || 'SK';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#7c3aed"/>
        <stop offset="100%" stop-color="#d946ef"/>
      </linearGradient>
    </defs>
    <rect width="800" height="600" fill="url(#g)"/>
    <text x="400" y="330" font-family="sans-serif" font-size="180" font-weight="700"
      fill="rgba(255,255,255,0.9)" text-anchor="middle">${initials}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function ProjectDetailPage({ projectId, setPage }) {
  const [project, setProject]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [related, setRelated]   = useState([]);
  const [activeShot, setActiveShot] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  // Always pull the real, admin-entered project straight from the database —
  // whatever the admin filled in the "Add/Edit Project" form (title, price,
  // uploaded screenshots, features, tech stack, etc.) is exactly what renders here.
  useEffect(() => {
    if (!projectId) { setNotFound(true); setLoading(false); return; }
    setLoading(true);
    setActiveShot(0);
    fetch(`${API}/projects/${projectId}`)
      .then(r => { if (!r.ok) throw new Error('not found'); return r.json(); })
      .then(data => { setProject(data); setLoading(false); })
      .catch(() => { setNotFound(true); setLoading(false); });

    fetch(`${API}/projects?limit=8`)
      .then(r => r.json())
      .then(data => setRelated((data.projects || []).filter(p => p._id !== projectId).slice(0, 3)))
      .catch(() => {});
  }, [projectId]);

  if (loading) {
    return (
      <div className="pg-enter" style={{ paddingTop: '10rem', textAlign: 'center', color: 'var(--text-2)' }}>
        Loading project...
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="pg-enter" style={{ paddingTop: '10rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-2)', marginBottom: '1.5rem' }}>This project couldn't be found.</p>
        <button className="btn-primary" onClick={() => setPage('projects')}>← Back to Projects</button>
      </div>
    );
  }

  const shots = (project.screenshots && project.screenshots.length > 0)
    ? project.screenshots
    : (project.image ? [project.image] : []);
  const shotUrls = shots.length > 0
    ? shots.map(s => resolveImageUrl(s, FILE_BASE))
    : [placeholderThumb(project.title)];

  const price = project.price || 0;
  const discountPrice = project.discountPrice > 0 && project.discountPrice < price ? project.discountPrice : price;
  const discount = price > 0 && discountPrice < price ? Math.round(((price - discountPrice) / price) * 100) : 0;

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const submitBuy = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await fetch(`${API}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: form.name,
          clientEmail: form.email,
          clientPhone: form.phone,
          projectType: project.category,
          projectTitle: `[BUY] ${project.title}`,
          description: `Buy request for "${project.title}" (Rs.${discountPrice}). Message: ${form.message}`,
          budget: `Rs.${discountPrice}`,
        }),
      });
    } catch (err) {
      // fail silently
    }
    setBusy(false);
    setSent(true);
  };

  return (
    <div className="pg-enter" style={{ paddingTop: '6rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2.5rem 1rem' }}>
        <button
          onClick={() => setPage('projects')}
          style={{
            background: 'none', border: 'none', color: 'var(--text-2)', cursor: 'pointer',
            fontFamily: 'var(--font-ui)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
          }}
        >
          ← Back to Projects
        </button>
      </div>

      <section className="section" style={{ paddingTop: '1rem' }}>
        <div className="section-inner">
          <div className="proj-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2.5rem', alignItems: 'start' }}>

            <Reveal>
            <div>
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(var(--nb-rgb),0.12), rgba(var(--np-rgb),0.14))',
                  border: '1px solid var(--border)', borderRadius: 18, height: 380, marginBottom: '1rem',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                <img
                  src={shotUrls[activeShot] || shotUrls[0]}
                  alt={project.title}
                  onError={(e) => { e.currentTarget.src = placeholderThumb(project.title); }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div style={{
                  position: 'absolute', top: 16, left: 16, background: 'var(--neon-blue)', color: '#fff',
                  fontFamily: 'var(--font-ui)', fontSize: '0.7rem', fontWeight: 700, padding: '0.3rem 0.8rem',
                  borderRadius: 100, letterSpacing: '0.05em', textTransform: 'uppercase',
                }}>
                  {project.category}
                </div>
                <div style={{
                  position: 'absolute', top: 16, right: 16, background: 'rgba(10,7,20,0.75)', backdropFilter: 'blur(8px)',
                  color: '#fbbf24', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 700,
                  padding: '0.3rem 0.8rem', borderRadius: 100,
                }}>
                  ★ {project.rating ?? '4.8'}
                </div>
              </div>

              {shotUrls.length > 1 && (
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {shotUrls.map((shot, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveShot(i)}
                      style={{
                        width: 80, height: 60, borderRadius: 10, overflow: 'hidden', padding: 0,
                        background: 'var(--bg-card)',
                        border: i === activeShot ? '2px solid var(--neon-blue)' : '1px solid var(--border)',
                        cursor: 'pointer', transition: 'all 0.3s',
                      }}
                    >
                      <img
                        src={shot}
                        alt=""
                        onError={(e) => { e.currentTarget.src = placeholderThumb(project.title); }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </button>
                  ))}
                </div>
              )}

              <div style={{ marginTop: '2.5rem' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
                  About This{' '}
                  <span style={{ background: 'linear-gradient(135deg,var(--neon-blue),var(--neon-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Project
                  </span>
                </h3>
                <p style={{ color: 'var(--text-2)', lineHeight: 1.85, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
                  {project.fullDescription || project.description}
                </p>
              </div>

              {project.features && project.features.length > 0 && (
                <div style={{ marginTop: '2.5rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
                    Key{' '}
                    <span style={{ background: 'linear-gradient(135deg,var(--neon-blue),var(--neon-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      Features
                    </span>
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                    {project.features.map((feat, i) => (
                      <div key={i} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                        <span style={{ color: 'var(--neon-green)', fontSize: '0.9rem', marginTop: '0.1rem' }}>✓</span>
                        <span style={{ color: 'var(--text-2)', fontSize: '0.88rem', lineHeight: 1.5 }}>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {project.technologies && project.technologies.length > 0 && (
                <div style={{ marginTop: '2.5rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
                    Tech Stack
                  </h3>
                  <div className="tech-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {project.technologies.map((t) => (
                      <span key={t} className="tech-tag">{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            </Reveal>

            <Reveal delay={0.1} x={20} y={0}>
            <div style={{ position: 'sticky', top: '6rem' }}>
              <div className="glass-card" style={{ padding: '2rem' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}>
                  {project.title}
                </h2>
                <p style={{ color: 'var(--text-2)', fontSize: '0.85rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                  {project.description}
                </p>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.82rem', fontFamily: 'var(--font-ui)' }}>
                  <span style={{ color: '#fbbf24' }}>
                    ★★★★★ <span style={{ color: 'var(--text-2)' }}>{project.rating ?? '4.8'}</span>
                  </span>
                  <span style={{ color: 'var(--text-3)' }}>|</span>
                  <span style={{ color: 'var(--text-2)' }}>{project.sales ?? 0} Sales</span>
                </div>

                <div style={{ height: 1, background: 'var(--border)', marginBottom: '1.5rem' }} />

                {price > 0 ? (
                  <>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-1)' }}>
                        ₹{discountPrice.toLocaleString('en-IN')}
                      </span>
                      {discount > 0 && (
                        <>
                          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '1rem', color: 'var(--text-3)', textDecoration: 'line-through' }}>
                            ₹{price.toLocaleString('en-IN')}
                          </span>
                          <span style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--neon-green)', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 100 }}>
                            {discount}% OFF
                          </span>
                        </>
                      )}
                    </div>
                    <p style={{ color: 'var(--text-3)', fontSize: '0.78rem', marginBottom: '1.5rem' }}>
                      One-time payment · Full source code included
                    </p>
                  </>
                ) : (
                  <p style={{ color: 'var(--text-2)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Contact us for a custom quote</p>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
                  {[
                    ['🚀', 'Delivery Time', project.deliveryTime || '7-10 Days'],
                    ['🛟', 'Support', project.supportPeriod || '6 Months Free Support'],
                    ['📦', 'Includes', 'Full Source Code + Docs'],
                  ].map(([icon, label, val]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                      <span style={{ color: 'var(--text-2)' }}>{icon} {label}</span>
                      <span style={{ color: 'var(--text-1)', fontWeight: 600 }}>{val}</span>
                    </div>
                  ))}
                </div>

                <button className="btn-primary" style={{ width: '100%', border: 'none', marginBottom: '0.75rem' }} onClick={() => setShowForm(true)}>
                  🛒 Buy This Project
                </button>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ flex: 1, textDecoration: 'none', fontSize: '0.78rem', padding: '0.7rem 1rem', textAlign: 'center' }}>
                      🔗 Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ flex: 1, textDecoration: 'none', fontSize: '0.78rem', padding: '0.7rem 1rem', textAlign: 'center' }}>
                      🐙 Preview Code
                    </a>
                  )}
                </div>

                <a
                  href={`https://wa.me/917410721438?text=Hi! I'm interested in "${project.title}" project (Rs.${discountPrice})`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem', color: '#25D366', textDecoration: 'none', fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 600 }}
                >
                  💬 Have questions? Chat on WhatsApp
                </a>
              </div>

              <div className="glass-card" style={{ marginTop: '1rem', padding: '1.25rem' }}>
                {[
                  ['🔒', 'Secure Payment & NDA Available'],
                  ['✅', 'Tested & Production-Ready Code'],
                  ['🎯', 'Customization Available on Request'],
                ].map(([icon, txt]) => (
                  <div key={txt} style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-2)', marginBottom: '0.6rem' }}>
                    <span>{icon}</span><span>{txt}</span>
                  </div>
                ))}
              </div>
            </div>
            </Reveal>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <Reveal>
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-inner">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem' }}>
              More{' '}
              <span style={{ background: 'linear-gradient(135deg,var(--neon-blue),var(--neon-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Projects
              </span>
            </h3>
            <div className="projects-grid">
              {related.map((p) => (
                <div key={p._id} className="project-card" onClick={() => setPage('projectDetail', p._id)}>
                  <div className="project-card-media">
                    <img
                      src={p.image ? resolveImageUrl(p.image, FILE_BASE) : placeholderThumb(p.title)}
                      alt={p.title}
                      loading="lazy"
                      onError={(e) => { e.currentTarget.src = placeholderThumb(p.title); }}
                    />
                    <div className="project-card-overlay" />
                    <div className="project-card-badges">
                      <span className="project-badge-cat">{p.category || 'Web'}</span>
                    </div>
                  </div>
                  <div className="project-card-body">
                    <div className="project-card-title">{p.title}</div>
                    <div className="project-card-foot">
                      <span className="project-rating">⭐ {p.rating ?? '4.8'}</span>
                      {p.price > 0 && (
                        <span className="project-price">
                          ₹{(p.discountPrice > 0 && p.discountPrice < p.price ? p.discountPrice : p.price).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        </Reveal>
      )}

      {showForm && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(10,7,20,0.85)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
          onClick={() => { if (!sent) setShowForm(false); }}
        >
          <div className="glass-card" style={{ maxWidth: 460, width: '100%', padding: '2.25rem', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowForm(false)}
              style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'var(--text-3)', fontSize: '1.2rem', cursor: 'pointer' }}
            >✕</button>

            {sent ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Request Sent!</h3>
                <p style={{ color: 'var(--text-2)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                  We've received your purchase request for{' '}
                  <strong style={{ color: 'var(--neon-blue)' }}>{project.title}</strong>. Our team will contact you within 2 hours with payment details.
                </p>
                <button className="btn-primary" style={{ border: 'none' }} onClick={() => { setShowForm(false); setSent(false); }}>Close</button>
              </div>
            ) : (
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                  🛒 Buy "{project.title}"
                </h3>
                <p style={{ color: 'var(--text-2)', fontSize: '0.82rem', marginBottom: '1.5rem' }}>
                  Price: <strong style={{ color: 'var(--neon-blue)' }}>₹{discountPrice.toLocaleString('en-IN')}</strong> — fill the form
                  and we'll reach out with payment & delivery details.
                </p>
                <form onSubmit={submitBuy}>
                  <div className="fg">
                    <label className="fl">Full Name</label>
                    <input className="fi" placeholder="Your name" value={form.name} onChange={f('name')} required />
                  </div>
                  <div className="fg">
                    <label className="fl">Email</label>
                    <input type="email" className="fi" placeholder="your@email.com" value={form.email} onChange={f('email')} required />
                  </div>
                  <div className="fg">
                    <label className="fl">Phone / WhatsApp</label>
                    <input className="fi" placeholder="+91-XXXXXXXXXX" value={form.phone} onChange={f('phone')} required />
                  </div>
                  <div className="fg">
                    <label className="fl">Message (Optional)</label>
                    <textarea className="fta" style={{ minHeight: 80 }} placeholder="Any customization needed?" value={form.message} onChange={f('message')} />
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%', border: 'none' }} disabled={busy}>
                    {busy ? '⏳ Submitting...' : `🚀 Confirm — ₹${discountPrice.toLocaleString('en-IN')}`}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .proj-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
