import { useState } from 'react';
import { BLOG_POSTS, SERVICES } from '../data';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// ════════════════════════════════════════════
// Blog
// ════════════════════════════════════════════
export function BlogPage() {
  return (
    <div className="page-enter">
      <section className="section" style={{ paddingTop:'8rem' }}>
        <div className="section-inner">
          <div style={{ textAlign:'center' }}>
            <span className="section-tag">Knowledge Hub</span>
            <h2 className="section-title">Tech <span>Blog</span></h2>
            <p className="section-sub">Insights, tutorials, and deep-dives from the SK TECHVERSE engineering team.</p>
          </div>
          <div className="blog-grid">
            {BLOG_POSTS.map((p,i)=>(
              <div key={i} className="blog-card">
                <div className="blog-thumb">
                  <span>{p.icon}</span>
                  <span className="blog-cat">{p.cat}</span>
                </div>
                <div className="blog-body">
                  <div className="blog-meta"><span>📅 {p.date}</span><span>⏱ {p.read} read</span></div>
                  <div className="blog-title">{p.title}</div>
                  <div className="blog-excerpt">{p.excerpt}</div>
                  <div style={{ marginTop:'1rem', color:'var(--neon-blue)', fontSize:'0.82rem', fontFamily:'var(--font-ui)', fontWeight:600, cursor:'pointer' }}>Read More →</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ════════════════════════════════════════════
// Contact
// ════════════════════════════════════════════
export function ContactPage() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', subject:'', message:'' });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const f = k => e => setForm(p=>({...p,[k]:e.target.value}));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      const res = await fetch(`${API}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send message');
      setSent(true);
      setForm({ name:'', email:'', phone:'', subject:'', message:'' });
      setTimeout(()=>setSent(false),5000);
    } catch (e) {
      setErr(e.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page-enter">
      <section className="section" style={{ paddingTop:'8rem' }}>
        <div className="section-inner">
          <div style={{ textAlign:'center' }}>
            <span className="section-tag">Get In Touch</span>
            <h2 className="section-title">Contact <span>Us</span></h2>
            <p className="section-sub">Ready to start? We respond within 2 hours on business days.</p>
          </div>
          <div className="contact-grid">
            <div>
              <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.15rem', fontWeight:700, marginBottom:'2rem' }}>Contact Information</h3>
              {[['📧','Email','sktechverse@gmail.com'],['📞','Phone','+91 74107 21438'],
                ['💬','WhatsApp','+91 74107 21438 (24/7)'],['📍','Location','India (Remote + On-site)'],
                ['⏰','Response','Within 2 business hours']].map(([icon,label,val])=>(
                <div key={label} className="contact-item">
                  <div className="contact-icon">{icon}</div>
                  <div><div className="contact-label">{label}</div><div className="contact-val">{val}</div></div>
                </div>
              ))}
              <div style={{ marginTop:'2rem' }}>
                <div style={{ fontFamily:'var(--font-ui)', fontSize:'0.75rem', fontWeight:600, letterSpacing:'0.1em', color:'var(--neon-blue)', textTransform:'uppercase', marginBottom:'0.75rem' }}>Follow Us</div>
                <div style={{ display:'flex', gap:'0.75rem' }}>
                  {['𝕏','in','🐙','📘'].map((s,i)=><a key={i} className="social-btn" href="#" onClick={e=>e.preventDefault()}>{s}</a>)}
                </div>
              </div>
              <div className="map-box">
                <span>📍</span>
                <div style={{ fontSize:'0.85rem', fontFamily:'var(--font-ui)', textAlign:'center' }}>India — Remote &amp; On-site Available</div>
              </div>
            </div>
            <div className="glass-card">
              {sent ? (
                <div style={{ textAlign:'center', padding:'3rem 1rem' }}>
                  <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>✅</div>
                  <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.2rem', marginBottom:'0.5rem' }}>Message Sent!</h3>
                  <p style={{ color:'var(--text-2)' }}>We'll get back to you within 2 hours.</p>
                </div>
              ) : (
                <form onSubmit={submit}>
                  <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.05rem', fontWeight:700, marginBottom:'1.5rem' }}>Send a Message</h3>
                  {err && (
                    <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:8, padding:'0.75rem 1rem', marginBottom:'1.25rem', fontSize:'0.85rem', color:'#ef4444' }}>
                      ⚠️ {err}
                    </div>
                  )}
                  <div className="form-row">
                    <div className="form-group"><label className="form-label">Name</label><input className="form-input" placeholder="Your full name" value={form.name} onChange={f('name')} required/></div>
                    <div className="form-group"><label className="form-label">Email</label><input type="email" className="form-input" placeholder="your@email.com" value={form.email} onChange={f('email')} required/></div>
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label className="form-label">Phone</label><input className="form-input" placeholder="+91-XXXXXXXXXX" value={form.phone} onChange={f('phone')}/></div>
                    <div className="form-group"><label className="form-label">Subject</label><input className="form-input" placeholder="Project type" value={form.subject} onChange={f('subject')} required/></div>
                  </div>
                  <div className="form-group"><label className="form-label">Message</label><textarea className="form-textarea" placeholder="Tell us about your project..." value={form.message} onChange={f('message')} required/></div>
                  <button type="submit" className="btn-primary" style={{ width:'100%', border:'none' }} disabled={busy}>
                    {busy?'⏳ Sending...':'🚀 Send Message'}
                  </button>
                  <p style={{ textAlign:'center', marginTop:'1rem', fontSize:'0.8rem', color:'var(--text-3)' }}>
                    Or chat on <a href="https://wa.me/917410721438" target="_blank" rel="noopener noreferrer" style={{ color:'#25D366', textDecoration:'none', fontWeight:600 }}>WhatsApp →</a>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ════════════════════════════════════════════
// Order
// ════════════════════════════════════════════
export function OrderPage({ setPage }) {
  const [form, setForm] = useState({ clientName:'', clientEmail:'', clientPhone:'', projectType:'', projectTitle:'', description:'', budget:'', deadline:'' });
  const [sent, setSent] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [busy, setBusy] = useState(false);
  const [err,  setErr]  = useState('');
  const f = k => e => setForm(p=>({...p,[k]:e.target.value}));

  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setErr('');
    try {
      const res = await fetch(`${API}/orders`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setOrderId(data.orderId);
      setSent(true);
    } catch(e) {
      setErr(e.message || 'Something went wrong. Please try again.');
    } finally { setBusy(false); }
  };

  return (
    <div className="page-enter" style={{ minHeight:'100vh', padding:'8rem 2rem 4rem' }}>
      <div style={{ maxWidth:800, margin:'0 auto', background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:20, padding:'3rem' }}>
        {sent ? (
          <div style={{ textAlign:'center', padding:'2rem 1rem' }}>
            <div style={{ fontSize:'4rem', marginBottom:'1rem' }}>🎉</div>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.8rem', fontWeight:900, marginBottom:'0.75rem' }}>Order Submitted!</h2>
            <div style={{ background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:12, padding:'1.25rem', margin:'1.5rem auto', maxWidth:420 }}>
              <div style={{ fontFamily:'var(--font-ui)', fontSize:'0.72rem', color:'var(--neon-green)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.4rem' }}>Your Order ID</div>
              <div style={{ fontFamily:'var(--font-display)', fontSize:'0.95rem', color:'var(--text-1)', wordBreak:'break-all' }}>{orderId}</div>
            </div>
            <p style={{ color:'var(--text-2)', marginBottom:'0.75rem' }}>
              ✅ A <strong>confirmation email</strong> has been sent to <strong style={{ color:'var(--neon-cyan)' }}>{form.clientEmail}</strong>
            </p>
            <p style={{ color:'var(--text-2)', marginBottom:'2rem', fontSize:'0.9rem' }}>
              Our team will review your project and respond within 2 hours. You will receive email updates at every stage.
            </p>
            <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
              <button className="btn-primary" onClick={() => setPage('track')}>📦 Track My Order</button>
              <a href="https://wa.me/917410721438" target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ textDecoration:'none' }}>💬 WhatsApp Us</a>
            </div>
          </div>
        ) : (
          <>
            <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
              <span className="section-tag" style={{ justifyContent:'center' }}>Start Your Project</span>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'2rem', fontWeight:900 }}>
                Order a <span style={{ background:'linear-gradient(135deg,var(--neon-blue),var(--neon-purple))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Project</span>
              </h2>
              <p style={{ color:'var(--text-2)', marginTop:'0.5rem', fontSize:'0.9rem' }}>Fill the form — you'll receive an email confirmation instantly 📧</p>
            </div>

            {err && (
              <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:8, padding:'0.75rem 1rem', marginBottom:'1.25rem', fontSize:'0.88rem', color:'#ef4444' }}>
                ⚠️ {err}
              </div>
            )}

            <form onSubmit={submit}>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Your Name</label><input className="form-input" placeholder="Full name" value={form.clientName} onChange={f('clientName')} required/></div>
                <div className="form-group"><label className="form-label">Email *</label><input type="email" className="form-input" placeholder="your@email.com" value={form.clientEmail} onChange={f('clientEmail')} required/></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Phone / WhatsApp</label><input className="form-input" placeholder="+91-XXXXXXXXXX" value={form.clientPhone} onChange={f('clientPhone')}/></div>
                <div className="form-group">
                  <label className="form-label">Project Type</label>
                  <select className="form-select" value={form.projectType} onChange={f('projectType')} required>
                    <option value="">Select type...</option>
                    {SERVICES.map(s=><option key={s.title} value={s.title}>{s.title}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group"><label className="form-label">Project Title</label><input className="form-input" placeholder="e.g. Hospital Management System" value={form.projectTitle} onChange={f('projectTitle')}/></div>
              <div className="form-group"><label className="form-label">Description *</label><textarea className="form-textarea" style={{ minHeight:130 }} placeholder="Describe your requirements, features, tech preferences..." value={form.description} onChange={f('description')} required/></div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Budget Range</label>
                  <select className="form-select" value={form.budget} onChange={f('budget')}>
                    <option value="">Select budget...</option>
                    <option>Under ₹5,000</option><option>₹5,000 – ₹15,000</option>
                    <option>₹15,000 – ₹50,000</option><option>₹50,000 – ₹1,00,000</option>
                    <option>₹1,00,000+</option>
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Deadline</label><input type="date" className="form-input" value={form.deadline} onChange={f('deadline')}/></div>
              </div>
              <button type="submit" className="btn-primary" style={{ width:'100%', border:'none', marginTop:'0.5rem' }} disabled={busy}>
                {busy ? '⏳ Submitting...' : '🚀 Submit Order — Get Email Confirmation'}
              </button>
              <p style={{ textAlign:'center', marginTop:'1rem', fontSize:'0.8rem', color:'var(--text-3)' }}>
                Already ordered? <span style={{ color:'var(--neon-blue)', cursor:'pointer', fontWeight:600 }} onClick={()=>setPage('track')}>Track your project →</span>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// Track Order
// ════════════════════════════════════════════
const STATUS_CONFIG = {
  pending:      { icon:'⏳', color:'#f59e0b', bg:'rgba(245,158,11,0.1)',  border:'rgba(245,158,11,0.25)',  label:'Order Received',  desc:'Your order has been received and is waiting for review.' },
  reviewing:    { icon:'🔍', color:'var(--neon-blue)', bg:'rgba(var(--nb-rgb),0.08)', border:'rgba(var(--nb-rgb),0.2)',   label:'Under Review',    desc:'Our team is reviewing your project and preparing a proposal.' },
  accepted:     { icon:'✅', color:'#10b981', bg:'rgba(16,185,129,0.1)', border:'rgba(16,185,129,0.25)', label:'Accepted',        desc:'Your project has been accepted! We will contact you for next steps.' },
  'in-progress':{ icon:'⚡', color:'var(--neon-purple)', bg:'rgba(var(--np-rgb),0.1)', border:'rgba(var(--np-rgb),0.25)', label:'In Progress',     desc:'Your project is actively being developed by our team.' },
  completed:    { icon:'🎉', color:'#10b981', bg:'rgba(16,185,129,0.1)', border:'rgba(16,185,129,0.25)', label:'Completed',       desc:'Your project is complete! Please review the deliverables.' },
  cancelled:    { icon:'❌', color:'#ef4444', bg:'rgba(239,68,68,0.1)',  border:'rgba(239,68,68,0.25)',  label:'Cancelled',       desc:'This order has been cancelled. Contact us for more info.' },
};

const STEPS = ['pending','reviewing','accepted','in-progress','completed'];

export function TrackOrderPage({ setPage }) {
  const [email,   setEmail]   = useState('');
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(false);
  const [err,     setErr]     = useState('');
  const [tracked, setTracked] = useState(false);

  const track = async (e) => {
    e.preventDefault(); setLoading(true); setErr(''); setOrders([]);
    try {
      const res  = await fetch(`${API}/orders/track`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setOrders(data.orders);
      setTracked(true);
    } catch(e) {
      setErr(e.message || 'No orders found for this email.');
    } finally { setLoading(false); }
  };

  const stepIndex = (status) => STEPS.indexOf(status);

  return (
    <div className="page-enter" style={{ minHeight:'100vh', padding:'8rem 2rem 4rem' }}>
      <div style={{ maxWidth:760, margin:'0 auto' }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:'3rem' }}>
          <span className="section-tag" style={{ justifyContent:'center' }}>Project Tracker</span>
          <h2 className="section-title">Track Your <span>Order</span></h2>
          <p style={{ color:'var(--text-2)', fontSize:'0.95rem' }}>Enter your email to see all your project orders and their live status.</p>
        </div>

        {/* Search Form */}
        <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:'2rem', marginBottom:'2rem' }}>
          <form onSubmit={track} style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap' }}>
            <input
              type="email"
              className="form-input"
              placeholder="Enter your email address..."
              value={email}
              onChange={e=>setEmail(e.target.value)}
              style={{ flex:1, minWidth:240 }}
              required
            />
            <button type="submit" className="btn-primary" style={{ border:'none', whiteSpace:'nowrap' }} disabled={loading}>
              {loading ? '⏳ Searching...' : '🔍 Track Orders'}
            </button>
          </form>

          {err && (
            <div style={{ marginTop:'1rem', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:8, padding:'0.75rem 1rem', color:'#ef4444', fontSize:'0.88rem' }}>
              ⚠️ {err}
            </div>
          )}
        </div>

        {/* Orders List */}
        {tracked && orders.length > 0 && (
          <div>
            <div style={{ fontFamily:'var(--font-ui)', fontSize:'0.78rem', color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'1rem' }}>
              {orders.length} order{orders.length > 1 ? 's' : ''} found for <span style={{ color:'var(--neon-cyan)' }}>{email}</span>
            </div>

            {orders.map((order, i) => {
              const s   = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const idx = stepIndex(order.status);

              return (
                <div key={order._id} style={{
                  background:'var(--bg-card)', border:`1px solid ${s.border}`,
                  borderRadius:16, padding:'1.75rem', marginBottom:'1.25rem',
                  transition:'all 0.3s',
                }}>
                  {/* Top row */}
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'0.75rem', marginBottom:'1.25rem' }}>
                    <div>
                      <div style={{ fontFamily:'var(--font-display)', fontSize:'1rem', fontWeight:700, marginBottom:'0.25rem' }}>
                        {order.projectTitle || order.projectType}
                      </div>
                      <div style={{ fontFamily:'var(--font-ui)', fontSize:'0.75rem', color:'var(--text-3)' }}>
                        ID: <span style={{ color:'var(--neon-cyan)', fontFamily:'monospace' }}>{order._id}</span>
                      </div>
                    </div>
                    <div style={{ background:s.bg, border:`1px solid ${s.border}`, borderRadius:100, padding:'0.35rem 1rem', display:'inline-flex', alignItems:'center', gap:'0.4rem' }}>
                      <span>{s.icon}</span>
                      <span style={{ fontFamily:'var(--font-ui)', fontSize:'0.78rem', fontWeight:700, color:s.color, textTransform:'uppercase', letterSpacing:'0.08em' }}>{s.label}</span>
                    </div>
                  </div>

                  {/* Status description */}
                  <p style={{ fontSize:'0.9rem', color:'var(--text-2)', marginBottom:'1.5rem', lineHeight:1.6 }}>{s.desc}</p>

                  {/* Progress bar */}
                  {order.status !== 'cancelled' && (
                    <div style={{ marginBottom:'1.5rem' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.6rem' }}>
                        {STEPS.map((step, si) => {
                          const sc = STATUS_CONFIG[step];
                          const done = si <= idx;
                          return (
                            <div key={step} style={{ textAlign:'center', flex:1 }}>
                              <div style={{
                                width:28, height:28, borderRadius:'50%', margin:'0 auto 0.35rem',
                                background: done ? `linear-gradient(135deg,var(--neon-blue),var(--neon-purple))` : 'rgba(255,255,255,0.06)',
                                border: done ? 'none' : '1px solid var(--border)',
                                display:'flex', alignItems:'center', justifyContent:'center',
                                fontSize:'0.75rem', transition:'all 0.3s',
                              }}>{done ? sc.icon : ''}</div>
                              <div style={{ fontSize:'0.6rem', color: done ? 'var(--neon-cyan)' : 'var(--text-3)', fontFamily:'var(--font-ui)', textTransform:'uppercase', letterSpacing:'0.05em' }}>
                                {sc.label.split(' ')[0]}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {/* Line */}
                      <div style={{ height:3, background:'rgba(255,255,255,0.06)', borderRadius:2, position:'relative', marginTop:'0.25rem' }}>
                        <div style={{ height:'100%', borderRadius:2, background:'linear-gradient(90deg,var(--neon-blue),var(--neon-purple))', width:`${Math.max(5,(idx/(STEPS.length-1))*100)}%`, transition:'width 0.5s ease' }} />
                      </div>
                    </div>
                  )}

                  {/* Admin notes */}
                  {order.adminNotes && (
                    <div style={{ background:'rgba(var(--np-rgb),0.08)', border:'1px solid rgba(var(--np-rgb),0.2)', borderRadius:10, padding:'1rem 1.25rem', marginBottom:'1.25rem' }}>
                      <div style={{ fontFamily:'var(--font-ui)', fontSize:'0.72rem', color:'var(--neon-purple)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.4rem', fontWeight:600 }}>
                        📝 Message from SK TECHVERSE
                      </div>
                      <p style={{ margin:0, fontSize:'0.92rem', color:'var(--text-1)', lineHeight:1.6 }}>{order.adminNotes}</p>
                    </div>
                  )}

                  {/* Details */}
                  <div style={{ display:'flex', gap:'1.5rem', flexWrap:'wrap', fontSize:'0.82rem', color:'var(--text-3)', fontFamily:'var(--font-ui)' }}>
                    <span>📦 <span style={{ color:'var(--text-2)' }}>{order.projectType}</span></span>
                    {order.budget && <span>💰 <span style={{ color:'var(--text-2)' }}>{order.budget}</span></span>}
                    <span>📅 <span style={{ color:'var(--text-2)' }}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</span></span>
                    <span>🔄 Updated: <span style={{ color:'var(--text-2)' }}>{new Date(order.updatedAt).toLocaleDateString('en-IN')}</span></span>
                  </div>

                  {/* Action */}
                  <div style={{ marginTop:'1.25rem', paddingTop:'1.25rem', borderTop:'1px solid rgba(255,255,255,0.06)', display:'flex', gap:'0.75rem', flexWrap:'wrap' }}>
                    <a href={`https://wa.me/917410721438?text=Hi! Regarding my Order ID: ${order._id}`}
                      target="_blank" rel="noopener noreferrer"
                      style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', padding:'0.45rem 1rem', borderRadius:100, background:'rgba(37,211,102,0.1)', border:'1px solid rgba(37,211,102,0.2)', color:'#25D366', textDecoration:'none', fontFamily:'var(--font-ui)', fontSize:'0.78rem', fontWeight:600 }}>
                      💬 WhatsApp about this order
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* No result after search */}
        {tracked && orders.length === 0 && !err && (
          <div style={{ textAlign:'center', padding:'3rem', background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16 }}>
            <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>📭</div>
            <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', marginBottom:'0.5rem' }}>No Orders Found</h3>
            <p style={{ color:'var(--text-2)', marginBottom:'1.5rem' }}>No orders found for this email. Place a new order to get started.</p>
            <button className="btn-primary" onClick={()=>setPage('order')}>🚀 Place New Order</button>
          </div>
        )}

        {/* Bottom CTA */}
        {!tracked && (
          <div style={{ textAlign:'center', marginTop:'2rem' }}>
            <p style={{ color:'var(--text-3)', fontSize:'0.88rem', marginBottom:'1rem' }}>Don't have an order yet?</p>
            <button className="btn-outline" onClick={()=>setPage('order')}>🚀 Place New Order</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// Auth (Login / Register)
// ════════════════════════════════════════════
export function AuthPage({ setPage }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setBusy(true);

    // ⚠️ Demo-credential shortcut REMOVED — pehle ye sirf localStorage set kar deta tha
    // aur real sk_token kabhi nahi milta tha, isi wajah se protected admin requests
    // (jaise "Add Project") mein "Token invalid or expired" error aata tha.
    // Ab har login real backend se hota hai, taaki asli JWT token save ho.
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Invalid credentials');
      if (data.user?.role !== 'admin') throw new Error('Admin access required');
      localStorage.setItem('sk_token', data.token);
      localStorage.setItem('sk_admin', 'true');
      if (data.user) localStorage.setItem('sk_user', JSON.stringify(data.user));
      setBusy(false);
      setPage('admin');
    } catch (e) {
      setErr(e.message);
      setBusy(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background effects */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 30%, rgba(220,38,38,0.06), transparent 50%), radial-gradient(ellipse at 70% 70%, rgba(127,29,29,0.05), transparent 50%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(220,38,38,0.04)', filter: 'blur(80px)' }} />
      <div style={{ position: 'absolute', bottom: -100, right: -100, width: 350, height: 350, borderRadius: '50%', background: 'rgba(127,29,29,0.05)', filter: 'blur(80px)' }} />

      <div style={{
        width: '100%',
        maxWidth: 420,
        background: 'var(--card)',
        border: '1px solid var(--bdrh)',
        borderRadius: 20,
        padding: '2.75rem',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'var(--fd)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--nb)' }}>SK </span>
            <span style={{ color: 'var(--npi)' }}>TECHVERSE</span>
          </div>
          <div style={{ fontFamily: 'var(--fu)', fontSize: '0.72rem', color: 'var(--t3)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Admin Control Panel
          </div>
        </div>

        {/* Lock icon */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, var(--nb), var(--npi))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto', boxShadow: '0 0 30px rgba(220,38,38,0.3)' }}>
            🔐
          </div>
        </div>

        <h2 style={{ fontFamily: 'var(--fd)', fontSize: '1.1rem', fontWeight: 700, textAlign: 'center', marginBottom: '1.75rem', color: 'var(--t1)' }}>
          Admin Sign In
        </h2>

        {/* Error */}
        {err && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.85rem', color: '#ef4444', textAlign: 'center' }}>
            ⚠️ {err}
          </div>
        )}

        <form onSubmit={submit}>
          <div className="fg">
            <label className="fl">Admin Email</label>
            <input
              type="email"
              className="fi"
              placeholder="admin@sktechverse.com"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              required
              autoComplete="email"
            />
          </div>
          <div className="fg">
            <label className="fl">Password</label>
            <input
              type="password"
              className="fi"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', border: 'none', marginTop: '0.5rem', fontSize: '0.9rem', padding: '0.9rem' }}
            disabled={busy}
          >
            {busy ? '⏳ Signing in...' : '🔐 Sign In to Admin Panel'}
          </button>
        </form>

        {/* Hint */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', padding: '0.75rem', background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.1)', borderRadius: 8 }}>
          <div style={{ fontFamily: 'var(--fu)', fontSize: '0.72rem', color: 'var(--t3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Demo Credentials</div>
          <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--nc)' }}>admin@sktechverse.com</div>
          <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--nc)' }}>Admin@123</div>
        </div>

        {/* Back to site */}
        <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          <button
            onClick={() => setPage('home')}
            style={{ background: 'none', border: 'none', color: 'var(--t3)', cursor: 'pointer', fontFamily: 'var(--fu)', fontSize: '0.78rem' }}
          >
            ← Back to Website
          </button>
        </div>
      </div>
    </div>
  );
}