import "./TableCard.css";

function TableCard({
    table,
    onSelectTable,
    onReleaseTable,
    onRequestBill,
    isReleasing,
    isRequestingBill
}) {
    const tableNumber = table?.tableNumber ?? table?.id ?? "N/A";
    const status = table?.status ?? "UNKNOWN";

    const statusClass = status.toLowerCase().replace(/\s+/g, "-");

    const handleSelect = () => {
        if (onSelectTable) {
            onSelectTable(table);
        }
    };

    const handleRelease = () => {
        if (!table.activeSessionId) {
            alert("No active session found for this table.");
            return;
        }

        onReleaseTable(table);
    };

    const handleRequestBill = () => {
        if (!table.activeSessionId) {
            alert("No active session found for this table.");
            return;
        }

        onRequestBill(table);
    };

    return (
        <article className={`table-card table-card--${statusClass}`}>

            <div className="table-card__header">
                <div className="table-card__icon" aria-hidden="true">
                    🪑
                </div>

                <span className={`table-card__status table-card__status--${statusClass}`}>
                    {status.replace(/_/g, " ")}
                </span>
            </div>

            <div className="table-card__body">

                <h3 className="table-card__number">
                    Table {tableNumber}
                </h3>

                <p className="table-card__description">
                    {status === "AVAILABLE"
                        ? "Ready for customers"
                        : status === "OCCUPIED"
                            ? "Customers seated"
                            : status === "WAITING_FOR_BILL"
                                ? "Waiting for bill"
                                : "Table status unavailable"}
                </p>

                {table?.capacity != null && (
                    <p className="table-card__capacity">
                        Capacity: {table.capacity} people
                    </p>
                )}

                {table?.currentOrderNumber && (
                    <p className="table-card__order">
                        Order: #{table.currentOrderNumber}
                    </p>
                )}

            </div>

            <button
                type="button"
                className="table-card__button"
                onClick={handleSelect}
                disabled={!onSelectTable}
            >
                View Table
            </button>

            {status === "OCCUPIED" && (
                <>
                    <button
                        type="button"
                        className="table-card__bill-button"
                        onClick={handleRequestBill}
                        disabled={
                            !table.activeSessionId ||
                            !onRequestBill ||
                            isRequestingBill
                        }
                    >
                        {isRequestingBill ? "Requesting..." : "Request Bill"}
                    </button>

                    <button
                        type="button"
                        className="table-card__release-button"
                        onClick={handleRelease}
                        disabled={
                            !table.activeSessionId ||
                            !onReleaseTable ||
                            isReleasing
                        }
                    >
                        {isReleasing ? "Releasing..." : "Release Table"}
                    </button>
                </>
            )}

            {status === "WAITING_FOR_BILL" && (
                <button
                    type="button"
                    className="table-card__bill-button"
                    disabled
                >
                    Bill Requested
                </button>
            )}

        </article>
    );
}

export default TableCard;