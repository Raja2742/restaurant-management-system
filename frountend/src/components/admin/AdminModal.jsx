import { useEffect } from "react";
import { X, LoaderCircle } from "lucide-react";
import "./AdminModal.css";

const AdminModal = ({
isOpen = false,
onClose = () => {},
title = "Modal",
subtitle = "",
children,
onSubmit,
submitText = "Save Changes",
cancelText = "Cancel",
loading = false,
size = "medium",
showFooter = true,
}) => {
useEffect(() => {
if (!isOpen) return;


const handleEscape = (event) => {
  if (event.key === "Escape" && !loading) {
    onClose();
  }
};

document.addEventListener("keydown", handleEscape);
document.body.style.overflow = "hidden";

return () => {
  document.removeEventListener("keydown", handleEscape);
  document.body.style.overflow = "";
};


}, [isOpen, loading, onClose]);

if (!isOpen) return null;

const handleBackdropClick = (event) => {
if (event.target === event.currentTarget && !loading) {
onClose();
}
};

const handleSubmit = (event) => {
event.preventDefault();


if (!loading && onSubmit) {
  onSubmit(event);
}


};

return ( <div
   className="admin-modal-backdrop"
   onMouseDown={handleBackdropClick}
 >
<div
className={`admin-modal admin-modal-${size}`}
role="dialog"
aria-modal="true"
aria-labelledby="admin-modal-title"
> <div className="admin-modal-header"> <div> <h2 id="admin-modal-title">{title}</h2>


        {subtitle && (
          <p className="admin-modal-subtitle">{subtitle}</p>
        )}
      </div>

      <button
        type="button"
        className="admin-modal-close"
        onClick={onClose}
        disabled={loading}
        aria-label="Close modal"
      >
        <X size={20} />
      </button>
    </div>

    <form onSubmit={handleSubmit}>
      <div className="admin-modal-body">{children}</div>

      {showFooter && (
        <div className="admin-modal-footer">
          <button
            type="button"
            className="admin-modal-cancel"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </button>

          {onSubmit && (
            <button
              type="submit"
              className="admin-modal-submit"
              disabled={loading}
            >
              {loading && (
                <LoaderCircle
                  size={17}
                  className="admin-modal-spinner"
                />
              )}

              {loading ? "Please wait..." : submitText}
            </button>
          )}
        </div>
      )}
    </form>
  </div>
</div>


);
};

export default AdminModal;
