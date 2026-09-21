import {
  useState
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  useAuth
} from "../context/AuthContext";


function Register() {

  const {
    register
  } = useAuth();


  const navigate =
    useNavigate();


  const [name, setName] =
    useState("");


  const [email, setEmail] =
    useState("");


  const [password, setPassword] =
    useState("");


  const [confirmPassword, setConfirmPassword] =
    useState("");


  const [error, setError] =
    useState("");


  const [loading, setLoading] =
    useState(false);


  const handleSubmit =
    async (event) => {

      event.preventDefault();

      setError("");


      if (
        password !==
        confirmPassword
      ) {

        setError(
          "Passwords do not match"
        );

        return;

      }


      if (password.length < 6) {

        setError(
          "Password must contain at least 6 characters"
        );

        return;

      }


      setLoading(true);


      try {

        await register(
          name,
          email,
          password
        );


        navigate("/login");

      } catch (error) {

        setError(
          error.response?.data?.message ||
          "Registration failed"
        );

      } finally {

        setLoading(false);

      }

    };


  return (

    <main className="auth-page">


      <div className="auth-card">


        <div className="auth-icon">
          👤
        </div>


        <h1>
          Create Account
        </h1>


        <p>
          Start managing your job search today.
        </p>


        {error && (

          <div className="error-message">
            {error}
          </div>

        )}


        <form
          onSubmit={handleSubmit}
          className="auth-form"
        >


          <label>
            Full Name
          </label>

          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            required
          />


          <label>
            Email Address
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
          />


          <label>
            Password
          </label>

          <input
            type="password"
            placeholder="Minimum 6 characters"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            minLength="6"
            required
          />


          <label>
            Confirm Password
          </label>

          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
            required
          />


          <button
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Creating account..."
              : "Create Account"}

          </button>


        </form>


        <p className="auth-footer">

          Already have an account?

          <Link to="/login">
            Login
          </Link>

        </p>


      </div>


    </main>

  );

}


export default Register;