import { useState, useEffect } from 'react';
import '../../styles/admin.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// NOTE: the public Contact form (BlogContactOrderAuth.jsx -> ContactPage) posts
// to /api/contacts (Contact model). This admin view reads from the SAME
// endpoint so every message a visitor submits actually shows up here.
const STATUS_TABS = [
  ['all', 'All'], ['new', 'New'], ['read', 'Read'], ['replied', 'Replied'], ['closed', 'Closed'],
];
const STATUS_BADGE = { new: 'bg-b', read: 'bg-y', replied: 'bg-g', closed: 'bg-r' };

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function ManageMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [status, setStatus]     = useState('all');
  const [search, setSearch]     = useState('');
  const [selected, setSelected] = useState(null);
  const [busy, setBusy]         = useState(false);
  const [err, setErr]           = useState('');

  const token = localStorage.getItem('sk_token');

  const fetchMessages = async () => {
    setLoading(true); setErr('');
    try {
      const res = await fetch(`${API}/contacts`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load messages');
      setMessages(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message);
    }
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const openMessage = async (m) => {
    setSelected(m);
    if (m.status === 'new') {
      try {
        await fetch(`${API}/contacts/${m._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ status: 'read' }),
        });
        setMessages((prev) => prev.map((x) => (x._id === m._id ? { ...x, status: 'read' } : x)));
      } catch (e) { /* ignore */ }
    }
  };

  const setStatusFor = async (id, newStatus) => {
    setBusy(true);
    try {
      await fetch(`${API}/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      setMessages((prev) => prev.map((x) => (x._id === id ? { ...x, status: newStatus } : x)));
      setSelected((prev) => (prev && prev._id === id ? { ...prev, status: newStatus } : prev));
    } catch (e) { alert('Update failed'); }
    setBusy(false);
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Delete this message? This cannot be undone.')) return;
    try {
      const res = await fetch(`${API}/contacts/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Delete failed');
      setMessages((prev) => prev.filter((x) => x._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch (e) { alert(e.message); }
  };

  const filtered = messages.filter((m) => {
    if (status !== 'all' && m.status !== status) return false;
    if (!search.trim()) return true;
    const s = search.toLowerCase();
    return m.name?.toLowerCase().includes(s) || m.email?.toLowerCase().includes(s) || m.subject?.toLowerCase().includes(s);
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--fd)', fontSize: '1.4rem', fontWeight: 800 }}>Messages</h1>
          <p style={{ color: 'var(--t3)', fontSize: '0.78rem', marginTop: '0.2rem', fontFamily: 'var(--fu)' }}>
            {messages.length} message{messages.length !== 1 ? 's' : ''} · {messages.filter((m) => m.status === 'new').length} new
          </p>
        </div>
        <input className="fi" style={{ maxWidth: 260 }} placeholder="Search by name, email, subject..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {err ? <div className="err-box">⚠️ {err}</div> : null}

      <div className="adm-tabs">
        {STATUS_TABS.map(([key, label]) => (
          <button key={key} className={`adm-tab${status === key ? ' active' : ''}`} onClick={() => setStatus(key)}>{label}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--t3)' }}>Loading messages...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--t3)' }}>
          No messages found{status !== 'all' ? ` with status "${status}"` : ''}. Jab koi Contact form bharega, wo yahan dikhega.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="adm-tbl">
            <thead>
              <tr><th>From</th><th>Subject</th><th>Status</th><th>Received</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m._id} style={{ cursor: 'pointer' }} onClick={() => openMessage(m)}>
                  <td>
                    <div style={{ fontWeight: m.status === 'new' ? 700 : 600, color: 'var(--t1)' }}>{m.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--t3)' }}>{m.email}</div>
                  </td>
                  <td style={{ color: 'var(--t2)', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.subject}</td>
                  <td><span className={`bge ${STATUS_BADGE[m.status] || 'bg-b'}`}>{m.status}</span></td>
                  <td style={{ color: 'var(--t3)', fontSize: '0.78rem' }}>{fmtDate(m.createdAt)}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => deleteMessage(m._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.78rem', fontFamily: 'var(--fu)' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(10,6,6,0.85)', backdropFilter: 'blur(6px)', zIndex: 3000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '2rem 1rem', overflowY: 'auto' }}
          onClick={() => setSelected(null)}
        >
          <div
            style={{ maxWidth: 560, width: '100%', background: 'var(--card)', border: '1px solid var(--bdrh)', borderRadius: 16, padding: '2rem', backdropFilter: 'blur(20px)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontFamily: 'var(--fd)', fontSize: '1.15rem', fontWeight: 700 }}>{selected.subject}</h2>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--t3)', fontSize: '1.3rem', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', fontSize: '0.85rem', flexWrap: 'wrap' }}>
              <div><span style={{ color: 'var(--t3)' }}>From: </span><span style={{ color: 'var(--t1)', fontWeight: 600 }}>{selected.name}</span></div>
              <div><span style={{ color: 'var(--t3)' }}>Email: </span><span style={{ color: 'var(--t1)' }}>{selected.email}</span></div>
              {selected.phone && <div><span style={{ color: 'var(--t3)' }}>Phone: </span><span style={{ color: 'var(--t1)' }}>{selected.phone}</span></div>}
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--bdr)', borderRadius: 10, padding: '1.1rem 1.3rem', marginBottom: '1.5rem', color: 'var(--t2)', lineHeight: 1.7, whiteSpace: 'pre-line', fontSize: '0.9rem' }}>
              {selected.message}
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || '')}`} className="btn-outline" style={{ flex: 1, textDecoration: 'none', fontSize: '0.78rem', padding: '0.6rem 1rem', textAlign: 'center' }}>
                ✉️ Reply by Email
              </a>
              {selected.phone && (
                <a href={`https://wa.me/91${selected.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ flex: 1, textDecoration: 'none', fontSize: '0.78rem', padding: '0.6rem 1rem', textAlign: 'center' }}>
                  💬 WhatsApp
                </a>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['new', 'read', 'replied', 'closed'].map((st) => (
                <button
                  key={st}
                  disabled={busy}
                  onClick={() => setStatusFor(selected._id, st)}
                  className={`adm-tab${selected.status === st ? ' active' : ''}`}
                >
                  Mark {st}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
