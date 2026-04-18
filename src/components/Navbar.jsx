import { Link } from "react-router-dom";
import "./navbar.css";

function Navbar() {
  return (
    <nav className="navbar">

      <div className="logo">
        SecureLife
      </div>

      <ul className="nav-links">

        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <Link to="/calculator">Calculator</Link>
        </li>

        <li>
          <Link to="/buy-policy">Buy Policy</Link>
        </li>

        <li>
          <Link to="/login">Login</Link>
        </li>

        <li>
          <Link to="/register">Register</Link>
        </li>

        <li>
          <Link to="/admin-login">Admin</Link>
        </li>

      </ul>

    </nav>
  );
}

export default Navbar;