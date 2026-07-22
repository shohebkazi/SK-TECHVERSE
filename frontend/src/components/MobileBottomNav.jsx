import { FiHome, FiUser, FiFolder, FiBriefcase } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const LEFT_TABS = [
  ['home',     'Home',     FiHome],
  ['about',    'About',    FiUser],
];
const RIGHT_TABS = [
  ['projects', 'Projects', FiFolder],
  ['services', 'Services', FiBriefcase],
];

const WA_LINK = 'https://wa.me/917410721438?text=Hi%20SK%20TECHVERSE!%20I%27d%20like%20to%20know%20more.';

function Tab({ id, label, Icon, active, onClick }) {
  return (
    <button className={`mbn-item${active ? ' active' : ''}`} onClick={onClick}>
      <span className="mbn-icon-wrap"><Icon /></span>
      <span className="mbn-label">{label}</span>
    </button>
  );
}

export default function MobileBottomNav({ page, setPage }) {
  return (
    <nav className="mobile-bottom-nav">
      <div className="mbn-row">
        {LEFT_TABS.map(([id, label, Icon]) => (
          <Tab key={id} id={id} label={label} Icon={Icon} active={page === id} onClick={() => setPage(id)} />
        ))}

        {/* Floating center WhatsApp action — raised above the bar */}
        <div className="mbn-center">
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mbn-fab"
            aria-label="Chat on WhatsApp"
          >
            <span className="mbn-fab-ring" />
            <FaWhatsapp />
          </a>
          <span className="mbn-fab-label">WhatsApp</span>
        </div>

        {RIGHT_TABS.map(([id, label, Icon]) => (
          <Tab key={id} id={id} label={label} Icon={Icon} active={page === id} onClick={() => setPage(id)} />
        ))}
      </div>
    </nav>
  );
}
