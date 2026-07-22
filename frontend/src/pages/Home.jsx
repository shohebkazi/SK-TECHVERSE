import { useState, useEffect } from 'react';
import { useCounter, useInView, useTyping } from '../hooks';
import { SERVICES, TECH_STACK } from '../data';
import { getTechIcon } from '../data/techIcons';
import { resolveImageUrl } from '../utils/image';
import Reveal from '../components/Reveal';
import { FiArrowRight, FiPlay, FiSearch, FiEdit3, FiCode, FiSend, FiPhone } from 'react-icons/fi';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const FILE_BASE = API.replace('/api', '');

function placeholderThumb(title = '') {
  const initials = title.trim().slice(0, 2).toUpperCase() || 'SK';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0F2148"/><stop offset="100%" stop-color="#C9A227"/>
    </linearGradient></defs>
    <rect width="800" height="600" fill="url(#g)"/>
    <text x="400" y="330" font-family="sans-serif" font-size="180" font-weight="700"
      fill="rgba(255,255,255,0.9)" text-anchor="middle">${initials}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function StatItem({ value, label, icon, suffix='+', trigger }) {
  const count = useCounter(value, 2000, trigger);
  return (
    <div className="stat-box-item">
      <div className="stat-box-icon">{icon}</div>
      <span className="stat-box-num">{count}{suffix}</span>
      <span className="stat-box-label">{label}</span>
    </div>
  );
}

const PROCESS_STEPS = [
  ['01', 'Discover', 'We understand your business and goals.', FiSearch],
  ['02', 'Plan',     'We create a strategy and project roadmap.', FiEdit3],
  ['03', 'Build',    'We design and develop with best practices.', FiCode],
  ['04', 'Deliver',  'We test, launch and support.', FiSend],
];

const TRUST_TECHS = ['React.js','Node.js','MongoDB','TypeScript','AWS','Docker'];

export default function HomePage({ setPage }) {
  const [statsRef, statsVis] = useInView(0.3);
  const typed = useTyping(['AI-Powered Solutions','Web Applications','Mobile Apps','ERP Systems','Custom Software']);
  const [projects, setProjects] = useState([]);
  const [projLoading, setProjLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/projects?limit=3`)
      .then(r => r.json())
      .then(data => setProjects((data.projects || data || []).slice(0, 3)))
      .catch(() => {})
      .finally(() => setProjLoading(false));
  }, []);

  return (
    <div className="page-enter">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />

        <div className="hero-split">
          <div className="hero-content">
            <div className="hero-badge"><span className="badge-dot" />We Build Digital Solutions</div>

            <h1 className="hero-title">
              <span style={{ display:'block', color:'var(--text-1)' }}>Innovate. Build.</span>
              <span className="brand">Grow.</span>
            </h1>

            <div className="typing-wrap">
              <span style={{ color:'var(--text-2)' }}>Experts in</span>
              <span style={{ color:'var(--neon-cyan)', fontWeight:600 }}>{typed}</span>
              <span className="typing-cursor" style={{ color:'var(--neon-blue)' }}>|</span>
            </div>

            <p className="hero-tagline">
              SK TECHVERSE is a premium digital solutions company helping businesses and startups
              scale with technology, design and innovation.
            </p>

            <div className="hero-btns-row" style={{ display:'flex', gap:'1rem', flexWrap:'wrap', marginBottom:'4rem' }}>
              <button className="btn-primary" onClick={() => setPage('services')}>Explore Services <FiArrowRight /></button>
              <button className="btn-outline" onClick={() => setPage('projects')}><FiPlay style={{ fontSize:'0.75rem' }} /> View Our Work</button>
            </div>
          </div>

          <Reveal x={24} y={0} delay={0.15}>
          <div className="hero-visual">
            <div className="browser-mock">
              <div className="browser-topbar">
                <span className="browser-dot r" /><span className="browser-dot y" /><span className="browser-dot g" />
                <div className="browser-nav" />
              </div>
              <div className="browser-body">
                <span className="browser-badge-mini">Full Stack Development</span>
                <div className="browser-title-mini">SK TECHVERSE</div>
                <div className="browser-sub-mini">Building digital experiences with modern technologies and innovative solutions.</div>
                <div className="browser-btns-mini">
                  <span className="browser-btn-mini solid">View Work</span>
                  <span className="browser-btn-mini outline">Get In Touch</span>
                </div>
              </div>
            </div>
          </div>
          </Reveal>
        </div>
      </section>

      {/* ── Trusted-by tech strip + stats ── */}
      <Reveal>
        <section className="trust-strip-section">
          <div className="section-inner trust-strip-grid">
            <div className="trust-logos">
              <span className="trust-label">— Technologies We Work With —</span>
              <div className="trust-logos-row">
                {TRUST_TECHS.map((name) => {
                  const { Icon, color } = getTechIcon(name);
                  return (
                    <span key={name} className="trust-logo-item" style={{ color }} title={name}>
                      {Icon ? <Icon /> : name}
                    </span>
                  );
                })}
              </div>
            </div>

            <div ref={statsRef} className="stats-box">
              <StatItem icon="🚀" value={150} label="Projects Delivered" trigger={statsVis} />
              <StatItem icon="🤝" value={80}  label="Happy Clients"      trigger={statsVis} />
              <StatItem icon="🏆" value={3}   label="Years Experience"   trigger={statsVis} />
              <StatItem icon="⚙️" value={20}  label="Technologies"       trigger={statsVis} />
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Services ── */}
      <Reveal>
        <section className="section">
          <div className="section-inner">
            <div>
              <span className="section-tag">What We Do</span>
              <h2 className="section-title">Services We <span>Provide</span></h2>
              <p className="section-sub" style={{ margin:0 }}>End-to-end digital solutions to help your business grow, scale and succeed in the digital world.</p>
            </div>

            <div className="services-grid" style={{ marginTop:'2.5rem' }}>
              {SERVICES.slice(0, 4).map((s, i) => (
                <Reveal key={i} delay={Math.min(i * 0.06, 0.3)}>
                  <div className="glass-card">
                    <div className="service-icon" style={{ background:'rgba(var(--np-rgb),0.1)', border:'1px solid rgba(var(--np-rgb),0.3)' }}>
                      <span style={{ fontSize:'1.4rem' }}>{s.icon}</span>
                    </div>
                    <div className="service-title">{s.title}</div>
                    <div className="service-desc">{s.desc}</div>
                    <div className="service-arrow" onClick={() => setPage('services')}>Learn More →</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Featured Projects (navy band) ── */}
      <Reveal>
        <section className="section navy-band">
          <div className="section-inner">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:'1.5rem', marginBottom:'2.5rem' }}>
              <div>
                <span className="section-tag light">Our Work</span>
                <h2 className="section-title light">Featured <span>Projects</span></h2>
                <p className="section-sub light" style={{ margin:0 }}>We deliver impactful solutions that drive growth and success.</p>
              </div>
              <button className="btn-primary" style={{ background:'var(--neon-purple)' }} onClick={() => setPage('projects')}>
                View All Projects <FiArrowRight />
              </button>
            </div>

            {projLoading ? (
              <div style={{ textAlign:'center', padding:'2rem', color:'rgba(255,255,255,0.6)' }}>Loading projects...</div>
            ) : projects.length === 0 ? (
              <div style={{ textAlign:'center', padding:'2rem', color:'rgba(255,255,255,0.6)' }}>No projects yet — check back soon.</div>
            ) : (
              <div className="projects-grid">
                {projects.map((p, i) => (
                  <Reveal key={p._id || i} delay={Math.min(i * 0.08, 0.3)}>
                    <div className="project-card dark" onClick={() => setPage('projectDetail', p._id)}>
                      <div className="project-card-media">
                        <img
                          src={p.image ? resolveImageUrl(p.image, FILE_BASE) : placeholderThumb(p.title)}
                          alt={p.title}
                          loading="lazy"
                          onError={(e) => { e.currentTarget.src = placeholderThumb(p.title); }}
                        />
                        <div className="project-card-overlay" />
                      </div>
                      <div className="project-card-body">
                        <div className="project-card-title light">{p.title}</div>
                        <p className="project-card-desc light">{p.description}</p>
                        <div className="service-arrow gold">View Case Study →</div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>
      </Reveal>

      {/* ── Process ── */}
      <Reveal>
        <section className="section">
          <div className="section-inner">
            <span className="section-tag">Our Process</span>
            <h2 className="section-title">Our Simple, <span>Effective Process</span></h2>
            <p className="section-sub" style={{ margin:'0 0 3rem' }}>We follow a proven process to deliver the best results.</p>

            <div className="process-row">
              {PROCESS_STEPS.map(([num, title, desc, Icon], i) => (
                <Reveal key={num} delay={i * 0.08} className="process-step">
                  <div className="process-step-inner">
                    <div className="process-circle"><Icon /></div>
                    <div className="process-title">{title}</div>
                    <div className="process-desc">{desc}</div>
                  </div>
                  {i < PROCESS_STEPS.length - 1 && <span className="process-arrow">→</span>}
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── CTA banner ── */}
      <Reveal>
        <section className="cta-navy-banner">
          <div className="section-inner cta-navy-inner">
            <div className="cta-navy-left">
              <div className="cta-navy-icon"><FiPhone /></div>
              <div>
                <h3 className="cta-navy-title">Let's Build Something Amazing <span className="gold-text">Together</span></h3>
                <p className="cta-navy-sub">Have a project in mind? Let's discuss and turn your ideas into reality.</p>
              </div>
            </div>
            <button className="btn-primary" style={{ background:'var(--neon-purple)', whiteSpace:'nowrap' }} onClick={() => setPage('order')}>
              Start a Project <FiArrowRight />
            </button>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
