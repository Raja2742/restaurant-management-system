import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import "./CustomerProfile.css";

const CustomerProfile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        navigate("/login", { replace: true });
    };

    if (!user) return null;

    const initial = user.name?.charAt(0)?.toUpperCase() || "U";

    return (
        <div className="customer-profile">

            <button
                className="profile-trigger"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Open customer profile"
                aria-expanded={isOpen}
            >
                <span className="profile-avatar">
                    {initial}
                </span>
            </button>

            {isOpen && (
                <>
                    <div
                        className="profile-backdrop"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="profile-dropdown">

                        <div className="profile-user-info">

                            <div className="profile-avatar profile-avatar-large">
                                {initial}
                            </div>

                            <div>
                                <h3>{user.name}</h3>
                                <p>{user.email}</p>
                            </div>

                        </div>

                        <div className="profile-divider" />

                        <div className="profile-details">

                            <div className="profile-detail-row">
                                <span>Account Type</span>
                                <strong>Customer</strong>
                            </div>

                            <div className="profile-detail-row">
                                <span>Email</span>
                                <strong>{user.email}</strong>
                            </div>

                        </div>

                        <div className="profile-divider" />

                        <button
                            className="profile-logout-btn"
                            onClick={handleLogout}
                        >
                            <span>↪</span>
                            Logout
                        </button>

                    </div>
                </>
            )}

        </div>
    );
};

export default CustomerProfile;