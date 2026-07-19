import { useState, useEffect } from 'react';
import ManageProjects from './ManageProjects';
import ManageOrders   from './ManageOrders';
import ManageServices from './ManageServices';
import ManageMessages from './ManageMessages';
import ManageClients  from './ManageClients';
import Analytics       from './Analytics';
import '../../styles/admin.css';   // 

const NAV = [
  ['📊','Dashboard','dashboard'],
  ['🗂️','Projects','projects'],
  ['⚡','Services','services'],
  ['📦','Orders','orders'],
  ['✉️','Messages','messages'],
  ['📝','Blog','blog'],
  ['👥','Clients','clients'],
  ['📈','Analytics','analytics'],
  ['⚙️','Settings','settings'],
];

const ORDERS = [
  { id:'#ORD001', client:'Rahul Sharma',  project:'Hospital ERP',      status:'in-progress', amount:'₹45,000', date:'Dec 15' },
  { id:'#ORD002', client:'Priya Mehta',   project:'E-commerce Site',   status:'pending',     amount:'₹28,000', date:'Dec 14' },
  { id:'#ORD003', client:'Vikram Joshi',  project:'AI Chatbot',        status:'completed',   amount:'₹18,000', date:'Dec 12' },
  { id:'#ORD004', client:'Anita Patel',   project:'Billing Software',  status:'reviewing',   amount:'₹12,000', date:'Dec 11' },
  { id:'#ORD005', client:'Neha Singh',    project:'College Project',   status:'completed',   amount:'₹5,000',  date:'Dec 09' },
];

const MESSAGES = [
  { name:'Arun K.',   msg:'Looking for a full ERP system for my factory...',   time:'5 min ago',  status:'new'  },
  { name:'Meera S.',  msg:'Pricing query for mobile app development...',        time:'1 hr ago',   status:'new'  },
  { name:'Raj P.',    msg:'Need college project help urgently for submission',  time:'3 hr ago',   status:'read' },
  { name:'Suresh T.', msg:'Can you integrate WhatsApp API into my website?',   time:'5 hr ago',   status:'read' },
];

const STATS = [
  { num:'150',   label:'Total Projects',   change:'+12 this month', dir:'up',   icon:'🗂️' },
  { num:'80',    label:'Happy Clients',    change:'+5 this month',  dir:'up',   icon:'👥' },
  { num:'24',    label:'Active Orders',    change:'3 urgent',       dir:'up',   icon:'📦' },
  { num:'₹4.2L', label:'Revenue (MTD)',    change:'+18% vs last',   dir:'up',   icon:'💰' },
  { num:'6',     label:'New Messages',     change:'2 urgent',       dir:'up',   icon:'✉️' },
  { num:'98%',   label:'Client Retention', change:'+2% vs last qtr',dir:'up',   icon:'❤️' },
];

// ── AUTH CHECK ─────────────────────────────────────────────
// ── AUTH CHECK ─────────────────────────────────────────────
function useAdminAuth(setPage) {
  useEffect(() => {
    const isAdmin = localStorage.getItem('sk_admin');
    if (!isAdmin) setPage('login');
  }, [setPage]);
}


function StatusBadge({ status }) {
  const map = { 'in-progress':['blue','In Progress'], pending:['yellow','Pending'], completed:['green','Completed'], reviewing:['purple','Reviewing'], new:['blue','New'], read:['green','Read'] };
  const [color, label] = map[status] || ['blue', status];
  return <span className={`badge badge-${color}`}>{label}</span>;
}

