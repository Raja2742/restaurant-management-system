import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    useNavigate,
    useSearchParams
} from "react-router-dom";

// Services
import { getAvailableMenuItems } from "../../services/menuService";
import { getTableByQrCode } from "../../services/tableService";

// Contexts
import { useCart } from "../../context/CartContext";
import { useSession } from "../../context/SessionContext";

// Customer components
import Navbar from "../../components/customer/Navbar";
import HeroSection from "../../components/customer/HeroSection";
import CategoryFilter from "../../components/customer/CategoryFilter";
import MenuGrid from "../../components/customer/MenuGrid";
import CartDrawer from "../../components/customer/CartDrawer";
import Footer from "../../components/customer/Footer";
import TableSelector from "../../components/customer/TableSelector";

import { getOrdersBySession } from "../../services/orderService";
import { connectWebSocket } from "../../services/websocketService";

import "./Customer.css";


function Customer() {

    // -----------------------------------------
    // ROUTER
    // -----------------------------------------

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const qrCode = searchParams.get("qrCode");


    // -----------------------------------------
    // CART CONTEXT
    // -----------------------------------------

    const {
        cart,
        addToCart,
        updateQuantity,
        cartCount,
        cartTotal
    } = useCart();


    // -----------------------------------------
    // SESSION CONTEXT
    // -----------------------------------------

    const {
        table,
        session,
        loading: sessionLoading,
        startSession
    } = useSession();


    // -----------------------------------------
    // LOCAL STATES
    // -----------------------------------------

    const [menuItems, setMenuItems] = useState([]);

    const [menuLoading, setMenuLoading] = useState(true);

    const [menuError, setMenuError] = useState("");

    const [sessionError, setSessionError] = useState("");

    const [startingSession, setStartingSession] = useState(false);

    const [search, setSearch] = useState("");

    const [selectedCategory, setSelectedCategory] = useState("All");

    const [cartOpen, setCartOpen] = useState(false);


    const [sessionOrders, setSessionOrders] = useState([]);
    const [customerNotification, setCustomerNotification] = useState("");

    // -----------------------------------------
    // FETCH MENU
    // -----------------------------------------

    const fetchMenuItems = async () => {

        try {

            setMenuLoading(true);
            setMenuError("");

            const items = await getAvailableMenuItems();

            setMenuItems(
                Array.isArray(items) ? items : []
            );

        } catch (error) {

            console.error("Menu fetching failed:", error);

            setMenuError(
                error.response?.data?.message ||
                "Unable to load menu. Please try again."
            );

        } finally {

            setMenuLoading(false);

        }
    };


    useEffect(() => {

        fetchMenuItems();

    }, []);


    // -----------------------------------------
    // QR CODE SESSION
    // -----------------------------------------

    useEffect(() => {

        let active = true;

        const initializeQrSession = async () => {

            // Wait for SessionContext restoration
            if (sessionLoading) return;

            // No QR code
            if (!qrCode) return;

            // Existing session already available
            if (session) return;

            try {

                setStartingSession(true);
                setSessionError("");

                const tableData = await getTableByQrCode(qrCode);

                if (!active) return;

                await startSession(tableData);

            } catch (error) {

                console.error("QR session failed:", error);

                if (active) {

                    setSessionError(
                        error.response?.data?.message ||
                        "Invalid QR code or unable to start your session."
                    );

                }

            } finally {

                if (active) {
                    setStartingSession(false);
                }

            }

        };

        initializeQrSession();

        return () => {
            active = false;
        };

    }, [qrCode, sessionLoading, session, startSession]);


    // -----------------------------------------
// CUSTOMER WEBSOCKET
// -----------------------------------------

useEffect(() => {

    if (!session?.id) return;

    const sessionId = session.id;

    // Fetch existing orders for this session
    const fetchOrders = async () => {
        try {
            const orders = await getOrdersBySession(sessionId);
            setSessionOrders(Array.isArray(orders) ? orders : []);
        } catch (error) {
            console.error("Failed to fetch session orders:", error);
        }
    };

    fetchOrders();

    // Listen for order and session updates
    const disconnectSession = connectWebSocket(
        `/topic/session/${sessionId}`,
        (event) => {
            console.log("Customer session event:", event);

            setCustomerNotification(event.type);

            // Refresh orders whenever an event arrives
            fetchOrders();
        }
    );

    // Listen for payment updates
    const disconnectPayment = connectWebSocket(
        `/topic/session/${sessionId}/payment`,
        (event) => {
            console.log("Customer payment event:", event);

            setCustomerNotification(event.type);
        }
    );

    return () => {
        disconnectSession?.();
        disconnectPayment?.();
    };

}, [session?.id]);

    // -----------------------------------------
    // MANUAL TABLE SELECTION
    // -----------------------------------------

    const handleTableSelection = async (selectedTable) => {

        try {

            setStartingSession(true);
            setSessionError("");

            await startSession(selectedTable);

        } catch (error) {

            console.error("Table session failed:", error);

            setSessionError(
                error.response?.data?.message ||
                "Unable to start your table session."
            );

        } finally {

            setStartingSession(false);

        }

    };


    // -----------------------------------------
    // CATEGORIES
    // -----------------------------------------

    const categories = useMemo(() => {

        return [
            "All",
            ...new Set(
                menuItems
                    .map(item => item.categoryName)
                    .filter(Boolean)
            )
        ];

    }, [menuItems]);


    // -----------------------------------------
    // SEARCH AND FILTER
    // -----------------------------------------

    const filteredItems = useMemo(() => {

        const normalizedSearch = search
            .trim()
            .toLowerCase();

        return menuItems.filter(item => {

            const matchesSearch = [
                item.name,
                item.description,
                item.categoryName
            ]
                .filter(Boolean)
                .some(value =>
                    value.toLowerCase().includes(normalizedSearch)
                );

            const matchesCategory =
                selectedCategory === "All" ||
                item.categoryName === selectedCategory;

            return matchesSearch && matchesCategory;

        });

    }, [menuItems, search, selectedCategory]);


    // -----------------------------------------
    // CLEAR FILTERS
    // -----------------------------------------

    const clearFilters = () => {

        setSearch("");
        setSelectedCategory("All");

    };


    // -----------------------------------------
    // CART QUANTITY
    // -----------------------------------------

    const handleCartQuantity = (itemId, change) => {

        const cartItem = cart.find(
            item => item.id === itemId
        );

        if (!cartItem) return;

        updateQuantity(
            itemId,
            cartItem.quantity + change
        );

    };


    // -----------------------------------------
    // CHECKOUT
    // -----------------------------------------

    const handleCheckout = () => {

        if (cart.length === 0) return;

        if (!session?.id) {

            setCartOpen(false);

            setSessionError(
                "Please select a table before checkout."
            );

            return;

        }

        setCartOpen(false);

        navigate("/checkout", {
            state: {
                session,
                table
            }
        });

    };


    // -----------------------------------------
    // SESSION LOADING
    // -----------------------------------------

    if (sessionLoading || startingSession) {

        return (

            <div className="customer-page">

                <div className="customer-loading">

                    <div className="loading-spinner"></div>

                    <h3>Preparing your table...</h3>

                    <p>Please wait a moment.</p>

                </div>

            </div>

        );

    }


    // -----------------------------------------
    // SESSION ERROR
    // -----------------------------------------

    if (sessionError) {

        return (

            <div className="customer-page">

                <div className="customer-error">

                    <h3>Unable to continue</h3>

                    <p>{sessionError}</p>

                    <button
                        type="button"
                        onClick={() => {

                            setSessionError("");

                            if (qrCode) {
                                window.location.reload();
                            }

                        }}
                    >
                        Try again
                    </button>

                </div>

            </div>

        );

    }


    // -----------------------------------------
    // TABLE SELECTION
    // -----------------------------------------

    if (!session) {

        return (

            <div className="customer-page">

                <Navbar
                    search={search}
                    onSearchChange={setSearch}
                    cartCount={cartCount}
                    onOpenCart={() => setCartOpen(true)}
                />

                <TableSelector
                    onSelectTable={handleTableSelection}
                />

                <CartDrawer
                    isOpen={cartOpen}
                    cart={cart}
                    cartCount={cartCount}
                    cartTotal={cartTotal}
                    onClose={() => setCartOpen(false)}
                    onUpdateQuantity={handleCartQuantity}
                    onCheckout={handleCheckout}
                />

                <Footer />

            </div>

        );

    }


    // -----------------------------------------
    // MAIN CUSTOMER PAGE
    // -----------------------------------------

    return (

        <div className="customer-page">

            {/* NAVBAR */}

            <Navbar
                search={search}
                onSearchChange={setSearch}
                cartCount={cartCount}
                onOpenCart={() => setCartOpen(true)}
            />


            {/* TABLE INFORMATION */}

            <div className="customer-table-info">

                <div className="table-info-left">

                    <span className="table-info-label">
                        Ordering at
                    </span>

                    <strong>
                        {table?.tableNumber || session.tableNumber}
                    </strong>

                </div>

                <div className="table-info-right">

                    <span>
                        Session: {session.sessionNumber}
                    </span>

                </div>

            </div>


            {/* CUSTOMER REAL-TIME NOTIFICATION */}

            {customerNotification && (
                <div className="customer-notification">
                    <p>
                        Latest update: {customerNotification.replaceAll("_", " ")}
                    </p>

                    <button
                        type="button"
                        onClick={() => setCustomerNotification("")}
                    >
                        ×
                    </button>
                </div>
            )}

            <main className="customer-content">

                {/* HERO */}

                <HeroSection />


                {/* MENU */}

                <section
                    className="menu-section"
                    id="menu"
                >

                    <div className="menu-heading">

                        <div>

                            <span className="section-eyebrow">
                                MADE WITH LOVE
                            </span>

                            <h2>
                                Explore our menu
                            </h2>

                            <p>
                                Find something delicious for every craving.
                            </p>

                        </div>

                        <span className="menu-result-count">
                            {filteredItems.length} dishes
                        </span>

                    </div>


                    {/* CATEGORY FILTER */}

                    <CategoryFilter
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onSelectCategory={setSelectedCategory}
                    />


                    {/* MENU LOADING */}

                    {menuLoading && (

                        <div className="menu-message">

                            <div className="loading-spinner"></div>

                            <p>Preparing your menu...</p>

                        </div>

                    )}


                    {/* MENU ERROR */}

                    {!menuLoading && menuError && (

                        <div className="menu-message error-message">

                            <p>{menuError}</p>

                            <button
                                type="button"
                                onClick={fetchMenuItems}
                            >
                                Try again
                            </button>

                        </div>

                    )}


                    {/* MENU GRID */}

                    {!menuLoading &&
                        !menuError &&
                        filteredItems.length > 0 && (

                            <MenuGrid
                                items={filteredItems}
                                cart={cart}
                                onAddToCart={addToCart}
                                onUpdateQuantity={updateQuantity}
                            />

                        )}


                    {/* EMPTY STATE */}

                    {!menuLoading &&
                        !menuError &&
                        filteredItems.length === 0 && (

                            <div className="empty-menu">

                                <span>⌕</span>

                                <h3>No dishes found</h3>

                                <p>
                                    Try another search or choose a different category.
                                </p>

                                <button
                                    type="button"
                                    onClick={clearFilters}
                                >
                                    Clear filters
                                </button>

                            </div>

                        )}

                </section>

            </main>


            {/* CART DRAWER */}

            <CartDrawer
                isOpen={cartOpen}
                cart={cart}
                cartCount={cartCount}
                cartTotal={cartTotal}
                onClose={() => setCartOpen(false)}
                onUpdateQuantity={handleCartQuantity}
                onCheckout={handleCheckout}
            />


            {/* FOOTER */}

            <Footer />

        </div>

    );

}

export default Customer;