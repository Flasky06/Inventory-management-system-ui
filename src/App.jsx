import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import Product from "./pages/product/Product";
import User from "./pages/user/User";
import Employee from "./pages/employee/Employee";
import ProtectedRoute from "./component/ProtectedRoute";
import Layout from "./component/Layout";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import WorkshopDashboard from "./pages/dashboard/WorkshopDashboard";
import ShopDashboard from "./pages/dashboard/ShopDashboard";
import ShopManagement from "./pages/shop/ShopManagement";
import ShopManagementForm from "./pages/shop/ShopManagementForm";
import EmployeeForm from "./pages/employee/EmployeeForm";
import UserForm from "./pages/user/UserManagementForm";
import Category from "./pages/category/category";
import ProductManagementForm from "./pages/product/ProductManagementForm";
import UserManagementForm from "./pages/user/UserManagementForm";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        {/* Product Routes */}
        <Route
          path="/product"
          element={
            <Layout>
              <Product />
            </Layout>
          }
        />
        <Route
          path="/product/create-product"
          element={
            <Layout>
              <ProductManagementForm />
            </Layout>
          }
        />
        <Route
          path="/product/:productId"
          element={
            <Layout>
              <ProductManagementForm />
            </Layout>
          }
        />

        {/* User Routes */}
        <Route
          path="/user"
          element={
            <Layout>
              <User />
            </Layout>
          }
        />

        <Route
          path="/user/create-user"
          element={
            <Layout>
              <UserManagementForm />
            </Layout>
          }
        />

        <Route
          path="/user/create-user/:userId"
          element={
            <Layout>
              <UserManagementForm />
            </Layout>
          }
        />

        {/* Shop Routes */}
        <Route
          path="/shop"
          element={
            <Layout>
              <ShopManagement />
            </Layout>
          }
        />

        <Route
          path="/shop/create-shop"
          element={
            <Layout>
              <ShopManagementForm />
            </Layout>
          }
        />

        <Route
          path="/shop/:id"
          element={
            <Layout>
              <ShopManagementForm />
            </Layout>
          }
        />

        {/* Employee Routes */}
        <Route
          path="/employee"
          element={
            <Layout>
              <Employee />
            </Layout>
          }
        />

        <Route
          path="/employee/create-employee"
          element={
            <Layout>
              <EmployeeForm />
            </Layout>
          }
        />

        <Route
          path="/employee/:employeeId"
          element={
            <Layout>
              <EmployeeForm />
            </Layout>
          }
        />

        {/* Category Routes */}
        <Route
          path="/category"
          element={
            <Layout>
              <Category />
            </Layout>
          }
        />

        {/* Workshop Routes */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