function DashboardHome({ setTab }) {
  return (
    <>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem', fontWeight:900 }}>Dashboard Overview</h1>
          <p style={{ color:'var(--text-3)', fontSize:'0.85rem', marginTop:'0.25rem' }}>Welcome back, Admin! Here's what's happening at SK TECHVERSE.</p>
        </div>
        <div style={{ display:'flex', gap:'0.75rem' }}>
          <button className="btn-outline" style={{ fontSize:'0.78rem', padding:'0.5rem 1rem' }} onClick={() => setTab('projects')}>+ Add Project</button>
          <button className="btn-primary" style={{ fontSize:'0.78rem', padding:'0.5rem 1rem', border:'none' }} onClick={() => setTab('orders')}>View Orders</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'1rem', marginBottom:'2rem' }}>
        {STATS.map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div>
                <div className="stat-num2">{s.num}</div>
                <div className="stat-lbl">{s.label}</div>
              </div>
              <div style={{ fontSize:'1.4rem', opacity:0.55 }}>{s.icon}</div>
            </div>
            <div className={`stat-chg ${s.dir === 'up' ? 'up' : 'down'}`}>
              {s.dir === 'up' ? '↑' : '↓'} {s.change}
            </div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="glass-card" style={{ marginBottom:'1.5rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
          <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1rem', fontWeight:700 }}>Recent Orders</h3>
          <button onClick={() => setTab('orders')} style={{ background:'none', border:'none', color:'var(--neon-blue)', cursor:'pointer', fontSize:'0.8rem', fontFamily:'var(--font-ui)', fontWeight:600 }}>View All →</button>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table className="admin-table">
            <thead>
              <tr><th>Order ID</th><th>Client</th><th>Project</th><th>Status</th><th>Amount</th><th>Date</th><th>Action</th></tr>
            </thead>
            <tbody>
              {ORDERS.map(o => (
                <tr key={o.id}>
                  <td style={{ color:'var(--neon-cyan)', fontFamily:'var(--font-ui)', fontWeight:600 }}>{o.id}</td>
                  <td>{o.client}</td>
                  <td>{o.project}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td style={{ color:'var(--neon-green)', fontWeight:600 }}>{o.amount}</td>
                  <td style={{ color:'var(--text-3)' }}>{o.date}</td>
                  <td>
                    <button style={{ background:'none', border:'none', color:'var(--neon-blue)', cursor:'pointer', fontSize:'0.78rem', fontFamily:'var(--font-ui)' }}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two column bottom */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>
        {/* Quick Actions */}
        <div className="glass-card">
          <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1rem', fontWeight:700, marginBottom:'1.25rem' }}>Quick Actions</h3>
          {[['➕ Add New Project','projects'],['📝 Write Blog Post','blog'],['⚡ Add Service','services'],['👥 Manage Clients','clients'],['📈 View Analytics','analytics'],['⚙️ Settings','settings']].map(([label, tab]) => (
            <div key={label} onClick={() => setTab(tab)}
              style={{ padding:'0.75rem 1rem', marginBottom:'0.5rem', background:'rgba(255,255,255,0.03)', border:'1px solid var(--border)', borderRadius:8, cursor:'pointer', fontSize:'0.88rem', fontFamily:'var(--font-ui)', transition:'all 0.2s', display:'flex', alignItems:'center', justifyContent:'space-between' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(var(--nb-rgb),0.3)'; e.currentTarget.style.color='var(--neon-blue)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text-2)'; }}
            >
              <span>{label}</span><span style={{ color:'var(--text-3)' }}>→</span>
            </div>
          ))}
        </div>

        {/* New Messages */}
        <div className="glass-card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem' }}>
            <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1rem', fontWeight:700 }}>New Messages</h3>
            <button onClick={() => setTab('messages')} style={{ background:'none', border:'none', color:'var(--neon-blue)', cursor:'pointer', fontSize:'0.78rem', fontFamily:'var(--font-ui)', fontWeight:600 }}>View All →</button>
          </div>
          {MESSAGES.map((m, i) => (
            <div key={i} style={{ display:'flex', gap:'0.75rem', marginBottom:'1rem', alignItems:'flex-start' }}>
              <div style={{ width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg,var(--neon-blue),var(--neon-purple))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.75rem', fontWeight:700, flexShrink:0, fontFamily:'var(--font-display)' }}>{m.name[0]}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:'0.85rem', fontWeight:600, fontFamily:'var(--font-ui)' }}>{m.name}</span>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                    <span style={{ fontSize:'0.7rem', color:'var(--text-3)' }}>{m.time}</span>
                    <StatusBadge status={m.status} />
                  </div>
                </div>
                <div style={{ fontSize:'0.8rem', color:'var(--text-3)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginTop:'0.15rem' }}>{m.msg}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function PlaceholderTab({ tab }) {
  const info = NAV.find(n => n[2] === tab);
  const apiBase = `/api/${tab}`;
  return (
    <div style={{ textAlign:'center', paddingTop:'4rem' }}>
      <div style={{ fontSize:'4rem', marginBottom:'1.5rem' }}>{info?.[0] || '📋'}</div>
      <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem', fontWeight:900, marginBottom:'0.75rem' }}>
        {info?.[1]} Management
      </h2>
      <p style={{ color:'var(--text-3)', marginBottom:'2.5rem', fontSize:'0.95rem' }}>
        Connect to your backend API to manage {tab} data.
      </p>
      <div className="glass-card" style={{ maxWidth:600, margin:'0 auto', textAlign:'left' }}>
        <div style={{ fontFamily:'var(--font-ui)', fontSize:'0.78rem', color:'var(--neon-cyan)', marginBottom:'0.75rem', letterSpacing:'0.08em', textTransform:'uppercase' }}>
          Backend API Endpoints
        </div>
        <code style={{ fontFamily:'monospace', fontSize:'0.84rem', color:'var(--text-2)', background:'rgba(var(--nb-rgb),0.05)', padding:'1rem', borderRadius:8, display:'block', lineHeight:2, border:'1px solid var(--border)' }}>
          GET    {apiBase}<br/>
          GET    {apiBase}/:id<br/>
          POST   {apiBase}<br/>
          PUT    {apiBase}/:id<br/>
          DELETE {apiBase}/:id
        </code>
        <div style={{ marginTop:'1.25rem', fontSize:'0.82rem', color:'var(--text-3)', lineHeight:1.7 }}>
          📁 Backend file: <span style={{ color:'var(--neon-cyan)' }}>backend/routes/{tab}.js</span><br/>
          📦 Model file: <span style={{ color:'var(--neon-cyan)' }}>backend/models/{tab.slice(0,-1)}.js</span>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard({ setPage }) {
  const [tab, setTab] = useState('dashboard');

  // Auth check — agar logged in nahi hai to login page pe bhejo
  useEffect(() => {
    const isAdmin = localStorage.getItem('sk_admin');
    if (!isAdmin) setPage('login');
  }, [setPage]);

  return (
    <div className="page-enter" style={{ paddingTop:60 }}>
      <div className="admin-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div style={{ padding:'1.5rem', borderBottom:'1px solid var(--border)', marginBottom:'1rem' }}>
            <div style={{ fontFamily:'var(--font-display)', fontSize:'1rem', fontWeight:900 }}>
              <span style={{ color:'var(--neon-blue)' }}>SK </span>
              <span style={{ color:'var(--neon-purple)' }}>ADMIN</span>
            </div>
            <div style={{ fontSize:'0.72rem', color:'var(--text-3)', marginTop:'0.25rem', fontFamily:'var(--font-ui)' }}>Control Panel v1.0</div>
          </div>

          {NAV.map(([icon, label, key]) => (
            <div key={key} className={`admin-nav-item${tab === key ? ' active' : ''}`} onClick={() => setTab(key)}>
              <span style={{ fontSize:'1rem' }}>{icon}</span>
              <span>{label}</span>
              {key === 'messages' && (
                <span style={{ marginLeft:'auto', background:'var(--neon-blue)', color:'var(--bg-dark)', borderRadius:'100px', fontSize:'0.65rem', fontWeight:700, padding:'0.1rem 0.45rem' }}>6</span>
              )}
              {key === 'orders' && (
                <span style={{ marginLeft:'auto', background:'#f59e0b', color:'var(--bg-dark)', borderRadius:'100px', fontSize:'0.65rem', fontWeight:700, padding:'0.1rem 0.45rem' }}>3</span>
              )}
            </div>
          ))}

          <div style={{ padding:'1rem', borderTop:'1px solid var(--border)', marginTop:'auto', position:'absolute', bottom:0, left:0, right:0 }}>
            <div
              className="admin-nav-item"
              onClick={() => {
                if (window.confirm('Are you sure you want to logout?')) {
                  localStorage.removeItem('sk_token');
                  localStorage.removeItem('sk_admin');
                  localStorage.removeItem('sk_user');
                  setPage('home');
                }
              }}
              style={{ color:'#ef4444', borderColor:'transparent', cursor:'pointer' }}
            >
              <span>🚪</span><span>Logout</span>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="admin-content">
          {tab === 'dashboard' ? (
  <DashboardHome setTab={setTab} />
) : tab === 'projects' ? (
  <ManageProjects />
) : tab === 'orders' ? (
  <ManageOrders />
) : tab === 'services' ? (
  <ManageServices />
) : tab === 'messages' ? (
  <ManageMessages />
) : tab === 'clients' ? (
  <ManageClients />
) : tab === 'analytics' ? (
  <Analytics />
) : (
  <PlaceholderTab tab={tab} />
)}
        </main>
      </div>
    </div>
  );
}
