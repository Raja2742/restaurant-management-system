import MenuCard from "./MenuCard";
import "./MenuGrid.css";

export default function MenuGrid({
    items = [],
    cart = [],
    onAddToCart,
    onUpdateQuantity,
}) {
    if (items.length === 0) {
        return (
            <div className="menu-grid-empty">
                <h3>No dishes found</h3>
                <p>Try another search or category.</p>
            </div>
        );
    }

    return (
        <div className="food-grid">
            {items.map((item) => {
                const cartItem = cart.find(
                    (entry) => entry.id === item.id
                );

                return (
                    <MenuCard
                        key={item.id}
                        item={item}
                        cartItem={cartItem}
                        onAddToCart={onAddToCart}
                        onUpdateQuantity={onUpdateQuantity}
                    />
                );
            })}
        </div>
    );
}