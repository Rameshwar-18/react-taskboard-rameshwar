import { Link, NavLink } from 'react-router-dom';

/**
 * Navbar — sticky top navigation bar.
 * Styling lives entirely in index.css (.navbar, .navbar__brand, etc.)
 */
function Navbar() {
  return (
    <nav className="navbar" aria-label="Main navigation">
      <Link to="/" className="navbar__brand">
        📋 Task Board
      </Link>

      <div className="navbar__links">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? 'navbar__link active' : 'navbar__link'
          }
        >
          Board
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
