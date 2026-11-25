
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must contain at least 6 characters.");
            return;
        }

        setLoading(true);

        try {
            const response = await registerUser({
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                password: formData.password,
            });

            // Registration returns a JWT and user details.
            // Save them using our existing authentication context.
            login(response);

            navigate("/customer", { replace: true });
        } catch (err) {
            const responseData = err.response?.data;

            const validationErrors = responseData?.validationErrors;

            if (validationErrors) {
                setError(Object.values(validationErrors).join(" "));
            } else {
                setError(
                    responseData?.message ||
                    "Registration failed. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Create Account</h1>

                <p className="auth-subtitle">
                    Join us for a better dining experience.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            minLength={2}
                            maxLength={50}
                            autoComplete="name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>

                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="10-digit Indian mobile number"
                            value={formData.phone}
                            onChange={handleChange}
                            pattern="[6-9][0-9]{9}"
                            title="Enter a valid 10-digit Indian mobile number"
                            maxLength={10}
                            autoComplete="tel"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>

                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            minLength={6}
                            maxLength={100}
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">
                            Confirm Password
                        </label>

                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="Re-enter your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            minLength={6}
                            maxLength={100}
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    {error && (
                        <div className="auth-error" role="alert">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account?{" "}
                    <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;

