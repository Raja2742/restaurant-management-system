import React from "react";
import "./WaiterEmptyState.css";

const WaiterEmptyState = ({
title = "Nothing to display",
message = "There is no data available right now.",
icon = "📋",
actionLabel,
onAction,
}) => {
return ( <div className="waiter-empty-state"> <div className="waiter-empty-icon" aria-hidden="true">
{icon} </div>


  <h3>{title}</h3>

  <p>{message}</p>

  {actionLabel && onAction && (
    <button
      type="button"
      className="waiter-empty-action"
      onClick={onAction}
    >
      {actionLabel}
    </button>
  )}
</div>


);
};

export default WaiterEmptyState;
