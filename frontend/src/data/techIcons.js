import {
  SiReact, SiNodedotjs, SiMongodb, SiPython, SiTensorflow, SiFlutter, SiDocker,
  SiAmazonaws, SiPostgresql, SiRedis, SiGraphql, SiTypescript, SiNextdotjs,
  SiKubernetes, SiFirebase, SiMysql, SiExpress, SiFastapi, SiVuedotjs, SiAngular,
  SiTailwindcss, SiJavascript, SiGit,
} from 'react-icons/si';

// Maps a tech-stack label (as used in data/index.js TECH_STACK) to a brand icon,
// glow color, and short category tag — purely presentational, no content change.
export const TECH_ICON_MAP = {
  'React.js':     { Icon: SiReact,       color: '#61dafb', cat: 'Frontend Library' },
  'Node.js':      { Icon: SiNodedotjs,   color: '#83cd29', cat: 'Runtime Environment' },
  'MongoDB':      { Icon: SiMongodb,     color: '#10b981', cat: 'Database' },
  'Python':       { Icon: SiPython,      color: '#f7d154', cat: 'Language' },
  'TensorFlow':   { Icon: SiTensorflow,  color: '#ff8f5e', cat: 'Machine Learning' },
  'Flutter':      { Icon: SiFlutter,     color: '#38bdf8', cat: 'Mobile Framework' },
  'Docker':       { Icon: SiDocker,      color: '#38bdf8', cat: 'Containerization' },
  'AWS':          { Icon: SiAmazonaws,   color: '#f59e0b', cat: 'Cloud Platform' },
  'PostgreSQL':   { Icon: SiPostgresql,  color: '#818cf8', cat: 'Database' },
  'Redis':        { Icon: SiRedis,       color: '#f87171', cat: 'In-Memory Store' },
  'GraphQL':      { Icon: SiGraphql,     color: '#e879f9', cat: 'API Layer' },
  'TypeScript':   { Icon: SiTypescript,  color: '#3178c6', cat: 'Type Safety' },
  'Next.js':      { Icon: SiNextdotjs,   color: '#f4f0ff', cat: 'React Framework' },
  'Kubernetes':   { Icon: SiKubernetes,  color: '#818cf8', cat: 'Orchestration' },
  'Firebase':     { Icon: SiFirebase,    color: '#f59e0b', cat: 'Backend Platform' },
  'MySQL':        { Icon: SiMysql,       color: '#60a5fa', cat: 'Database' },
  'Express.js':   { Icon: SiExpress,     color: '#f4f0ff', cat: 'Web Framework' },
  'FastAPI':      { Icon: SiFastapi,     color: '#10b981', cat: 'API Framework' },
  'Vue.js':       { Icon: SiVuedotjs,    color: '#4ade80', cat: 'Frontend Framework' },
  'Angular':      { Icon: SiAngular,     color: '#f87171', cat: 'Frontend Framework' },
  'Tailwind CSS': { Icon: SiTailwindcss, color: '#38bdf8', cat: 'CSS Framework' },
  'JavaScript':   { Icon: SiJavascript,  color: '#f7d154', cat: 'Language' },
  'Git':          { Icon: SiGit,         color: '#f97316', cat: 'Version Control' },
};

export function getTechIcon(name) {
  return TECH_ICON_MAP[name] || { Icon: null, color: 'var(--neon-blue)', cat: 'Technology' };
}
