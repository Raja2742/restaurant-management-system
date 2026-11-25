import { Link, useLocation } from "react-router-dom";
import {
Search,
ShoppingBag,
X,
Utensils,
ClipboardList,
UserRound
} from "lucide-react";
import CustomerProfile from "./CustomerProfile";
import "./Navbar.css";

export default function Navbar({
search = "",
onSearchChange,
cartCount = 0,
onOpenCart,
}) {
const location = useLocation();


return (
    <header className="customer-navbar">

        <Link to="/customer" className="restaurant-brand">
            <span className="brand-icon">
                <Utensils size={22} />
            </span>

            <span className="brand-name">
                <strong>Urban</strong>
                <span className="brand-subtitle">TABLE</span>
            </span>
        </Link>

        <nav className="navbar-links">
            <Link
                to="/customer"
                className={location.pathname === "/customer" ? "active" : ""}
            >
                Menu
            </Link>

            <Link
                to="/customer/orders"
                className={location.pathname.startsWith("/customer/orders") ? "active" : ""}
            >
                <ClipboardList size={17} />
                My Orders
            </Link>
        </nav>

        <div className="navbar-search">
            <Search size={19} className="search-icon" />

            <input
                type="text"
                placeholder="Search your favourite dishes..."
                value={search}
                onChange={(event) => onSearchChange?.(event.target.value)}
                aria-label="Search dishes"
            />

            {search && (
                <button
                    type="button"
                    className="clear-search"
                    onClick={() => onSearchChange?.("")}
                    aria-label="Clear search"
                >
                    <X size={17} />
                </button>
            )}
        </div>

        <div className="navbar-profile-wrapper">
            <CustomerProfile />
        </div>

        <button
            className="cart-button"
            onClick={onOpenCart}
            type="button"
            aria-label={`Open cart, ${cartCount} items`}
        >
            <ShoppingBag size={19} />
            <span>Your Cart</span>
            <span className="cart-count">{cartCount}</span>
        </button>

    </header>
);


}
