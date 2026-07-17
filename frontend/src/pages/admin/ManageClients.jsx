import { useState, useEffect } from 'react';
import '../../styles/admin.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ManageClients() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [err, setErr]         = useState('');
  const [busyId, setBusyId]   = useState(null);

  const token = localStorage.getItem('sk_token');
  const myEmail = (() => {
    try { return JSON.parse(localStorage.getItem('sk_user') || '{}').email; } catch { return null; }
  })();

  const fetchUsers = async () => {
    setLoading(true); setErr('');
    try {
      const res = await fetch(`${API}/admin/users`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load clients');
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message);
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleRole = async (u) => {
    const newRole = u.role === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Change ${u.name}'s role to "${newRole}"?`)) return;
    setBusyId(u._id);
    try {
      const res = await fetch(`${API}/admin/users/${u._id}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error('Failed to update role');
      setUsers((prev) => prev.map((x) => (x._id === u._id ? { ...x, role: newRole } : x)));
    } catch (e) {
      alert(e.message);
    }
    setBusyId(null);
  };

  const filtered = users.filter((u) => {
    if (!search.trim()) return true;
    const s = search.toLowerCase();
    return u.name?.toLowerCase().includes(s) || u.email?.toLowerCase().includes(s) || u.company?.toLowerCase().includes(s);
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--fd)', fontSize: '1.4rem', fontWeight: 800 }}>Clients</h1>
          <p style={{ color: 'var(--t3)', fontSize: '0.78rem', marginTop: '0.2rem', fontFamily: 'var(--fu)' }}>
            {users.length} registered user{users.length !== 1 ? 's' : ''} · {users.filter((u) => u.role === 'admin').length} admin(s)
          </p>
        </div>
        <input className="fi" style={{ maxWidth: 260 }} placeholder="Search by name, email, company..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {err ? <div className="err-box">⚠️ {err}</div> : null}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--t3)' }}>Loading clients...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--t3)' }}>
          No clients found. Jab koi user site pe register karega, wo yahan dikhega.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="adm-tbl">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Company</th><th>Phone</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u._id}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,var(--nb),#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                      {u.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <span style={{ fontWeight: 600, color: 'var(--t1)' }}>{u.name}</span>
                  </td>
                  <td style={{ color: 'var(--t2)' }}>{u.email}</td>
                  <td style={{ color: 'var(--t2)' }}>{u.company || '—'}</td>
                  <td style={{ color: 'var(--t2)' }}>{u.phone || '—'}</td>
                  <td><span className={`bge ${u.role === 'admin' ? 'bg-p' : 'bg-b'}`}>{u.role}</span></td>
                  <td style={{ color: 'var(--t3)', fontSize: '0.78rem' }}>{fmtDate(u.createdAt)}</td>
                  <td>
                    <button
                      disabled={busyId === u._id || u.email === myEmail}
                      onClick={() => toggleRole(u)}
                      title={u.email === myEmail ? "You can't change your own role" : ''}
                      style={{ background: 'none', border: 'none', color: u.email === myEmail ? 'var(--t3)' : 'var(--nb)', cursor: u.email === myEmail ? 'not-allowed' : 'pointer', fontSize: '0.78rem', fontFamily: 'var(--fu)' }}
                    >
                      {busyId === u._id ? '...' : u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
