import { useEffect } from "react";
import {
CheckCircle2,
XCircle,
AlertTriangle,
Info,
X,
} from "lucide-react";

import "./AdminToast.css";

const toastConfig = {
success: {
icon: CheckCircle2,
title: "Success",
},
error: {
icon: XCircle,
title: "Error",
},
warning: {
icon: AlertTriangle,
title: "Warning",
},
info: {
icon: Info,
title: "Information",
},
};

const AdminToast = ({
isOpen = false,
type = "success",
message = "",
title,
duration = 3000,
onClose = () => {},
}) => {
useEffect(() => {
if (!isOpen || duration <= 0) return;


const timer = setTimeout(() => {
  onClose();
}, duration);

return () => clearTimeout(timer);


}, [isOpen, duration, onClose]);

if (!isOpen || !message) return null;

const config = toastConfig[type] ?? toastConfig.info;
const Icon = config.icon;

return (
<div
className={`admin-toast admin-toast-${type in toastConfig ? type : "info"}`}
role={type === "error" ? "alert" : "status"}
aria-live={type === "error" ? "assertive" : "polite"}
> <div className="admin-toast-icon"> <Icon size={22} /> </div>


  <div className="admin-toast-content">
    <strong>{title || config.title}</strong>
    <p>{message}</p>
  </div>

  <button
    type="button"
    className="admin-toast-close"
    onClick={onClose}
    aria-label="Close notification"
  >
    <X size={18} />
  </button>
</div>


);
};

export default AdminToast;
