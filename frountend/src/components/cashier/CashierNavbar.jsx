import { useEffect, useState } from "react";
import "./CashierNavbar.css";

const CashierNavbar = () => {
const [currentTime, setCurrentTime] = useState(new Date());

useEffect(() => {
const timer = setInterval(() => {
setCurrentTime(new Date());
}, 1000);


return () => clearInterval(timer);


}, []);

const formattedTime = currentTime.toLocaleTimeString("en-IN", {
hour: "2-digit",
minute: "2-digit",
second: "2-digit",
hour12: true,
});

const formattedDate = currentTime.toLocaleDateString("en-IN", {
weekday: "short",
day: "2-digit",
month: "short",
year: "numeric",
});

return ( <header className="cashier-navbar"> <div className="cashier-navbar-brand"> <div className="cashier-brand-icon" aria-hidden="true">
₹ </div>


    <div className="cashier-brand-text">
      <h2>Restaurant POS</h2>
      <span>Cashier Management</span>
    </div>
  </div>

  <div className="cashier-navbar-center">
    <span className="cashier-dashboard-label">
      CASHIER DASHBOARD
    </span>

    <span className="cashier-navbar-subtitle">
      Payments &amp; Billing
    </span>
  </div>

  <div className="cashier-navbar-right">
    <div className="cashier-live-indicator">
      <span className="cashier-live-dot" />
      <span>Cashier Portal</span>
    </div>

    <div className="cashier-clock">
      <span className="cashier-clock-time">
        {formattedTime}
      </span>

      <span className="cashier-clock-date">
        {formattedDate}
      </span>
    </div>
  </div>
</header>


);
};

export default CashierNavbar;
