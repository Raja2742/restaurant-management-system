import { AlertTriangle, X, LoaderCircle, Trash2 } from "lucide-react";
import "./AdminConfirmationModal.css";

const AdminConfirmationModal = ({
isOpen = false,
onClose = () => {},
onConfirm = () => {},
title = "Are you sure?",
message = "This action cannot be undone.",
itemName = "",
confirmText = "Delete",
cancelText = "Cancel",
loading = false,
variant = "danger",
}) => {
if (!isOpen) return null;

const handleConfirm = async () => {
if (loading) return;
await onConfirm();
};

const handleBackdropClick = (event) => {
if (event.target === event.currentTarget && !loading) {
onClose();
}
};

return ( <div
   className="admin-confirmation-backdrop"
   onMouseDown={handleBackdropClick}
 > <div
     className="admin-confirmation-modal"
     role="alertdialog"
     aria-modal="true"
     aria-labelledby="admin-confirmation-title"
     aria-describedby="admin-confirmation-message"
   > <button
       type="button"
       className="admin-confirmation-close"
       onClick={onClose}
       disabled={loading}
       aria-label="Close confirmation dialog"
     > <X size={19} /> </button>


    <div className={`admin-confirmation-icon ${variant}`}>
      <AlertTriangle size={27} />
    </div>

    <h2 id="admin-confirmation-title">{title}</h2>

    <p id="admin-confirmation-message">{message}</p>

    {itemName && (
      <div className="admin-confirmation-item">
        <span>Selected item</span>
        <strong>{itemName}</strong>
      </div>
    )}

    <div className="admin-confirmation-actions">
      <button
        type="button"
        className="admin-confirmation-cancel"
        onClick={onClose}
        disabled={loading}
      >
        {cancelText}
      </button>

      <button
        type="button"
        className={`admin-confirmation-confirm ${variant}`}
        onClick={handleConfirm}
        disabled={loading}
      >
        {loading ? (
          <LoaderCircle
            size={17}
            className="admin-confirmation-spinner"
          />
        ) : (
          <Trash2 size={17} />
        )}

        {loading ? "Please wait..." : confirmText}
      </button>
    </div>
  </div>
</div>


);
};

export default AdminConfirmationModal;
