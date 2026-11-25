import { Search, RotateCcw, SlidersHorizontal } from "lucide-react";
import "./AdminSearchFilter.css";

const AdminSearchFilter = ({
searchTerm = "",
onSearchChange = () => {},
searchPlaceholder = "Search...",
filters = [],
onFilterChange = () => {},
onReset = () => {},
showReset = true,
}) => {
const handleReset = () => {
onSearchChange("");


filters.forEach((filter) => {
  onFilterChange(filter.name, "");
});

onReset();


};

return ( <div className="admin-search-filter"> <div className="admin-search-box"> <Search size={19} className="admin-search-icon" />


    <input
      type="text"
      value={searchTerm}
      placeholder={searchPlaceholder}
      onChange={(event) => onSearchChange(event.target.value)}
      aria-label={searchPlaceholder}
    />
  </div>

  {filters.length > 0 && (
    <div className="admin-filter-group">
      <SlidersHorizontal size={18} className="admin-filter-icon" />

      {filters.map((filter) => (
        <select
          key={filter.name}
          value={filter.value ?? ""}
          onChange={(event) =>
            onFilterChange(filter.name, event.target.value)
          }
          aria-label={filter.label}
          className="admin-filter-select"
        >
          <option value="">{filter.label}</option>

          {filter.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ))}
    </div>
  )}

  {showReset && (
    <button
      type="button"
      className="admin-reset-button"
      onClick={handleReset}
    >
      <RotateCcw size={16} />
      <span>Reset</span>
    </button>
  )}
</div>


);
};

export default AdminSearchFilter;
