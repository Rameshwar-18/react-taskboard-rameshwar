import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Navbar — responsive navigation header with authentication status.
 */
function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="navbar" aria-label="Main navigation">
      <Link to="/" className="navbar__brand">
        Task Board
      </Link>

      <div className="navbar__links">
        {isAuthenticated ? (
          <>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? 'navbar__link active' : 'navbar__link'
              }
            >
              Board
            </NavLink>

            <span
              style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '0.85rem',
                fontWeight: 500,
                padding: '0.2rem 0.6rem',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                borderRadius: 'var(--radius-sm)',
                marginLeft: '0.5rem',
                marginRight: '0.25rem',
                maxWidth: '160px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={user?.email || user?.name}
            >
              👤 {user?.name || user?.email}
            </span>

            <button
              type="button"
              onClick={handleLogout}
              className="navbar__link"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
              aria-label="Log out of account"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? 'navbar__link active' : 'navbar__link'
              }
            >
              Sign In
            </NavLink>

            <NavLink
              to="/register"
              className={({ isActive }) =>
                isActive ? 'navbar__link active' : 'navbar__link'
              }
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                fontWeight: 600,
              }}
            >
              Register
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
