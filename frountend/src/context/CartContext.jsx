
import {
    createContext,
    useContext,
    useMemo,
    useState
} from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {

    const [cart, setCart] = useState([]);

    // Add item to cart
    const addToCart = (item) => {
        setCart((previousCart) => {
            const existingItem = previousCart.find(
                (cartItem) => cartItem.id === item.id
            );

            if (existingItem) {
                return previousCart.map((cartItem) =>
                    cartItem.id === item.id
                        ? {
                            ...cartItem,
                            quantity: cartItem.quantity + 1
                        }
                        : cartItem
                );
            }

            return [
                ...previousCart,
                {
                    ...item,
                    quantity: 1
                }
            ];
        });
    };

    // Update item quantity
    const updateQuantity = (itemId, quantity) => {
        setCart((previousCart) => {
            if (quantity <= 0) {
                return previousCart.filter(
                    (item) => item.id !== itemId
                );
            }

            return previousCart.map((item) =>
                item.id === itemId
                    ? { ...item, quantity }
                    : item
            );
        });
    };

    // Remove one item
    const removeFromCart = (itemId) => {
        setCart((previousCart) =>
            previousCart.filter(
                (item) => item.id !== itemId
            )
        );
    };

    // Clear cart after successful order
    const clearCart = () => {
        setCart([]);
    };

    const cartCount = useMemo(
        () => cart.reduce(
            (total, item) => total + item.quantity,
            0
        ),
        [cart]
    );

    const cartTotal = useMemo(
        () => cart.reduce(
            (total, item) =>
                total + Number(item.price) * item.quantity,
            0
        ),
        [cart]
    );

    return (
        <CartContext.Provider
            value={{
                cart,
                setCart,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
                cartCount,
                cartTotal
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error(
            "useCart must be used inside CartProvider"
        );
    }

    return context;
};
