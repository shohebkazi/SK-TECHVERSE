import { useCounter, useInView, useTyping } from '../hooks';
import { SERVICES, TECH_STACK } from '../data';
import { getTechIcon } from '../data/techIcons';
import Reveal from '../components/Reveal';

function StatItem({ value, label, suffix='+', trigger }) {
  const count = useCounter(value, 2000, trigger);
  return (
    <div style={{ textAlign:'center' }}>
      <span className="stat-num">{count}{suffix}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

export default function HomePage({ setPage }) {
  const [statsRef, statsVis] = useInView(0.3);
  const typed = useTyping(['AI-Powered Solutions','Web Applications','Mobile Apps','ERP Systems','Custom Software']);
  const doubled = [...TECH_STACK, ...TECH_STACK];

  return (
    <div className="page-enter">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />

        <div className="hero-split">
          <div className="hero-content">
            <div className="hero-badge"><span className="badge-dot" />AI-Powered Digital Agency</div>

            <h1 className="hero-title">
              <span style={{ display:'block', color:'var(--text-1)' }}>We Build</span>
              <span className="brand">SK TECHVERSE</span>
            </h1>

            <div className="typing-wrap">
              <span style={{ color:'var(--text-2)' }}>Experts in</span>
              <span style={{ color:'var(--neon-cyan)', fontWeight:600 }}>{typed}</span>
              <span className="typing-cursor" style={{ color:'var(--neon-blue)' }}>|</span>
            </div>

            <p className="hero-tagline">
              Building Smart Digital Solutions with AI. From concept to deployment, we craft
              premium software that scales your business to the next level.
            </p>

            <div className="hero-btns-row" style={{ display:'flex', gap:'1rem', flexWrap:'wrap', marginBottom:'4rem' }}>
              <button className="btn-primary" onClick={() => setPage('order')}>🚀 Hire Us</button>
              <button className="btn-outline" onClick={() => setPage('projects')}>View Projects →</button>
            </div>

            <div ref={statsRef} className="stats-row hero-stats-row">
              <StatItem value={150} label="Projects Done"      suffix="+" trigger={statsVis} />
              <StatItem value={80}  label="Happy Clients"      suffix="+" trigger={statsVis} />
              <StatItem value={20}  label="Technologies"       suffix="+" trigger={statsVis} />
              <StatItem value={3}   label="Years Experience"   suffix="+" trigger={statsVis} />
            </div>
          </div>

          {/* Product showcase mockup */}
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

      {/* ── Tech Slider ── */}
      <Reveal>
        <section style={{ padding:'2rem 2rem 4rem' }}>
          <div className="section-inner">
            <div style={{ textAlign:'center', marginBottom:'1.5rem' }}>
              <span className="section-tag">Our Tech Stack</span>
            </div>
            <div className="tech-slider">
              <div className="tech-track">
                {doubled.map((t, i) => (
                  <div key={i} className="tech-item"><span>⚡</span>{t}</div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <div className="section-divider" />

      {/* ── Technologies Grid ── */}
      <Reveal>
        <section className="section" style={{ paddingTop:'2rem' }}>
          <div className="section-inner">
            <div style={{ textAlign:'center' }}>
              <span className="section-tag" style={{ justifyContent:'center' }}>Skills &amp; Technologies</span>
              <h2 className="section-title">Technologies We <span>Work With</span></h2>
              <p className="section-sub">A modern, battle-tested toolkit powering every project we ship.</p>
            </div>

            <div className="tech-grid" style={{ marginTop:'2.5rem' }}>
              {TECH_STACK.map((name, i) => {
                const { Icon, color, cat } = getTechIcon(name);
                return (
                  <Reveal key={name} delay={Math.min(i * 0.04, 0.4)} y={16}>
                    <div className="tech-card">
                      <div className="tech-card-icon" style={{ color }}>
                        {Icon ? <Icon /> : <span>{name.slice(0,2)}</span>}
                      </div>
                      <div className="tech-card-name">{name}</div>
                      <div className="tech-card-cat">{cat}</div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      </Reveal>

      <div className="section-divider" />

      {/* ── Services Preview ── */}
      <Reveal>
        <section className="section">
          <div className="section-inner">
            <div style={{ textAlign:'center' }}>
              <span className="section-tag">What We Do</span>
              <h2 className="section-title">Premium <span>Services</span></h2>
              <p className="section-sub">From AI solutions to full-stack development, we deliver excellence across every technology domain.</p>
            </div>

            <div className="services-grid">
              {SERVICES.slice(0, 6).map((s, i) => (
                <Reveal key={i} delay={Math.min(i * 0.06, 0.3)}>
                  <div className="glass-card">
                    <div className="service-icon" style={{ background:`${s.color}15`, border:`1px solid ${s.color}28` }}>
                      <span style={{ fontSize:'1.4rem' }}>{s.icon}</span>
                    </div>
                    <div className="service-title">{s.title}</div>
                    <div className="service-desc">{s.desc}</div>
                    <div className="service-arrow">Learn more →</div>
                  </div>
                </Reveal>
              ))}
            </div>

            <div style={{ textAlign:'center', marginTop:'2.5rem' }}>
              <button className="btn-outline" onClick={() => setPage('services')}>View All Services →</button>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── CTA Banner ── */}
      <Reveal scale={0.96}>
        <section style={{ padding:'0 2rem 6rem' }}>
          <div style={{
            maxWidth:1200, margin:'0 auto',
            background:'linear-gradient(135deg,rgba(var(--nb-rgb),0.09),rgba(var(--np-rgb),0.12))',
            border:'1px solid rgba(var(--np-rgb),0.25)', borderRadius:20,
            padding:'3.5rem 3rem', textAlign:'center', position:'relative', overflow:'hidden',
          }}>
            <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at center,rgba(var(--np-rgb),0.09),transparent 70%)', pointerEvents:'none' }} />
            <div style={{ position:'relative', zIndex:1 }}>
              <span className="section-tag" style={{ justifyContent:'center' }}>Ready to Start?</span>
              <h2 className="section-title" style={{ marginBottom:'1rem' }}>Transform Your <span>Business</span> Today</h2>
              <p style={{ color:'var(--text-2)', marginBottom:'2rem', fontSize:'1.05rem' }}>
                Get a free consultation and project estimate from our expert team.
              </p>
              <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
                <button className="btn-primary" onClick={() => setPage('order')}>🚀 Start a Project</button>
                <button className="btn-outline" onClick={() => setPage('contact')}>📞 Contact Us</button>
              </div>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
