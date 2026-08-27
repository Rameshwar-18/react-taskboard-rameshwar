import { Link, NavLink } from 'react-router-dom';

const navStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 2rem',
  height: '60px',
  backgroundColor: '#4f46e5',
  color: '#ffffff',
  boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
};

const brandStyle = {
  fontWeight: '700',
  fontSize: '1.2rem',
  letterSpacing: '0.5px',
  color: '#ffffff',
};

const navLinksStyle = {
  display: 'flex',
  gap: '1.5rem',
};

const linkStyle = {
  color: 'rgba(255,255,255,0.85)',
  fontWeight: '500',
  fontSize: '0.95rem',
  padding: '6px 12px',
  borderRadius: '6px',
  transition: 'background 0.2s',
};

function Navbar() {
  return (
    <nav style={navStyle}>
      <Link to="/" style={brandStyle}>
        📋 Task Board
      </Link>
      <div style={navLinksStyle}>
        <NavLink
          to="/"
          end
          style={({ isActive }) => ({
            ...linkStyle,
            backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
            color: '#ffffff',
          })}
        >
          Board
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
