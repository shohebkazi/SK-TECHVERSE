import { useState, useEffect } from 'react';
import { useCounter, useInView, useTyping } from '../hooks';
import { SERVICES, TECH_STACK } from '../data';
import { getTechIcon } from '../data/techIcons';
import { resolveImageUrl } from '../utils/image';
import Reveal from '../components/Reveal';
import DepthCarousel from '../components/DepthCarousel';
import { FiArrowRight, FiPlay, FiSearch, FiEdit3, FiCode, FiSend, FiPhone, FiTrendingUp, FiTarget, FiZap, FiBarChart2, FiCheck, FiShield, FiClock, FiHeadphones, FiLock, FiRocket } from 'react-icons/fi';

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

const AI_QUESTION = "Tell me about SK TECHVERSE, a digital agency offering AI, web and mobile app development in India — are they a credible team to hire for a business website or app?";
const AI_LINKS = [
  { name:'ChatGPT', mark:'✦', color:'#10A37F', url:`https://chatgpt.com/?q=${encodeURIComponent(AI_QUESTION)}` },
  { name:'Claude',  mark:'✳', color:'#D97757', url:`https://claude.ai/new?q=${encodeURIComponent(AI_QUESTION)}` },
  { name:'Gemini',  mark:'✧', color:'#4285F4', url:`https://gemini.google.com/app?q=${encodeURIComponent(AI_QUESTION)}` },
  { name:'Grok',    mark:'✕', color:'#111111', url:`https://grok.com/?q=${encodeURIComponent(AI_QUESTION)}` },
];

const SERVICE_STATS = [
  { icon: <FiRocket />, num: '50+', label: 'Projects Delivered' },
  { icon: <FiCode />,   num: '15+', label: 'Technologies Used' },
  { icon: <FiTarget />, num: '10+', label: 'Happy Clients' },
  { icon: <FiZap />,    num: '3+',  label: 'Years' },
];
const PROJECT_STATS = [
  { icon: <FiRocket />, num: '25+', label: 'Projects Delivered' },
  { icon: <FiCode />,   num: '15+', label: 'Technologies Used' },
  { icon: <FiTarget />, num: '10+', label: 'Happy Clients' },
  { icon: <FiZap />,    num: '3+',  label: 'Years of Excellence' },
];
const TRUST_BADGES = [
  { icon: <FiShield />,     title: 'Quality Assured',   sub: 'We follow best practices to deliver top-notch quality.' },
  { icon: <FiClock />,      title: 'On-Time Delivery',  sub: 'We respect deadlines and deliver on time, every time.' },
  { icon: <FiHeadphones />, title: '24/7 Support',      sub: 'Our team is always here to support your growth.' },
  { icon: <FiLock />,       title: 'Secure & Scalable', sub: 'We build secure and scalable solutions for your business.' },
  { icon: <FiTrendingUp />, title: 'Growth Focused',    sub: 'We build solutions that help your business grow.' },
];

