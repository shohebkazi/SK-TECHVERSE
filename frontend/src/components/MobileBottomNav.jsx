import { FiHome, FiUser, FiFolder, FiBriefcase } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const TABS = [
  ['home',     'Home',     FiHome],
  ['about',    'About',    FiUser],
  ['projects', 'Projects', FiFolder],
  ['services', 'Services', FiBriefcase],
];

const WA_LINK = 'https://wa.me/917410721438?text=Hi%20SK%20TECHVERSE!%20I%27d%20like%20to%20know%20more.';

export default function MobileBottomNav({ page, setPage }) {
  return (
    <nav className="mobile-bottom-nav">
      {TABS.map(([id, label, Icon]) => (
        <button
          key={id}
          className={`mbn-item${page === id ? ' active' : ''}`}
          onClick={() => setPage(id)}
        >
          <Icon />
          <span>{label}</span>
        </button>
      ))}
      <a
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="mbn-item mbn-whatsapp"
      >
        <FaWhatsapp />
        <span>WhatsApp</span>
      </a>
    </nav>
  );
}
