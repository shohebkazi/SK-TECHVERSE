import { useState, useEffect } from 'react';
import '../../styles/admin.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const emptyForm = {
  title: '', description: '', icon: '⚡', features: '',
  priceFrom: '', priceTo: '', category: '', order: '0', active: true,
};

export default function ManageServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId]     = useState(null);
  const [form, setForm]         = useState(emptyForm);
  const [busy, setBusy]         = useState(false);
  const [err, setErr]           = useState('');

  const token = localStorage.getItem('sk_token');

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/services/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchServices(); }, []);

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowForm(true); setErr(''); };

  const openEdit = (s) => {
    setForm({
      title: s.title || '', description: s.description || '', icon: s.icon || '⚡',
      features: (s.features || []).join('\n'),
      priceFrom: s.price?.from || '', priceTo: s.price?.to || '',
      category: s.category || '', order: s.order ?? '0', active: s.active !== false,
    });
    setEditId(s._id);
    setShowForm(true);
    setErr('');
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setErr('');
    try {
      const body = {
        title: form.title,
        description: form.description,
        icon: form.icon,
        features: form.features.split('\n').map((s) => s.trim()).filter(Boolean),
        price: { from: Number(form.priceFrom) || 0, to: Number(form.priceTo) || 0, currency: 'INR' },
        category: form.category,
        order: Number(form.order) || 0,
        active: form.active,
      };
      const url = editId ? `${API}/services/${editId}` : `${API}/services`;
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save service');
      setShowForm(false);
      fetchServices();
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  const deleteService = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${API}/services/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Delete failed');
      fetchServices();
    } catch (e) { alert(e.message); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--fd)', fontSize: '1.4rem', fontWeight: 800 }}>Manage Services</h1>
          <p style={{ color: 'var(--t3)', fontSize: '0.78rem', marginTop: '0.2rem', fontFamily: 'var(--fu)' }}>
            {services.length} service{services.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <button className="btn-primary" style={{ border: 'none', fontSize: '0.78rem', padding: '0.6rem 1.3rem' }} onClick={openAdd}>
          + Add New Service
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--t3)' }}>Loading services...</div>
      ) : services.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--t3)' }}>
          No services yet. Click "Add New Service" to create one.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="adm-tbl">
            <thead>
              <tr><th>Icon</th><th>Title</th><th>Category</th><th>Price Range</th><th>Order</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s._id}>
                  <td style={{ fontSize: '1.3rem' }}>{s.icon || '⚡'}</td>
                  <td style={{ fontWeight: 600, color: 'var(--t1)' }}>{s.title}</td>
                  <td>{s.category || '—'}</td>
                  <td style={{ color: 'var(--nb)' }}>
                    {s.price?.from || s.price?.to ? `₹${s.price?.from || 0} - ₹${s.price?.to || 0}` : '—'}
                  </td>
                  <td style={{ color: 'var(--t3)' }}>{s.order ?? 0}</td>
                  <td><span className={`bge ${s.active ? 'bg-g' : 'bg-y'}`}>{s.active ? 'active' : 'inactive'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => openEdit(s)} style={{ background: 'none', border: 'none', color: 'var(--nb)', cursor: 'pointer', fontSize: '0.78rem', fontFamily: 'var(--fu)' }}>Edit</button>
                      <button onClick={() => deleteService(s._id, s.title)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.78rem', fontFamily: 'var(--fu)' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(10,6,6,0.85)', backdropFilter: 'blur(6px)', zIndex: 3000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '2rem 1rem', overflowY: 'auto' }}
          onClick={() => !busy && setShowForm(false)}
        >
          <div
            style={{ maxWidth: 600, width: '100%', background: 'var(--card)', border: '1px solid var(--bdrh)', borderRadius: 16, padding: '2rem', backdropFilter: 'blur(20px)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'var(--fd)', fontSize: '1.15rem', fontWeight: 700 }}>
                {editId ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--t3)', fontSize: '1.3rem', cursor: 'pointer' }}>✕</button>
            </div>

            {err ? <div className="err-box">⚠️ {err}</div> : null}

            <form onSubmit={submit}>
              <div className="f-row">
                <div className="fg" style={{ maxWidth: 90 }}>
                  <label className="fl">Icon (emoji)</label>
                  <input className="fi" value={form.icon} onChange={f('icon')} placeholder="⚡" />
                </div>
                <div className="fg">
                  <label className="fl">Title</label>
                  <input className="fi" value={form.title} onChange={f('title')} placeholder="e.g. Web Development" required />
                </div>
              </div>

              <div className="fg">
                <label className="fl">Description</label>
                <textarea className="fta" value={form.description} onChange={f('description')} placeholder="Short description shown on the service card" required />
              </div>

              <div className="fg">
                <label className="fl">Features (one per line)</label>
                <textarea className="fta" style={{ minHeight: 80 }} value={form.features} onChange={f('features')} placeholder={'Custom Build\nAI-Ready\nFast Delivery'} />
              </div>

              <div className="f-row">
                <div className="fg">
                  <label className="fl">Category</label>
                  <input className="fi" value={form.category} onChange={f('category')} placeholder="e.g. Development" />
                </div>
                <div className="fg" style={{ maxWidth: 100 }}>
                  <label className="fl">Order</label>
                  <input className="fi" type="number" value={form.order} onChange={f('order')} />
                </div>
              </div>

              <div className="f-row">
                <div className="fg">
                  <label className="fl">Price From (₹)</label>
                  <input className="fi" type="number" value={form.priceFrom} onChange={f('priceFrom')} placeholder="5000" />
                </div>
                <div className="fg">
                  <label className="fl">Price To (₹)</label>
                  <input className="fi" type="number" value={form.priceTo} onChange={f('priceTo')} placeholder="25000" />
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', cursor: 'pointer', fontFamily: 'var(--fu)', fontSize: '0.85rem', color: 'var(--t2)' }}>
                <input type="checkbox" checked={form.active} onChange={f('active')} />
                Active (visible on public site)
              </label>

              <button type="submit" className="btn-primary" style={{ width: '100%', border: 'none' }} disabled={busy}>
                {busy ? '⏳ Saving...' : editId ? '💾 Update Service' : '+ Create Service'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