export default function HomePage({ setPage }) {
  const [statsRef, statsVis] = useInView(0.3);
  const typed = useTyping(['AI-Powered Solutions','Web Applications','Mobile Apps','ERP Systems','Custom Software']);
  const [projects, setProjects] = useState([]);
  const [projLoading, setProjLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth <= 640);

  useEffect(() => {
    fetch(`${API}/projects?limit=3`)
      .then(r => r.json())
      .then(data => setProjects((data.projects || data || []).slice(0, 3)))
      .catch(() => {})
      .finally(() => setProjLoading(false));
  }, []);

  // Track viewport width so the featured-project carousel can switch to
  // square cards on mobile without ever touching the page's scroll position.
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
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
            <div className="growth-visual">
              <div className="growth-card">
                <div className="growth-card-header">
                  <span className="growth-card-badge">AI-Powered</span>
                  <span className="growth-card-live"><span className="live-dot" /> Live</span>
                </div>
                <div className="growth-card-title">Web & App Growth Engine</div>
                <div className="growth-card-chart">
                  {[38, 55, 46, 68, 60, 82, 72, 95].map((h, i) => (
                    <div key={i} className="growth-bar" style={{ height: `${h}%`, animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
                <div className="growth-card-stats-row">
                  <div>
                    <span className="growth-stat-num">+247%</span>
                    <span className="growth-stat-label">Traffic Growth</span>
                  </div>
                  <div>
                    <span className="growth-stat-num">98%</span>
                    <span className="growth-stat-label">Client Satisfaction</span>
                  </div>
                </div>
                <div className="growth-card-tags">
                  <span className="growth-tag">AI Solutions</span>
                  <span className="growth-tag">Web Dev</span>
                  <span className="growth-tag">Mobile Apps</span>
                  <span className="growth-tag">Cloud</span>
                </div>
              </div>
              <div className="growth-float-badge top"><FiTrendingUp /> +150% ROI</div>
              <div className="growth-float-badge bottom"><FiCode /> 200+ Projects</div>
            </div>
          </div>
          </Reveal>
        </div>
      </section>

      {/* ── Feature strip ── */}
      <Reveal>
        <section className="feature-strip">
          <div className="feature-strip-inner">
            <div className="feature-strip-item">
              <div className="feature-strip-icon"><FiTrendingUp /></div>
              <div>
                <div className="feature-strip-title">Data Driven</div>
                <div className="feature-strip-sub">Strategies</div>
              </div>
            </div>
            <div className="feature-strip-item">
              <div className="feature-strip-icon"><FiTarget /></div>
              <div>
                <div className="feature-strip-title">Results</div>
                <div className="feature-strip-sub">That Matter</div>
              </div>
            </div>
            <div className="feature-strip-item">
              <div className="feature-strip-icon"><FiZap /></div>
              <div>
                <div className="feature-strip-title">Creative Minds</div>
                <div className="feature-strip-sub">Real Impact</div>
              </div>
            </div>
            <div className="feature-strip-item">
              <div className="feature-strip-icon"><FiBarChart2 /></div>
              <div>
                <div className="feature-strip-title">Focused On</div>
                <div className="feature-strip-sub">Your Growth</div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

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
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'1.5rem' }}>
              <div>
                <span className="section-tag">What We Do</span>
                <h2 className="section-title">Services We <span>Provide</span></h2>
                <p className="section-sub" style={{ margin:0 }}>End-to-end digital solutions to help your business grow, scale and succeed in the digital world.</p>
              </div>
              <div className="rating-badge">
                <div className="rating-badge-avatars">
                  <span>S</span><span>K</span><span>+</span>
                </div>
                <div>
                  <div className="rating-badge-score">4.9/5 <span className="rating-badge-stars">★★★★★</span></div>
                  <div className="rating-badge-sub">Trusted by 10+ Businesses Worldwide</div>
                </div>
              </div>
            </div>

            <div className="stats-strip" style={{ marginTop:'2.5rem' }}>
              {SERVICE_STATS.map(s => (
                <div key={s.label} className="stats-strip-item">
                  <div className="stats-strip-icon">{s.icon}</div>
                  <div>
                    <div className="stats-strip-num">{s.num}</div>
                    <div className="stats-strip-label">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="proj-carousel-wrap" style={{ height: isMobile ? 460 : 520, position:'relative' }}>
              <DepthCarousel
                items={SERVICES.slice(0, 5).map((s, i) => ({
                  id: s.title,
                  image: `https://picsum.photos/seed/sk-service-${i}/700/900`,
                  alt: s.title,
                  title: s.title,
                  category: s.title.split(' ')[0],
                  description: s.desc,
                  ribbon: i === 2 ? 'Most Popular' : null,
                }))}
                cardWidth={isMobile ? 300 : 320}
                cardHeight={isMobile ? 300 : 420}
                radius={22}
                depth={isMobile ? 90 : 210}
                spread={isMobile ? 18 : 85}
                tilt={isMobile ? 14 : 18}
                tiltDirection="right"
                perspective={1400}
                visibleCards={isMobile ? 2 : 3}
                falloff={0.22}
                blur={5}
                autoplay
                autoplayDelay={4600}
                loop
                showControls={!isMobile}
                showIndicators
                kickerPrefix="Our Service"
                ctaLabel="Explore Service →"
                onCardAction={() => setPage('services')}
              />
            </div>

            <div className="trust-badges">
              {TRUST_BADGES.map(b => (
                <div key={b.title} className="trust-badge-item">
                  <div className="trust-badge-icon">{b.icon}</div>
                  <div>
                    <div className="trust-badge-title">{b.title}</div>
                    <div className="trust-badge-sub">{b.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Featured Projects (navy band) ── */}
      <Reveal>
        <section className="section navy-band">
          <div className="section-inner">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:'1.5rem', marginBottom:'2rem' }}>
              <div>
                <span className="section-tag light">Our Work</span>
                <h2 className="section-title light">Featured <span>Projects</span></h2>
                <p className="section-sub light" style={{ margin:0 }}>We deliver impactful solutions that drive growth and success.</p>
              </div>
              <div className="stats-strip" style={{ marginBottom:0, gridTemplateColumns:'repeat(4,auto)' }}>
                {PROJECT_STATS.map(s => (
                  <div key={s.label} className="stats-strip-item">
                    <div className="stats-strip-icon">{s.icon}</div>
                    <div>
                      <div className="stats-strip-num">{s.num}</div>
                      <div className="stats-strip-label">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {projLoading ? (
              <div style={{ textAlign:'center', padding:'2rem', color:'rgba(255,255,255,0.6)' }}>Loading projects...</div>
            ) : projects.length === 0 ? (
              <div style={{ textAlign:'center', padding:'2rem', color:'rgba(255,255,255,0.6)' }}>No projects yet — check back soon.</div>
            ) : (
              <div className="proj-carousel-wrap" style={{ height: isMobile ? 440 : 500, position:'relative' }}>
                <DepthCarousel
                  items={projects.map(p => ({
                    id: p._id,
                    image: p.image ? resolveImageUrl(p.image, FILE_BASE) : placeholderThumb(p.title),
                    alt: p.title,
                    title: p.title,
                    category: p.category || 'Web Development',
                    description: p.description,
                  }))}
                  cardWidth={isMobile ? 300 : 340}
                  cardHeight={isMobile ? 300 : 430}
                  radius={22}
                  depth={isMobile ? 90 : 220}
                  spread={isMobile ? 18 : 90}
                  tilt={isMobile ? 14 : 20}
                  tiltDirection="right"
                  perspective={1400}
                  visibleCards={isMobile ? 2 : 3}
                  falloff={0.22}
                  blur={5}
                  autoplay
                  autoplayDelay={4200}
                  loop
                  showControls={!isMobile}
                  showIndicators
                  onCardAction={(item) => setPage('projectDetail', item.id)}
                />
              </div>
            )}

            <div style={{ textAlign:'center', marginTop:'2rem' }}>
              <button className="btn-primary" style={{ background:'var(--neon-purple)' }} onClick={() => setPage('projects')}>
                View All Projects <FiArrowRight />
              </button>
            </div>
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
                    <span className="card-badge">{String(i + 1).padStart(2, '0')}</span>
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

      {/* ── Ask AI about us ── */}
      <Reveal>
        <section className="section ask-ai-section">
          <div className="section-inner" style={{ textAlign:'center' }}>
            <span className="section-tag">Don't Believe The Hype?</span>
            <h2 className="section-title">See what AI has to say <span>about us</span></h2>
            <div className="ask-ai-grid">
              {AI_LINKS.map(a => (
                <a key={a.name} href={a.url} target="_blank" rel="noopener noreferrer" className="ask-ai-btn">
                  <span className="ask-ai-mark" style={{ background:a.color }}>{a.mark}</span>
                  {a.name}
                </a>
              ))}
            </div>
            <p className="ask-ai-note">Opens your AI assistant with the question ready to send. We don't script the answer — read whatever it says.</p>
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
