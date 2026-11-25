
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await loginUser({
                email,
                password
            });

            login(response);

            switch (response.role) {
                case "CUSTOMER": {
                    const redirectTo =
                        location.state?.from || "/customer";

                    navigate(redirectTo, { replace: true });
                    break;
                }

                case "KITCHEN":
                    navigate("/kitchen", { replace: true });
                    break;

                case "WAITER":
                    navigate("/waiter", { replace: true });
                    break;

                case "CASHIER":
                    navigate("/cashier", { replace: true });
                    break;

                case "ADMIN":
                    navigate("/admin", { replace: true });
                    break;

                default:
                    navigate("/login", { replace: true });
            }

        } catch (err) {
            console.error("Login error:", err);

            setError(
                err.response?.data?.message ||
                "Invalid email or password. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <div className="login-left">

                <div className="login-brand">
                    <div className="brand-icon">R</div>
                    <span>Restro<span className="brand-highlight">Flow</span></span>
                </div>

                <div className="login-hero-content">
                    <span className="hero-tag">RESTAURANT MANAGEMENT</span>

                    <h1>
                        Great food.
                        <br />
                        <span>Seamless service.</span>
                    </h1>

                    <p>
                        Everything our restaurant needs to deliver
                        an exceptional dining experience, all in one place.
                    </p>

                    <div className="login-features">
                        <div className="feature-item">
                            <span className="feature-icon">✓</span>
                            Smart order management
                        </div>

                        <div className="feature-item">
                            <span className="feature-icon">✓</span>
                            Real-time kitchen updates
                        </div>

                        <div className="feature-item">
                            <span className="feature-icon">✓</span>
                            Simplified restaurant operations
                        </div>
                    </div>
                </div>

                <div className="login-left-footer">
                    © 2026 RestroFlow. All rights reserved.
                </div>

            </div>

            <div className="login-right">

                <div className="login-form-container">

                    <div className="mobile-brand">
                        <div className="brand-icon">R</div>
                        <span>Restro<span className="brand-highlight">Flow</span></span>
                    </div>

                    <div className="login-heading">
                        <span className="welcome-label">WELCOME BACK</span>
                        <h2>Sign in to your account</h2>
                        <p>
                            Enter your credentials to access your workspace.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">

                        <div className="form-group">
                            <label htmlFor="email">Email address</label>

                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                autoComplete="username"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <div className="password-label-row">
                                <label htmlFor="password">Password</label>
                            </div>

                            <div className="password-input-wrapper">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    autoComplete="current-password"
                                    required
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="login-error" role="alert">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="login-submit"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign in"}
                            {!loading && <span>→</span>}
                        </button>

                    </form>

                    <div className="login-security-note">
                        <span>🔒</span>
                        Your account information is securely protected.
                    </div>

                </div>

            </div>

        </div>
    );
};

export default Login;