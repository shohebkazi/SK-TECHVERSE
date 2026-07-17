import { motion } from 'framer-motion';

/**
 * Reveal — wraps any block in a smooth scroll-triggered fade + rise animation.
 * Used across pages to give the whole site a consistent "comes alive on scroll" feel.
 *
 * Props:
 *  - delay:   stagger delay in seconds
 *  - y:       starting vertical offset in px (rise distance)
 *  - x:       starting horizontal offset in px (slide distance)
 *  - scale:   starting scale (e.g. 0.94 for a subtle zoom-in)
 *  - once:    replay on every scroll into view if false (default true)
 */
export default function Reveal({
  children,
  delay = 0,
  y = 28,
  x = 0,
  scale = 1,
  once = true,
  amount = 0.2,
  className = '',
  style,
  ...rest
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y, x, scale }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
