import TableCard from "./TableCard";
import "./TableGrid.css";

function TableGrid({
    tables = [],
    onSelectTable,
    onReleaseTable,
    onRequestBill,
    releasingTableId,
    requestingBillSessionId
}) {

    return (
        <section className="table-grid-section">

            <div className="table-grid-section__header">

                <div>
                    <h2 className="table-grid-section__title">
                        Restaurant Tables
                    </h2>

                    <p className="table-grid-section__subtitle">
                        View table availability and customer occupancy.
                    </p>
                </div>

                <span className="table-grid-section__count">
                    {tables.length} {tables.length === 1 ? "Table" : "Tables"}
                </span>

            </div>

            {tables.length === 0 ? (

                <div className="table-grid-section__empty">
                    <span className="table-grid-section__empty-icon">
                        🪑
                    </span>

                    <h3>No tables available</h3>

                    <p>Restaurant tables will appear here when available.</p>
                </div>

            ) : (

                <div className="table-grid">

                    {tables.map((table) => (
                        <TableCard
                            key={table.id ?? table.tableId ?? table.tableNumber}
                            table={table}
                            onSelectTable={onSelectTable}
                            onReleaseTable={onReleaseTable}
                            onRequestBill={onRequestBill}
                            isReleasing={releasingTableId === table.id}
                            isRequestingBill={
                                requestingBillSessionId === table.activeSessionId
                            }
                        />
                    ))}

                </div>

            )}

        </section>
    );
}

export default TableGrid;