import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useSession } from "../../context/SessionContext";

import { createOrder } from "../../services/orderService";

import {
    getImageUrl,
    handleFoodImageError
} from "../../utils/imageUtils";

import "./Checkout.css";

const Checkout = () => {

    const navigate = useNavigate();
    const location = useLocation();

    // Authentication
    const { user } = useAuth();

    // Cart
    const {
        cart,
        cartCount,
        cartTotal,
        clearCart
    } = useCart();

    // Session
    const {
        session: activeSession,
        table: activeTable,
        loading: sessionLoading
    } = useSession();

    // Prefer navigation state, otherwise use SessionContext
    const session = location.state?.session || activeSession;
    const table = location.state?.table || activeTable;

    // Order states
    const [placingOrder, setPlacingOrder] = useState(false);
    const [orderError, setOrderError] = useState("");

    // -----------------------------------------
    // PLACE ORDER
    // -----------------------------------------

    const handlePlaceOrder = async () => {

        if (placingOrder) return;

        if (!user) {
            navigate("/login", {
                state: {
                    from: "/checkout"
                }
            });
            return;
        }

        if (!session?.id) {
            setOrderError(
                "Your table session is missing. Please select your table again."
            );
            return;
        }

        if (cart.length === 0) {
            setOrderError("Your cart is empty.");
            return;
        }

        try {

            setPlacingOrder(true);
            setOrderError("");

            // Backend expects menuItemId and quantity
            const orderItems = cart.map(item => ({
                menuItemId: item.id,
                quantity: item.quantity
            }));

            // Create order through Spring Boot
            const order = await createOrder(
                session.id,
                orderItems
            );

            // Clear cart only after successful API response
            clearCart();

            // Navigate to confirmation page
            navigate("/order-confirmation", {
                replace: true,
                state: {
                    order,
                    session,
                    table
                }
            });

        } catch (error) {

            console.error("Order creation failed:", error);

            setOrderError(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Unable to place your order. Please try again."
            );

        } finally {

            setPlacingOrder(false);

        }

    };


    // -----------------------------------------
    // SESSION LOADING
    // -----------------------------------------

    if (sessionLoading) {

        return (
            <div className="checkout-empty">
                <div className="loading-spinner" />
                <h2>Restoring your table session...</h2>
                <p>Please wait.</p>
            </div>
        );

    }


    // -----------------------------------------
    // EMPTY CART
    // -----------------------------------------

    if (cart.length === 0) {

        return (
            <div className="checkout-empty">

                <h2>Your cart is empty</h2>

                <p>
                    Add some delicious items before checkout.
                </p>

                <button
                    type="button"
                    onClick={() => navigate("/customer")}
                >
                    Explore Menu
                </button>

            </div>
        );

    }


    // -----------------------------------------
    // SESSION VALIDATION
    // -----------------------------------------

    if (!session?.id) {

        return (
            <div className="checkout-empty">

                <h2>Table session not found</h2>

                <p>
                    Please select your table again.
                </p>

                <button
                    type="button"
                    onClick={() => navigate("/customer")}
                >
                    Return to Menu
                </button>

            </div>
        );

    }


    // -----------------------------------------
    // CHECKOUT PAGE
    // -----------------------------------------

    return (

        <div className="checkout-page">

            {/* HEADER */}

            <header className="checkout-header">

                <button
                    type="button"
                    className="checkout-back"
                    onClick={() => navigate("/customer")}
                >
                    ← Back to Menu
                </button>

                <h1>Checkout</h1>

                <span className="checkout-step">
                    ORDER REVIEW
                </span>

            </header>


            <main className="checkout-container">


                {/* LEFT SECTION */}

                <section className="checkout-main">


                    {/* CUSTOMER INFORMATION */}

                    <div className="checkout-section">

                        <span className="checkout-eyebrow">
                            STEP 01
                        </span>

                        <h2>Customer Information</h2>

                        <div className="customer-info-card">

                            <div className="customer-avatar">

                                {user?.name?.charAt(0)?.toUpperCase() || "C"}

                            </div>

                            <div>

                                <h3>
                                    {user?.name || "Customer"}
                                </h3>

                                <p>
                                    {user?.email || ""}
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* DINING INFORMATION */}

                    <div className="checkout-section">

                        <span className="checkout-eyebrow">
                            STEP 02
                        </span>

                        <h2>Dining Information</h2>

                        <div className="dining-info-card">

                            <div>

                                <span>Table Number</span>

                                <strong>
                                    {table?.tableNumber ||
                                        session.tableNumber ||
                                        "N/A"}
                                </strong>

                            </div>

                            <div>

                                <span>Session Number</span>

                                <strong>
                                    {session.sessionNumber || session.id}
                                </strong>

                            </div>

                        </div>

                    </div>


                    {/* ORDER ITEMS */}

                    <div className="checkout-section">

                        <span className="checkout-eyebrow">
                            STEP 03
                        </span>

                        <h2>Review Your Items</h2>

                        <div className="checkout-items">

                            {cart.map(item => (

                                <div
                                    className="checkout-item"
                                    key={item.id}
                                >

                                    <img
                                        src={getImageUrl(item.imageUrl)}
                                        alt={item.name}
                                        onError={handleFoodImageError}
                                    />

                                    <div className="checkout-item-details">

                                        <h4>{item.name}</h4>

                                        <p>
                                            ₹{Number(item.price).toFixed(2)}
                                            {" "}× {item.quantity}
                                        </p>

                                    </div>

                                    <strong>
                                        ₹{(
                                            Number(item.price) * item.quantity
                                        ).toFixed(2)}
                                    </strong>

                                </div>

                            ))}

                        </div>

                    </div>

                </section>


                {/* RIGHT SECTION - SUMMARY */}

                <aside className="checkout-summary">

                    <h2>Order Summary</h2>


                    <div className="summary-row">

                        <span>Total Items</span>

                        <strong>{cartCount}</strong>

                    </div>


                    <div className="summary-row">

                        <span>Subtotal</span>

                        <strong>
                            ₹{Number(cartTotal).toFixed(2)}
                        </strong>

                    </div>


                    <div className="summary-divider" />


                    <div className="summary-total">

                        <span>Total Amount</span>

                        <strong>
                            ₹{Number(cartTotal).toFixed(2)}
                        </strong>

                    </div>


                    <p className="summary-note">

                        Taxes and other applicable charges will be
                        calculated by the restaurant.

                    </p>


                    {/* ORDER ERROR */}

                    {orderError && (

                        <div className="checkout-error">
                            {orderError}
                        </div>

                    )}


                    {/* PLACE ORDER */}

                    <button
                        type="button"
                        className="place-order-button"
                        onClick={handlePlaceOrder}
                        disabled={placingOrder || cart.length === 0}
                    >

                        {placingOrder
                            ? "Placing Order..."
                            : "Place Order"}

                    </button>


                    <p className="order-note">

                        Your order will be sent to the kitchen after
                        confirmation.

                    </p>

                </aside>

            </main>

        </div>

    );

};

export default Checkout;