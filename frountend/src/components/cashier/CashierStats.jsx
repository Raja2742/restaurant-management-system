import "./CashierStats.css";

function CashierStats({ payments = [] }) {
const getPaymentStatus = (payment) =>
String(
payment.status ??
payment.paymentStatus ??
payment.paymentState ??
""
).toUpperCase();

const isCompleted = (payment) =>
["COMPLETED", "PAID", "SUCCESS", "SUCCESSFUL"].includes(
getPaymentStatus(payment)
);

const isPending = (payment) =>
["PENDING", "INITIATED", "PROCESSING"].includes(
getPaymentStatus(payment)
);

const totalPayments = payments.length;

const completedPayments = payments.filter(isCompleted).length;

const pendingPayments = payments.filter(isPending).length;

const totalCollected = payments.reduce((total, payment) => {
if (!isCompleted(payment)) return total;


const amount = Number(
  payment.amount ??
  payment.totalAmount ??
  payment.paidAmount ??
  0
);

return total + (Number.isFinite(amount) ? amount : 0);


}, 0);

const stats = [
{
title: "Total Payments",
value: totalPayments,
icon: "💳",
className: "total",
description: "Payments available"
},
{
title: "Pending Payments",
value: pendingPayments,
icon: "⏳",
className: "pending",
description: "Awaiting completion"
},
{
title: "Completed Payments",
value: completedPayments,
icon: "✅",
className: "completed",
description: "Successfully processed"
},
{
title: "Total Collected",
value: `₹${totalCollected.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`,
icon: "💰",
className: "revenue",
description: "From completed payments"
}
];

return ( <section className="cashier-stats">
{stats.map((stat) => (
<article
className={`cashier-stat-card ${stat.className}`}
key={stat.title}
> <div className="cashier-stat-top"> <span className="cashier-stat-title">{stat.title}</span>


        <span className="cashier-stat-icon" aria-hidden="true">
          {stat.icon}
        </span>
      </div>

      <h2 className="cashier-stat-value">{stat.value}</h2>

      <p className="cashier-stat-description">
        {stat.description}
      </p>
    </article>
  ))}
</section>


);
}

export default CashierStats;
