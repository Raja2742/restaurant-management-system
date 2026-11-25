import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Register from "../pages/auth/Register";

import Login from "../pages/auth/Login";

// import CustomerDashboard
//     from "../pages/customer/CustomerDashboard";

import Customer
    from "../pages/customer/Customer";


import KitchenDashboard
    from "../pages/kitchen/KitchenDashboard";

import WaiterDashboard
    from "../pages/waiter/WaiterDashboard";

import CashierDashboard
    from "../pages/cashier/CashierDashboard";

// import AdminDashboard
//     from "../pages/admin/AdminDashboard";

import ProtectedRoute
    from "./ProtectedRoute";

import AdminLayout from "../pages/admin/AdminLayout"; 
import AdminDashboard from "../pages/admin/AdminDashboard";

import TablesManagement from "../pages/admin/management/TablesManagement";
import CategoriesManagement from "../pages/admin/management/CategoriesManagement";
import MenuManagement from "../pages/admin/management/MenuManagement";
import StaffManagement from "../pages/admin/management/StaffManagement";

import { CartProvider } from "../context/CartContext";
import Checkout from "../pages/customer/Checkout";
import OrderConfirmation from "../pages/customer/OrderConfirmation";
import OrderHistory from "../pages/customer/OrderHistory";
import OrderTracking from "../pages/customer/OrderTracking";
import CustomerProfile from "../components/customer/CustomerProfile";
import { SessionProvider } from "../context/SessionContext";

const AppRoutes = () => {

    return (
        <BrowserRouter>
            <CartProvider>
                <SessionProvider>

            <Routes>


                <Route
                    path="/register"
                    element={<Register />}
                />

                
                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* <Route
                    path="/customerd"
                    element={
                        <ProtectedRoute
                            allowedRoles={["CUSTOMERd"]}
                        >
                            <CustomerDashboard />
                        </ProtectedRoute>
                    }
                /> */}

                {/* Public customer ordering page */}
                <Route
                    path="/customer"
                    element={<Customer />}
                />
                <Route
                    path="/checkout"
                    element={
                        <ProtectedRoute allowedRoles={["CUSTOMER"]}>
                            <Checkout />
                        </ProtectedRoute>
                    }
                />
                <Route
                path="/customer/orders"
                element={
                    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
                        <OrderHistory />
                    </ProtectedRoute>
                }
                />

                <Route
                    path="/customer/orders/:orderId"
                    element={
                        <ProtectedRoute allowedRoles={["CUSTOMER"]}>
                            <OrderTracking />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/customer/profile"
                    element={
                        <ProtectedRoute allowedRoles={["CUSTOMER"]}>
                            <CustomerProfile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/order-confirmation"
                    element={
                        <ProtectedRoute allowedRoles={["CUSTOMER"]}>
                            <OrderConfirmation />
                        </ProtectedRoute>
                    }
                />
                
                    
                <Route
                    path="/kitchen"
                    element={
                        <ProtectedRoute
                            allowedRoles={["KITCHEN"]}
                        >
                            <KitchenDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/waiter"
                    element={
                        <ProtectedRoute
                            allowedRoles={["WAITER"]}
                        >
                            <WaiterDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/cashier"
                    element={
                        <ProtectedRoute
                            allowedRoles={["CASHIER"]}
                        >
                            <CashierDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin"
                        element={
                            <ProtectedRoute allowedRoles={["ADMIN"]}>
                            <AdminLayout />
                            </ProtectedRoute>
                        }
                        >
                        <Route
                            index
                            element={<AdminDashboard />}
                        />

                        <Route path="tables" element={<TablesManagement />} />

                        <Route path="categories"element={<CategoriesManagement />}/>
                        
                        <Route path="menu-items" element={<MenuManagement />} />

                        <Route path="staff" element={<StaffManagement />} />
                    </Route>





                <Route
                    path="/unauthorized"
                    element={
                        <h1>
                            403 - Unauthorized
                        </h1>
                    }
                />

                <Route
                    path="*"
                    element={
                        <Login />
                    }
                />

            </Routes>
            </SessionProvider>
            </CartProvider>
        </BrowserRouter>
    );
};


function AdminPlaceholder({ title }) {
  return (
    <div style={{ padding: "28px" }}>
      <h1>{title}</h1>
      <p>
        This management page is ready to be implemented.
      </p>
    </div>
  );
}
export default AppRoutes;