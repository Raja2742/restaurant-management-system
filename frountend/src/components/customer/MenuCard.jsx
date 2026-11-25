import { getImageUrl, handleFoodImageError } from "../../utils/imageUtils";
import "./MenuCard.css";

export default function MenuCard({
    item,
    cartItem,
    onAddToCart,
    onUpdateQuantity,
}) {
    return (
        <article className="food-card">

            {/* Food Image */}
            <div className="food-image-wrapper">
                <img
                    className="food-image"
                    src={getImageUrl(item.imageUrl)}
                    alt={item.name}
                    loading="lazy"
                    onError={handleFoodImageError}
                />

                {item.categoryName && (
                    <span className="food-category">
                        {item.categoryName}
                    </span>
                )}
            </div>

            {/* Food Details */}
            <div className="food-card-content">
                <h3>{item.name}</h3>

                <p className="food-description">
                    {item.description ||
                        "Freshly prepared and full of flavour."}
                </p>

                {/* Price and Actions */}
                <div className="food-card-footer">
                    <span className="food-price">
                        ₹{Number(item.price || 0).toFixed(2)}
                    </span>

                    {cartItem ? (
                        <div className="quantity-control">
                            <button
                                type="button"
                                onClick={() =>
                                    onUpdateQuantity(item.id, -1)
                                }
                                aria-label={`Remove one ${item.name}`}
                            >
                                −
                            </button>

                            <span>{cartItem.quantity}</span>

                            <button
                                type="button"
                                onClick={() =>
                                    onUpdateQuantity(item.id, 1)
                                }
                                aria-label={`Add one ${item.name}`}
                            >
                                +
                            </button>
                        </div>
                    ) : (
                        <button
                            className="add-button"
                            type="button"
                            onClick={() => onAddToCart(item)}
                        >
                            + Add
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
}