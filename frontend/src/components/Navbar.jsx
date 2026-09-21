import {
  Link,
  NavLink,
  useNavigate
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";


function Navbar() {

  const {
    user,
    logout
  } = useAuth();


  const navigate =
    useNavigate();


  const handleLogout = () => {

    logout();

    navigate("/");

  };


  return (

    <header className="navbar">

      <div className="navbar-container">


        {/* Logo */}

        <Link
          to="/"
          className="logo"
        >

          <span className="logo-icon">
            💼
          </span>

          JobFinder
          <span className="logo-pro">
            Pro
          </span>

        </Link>


        {/* Navigation */}

        <nav className="nav-links">

          <NavLink to="/">
            Home
          </NavLink>


          {user && (

            <NavLink to="/jobs">
              Jobs
            </NavLink>

          )}


          {user && (

            <NavLink to="/saved">
              Saved Jobs
            </NavLink>

          )}


          {user && (

            <NavLink to="/tracker">
              Tracker
            </NavLink>

          )}


          {user && (

            <NavLink to="/history">
              History
            </NavLink>

          )}

        </nav>


        {/* User Section */}

        <div className="nav-user">

          {user ? (

            <>

              <span className="welcome">

                Hi, {user.name}

              </span>


              <button
                className="logout-button"
                onClick={handleLogout}
              >

                Logout

              </button>

            </>

          ) : (

            <>

              <Link
                to="/login"
                className="login-link"
              >

                Login

              </Link>


              <Link
                to="/register"
                className="register-button"
              >

                Register

              </Link>

            </>

          )}

        </div>


      </div>

    </header>

  );

}


export default Navbar;