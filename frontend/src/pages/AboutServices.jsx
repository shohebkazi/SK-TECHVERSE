import { SERVICES } from '../data';
import Reveal from '../components/Reveal';

export function AboutPage() {
  return (
    <div className="page-enter">
      <section className="section" style={{ paddingTop: '8rem' }}>
        <div className="section-inner">

          {/* Hero Banner */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(var(--nb-rgb),0.08), rgba(var(--np-rgb),0.12))',
            border: '1px solid rgba(var(--np-rgb),0.2)', borderRadius: 20,
            padding: '3rem 2rem', textAlign: 'center', marginBottom: '5rem',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at center,rgba(var(--nb-rgb),0.06),transparent 70%)', pointerEvents:'none' }} />
            <div style={{ position:'relative', zIndex:1 }}>
              <span className="section-tag" style={{ justifyContent:'center' }}>About SK TECHVERSE</span>
              <h1 className="section-title" style={{ marginBottom:'1rem' }}>Building the <span>Future</span> of Digital</h1>
              <p style={{ color:'var(--text-2)', fontSize:'1.05rem', maxWidth:600, margin:'0 auto' }}>
                A premium software development agency specialising in AI-driven solutions,
                full-stack development, and enterprise systems.
              </p>
            </div>
          </div>

          {/* Founder Card */}
          <Reveal>
          <div style={{ textAlign:'center', marginBottom:'5rem' }}>
            <span className="section-tag" style={{ justifyContent:'center' }}>Meet the Founder</span>
            <h2 className="section-title" style={{ marginBottom:'3rem' }}>The <span>Brain</span> Behind SK TECHVERSE</h2>

            <div style={{
              maxWidth:780, margin:'0 auto',
              background:'linear-gradient(135deg,rgba(var(--nb-rgb),0.05),rgba(var(--np-rgb),0.08))',
              border:'1px solid rgba(var(--np-rgb),0.25)', borderRadius:24, padding:'2.5rem',
              display:'flex', gap:'2.5rem', alignItems:'center', flexWrap:'wrap', justifyContent:'center',
              position:'relative', overflow:'hidden',
            }}>
              <div style={{ position:'absolute', top:'-40px', right:'-40px', width:200, height:200, background:'radial-gradient(circle,rgba(var(--np-rgb),0.15),transparent 70%)', borderRadius:'50%', pointerEvents:'none' }} />
              <div style={{ position:'absolute', bottom:'-40px', left:'-40px', width:200, height:200, background:'radial-gradient(circle,rgba(var(--nb-rgb),0.12),transparent 70%)', borderRadius:'50%', pointerEvents:'none' }} />

              {/* Photo */}
              <div style={{ position:'relative', flexShrink:0 }}>
                <div style={{ position:'absolute', inset:-4, borderRadius:'50%', background:'linear-gradient(135deg,var(--neon-blue),var(--neon-purple),var(--neon-pink))', animation:'spinRing 4s linear infinite', zIndex:0 }} />
                <div style={{ position:'absolute', inset:-2, borderRadius:'50%', background:'var(--bg-dark)', zIndex:1 }} />
                <img
                  src="/assets/founder.jpg"
                  alt="Shoaib Kazi"
                  style={{ width:160, height:160, borderRadius:'50%', objectFit:'cover', objectPosition:'top', position:'relative', zIndex:2, display:'block' }}
                  onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                />
                <div style={{ width:160, height:160, borderRadius:'50%', background:'linear-gradient(135deg,var(--neon-blue),var(--neon-purple))', display:'none', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-display)', fontSize:'3rem', fontWeight:900, color:'#fff', position:'relative', zIndex:2 }}>SK</div>
                <div style={{ position:'absolute', bottom:8, right:8, zIndex:3, width:22, height:22, borderRadius:'50%', background:'var(--neon-green)', border:'3px solid var(--bg-dark)', boxShadow:'0 0 10px rgba(16,185,129,0.6)' }} />
              </div>

              {/* Info */}
              <div style={{ flex:1, minWidth:260, textAlign:'left', position:'relative', zIndex:1 }}>
                <div style={{ fontFamily:'var(--font-ui)', fontSize:'0.72rem', fontWeight:600, letterSpacing:'0.15em', color:'var(--neon-cyan)', textTransform:'uppercase', marginBottom:'0.35rem' }}>✦ Founder & CEO</div>
                <h3 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.5rem,4vw,2rem)', fontWeight:900, lineHeight:1.1 }}>
                  Shoaib <span style={{ background:'linear-gradient(135deg,var(--neon-blue),var(--neon-purple))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Kazi</span>
                </h3>
                <div style={{ fontFamily:'var(--font-ui)', fontSize:'0.88rem', color:'var(--text-2)', marginTop:'0.4rem' }}>Full Stack Developer · AI Engineer · UI/UX Designer</div>

                <p style={{ fontSize:'0.92rem', color:'var(--text-2)', lineHeight:1.75, margin:'1rem 0 1.25rem' }}>
                  Passionate software engineer with expertise in AI, full-stack web development,
                  and enterprise systems. Founded SK TECHVERSE with a mission to deliver
                  world-class digital solutions that transform businesses through technology.
                </p>

                {/* Contact chips */}
                <div style={{ display:'flex', flexWrap:'wrap', gap:'0.65rem', marginBottom:'1.25rem' }}>
                  <a href="https://wa.me/917410721438" target="_blank" rel="noopener noreferrer"
                    style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', padding:'0.45rem 1rem', borderRadius:100, background:'rgba(37,211,102,0.1)', border:'1px solid rgba(37,211,102,0.3)', color:'#25D366', textDecoration:'none', fontFamily:'var(--font-ui)', fontSize:'0.82rem', fontWeight:600 }}>
                    💬 +91 74107 21438
                  </a>
                  <a href="mailto:sktechverse@gmail.com"
                    style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', padding:'0.45rem 1rem', borderRadius:100, background:'rgba(var(--nb-rgb),0.08)', border:'1px solid rgba(var(--nb-rgb),0.2)', color:'var(--neon-cyan)', textDecoration:'none', fontFamily:'var(--font-ui)', fontSize:'0.82rem', fontWeight:600 }}>
                    📧 sktechverse@gmail.com
                  </a>
                </div>

                <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem' }}>
                  {['React.js','Node.js','Python','MongoDB','AI/ML','Flutter','AWS','UI/UX'].map(s=>(
                    <span key={s} className="tech-tag">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          </Reveal>

          {/* Stats */}
          <div style={{ display:'flex', justifyContent:'center', flexWrap:'wrap', gap:'1.5rem', marginBottom:'5rem' }}>
            {[['150+','Projects Completed'],['80+','Happy Clients'],['3+','Years Experience'],['20+','Technologies'],['98%','Client Retention']].map(([num,lbl],i)=>(
              <Reveal key={lbl} delay={i*0.06} y={16}>
              <div style={{ textAlign:'center', padding:'1.5rem 2rem', background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:14, minWidth:130, transition:'all 0.3s', cursor:'default' }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--border-h)';e.currentTarget.style.transform='translateY(-4px)';}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.transform='translateY(0)';}}>
                <div style={{ fontFamily:'var(--font-display)', fontSize:'1.8rem', fontWeight:900, background:'linear-gradient(135deg,var(--neon-blue),var(--neon-purple))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{num}</div>
                <div style={{ fontFamily:'var(--font-ui)', fontSize:'0.72rem', color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.1em', marginTop:'0.25rem' }}>{lbl}</div>
              </div>
              </Reveal>
            ))}
          </div>

          {/* Timeline */}
          <Reveal>
          <div style={{ maxWidth:700, margin:'0 auto 5rem' }}>
            <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
              <span className="section-tag" style={{ justifyContent:'center' }}>Our Journey</span>
              <h2 className="section-title">SK TECHVERSE <span>Timeline</span></h2>
            </div>
            <div className="timeline">
              {[['2021','Founded SK TECHVERSE — Started with web development and college projects'],
                ['2022','Completed 50+ projects — Launched dedicated AI & Mobile division'],
                ['2023','Expanded to enterprise ERP, cloud solutions and billing systems'],
                ['2024','150+ projects · 80+ clients · 20+ technologies · 98% retention rate']].map(([yr,txt])=>(
                <div key={yr} className="tl-item">
                  <div className="tl-dot"/>
                  <div className="tl-year">{yr}</div>
                  <div className="tl-text">{txt}</div>
                </div>
              ))}
            </div>
          </div>
          </Reveal>

          {/* Why Choose Us */}
          <Reveal>
          <div style={{ textAlign:'center', marginBottom:'2rem' }}>
            <span className="section-tag" style={{ justifyContent:'center' }}>Our Values</span>
            <h2 className="section-title">Why <span>Choose Us</span>?</h2>
          </div>
          </Reveal>
          <div className="services-grid" style={{ marginBottom:'5rem' }}>
            {[['⚡','Speed & Agility','Deliver projects on time without compromising quality. Agile sprints keep you in full control.'],
              ['🎯','Precision Engineering','Every line of code crafted with purpose. Scalable, maintainable systems that last.'],
              ['🤖','AI-First Approach','AI integrated into every solution where it genuinely adds value and competitive edge.'],
              ['🔒','Security First','Enterprise-grade security practices applied to every project, big or small.'],
              ['📞','24/7 Support','Dedicated support even after delivery. We are long-term partners, not just vendors.'],
              ['💡','Innovation','Constantly exploring emerging tech to bring you sustainable competitive advantages.']].map(([icon,title,desc],i)=>(
              <Reveal key={title} delay={Math.min(i*0.06,0.3)}>
              <div className="glass-card">
                <div style={{ fontSize:'2rem', marginBottom:'1rem' }}>{icon}</div>
                <div className="service-title">{title}</div>
                <div className="service-desc">{desc}</div>
              </div>
              </Reveal>
            ))}
          </div>

          {/* CTA */}
          <Reveal scale={0.96}>
          <div style={{ background:'linear-gradient(135deg,rgba(var(--nb-rgb),0.07),rgba(var(--np-rgb),0.1))', border:'1px solid rgba(var(--np-rgb),0.2)', borderRadius:20, padding:'3rem', textAlign:'center' }}>
            <div style={{ fontSize:'2.5rem', marginBottom:'1rem' }}>🤝</div>
            <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem', fontWeight:900, marginBottom:'0.75rem' }}>
              Let's Build <span style={{ background:'linear-gradient(135deg,var(--neon-blue),var(--neon-purple))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Something Amazing</span>
            </h3>
            <p style={{ color:'var(--text-2)', marginBottom:'2rem', maxWidth:500, margin:'0 auto 2rem' }}>
              Have a project in mind? Shoaib and the SK TECHVERSE team are ready to turn your idea into reality.
            </p>
            <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
              <a href="https://wa.me/917410721438" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ textDecoration:'none' }}>💬 WhatsApp Shoaib</a>
              <a href="mailto:sktechverse@gmail.com" className="btn-outline" style={{ textDecoration:'none' }}>📧 Send Email</a>
            </div>
          </div>
          </Reveal>

        </div>
      </section>
      <style>{`@keyframes spinRing{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export function ServicesPage({ setPage }) {
  return (
    <div className="page-enter">
      <section className="section" style={{ paddingTop:'8rem' }}>
        <div className="section-inner">
          <div style={{ textAlign:'center' }}>
            <span className="section-tag">What We Offer</span>
            <h2 className="section-title">Our <span>Services</span></h2>
            <p className="section-sub">Comprehensive software solutions crafted with precision, powered by AI, and built to scale your business.</p>
          </div>
          <div className="services-grid">
            {SERVICES.map((s,i)=>(
              <Reveal key={i} delay={Math.min(i*0.05,0.3)}>
              <div className="glass-card">
                <div className="service-icon" style={{ background:`${s.color}15`, border:`1px solid ${s.color}28` }}>
                  <span style={{ fontSize:'1.4rem' }}>{s.icon}</span>
                </div>
                <div className="service-title">{s.title}</div>
                <div className="service-desc">{s.desc}</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem', marginTop:'1.25rem' }}>
                  {['Custom Build','AI-Ready','Fast Delivery'].map(t=><span key={t} className="tech-tag">{t}</span>)}
                </div>
                <div className="service-arrow" onClick={()=>setPage('order')}>Get Quote →</div>
              </div>
              </Reveal>
            ))}
          </div>
          <div style={{ textAlign:'center', marginTop:'3rem' }}>
            <button className="btn-primary" onClick={()=>setPage('order')}>🚀 Order a Service</button>
          </div>
        </div>
      </section>
    </div>
  );
}