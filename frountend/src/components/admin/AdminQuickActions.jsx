import {
Armchair,
Tags,
UtensilsCrossed,
UserPlus,
ArrowUpRight,
} from "lucide-react";

import "./AdminQuickActions.css";

function AdminQuickActions({
onAddTable = () => {},
onAddCategory = () => {},
onAddMenuItem = () => {},
onAddStaff = () => {},
}) {
const actions = [
{
id: "table",
title: "Add New Table",
description: "Create a restaurant table",
icon: Armchair,
className: "admin-action-purple",
onClick: onAddTable,
},
{
id: "category",
title: "Add Category",
description: "Organize your menu",
icon: Tags,
className: "admin-action-blue",
onClick: onAddCategory,
},
{
id: "menu-item",
title: "Add Menu Item",
description: "Add a dish or beverage",
icon: UtensilsCrossed,
className: "admin-action-orange",
onClick: onAddMenuItem,
},
{
id: "staff",
title: "Add Staff Member",
description: "Register a team member",
icon: UserPlus,
className: "admin-action-green",
onClick: onAddStaff,
},
];

return ( <section className="admin-quick-actions"> <div className="admin-quick-actions-heading"> <div> <span className="admin-section-eyebrow">SHORTCUTS</span> <h2>Quick Actions</h2> <p>Manage your restaurant from one place.</p> </div> </div>


  <div className="admin-quick-actions-grid">
    {actions.map((action) => {
      const Icon = action.icon;

      return (
        <button
          type="button"
          key={action.id}
          className="admin-action-card"
          onClick={action.onClick}
        >
          <div
            className={`admin-action-icon ${action.className}`}
          >
            <Icon size={23} strokeWidth={1.9} />
          </div>

          <div className="admin-action-content">
            <h3>{action.title}</h3>
            <p>{action.description}</p>
          </div>

          <span className="admin-action-arrow">
            <ArrowUpRight size={18} />
          </span>
        </button>
      );
    })}
  </div>
</section>


);
}

export default AdminQuickActions;
