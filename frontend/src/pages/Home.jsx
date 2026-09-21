import {
  Link
} from "react-router-dom";

import {
  useAuth
} from "../context/AuthContext";


function Home() {

  const {
    user
  } = useAuth();


  return (

    <main>


      {/* Hero */}

      <section className="hero-section">

        <div className="hero-content">

          <div className="hero-badge">
            🚀 SMART JOB SEARCH PLATFORM
          </div>


          <h1>

            Find Your Next

            <span>
              Career Opportunity
            </span>

          </h1>


          <p>

            Search thousands of job opportunities,
            save your favorite jobs, and manage your
            complete application journey in one place.

          </p>


          <div className="hero-buttons">

            <Link
              to={user ? "/jobs" : "/register"}
              className="hero-primary"
            >

              {user
                ? "Search Jobs →"
                : "Get Started →"}

            </Link>


            <Link
              to={user ? "/tracker" : "/login"}
              className="hero-secondary"
            >

              📊 View Application Tracker

            </Link>

          </div>

        </div>


        <div className="hero-visual">

          <div className="dashboard-preview">

            <div className="preview-header">

              <span>
                JobFinder Pro
              </span>

              <span>
                ●
              </span>

            </div>


            <div className="preview-search">
              🔎 Python Developer
            </div>


            <div className="preview-job">

              <strong>
                Python Developer
              </strong>

              <span>
                ABC Technologies
              </span>

              <small>
                📍 Hyderabad
              </small>

            </div>


            <div className="preview-job">

              <strong>
                AI/ML Engineer
              </strong>

              <span>
                Tech Solutions
              </span>

              <small>
                📍 Bengaluru
              </small>

            </div>


          </div>

        </div>


      </section>


      {/* Features */}

      <section className="features-section">

        <div className="section-heading">

          <p>
            EVERYTHING YOU NEED
          </p>

          <h2>
            Manage Your Job Search
          </h2>

        </div>


        <div className="feature-grid">


          <div className="feature-card">

            <div className="feature-icon">
              🔎
            </div>

            <h3>
              Smart Job Search
            </h3>

            <p>
              Search job opportunities using
              keywords and locations.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              🔖
            </div>

            <h3>
              Save Jobs
            </h3>

            <p>
              Save interesting opportunities
              for later.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              📊
            </div>

            <h3>
              Application Tracker
            </h3>

            <p>
              Track applications from Saved
              to Offer.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              🕐
            </div>

            <h3>
              Search History
            </h3>

            <p>
              Review your previous job searches
              anytime.
            </p>

          </div>


        </div>

      </section>


    </main>

  );

}


export default Home;