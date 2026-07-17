import { useState, useEffect } from 'react';
import '../../styles/admin.css';   //
import { resolveImageUrl } from '../../utils/image';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const FILE_BASE = API.replace('/api', '');

const emptyForm = {
  title: '', description: '', fullDescription: '',
  category: 'Web', technologies: '', features: '',
  price: '', discountPrice: '', rating: '4.8', sales: '0',
  deliveryTime: '7-10 Days', supportPeriod: '6 Months Free Support',
  liveUrl: '', githubUrl: '', featured: false, status: 'active',
};

export default function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId]     = useState(null);
  const [form, setForm]         = useState(emptyForm);
  const [newFiles, setNewFiles] = useState([]);
  const [existingShots, setExistingShots] = useState([]);
  const [busy, setBusy]         = useState(false);
  const [err, setErr]           = useState('');

  const token = localStorage.getItem('sk_token');

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/projects/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const openAdd = () => {
    setForm(emptyForm);
    setNewFiles([]);
    setExistingShots([]);
    setEditId(null);
    setShowForm(true);
    setErr('');
  };

  const openEdit = (p) => {
    setForm({
      title: p.title || '', description: p.description || '', fullDescription: p.fullDescription || '',
      category: p.category || 'Web',
      technologies: (p.technologies || []).join(', '),
      features: (p.features || []).join('\n'),
      price: p.price || '', discountPrice: p.discountPrice || '',
      rating: p.rating || '4.8', sales: p.sales || '0',
      deliveryTime: p.deliveryTime || '7-10 Days',
      supportPeriod: p.supportPeriod || '6 Months Free Support',
      liveUrl: p.liveUrl || '', githubUrl: p.githubUrl || '',
      featured: p.featured || false, status: p.status || 'active',
    });
    setExistingShots(p.screenshots || []);
    setNewFiles([]);
    setEditId(p._id);
    setShowForm(true);
    setErr('');
  };

  const removeExisting = (idx) => {
    setExistingShots((prev) => prev.filter((_, i) => i !== idx));
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setErr('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'technologies') {
          fd.append(k, JSON.stringify(v.split(',').map((s) => s.trim()).filter(Boolean)));
        } else if (k === 'features') {
          fd.append(k, JSON.stringify(v.split('\n').map((s) => s.trim()).filter(Boolean)));
        } else {
          fd.append(k, v);
        }
      });
      if (editId) fd.append('existingScreenshots', JSON.stringify(existingShots));
      newFiles.forEach((file) => fd.append('screenshots', file));

      const url = editId ? `${API}/projects/${editId}` : `${API}/projects`;
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save project');

      setShowForm(false);
      fetchProjects();
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  const deleteProject = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${API}/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Delete failed');
      fetchProjects();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--fd)', fontSize: '1.4rem', fontWeight: 800 }}>Manage Projects</h1>
          <p style={{ color: 'var(--t3)', fontSize: '0.78rem', marginTop: '0.2rem', fontFamily: 'var(--fu)' }}>
            {projects.length} project{projects.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <button className="btn-primary" style={{ border: 'none', fontSize: '0.78rem', padding: '0.6rem 1.3rem' }} onClick={openAdd}>
          + Add New Project
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--t3)' }}>Loading projects...</div>
      ) : projects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--t3)' }}>
          No projects yet. Click "Add New Project" to create one.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="adm-tbl">
            <thead>
              <tr><th>Image</th><th>Title</th><th>Category</th><th>Price</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p._id}>
                  <td>
                    {p.image ? (
                      <img src={resolveImageUrl(p.image, FILE_BASE)} alt="" style={{ width: 48, height: 36, objectFit: 'cover', borderRadius: 6 }} />
                    ) : (
                      <div style={{ width: 48, height: 36, borderRadius: 6, background: 'var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>📦</div>
                    )}
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--t1)' }}>{p.title}</td>
                  <td>{p.category}</td>
                  <td style={{ color: 'var(--nb)' }}>₹{p.discountPrice?.toLocaleString('en-IN') || 0}</td>
                  <td>
                    <span className={`bge ${p.status === 'active' ? 'bg-g' : 'bg-y'}`}>{p.status}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => openEdit(p)} style={{ background: 'none', border: 'none', color: 'var(--nb)', cursor: 'pointer', fontSize: '0.78rem', fontFamily: 'var(--fu)' }}>Edit</button>
                      <button onClick={() => deleteProject(p._id, p.title)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.78rem', fontFamily: 'var(--fu)' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── ADD/EDIT MODAL ── */}
      {showForm && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(10,6,6,0.85)', backdropFilter: 'blur(6px)', zIndex: 3000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '2rem 1rem', overflowY: 'auto' }}
          onClick={() => !busy && setShowForm(false)}
        >
          <div
            style={{ maxWidth: 700, width: '100%', background: 'var(--card)', border: '1px solid var(--bdrh)', borderRadius: 16, padding: '2rem', backdropFilter: 'blur(20px)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'var(--fd)', fontSize: '1.15rem', fontWeight: 700 }}>
                {editId ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--t3)', fontSize: '1.3rem', cursor: 'pointer' }}>✕</button>
            </div>

            {err ? <div className="err-box">⚠️ {err}</div> : null}

            <form onSubmit={submit}>
              <div className="f-row">
                <div className="fg">
                  <label className="fl">Title *</label>
                  <input className="fi" value={form.title} onChange={f('title')} required />
                </div>
                <div className="fg">
                  <label className="fl">Category</label>
                  <select className="fs" value={form.category} onChange={f('category')}>
                    {['Web', 'Mobile', 'AI', 'ERP', 'Portfolio', 'Other'].map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="fg">
                <label className="fl">Short Description *</label>
                <textarea className="fta" style={{ minHeight: 60 }} value={form.description} onChange={f('description')} required />
              </div>

              <div className="fg">
                <label className="fl">Full Description (shown on detail page)</label>
                <textarea className="fta" style={{ minHeight: 100 }} value={form.fullDescription} onChange={f('fullDescription')} />
              </div>

              <div className="fg">
                <label className="fl">Technologies (comma separated)</label>
                <input className="fi" placeholder="React, Node.js, MongoDB" value={form.technologies} onChange={f('technologies')} />
              </div>

              <div className="fg">
                <label className="fl">Key Features (one per line)</label>
                <textarea className="fta" style={{ minHeight: 100 }} placeholder={'Feature one\nFeature two\nFeature three'} value={form.features} onChange={f('features')} />
              </div>

              <div className="f-row">
                <div className="fg">
                  <label className="fl">Original Price (₹)</label>
                  <input className="fi" type="number" value={form.price} onChange={f('price')} />
                </div>
                <div className="fg">
                  <label className="fl">Discount Price (₹) *</label>
                  <input className="fi" type="number" value={form.discountPrice} onChange={f('discountPrice')} required />
                </div>
              </div>

              <div className="f-row">
                <div className="fg">
                  <label className="fl">Rating (1-5)</label>
                  <input className="fi" type="number" step="0.1" min="1" max="5" value={form.rating} onChange={f('rating')} />
                </div>
                <div className="fg">
                  <label className="fl">Sales Count</label>
                  <input className="fi" type="number" value={form.sales} onChange={f('sales')} />
                </div>
              </div>

              <div className="f-row">
                <div className="fg">
                  <label className="fl">Delivery Time</label>
                  <input className="fi" value={form.deliveryTime} onChange={f('deliveryTime')} />
                </div>
                <div className="fg">
                  <label className="fl">Support Period</label>
                  <input className="fi" value={form.supportPeriod} onChange={f('supportPeriod')} />
                </div>
              </div>

              <div className="f-row">
                <div className="fg">
                  <label className="fl">Live Demo URL</label>
                  <input className="fi" value={form.liveUrl} onChange={f('liveUrl')} />
                </div>
                <div className="fg">
                  <label className="fl">GitHub URL</label>
                  <input className="fi" value={form.githubUrl} onChange={f('githubUrl')} />
                </div>
              </div>

              <div className="f-row">
                <div className="fg">
                  <label className="fl">Status</label>
                  <select className="fs" value={form.status} onChange={f('status')}>
                    <option value="active">Active (visible on site)</option>
                    <option value="draft">Draft (hidden)</option>
                  </select>
                </div>
                <div className="fg" style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--t2)', cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.featured} onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))} />
                    Mark as Featured Project
                  </label>
                </div>
              </div>

              {/* Existing screenshots (edit mode) */}
              {editId && existingShots.length > 0 && (
                <div className="fg">
                  <label className="fl">Current Screenshots (click to remove)</label>
                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                    {existingShots.map((shot, i) => (
                      <div key={i} style={{ position: 'relative', width: 72, height: 54, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--bdr)', cursor: 'pointer' }} onClick={() => removeExisting(i)}>
                        <img src={resolveImageUrl(shot, FILE_BASE)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(220,38,38,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}
                          onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                          onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                        >
                          <span style={{ color: '#fff', fontSize: '0.7rem', fontWeight: 700 }}>✕ Remove</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New file upload */}
              <div className="fg">
                <label className="fl">{editId ? 'Add More Screenshots' : 'Upload Screenshots (up to 8)'}</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setNewFiles(Array.from(e.target.files))}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--bdr)', borderRadius: 8, padding: '0.65rem 1rem', color: 'var(--t2)', fontSize: '0.82rem', fontFamily: 'var(--fb)' }}
                />
                {newFiles.length > 0 && (
                  <p style={{ fontSize: '0.78rem', color: 'var(--ng)', marginTop: '0.4rem' }}>
                    {newFiles.length} new image{newFiles.length > 1 ? 's' : ''} selected
                  </p>
                )}
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', border: 'none', marginTop: '1rem' }} disabled={busy}>
                {busy ? '⏳ Saving...' : editId ? '💾 Update Project' : '🚀 Create Project'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}