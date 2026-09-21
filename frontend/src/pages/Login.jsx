import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";


function Login() {

    const { login } = useAuth();

    const navigate = useNavigate();


    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    const handleSubmit =
        async (event) => {

            event.preventDefault();

            setError("");
            setLoading(true);


            try {

                await login(
                    email,
                    password
                );

                navigate("/");

            } catch (error) {

                setError(
                    error.response?.data?.message ||
                    "Login failed"
                );

            } finally {

                setLoading(false);

            }
        };


    return (

        <main className="auth-page">

            <div className="auth-card">

                <div className="auth-icon">
                    🔐
                </div>


                <h1>
                    Welcome Back
                </h1>


                <p>
                    Login to continue your job search.
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
                        placeholder="Enter your password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        required
                    />


                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Logging in..."
                            : "Login"
                        }

                    </button>

                </form>


                <p className="auth-footer">

                    Don't have an account?

                    <Link to="/register">
                        Create Account
                    </Link>

                </p>

            </div>

        </main>
    );
}


export default Login;