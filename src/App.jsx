import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import Product from "./pages/product/Product";
import User from "./pages/user/User";
import Employee from "./pages/employee/Employee";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Layout from "./components/common/Layout";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import ShopDashboard from "./pages/dashboard/ShopDashboard";
import ShopManagement from "./pages/shop/ShopManagement";
import ShopForm from "./pages/shop/ShopForm";
import EmployeeForm from "./pages/employee/EmployeeForm";
import Category from "./pages/category/Category";
import ProductForm from "./pages/product/ProductForm";
import UserForm from "./pages/user/UserForm";
import Dispatch from "./pages/dispatch/Dispatch";
import DispatchProducts from "./pages/dispatch/DispatchProducts";
import Inventory from "./pages/inventory/Inventory";
import InventoryForm from "./pages/inventory/InventoryForm";
import WorkshopDashboard from "./pages/dashboard/WorkshopDashboard";
import WorkshopManagement from "./pages/workshop/WorkshopManagement";
import WorkshopForm from "./pages/workshop/WorkshopForm";
import Profile from "./pages/profile/Profile";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboard Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "CEO"]}>
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/workshop-dashboard"
          element={
            <ProtectedRoute allowedRoles={["WORKSHOP_MANAGER"]}>
              <Layout>
                <WorkshopDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/shop-dashboard"
          element={
            <ProtectedRoute allowedRoles={["SHOP_MANAGER"]}>
              <Layout>
                <ShopDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        {/* Product Routes */}
        <Route
          path="/product"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "CEO", "WORKSHOP_MANAGER"]}>
              <Layout>
                <Product />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/create-product"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "CEO", "WORKSHOP_MANAGER"]}>
              <Layout>
                <ProductForm />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "CEO", "WORKSHOP_MANAGER"]}>
              <Layout>
                <ProductForm />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* User Routes */}
        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "CEO"]}>
              <Layout>
                <User />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/create-user"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "CEO"]}>
              <Layout>
                <UserForm />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/create-user/:userId"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "CEO"]}>
              <Layout>
                <UserForm />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Shop Routes */}
        <Route
          path="/shop"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "CEO"]}>
              <Layout>
                <ShopManagement />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/shop/create-shop"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "CEO"]}>
              <Layout>
                <ShopForm />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/shop/:id"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "CEO"]}>
              <Layout>
                <ShopForm />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Workshop Routes */}
        <Route
          path="/workshop"
          element={
            <ProtectedRoute allowedRoles={["WORKSHOP_MANAGER"]}>
              <Layout>
                <WorkshopManagement />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/workshop/create-workshop"
          element={
            <ProtectedRoute allowedRoles={["WORKSHOP_MANAGER"]}>
              <Layout>
                <WorkshopForm />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/workshop/:id"
          element={
            <ProtectedRoute allowedRoles={["WORKSHOP_MANAGER"]}>
              <Layout>
                <WorkshopForm />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Employee Routes */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "CEO"]}>
              <Layout>
                <Employee />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/create-employee"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "CEO"]}>
              <Layout>
                <EmployeeForm />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/:employeeId"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "CEO"]}>
              <Layout>
                <EmployeeForm />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Category Routes */}
        <Route
          path="/category"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "CEO", "WORKSHOP_MANAGER"]}>
              <Layout>
                <Category />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Dispatch Routes */}
        <Route
          path="/dispatch"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ADMIN",
                "CEO",
                "WORKSHOP_MANAGER",
                "SHOP_MANAGER",
              ]}
            >
              <Layout>
                <Dispatch />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dispatch/create-dispatch"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ADMIN",
                "CEO",
                "WORKSHOP_MANAGER",
                "SHOP_MANAGER",
              ]}
            >
              <Layout>
                <DispatchProducts />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Inventory Routes */}
        <Route
          path="/inventory"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ADMIN",
                "CEO",
                "WORKSHOP_MANAGER",
                "SHOP_MANAGER",
              ]}
            >
              <Layout>
                <Inventory />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory/create-inventory"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ADMIN",
                "CEO",
                "WORKSHOP_MANAGER",
                "SHOP_MANAGER",
              ]}
            >
              <Layout>
                <InventoryForm />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory/:id"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ADMIN",
                "CEO",
                "WORKSHOP_MANAGER",
                "SHOP_MANAGER",
              ]}
            >
              <Layout>
                <InventoryForm />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Profile Route */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ADMIN",
                "CEO",
                "WORKSHOP_MANAGER",
                "SHOP_MANAGER",
                "USER",
              ]}
            >
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Shop Dashboard */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
