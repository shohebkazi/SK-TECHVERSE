import { useState, useEffect } from 'react';
import { useScrollProgress } from '../hooks';

// ─── PARTICLES ───────────────────────────────────────────────
export function Particles() {
  const particles = Array.from({ length: 22 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    left: Math.random() * 100,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 18,
    color: Math.random() > 0.5 ? 'rgba(var(--nb-rgb),0.45)' : 'rgba(var(--np-rgb),0.45)',
  }));

  return (
    <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0, overflow:'hidden' }}>
      {particles.map(p => (
        <div key={p.id} className="particle" style={{
          width: p.size, height: p.size, left: `${p.left}%`,
          background: p.color,
          animationDuration: `${p.duration}s`,
          animationDelay: `${p.delay}s`,
        }} />
      ))}
    </div>
  );
}

// ─── LOADER ──────────────────────────────────────────────────
export function Loader({ onDone }) {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setHide(true);
      setTimeout(onDone, 800);
    }, 2800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className={`loader-screen${hide ? ' hide' : ''}`}>
      <div className="loader-logo">SK TECHVERSE</div>
      <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.76rem', color:'var(--text-3)', marginTop:'0.75rem', letterSpacing:'0.15em', textTransform:'uppercase' }}>
        Building Smart Digital Solutions
      </p>
      <div className="loader-track"><div className="loader-fill" /></div>
      <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.68rem', color:'var(--text-3)', marginTop:'1rem', letterSpacing:'0.1em' }}>
        PREPARING YOUR EXPERIENCE
      </p>
    </div>
  );
}

// ─── SCROLL PROGRESS ─────────────────────────────────────────
export function ScrollProgress() {
  const progress = useScrollProgress();
  return <div className="scroll-bar" style={{ width: `${progress}%` }} />;
}