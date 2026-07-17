import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dot  = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    const move = (e) => {
      if (dot.current)  { dot.current.style.left = e.clientX + 'px'; dot.current.style.top = e.clientY + 'px'; }
      if (ring.current) { setTimeout(() => { if (ring.current) { ring.current.style.left = e.clientX + 'px'; ring.current.style.top = e.clientY + 'px'; } }, 80); }
    };
    const enter = () => { if (ring.current) { ring.current.style.transform = 'translate(-50%,-50%) scale(1.6)'; ring.current.style.borderColor = 'rgba(var(--np-rgb),0.6)'; } };
    const leave = () => { if (ring.current) { ring.current.style.transform = 'translate(-50%,-50%) scale(1)';   ring.current.style.borderColor = 'rgba(var(--nb-rgb),0.5)'; } };

    document.addEventListener('mousemove', move);
    const interactables = document.querySelectorAll('button,a,[class*="card"],[class*="btn"]');
    interactables.forEach(el => { el.addEventListener('mouseenter', enter); el.addEventListener('mouseleave', leave); });

    return () => {
      document.removeEventListener('mousemove', move);
      interactables.forEach(el => { el.removeEventListener('mouseenter', enter); el.removeEventListener('mouseleave', leave); });
    };
  }, []);

  return (
    <>
      <div ref={dot}  className="cursor-dot" />
      <div ref={ring} className="cursor-ring" />
    </>
  );
}