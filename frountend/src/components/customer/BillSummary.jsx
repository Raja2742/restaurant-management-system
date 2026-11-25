import "./BillSummary.css";

const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toFixed(2)}`;
};

const BillSummary = ({
    items = [],
    subtotal = 0,
    taxAmount = 0,
    serviceCharge = 0,
    discount = 0,
    totalAmount = 0
}) => {
    return (
        <div className="bill-summary">
            <div className="bill-summary-header">
                <h2>Bill Summary</h2>
                <p>Review your order before payment</p>
            </div>

            <div className="bill-items">
                {items.length > 0 ? (
                    items.map((item, index) => (
                        <div className="bill-item" key={item.id || index}>
                            <div className="bill-item-details">
                                <h4>{item.menuItemName || item.name}</h4>
                                <p>
                                    {item.quantity} ×{" "}
                                    {formatCurrency(item.price)}
                                </p>
                            </div>

                            <span className="bill-item-total">
                                {formatCurrency(
                                    item.subtotal ??
                                    item.quantity * item.price
                                )}
                            </span>
                        </div>
                    ))
                ) : (
                    <p className="bill-empty">
                        No items available in this bill.
                    </p>
                )}
            </div>

            <div className="bill-calculations">
                <div className="bill-calculation-row">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                </div>

                {Number(taxAmount) > 0 && (
                    <div className="bill-calculation-row">
                        <span>Tax</span>
                        <span>{formatCurrency(taxAmount)}</span>
                    </div>
                )}

                {Number(serviceCharge) > 0 && (
                    <div className="bill-calculation-row">
                        <span>Service Charge</span>
                        <span>{formatCurrency(serviceCharge)}</span>
                    </div>
                )}

                {Number(discount) > 0 && (
                    <div className="bill-calculation-row bill-discount">
                        <span>Discount</span>
                        <span>-{formatCurrency(discount)}</span>
                    </div>
                )}
            </div>

            <div className="bill-grand-total">
                <span>Total Amount</span>
                <strong>{formatCurrency(totalAmount)}</strong>
            </div>
        </div>
    );
};

export default BillSummary;