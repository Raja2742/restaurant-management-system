import "./WaiterStats.css";
function WaiterStats({ tables = [], orders = [] }) {
const occupiedTables = tables.filter(
(table) => table.status === "OCCUPIED"
).length;

const availableTables = tables.filter(
(table) => table.status === "AVAILABLE"
).length;

const activeOrders = orders.filter((order) =>
["PENDING", "ACCEPTED", "PREPARING"].includes(order.status)
).length;

const readyOrders = orders.filter(
(order) => order.status === "READY"
).length;

const stats = [
{
title: "Total Tables",
count: tables.length,
icon: "🪑",
type: "total",
},
{
title: "Occupied Tables",
count: occupiedTables,
icon: "👥",
type: "occupied",
},
{
title: "Available Tables",
count: availableTables,
icon: "🟢",
type: "available",
},
{
title: "Active Orders",
count: activeOrders,
icon: "📋",
type: "active",
},
{
title: "Ready to Serve",
count: readyOrders,
icon: "🍽️",
type: "ready",
},
];

return ( <section className="waiter-stats">
{stats.map((stat) => (
<article
className={`waiter-stats__card waiter-stats__card--${stat.type}`}
key={stat.type}
> <div className="waiter-stats__details"> <p className="waiter-stats__title">{stat.title}</p> <h2 className="waiter-stats__count">{stat.count}</h2> </div>


      <span className="waiter-stats__icon" aria-hidden="true">
        {stat.icon}
      </span>
    </article>
  ))}
</section>


);
}

export default WaiterStats;
