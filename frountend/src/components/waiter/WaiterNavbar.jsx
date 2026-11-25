import { useEffect, useState } from "react";
import "./WaiterNavbar.css";

function WaiterNavbar() {
const [currentTime, setCurrentTime] = useState(new Date());

useEffect(() => {
const timer = setInterval(() => {
setCurrentTime(new Date());
}, 1000);


return () => clearInterval(timer);


}, []);

return ( <nav className="waiter-navbar"> <div className="waiter-navbar__brand"> <div className="waiter-navbar__logo">🍽️</div>


    <div className="waiter-navbar__brand-info">
      <h2>Restaurant Service</h2>
      <p>Waiter Dashboard</p>
    </div>
  </div>

  <div className="waiter-navbar__right">
    <div className="waiter-navbar__datetime">
      <span className="waiter-navbar__date">
        {currentTime.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </span>

      <span className="waiter-navbar__time">
        {currentTime.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </span>
    </div>

    <div className="waiter-navbar__status">
      <span className="waiter-navbar__status-dot" />
      Service Active
    </div>
  </div>
</nav>


);
}

export default WaiterNavbar;
