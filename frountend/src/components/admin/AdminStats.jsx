import {
Armchair,
Tags,
UtensilsCrossed,
Users,
TrendingUp,
} from "lucide-react";

import "./AdminStats.css";

function AdminStats({
totalTables = 0,
totalCategories = 0,
totalMenuItems = 0,
totalStaff = 0,
}) {
const stats = [
{
id: "tables",
title: "Total Tables",
value: totalTables,
icon: Armchair,
description: "Restaurant seating",
color: "purple",
},
{
id: "categories",
title: "Menu Categories",
value: totalCategories,
icon: Tags,
description: "Food categories",
color: "blue",
},
{
id: "menu-items",
title: "Menu Items",
value: totalMenuItems,
icon: UtensilsCrossed,
description: "Dishes and drinks",
color: "orange",
},
{
id: "staff",
title: "Total Staff",
value: totalStaff,
icon: Users,
description: "Restaurant team",
color: "green",
},
];

return ( <section className="admin-stats-grid">
{stats.map((stat) => {
const Icon = stat.icon;


    return (
      <article className="admin-stat-card" key={stat.id}>
        <div className="admin-stat-card-top">
          <div className={`admin-stat-icon admin-stat-${stat.color}`}>
            <Icon size={22} strokeWidth={1.9} />
          </div>

          <div className="admin-stat-trend">
            <TrendingUp size={14} />
            <span>Overview</span>
          </div>
        </div>

        <div className="admin-stat-content">
          <p>{stat.title}</p>
          <h2>{stat.value.toLocaleString("en-IN")}</h2>
          <span>{stat.description}</span>
        </div>
      </article>
    );
  })}
</section>


);
}

export default AdminStats;
