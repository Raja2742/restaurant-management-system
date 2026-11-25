import {
Eye,
Pencil,
Trash2,
ChevronLeft,
ChevronRight,
Inbox,
LoaderCircle,
} from "lucide-react";

import "./AdminDataTable.css";

const AdminDataTable = ({
columns = [],
data = [],
loading = false,
emptyMessage = "No records found.",
getRowKey = (row, index) => row.id ?? index,
actions = [],
currentPage = 1,
totalPages = 1,
onPageChange = () => {},
}) => {
const getValue = (row, column) => {
if (column.render) {
return column.render(row);
}


return column.accessor
  ?.split(".")
  .reduce((value, key) => value?.[key], row) ?? "-";


};

const getActionIcon = (action) => {
switch (action.icon) {
case "view":
return <Eye size={16} />;
case "edit":
return <Pencil size={16} />;
case "delete":
return <Trash2 size={16} />;
default:
return null;
}
};

return ( 
<div className="admin-data-table-container"> 
<div className="admin-data-table-scroll"> 
<table className="admin-data-table"> 
      <thead>
  <tr>
    {columns.map((column) => (
      <th key={column.key}>{column.header}</th>
    ))}
    {actions.length > 0 && (
      <th className="admin-table-actions-heading">
        Actions
      </th>
    )}
  </tr>
</thead>
      <tbody>
        {loading ? (
          <tr>
            <td
              colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
              className="admin-table-state-cell"
            >
              <LoaderCircle
                size={26}
                className="admin-table-spinner"
              />
              <span>Loading records...</span>
            </td>
          </tr>
        ) : data.length === 0 ? (
          <tr>
            <td
              colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
              className="admin-table-state-cell"
            >
              <Inbox size={30} />
              <span>{emptyMessage}</span>
            </td>
          </tr>
        ) : (
          data.map((row, index) => (
            <tr key={getRowKey(row, index)}>
              {columns.map((column) => (
                <td key={column.key}>
                  {getValue(row, column)}
                </td>
              ))}

              {actions.length > 0 && (
                <td className="admin-table-actions">
                  {actions.map((action) => (
                    <button
                      key={action.label}
                      type="button"
                      className={`admin-table-action-button ${action.variant ?? ""}`}
                      onClick={() => action.onClick(row)}
                      title={action.label}
                      aria-label={`${action.label} record`}
                      disabled={action.disabled?.(row) ?? false}
                    >
                      {getActionIcon(action)}
                      {action.showLabel && (
                        <span>{action.label}</span>
                      )}
                    </button>
                  ))}
                </td>
              )}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>

  {!loading && data.length > 0 && totalPages > 1 && (
    <div className="admin-table-pagination">
      <span className="admin-table-page-info">
        Page {currentPage} of {totalPages}
      </span>

      <div className="admin-table-page-controls">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )}
</div>


);
};

export default AdminDataTable;
