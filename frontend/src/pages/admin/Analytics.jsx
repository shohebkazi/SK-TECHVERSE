import { useState, useEffect } from 'react';
import '../../styles/admin.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

const STAT_CARDS = [
  ['projects',      '📦', 'Total Projects',   'var(--nb)'],
  ['orders',        '🛒', 'Total Orders',     '#a855f7'],
  ['pendingOrders', '⏳', 'Pending Orders',   'var(--ny)'],
  ['contacts',      '✉️', 'Total Messages',   'var(--nb)'],
  ['newContacts',   '🔔', 'New Messages',     'var(--nr)'],
  ['users',         '👥', 'Registered Users', 'var(--ng)'],
  ['services',      '⚡', 'Active Services',  'var(--ny)'],
  ['blogs',         '📝', 'Published Blogs',  '#a855f7'],
  ['testimonials',  '⭐', 'Testimonials',     'var(--ng)'],
];

export default function Analytics() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr]         = useState('');

  const token = localStorage.getItem('sk_token');

  useEffect(() => {
    (async () => {
      setLoading(true); setErr('');
      try {
        const res = await fetch(`${API}/admin/analytics`, { headers: { Authorization: `Bearer ${token}` } });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Failed to load analytics');
        setData(json);
      } catch (e) {
        setErr(e.message);
      }
      setLoading(false);
    })();
  }, [token]);

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--t3)' }}>Loading analytics...</div>;
  if (err) return <div className="err-box">⚠️ {err}</div>;
  if (!data) return null;

  const { stats, revenue, recentOrders, recentMsgs } = data;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--fd)', fontSize: '1.4rem', fontWeight: 800 }}>Analytics Overview</h1>
        <p style={{ color: 'var(--t3)', fontSize: '0.78rem', marginTop: '0.2rem', fontFamily: 'var(--fu)' }}>
          Live stats pulled directly from your database.
        </p>
      </div>

      {/* Revenue highlight */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(62,166,255,0.1), rgba(168,85,247,0.12))',
        border: '1px solid rgba(168,85,247,0.25)', borderRadius: 16, padding: '1.75rem 2rem', marginBottom: '2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
      }}>
        <div>
          <div style={{ color: 'var(--t3)', fontSize: '0.78rem', fontFamily: 'var(--fu)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
            Total Revenue (paid orders)
          </div>
          <div style={{ fontFamily: 'var(--fd)', fontSize: '2.2rem', fontWeight: 900, color: 'var(--t1)' }}>
            ₹{(revenue || 0).toLocaleString('en-IN')}
          </div>
        </div>
        <div style={{ fontSize: '3rem' }}>💰</div>
      </div>

      {/* Stat grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        {STAT_CARDS.map(([key, icon, label, color]) => (
          <div key={key} style={{ background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 14, padding: '1.25rem' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.6rem' }}>{icon}</div>
            <div style={{ fontFamily: 'var(--fd)', fontSize: '1.6rem', fontWeight: 800, color }}>{stats?.[key] ?? 0}</div>
            <div style={{ color: 'var(--t3)', fontSize: '0.75rem', fontFamily: 'var(--fu)', marginTop: '0.15rem' }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Recent orders */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 14, padding: '1.5rem' }}>
          <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Recent Orders</h3>
          {(!recentOrders || recentOrders.length === 0) ? (
            <p style={{ color: 'var(--t3)', fontSize: '0.82rem' }}>No orders yet.</p>
          ) : recentOrders.map((o) => (
            <div key={o._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid var(--bdr)' }}>
              <div>
                <div style={{ color: 'var(--t1)', fontSize: '0.85rem', fontWeight: 600 }}>{o.clientName}</div>
                <div style={{ color: 'var(--t3)', fontSize: '0.72rem' }}>{o.projectTitle || o.projectType}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className={`bge ${o.status === 'completed' ? 'bg-g' : o.status === 'cancelled' ? 'bg-r' : 'bg-y'}`}>{o.status}</span>
                <div style={{ color: 'var(--t3)', fontSize: '0.7rem', marginTop: '0.2rem' }}>{fmtDate(o.createdAt)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent messages */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 14, padding: '1.5rem' }}>
          <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>New Messages</h3>
          {(!recentMsgs || recentMsgs.length === 0) ? (
            <p style={{ color: 'var(--t3)', fontSize: '0.82rem' }}>No new messages.</p>
          ) : recentMsgs.map((m) => (
            <div key={m._id} style={{ padding: '0.6rem 0', borderBottom: '1px solid var(--bdr)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--t1)', fontSize: '0.85rem', fontWeight: 600 }}>{m.name}</span>
                <span style={{ color: 'var(--t3)', fontSize: '0.7rem' }}>{fmtDate(m.createdAt)}</span>
              </div>
              <div style={{ color: 'var(--t3)', fontSize: '0.75rem', marginTop: '0.15rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.subject}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
