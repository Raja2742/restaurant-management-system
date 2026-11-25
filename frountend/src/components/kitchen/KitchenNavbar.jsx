import { useEffect, useState } from "react";
import "./KitchenNavbar.css";

function KitchenNavbar() {
const [currentTime, setCurrentTime] = useState(new Date());

useEffect(() => {
const timer = setInterval(() => {
setCurrentTime(new Date());
}, 1000);


return () => clearInterval(timer);


}, []);

return ( <nav className="kitchen-navbar"> <div className="kitchen-navbar__brand"> <div className="kitchen-navbar__logo">🍳</div>


    <div className="kitchen-navbar__brand-info">
      <h2>Kitchen Panel</h2>
      <p>Order Management System</p>
    </div>
  </div>

  <div className="kitchen-navbar__right">
    <div className="kitchen-navbar__datetime">
      <span className="kitchen-navbar__date">
        {currentTime.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </span>

      <span className="kitchen-navbar__time">
        {currentTime.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </span>
    </div>

    <div className="kitchen-navbar__status">
      <span className="kitchen-navbar__status-dot" />
      Kitchen Active
    </div>
  </div>
</nav>


);
}

export default KitchenNavbar;
