import { useEffect, useState } from "react";
import { getAllTables } from "../../services/tableService";
import "./TableSelector.css";

export default function TableSelector({ onSelectTable }) {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        async function fetchTables() {
            try {
                const data = await getAllTables();

                if (active) {
                    setTables(data);
                }
            } catch (err) {
                console.error("Failed to load tables:", err);

                if (active) {
                    setError("Unable to load tables. Please try again.");
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        fetchTables();

        return () => {
            active = false;
        };
    }, []);

    if (loading) {
        return (
            <div className="table-selector-message">
                Loading available tables...
            </div>
        );
    }

    if (error) {
        return (
            <div className="table-selector-message">
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>
                    Try again
                </button>
            </div>
        );
    }

    const availableTables = tables.filter(
        (table) => table.status === "AVAILABLE"
    );

    return (
        <section className="table-selector">
            <div className="table-selector-heading">
                <span>WELCOME TO OUR RESTAURANT</span>
                <h1>Select Your Table</h1>
                <p>
                    Choose an available table to explore our menu
                    and place your order.
                </p>
            </div>

            {availableTables.length === 0 ? (
                <div className="table-selector-message">
                    No tables are currently available.
                </div>
            ) : (
                <div className="table-grid">
                    {availableTables.map((table) => (
                        <button
                            type="button"
                            className="table-card"
                            key={table.id}
                            onClick={() => onSelectTable(table)}
                        >
                            <span className="table-icon">♧</span>

                            <h3>{table.tableNumber}</h3>

                            <p>
                                Capacity: {table.capacity} guests
                            </p>

                            <span className="table-available">
                                Available
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
}