import "./KitchenStats.css";
function KitchenStats({ orders = [] }) {
const totalOrders = orders.length;

const pendingOrders = orders.filter(
(order) => order.status === "PLACED"
).length;

const preparingOrders = orders.filter(
(order) => order.status === "PREPARING"
).length;

const readyOrders = orders.filter(
(order) => order.status === "READY"
).length;

const stats = [
{
title: "Total Orders",
count: totalOrders,
icon: "📋",
type: "total",
},
{
title: "Pending Orders",
count: pendingOrders,
icon: "⏳",
type: "pending",
},
{
title: "Preparing",
count: preparingOrders,
icon: "👨‍🍳",
type: "preparing",
},
{
title: "Ready to Serve",
count: readyOrders,
icon: "✅",
type: "ready",
},
];

return ( <section className="kitchen-stats">
{stats.map((stat) => (
<article
className={`kitchen-stats__card kitchen-stats__card--${stat.type}`}
key={stat.type}
> <div className="kitchen-stats__details"> <p className="kitchen-stats__title">{stat.title}</p> <h2 className="kitchen-stats__count">{stat.count}</h2> </div>


      <span className="kitchen-stats__icon" aria-hidden="true">
        {stat.icon}
      </span>
    </article>
  ))}
</section>


);
}

export default KitchenStats;
