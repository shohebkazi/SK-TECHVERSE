import { useState, useEffect } from 'react';
import { PROJECTS, AI_FEATURES, PRICING_PLANS, TESTIMONIALS } from '../data';
import Reveal from '../components/Reveal';
import { resolveImageUrl } from '../utils/image';

function placeholderThumb(title = '') {
  const initials = title.trim().slice(0, 2).toUpperCase() || 'SK';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1E3FE0"/>
        <stop offset="100%" stop-color="#22D3EE"/>
      </linearGradient>
    </defs>
    <rect width="800" height="600" fill="url(#g)"/>
    <text x="400" y="330" font-family="sans-serif" font-size="180" font-weight="700"
      fill="rgba(255,255,255,0.9)" text-anchor="middle">${initials}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function ProjectsPage({ setPage }) {
  const [filter, setFilter] = useState('All');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const filters = ['All', 'AI', 'Web', 'Mobile', 'ERP', 'Portfolio'];

  useEffect(() => {
    const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    fetch(`${API}/projects`)
      .then(r => r.json())
      .then(data => { setProjects(data.projects || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const list = filter === 'All' ? projects : projects.filter(p => p.category === filter);
  const FILE_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace('/api', '');

  return (
    <div className="pg-enter">
      <section className="section" style={{ paddingTop: '8rem' }}>
        <div className="section-inner">
          <div style={{ textAlign: 'center' }}>
            <span className="section-tag">Our Work</span>
            <h2 className="section-title">Project <span>Showcase</span></h2>
            <p className="section-sub">Real-world solutions that drive results. Explore our portfolio of completed projects.</p>
          </div>

          <div className="filter-tabs" style={{ justifyContent: 'center' }}>
            {filters.map(f => (
              <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--t3)' }}>Loading projects...</div>
          ) : list.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--t3)' }}>No projects found.</div>
          ) : (
            <div className="projects-grid">
              {list.map((p, i) => (
                <Reveal key={p._id} delay={Math.min((i % 6) * 0.08, 0.4)} y={24}>
                  <div className="project-card" onClick={() => setPage('projectDetail', p._id)}>
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
                        {p.featured && <span className="project-badge-featured">⭐ Featured</span>}
                      </div>
                      <div className="project-card-view"><span>View Project →</span></div>
                    </div>

                    <div className="project-card-body">
                      <div className="project-card-title">{p.title}</div>
                      <p className="project-card-desc">{p.description}</p>

                      <div className="project-card-tags">
                        {(p.technologies || []).slice(0, 4).map((t) => (
                          <span key={t} className="project-tag">{t}</span>
                        ))}
                      </div>

                      <div className="project-card-foot">
                        <span className="project-rating">⭐ {p.rating ?? '4.8'} · {p.sales ?? 0} sold</span>
                        {p.price > 0 && (
                          <span className="project-price">
                            {p.discountPrice > 0 && p.discountPrice < p.price && (
                              <span className="strike">₹{p.price.toLocaleString()}</span>
                            )}
                            ₹{(p.discountPrice > 0 && p.discountPrice < p.price ? p.discountPrice : p.price).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export function AIPage({ setPage }) {
  return (
    <div className="pg-enter">
      <section className="section" style={{ paddingTop: '8rem' }}>
        <div className="section-inner">
          <div style={{ textAlign: 'center' }}>
            <span className="section-tag">AI Innovation</span>
            <h2 className="section-title">AI-Powered <span>Solutions</span></h2>
            <p className="section-sub">Harness the power of artificial intelligence to automate, predict, and transform your business operations.</p>
          </div>

          <div className="ai-grid">
            {AI_FEATURES.map((f, i) => (
              <Reveal key={i} delay={Math.min(i * 0.06, 0.3)}>
                <div className="ai-card">
                  <span className="ai-icon">{f.icon}</span>
                  <div className="ai-card-title">{f.title}</div>
                  <div className="ai-card-desc">{f.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>

          <div style={{ marginTop: '4rem', background: 'linear-gradient(135deg,rgba(220,38,38,0.06),rgba(127,29,29,0.1))', border: '1px solid rgba(127,29,29,0.2)', borderRadius: 20, padding: '3rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>AI</div>
            <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
              Free AI <span style={{ background: 'linear-gradient(135deg,var(--nb),var(--npi))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Consultation</span>
            </h3>
            <p style={{ color: 'var(--t2)', marginBottom: '2rem', maxWidth: 500, margin: '0 auto 2rem' }}>
              Not sure which AI solution fits your business? Our experts provide a free 30-minute AI readiness assessment.
            </p>
            <button className="btn-primary" onClick={() => setPage('contact')}>Get Free AI Consultation</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export function PricingPage({ setPage }) {
  const WA = 'https://wa.me/917410721438';
  return (
    <div className="pg-enter">
      <section className="section" style={{ paddingTop: '8rem' }}>
        <div className="section-inner">
          <div style={{ textAlign: 'center' }}>
            <span className="section-tag">Transparent Pricing</span>
            <h2 className="section-title">Simple, Honest <span>Pricing</span></h2>
            <p className="section-sub">Choose the plan that fits your needs. All plans include dedicated support and professional delivery.</p>
          </div>
          <div className="pricing-grid">
            {PRICING_PLANS.map((plan, i) => (
              <Reveal key={i} delay={i * 0.08} y={20} scale={0.97}>
              <div className={`pricing-card ${plan.featured ? 'featured' : ''}`}>
                {plan.featured && <div className="pricing-badge">Most Popular</div>}
                <div className="pricing-plan">{plan.name}</div>
                <div className="pricing-price">
                  <sup>Rs.</sup>{plan.price}
                </div>
                <div className="pricing-period">{plan.period}</div>
                <ul className="pricing-feats">
                  {plan.features.map(([has, feature], j) => (
                    <li key={j}>
                      <span className={has ? 'chk' : 'crs'}>{has ? 'Yes' : 'No'}</span>
                      <span style={{ color: has ? 'var(--t2)' : 'var(--t3)' }}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={`${WA}?text=Hi! I'm interested in the ${plan.name} plan.`}
                  target="_blank" rel="noopener noreferrer"
                  className={`pricing-cta ${plan.featured ? 'primary' : 'outline'}`}
                >
                  Enquire on WhatsApp
                </a>
              </div>
              </Reveal>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--t3)', fontSize: '0.9rem' }}>
            Need a custom quote? <span style={{ color: 'var(--nb)', cursor: 'pointer' }} onClick={() => setPage('contact')}>Contact us</span> for a free consultation.
          </div>
        </div>
      </section>
    </div>
  );
}

export function TestimonialsPage() {
  return (
    <div className="pg-enter">
      <section className="section" style={{ paddingTop: '8rem' }}>
        <div className="section-inner">
          <div style={{ textAlign: 'center' }}>
            <span className="section-tag">Client Stories</span>
            <h2 className="section-title">What Clients <span>Say</span></h2>
            <p className="section-sub">80+ happy clients and counting. Here's what they think about working with SK TECHVERSE.</p>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={i} delay={Math.min(i * 0.05, 0.3)}>
                <div className="test-card">
                  <div className="stars">{'*'.repeat(t.rating)}</div>
                  <p className="test-text">"{t.text}"</p>
                  <div style={{ fontSize: '0.75rem', color: 'var(--nc)', marginBottom: '1rem', fontFamily: 'var(--fu)' }}>Project: {t.project}</div>
                  <div className="test-author">
                    <div className="author-av">{t.initials}</div>
                    <div>
                      <div className="author-name">{t.name}</div>
                      <div className="author-role">{t.role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <div style={{ marginTop: '4rem', textAlign: 'center', padding: '2.5rem', background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
              {[['4.9/5', 'Average Rating'], ['80+', 'Happy Clients'], ['150+', 'Projects'], ['98%', 'Client Retention']].map(([num, label]) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--fd)', fontSize: '2rem', fontWeight: 900, background: 'linear-gradient(135deg,var(--nb),var(--npi))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{num}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'var(--fu)' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}