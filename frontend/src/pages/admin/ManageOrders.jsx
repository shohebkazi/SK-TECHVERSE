import { useState, useEffect } from 'react';
import '../../styles/admin.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const STATUS_TABS = [
  ['all', 'All'],
  ['pending', 'Pending'],
  ['reviewing', 'Reviewing'],
  ['in-progress', 'In Progress'],
  ['completed', 'Completed'],
  ['cancelled', 'Cancelled'],
];

const STATUS_BADGE = {
  pending: 'bg-y', reviewing: 'bg-p', 'in-progress': 'bg-b', completed: 'bg-g', cancelled: 'bg-r',
};

function fmtBudget(b) {
  if (!b) return 'N/A';
  if (typeof b === 'string') return b;
  if (typeof b === 'object') {
    if (b.min || b.max) return `₹${b.min ?? 0} - ₹${b.max ?? '∞'}`;
  }
  return 'N/A';
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ManageOrders() {
  const [orders, setOrders]   = useState([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [status, setStatus]   = useState('all');
  const [search, setSearch]   = useState('');
  const [selected, setSelected] = useState(null);
  const [form, setForm]       = useState({ status: '', priority: '', notes: '', totalAmount: '', paidAmount: '' });
  const [saving, setSaving]   = useState(false);
  const [err, setErr]         = useState('');

  const token = localStorage.getItem('sk_token');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const q = status !== 'all' ? `?status=${status}&limit=50` : '?limit=50';
      const res = await fetch(`${API}/orders${q}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data.orders || []);
      setTotal(data.total || 0);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); /* eslint-disable-next-line */ }, [status]);

  const openOrder = (o) => {
    setSelected(o);
    setForm({
      status: o.status || 'pending',
      priority: o.priority || 'medium',
      notes: o.notes || '',
      totalAmount: o.totalAmount || '',
      paidAmount: o.paidAmount || '',
    });
    setErr('');
  };

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const saveUpdate = async (e) => {
    e.preventDefault();
    setSaving(true); setErr('');
    try {
      const res = await fetch(`${API}/orders/${selected._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          status: form.status,
          priority: form.priority,
          notes: form.notes,
          totalAmount: form.totalAmount ? Number(form.totalAmount) : undefined,
          paidAmount: form.paidAmount ? Number(form.paidAmount) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');
      setSelected(null);
      fetchOrders();
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setSaving(false);
    }
  };

  const filtered = orders.filter((o) => {
    if (!search.trim()) return true;
    const s = search.toLowerCase();
    return (
      o.clientName?.toLowerCase().includes(s) ||
      o.clientEmail?.toLowerCase().includes(s) ||
      o.projectTitle?.toLowerCase().includes(s) ||
      o.projectType?.toLowerCase().includes(s)
    );
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--fd)', fontSize: '1.4rem', fontWeight: 800 }}>Manage Orders</h1>
          <p style={{ color: 'var(--t3)', fontSize: '0.78rem', marginTop: '0.2rem', fontFamily: 'var(--fu)' }}>
            {total} order{total !== 1 ? 's' : ''} total
          </p>
        </div>
        <input
          className="fi"
          style={{ maxWidth: 260 }}
          placeholder="Search by name, email, project..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="adm-tabs">
        {STATUS_TABS.map(([key, label]) => (
          <button key={key} className={`adm-tab${status === key ? ' active' : ''}`} onClick={() => setStatus(key)}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--t3)' }}>Loading orders...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--t3)' }}>
          No orders found{status !== 'all' ? ` with status "${status}"` : ''}.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="adm-tbl">
            <thead>
              <tr>
                <th>Client</th><th>Project</th><th>Budget</th><th>Priority</th><th>Status</th><th>Date</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o._id}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--t1)' }}>{o.clientName}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--t3)' }}>{o.clientEmail}</div>
                  </td>
                  <td>
                    <div style={{ color: 'var(--t1)' }}>{o.projectTitle || o.projectType}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--t3)' }}>{o.projectType}</div>
                  </td>
                  <td style={{ color: 'var(--nb)' }}>{fmtBudget(o.budget)}</td>
                  <td>
                    <span className={`bge ${o.priority === 'high' ? 'bg-r' : o.priority === 'low' ? 'bg-g' : 'bg-y'}`}>{o.priority}</span>
                  </td>
                  <td>
                    <span className={`bge ${STATUS_BADGE[o.status] || 'bg-b'}`}>{o.status}</span>
                  </td>
                  <td style={{ color: 'var(--t3)', fontSize: '0.78rem' }}>{fmtDate(o.createdAt)}</td>
                  <td>
                    <button onClick={() => openOrder(o)} style={{ background: 'none', border: 'none', color: 'var(--nb)', cursor: 'pointer', fontSize: '0.78rem', fontFamily: 'var(--fu)' }}>
                      View / Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── ORDER DETAIL / UPDATE MODAL ── */}
      {selected && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(10,6,6,0.85)', backdropFilter: 'blur(6px)', zIndex: 3000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '2rem 1rem', overflowY: 'auto' }}
          onClick={() => !saving && setSelected(null)}
        >
          <div
            style={{ maxWidth: 640, width: '100%', background: 'var(--card)', border: '1px solid var(--bdrh)', borderRadius: 16, padding: '2rem', backdropFilter: 'blur(20px)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontFamily: 'var(--fd)', fontSize: '1.15rem', fontWeight: 700 }}>Order Details</h2>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--t3)', fontSize: '1.3rem', cursor: 'pointer' }}>✕</button>
            </div>

            {err ? <div className="err-box">⚠️ {err}</div> : null}

            {/* Read-only client / project info exactly as the customer submitted it */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--bdr)', borderRadius: 10, padding: '1rem 1.2rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem 1.5rem', marginBottom: '0.8rem' }}>
                <div><span style={{ color: 'var(--t3)' }}>Client: </span><span style={{ color: 'var(--t1)', fontWeight: 600 }}>{selected.clientName}</span></div>
                <div><span style={{ color: 'var(--t3)' }}>Email: </span><span style={{ color: 'var(--t1)' }}>{selected.clientEmail}</span></div>
                <div><span style={{ color: 'var(--t3)' }}>Phone: </span><span style={{ color: 'var(--t1)' }}>{selected.clientPhone || 'N/A'}</span></div>
                <div><span style={{ color: 'var(--t3)' }}>Budget: </span><span style={{ color: 'var(--t1)' }}>{fmtBudget(selected.budget)}</span></div>
                <div><span style={{ color: 'var(--t3)' }}>Project Type: </span><span style={{ color: 'var(--t1)' }}>{selected.projectType}</span></div>
                <div><span style={{ color: 'var(--t3)' }}>Submitted: </span><span style={{ color: 'var(--t1)' }}>{fmtDate(selected.createdAt)}</span></div>
              </div>
              {selected.projectTitle && (
                <div style={{ marginBottom: '0.6rem' }}><span style={{ color: 'var(--t3)' }}>Title: </span><span style={{ color: 'var(--t1)', fontWeight: 600 }}>{selected.projectTitle}</span></div>
              )}
              <div>
                <div style={{ color: 'var(--t3)', marginBottom: '0.3rem' }}>Description:</div>
                <div style={{ color: 'var(--t2)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{selected.description}</div>
              </div>
              <div style={{ marginTop: '0.8rem' }}>
                <a
                  href={`https://wa.me/91${(selected.clientPhone || '').replace(/\D/g, '')}?text=Hi ${encodeURIComponent(selected.clientName)}! Regarding your order at SK TECHVERSE...`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ color: '#25D366', fontSize: '0.8rem', fontFamily: 'var(--fu)', fontWeight: 600, textDecoration: 'none' }}
                >
                  💬 Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Update form — saving this sends a status-update email to the client */}
            <form onSubmit={saveUpdate}>
              <div className="f-row">
                <div className="fg">
                  <label className="fl">Status</label>
                  <select className="fsel" value={form.status} onChange={f('status')}>
                    <option value="pending">Pending</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="fg">
                  <label className="fl">Priority</label>
                  <select className="fsel" value={form.priority} onChange={f('priority')}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="f-row">
                <div className="fg">
                  <label className="fl">Total Amount (₹)</label>
                  <input className="fi" type="number" placeholder="e.g. 25000" value={form.totalAmount} onChange={f('totalAmount')} />
                </div>
                <div className="fg">
                  <label className="fl">Paid Amount (₹)</label>
                  <input className="fi" type="number" placeholder="e.g. 10000" value={form.paidAmount} onChange={f('paidAmount')} />
                </div>
              </div>
              <div className="fg">
                <label className="fl">Message to Client (sent via email)</label>
                <textarea className="fta" style={{ minHeight: 90 }} placeholder="e.g. Your project has been accepted, we'll start development this week..." value={form.notes} onChange={f('notes')} />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', border: 'none', marginTop: '0.5rem' }} disabled={saving}>
                {saving ? '⏳ Saving & Emailing Client...' : '✅ Save & Notify Client'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
