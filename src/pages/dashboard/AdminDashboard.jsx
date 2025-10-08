import React, { useEffect, useState } from "react";
import { useInventory } from "../../context/InventoryContext";
import { useDispatch } from "../../context/DispatchContext";
import { useShop } from "../../context/ShopContext";
import { useProduct } from "../../context/ProductContext";
import { useEmployee } from "../../context/EmployeeContext";
import { useUser } from "../../context/UserContext";
import { Link } from "react-router-dom";
import {
  BuildingStorefrontIcon,
  CubeIcon,
  TruckIcon,
  UsersIcon,
  UserGroupIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const AdminDashboard = () => {
  const { inventories } = useInventory();
  const { dispatches } = useDispatch();
  const { shops } = useShop();
  const { products } = useProduct();
  const { employees } = useEmployee();
  const { users } = useUser();

  const [stats, setStats] = useState({
    totalShops: 0,
    totalProducts: 0,
    totalInventory: 0,
    totalDispatches: 0,
    pendingDispatches: 0,
    totalEmployees: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    // Calculate stats
    const totalInventory = inventories.reduce(
      (sum, inv) => sum + inv.quantity,
      0
    );
    const pendingDispatches = dispatches.filter(
      (d) => d.status === "PENDING"
    ).length;

    setStats({
      totalShops: shops.length,
      totalProducts: products.length,
      totalInventory,
      totalDispatches: dispatches.length,
      pendingDispatches,
      totalEmployees: employees.length,
      totalUsers: users.length,
    });
  }, [inventories, dispatches, shops, products, employees, users]);

  const StatCard = ({ title, value, icon: Icon, color, link }) => (
    <Link
      to={link}
      className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${color} border-l-4`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
    </Link>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome to the Inventory Management System
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Shops"
          value={stats.totalShops}
          icon={BuildingStorefrontIcon}
          color="border-blue-500"
          link="/shop"
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={CubeIcon}
          color="border-green-500"
          link="/product"
        />
        <StatCard
          title="Total Inventory"
          value={stats.totalInventory}
          icon={ChartBarIcon}
          color="border-purple-500"
          link="/inventory"
        />
        <StatCard
          title="Total Dispatches"
          value={stats.totalDispatches}
          icon={TruckIcon}
          color="border-orange-500"
          link="/dispatch"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Pending Dispatches"
          value={stats.pendingDispatches}
          icon={TruckIcon}
          color="border-yellow-500"
          link="/dispatch"
        />
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={UsersIcon}
          color="border-indigo-500"
          link="/employee"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={UserGroupIcon}
          color="border-pink-500"
          link="/user"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/shop/create-shop"
            className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            <BuildingStorefrontIcon className="h-6 w-6 mx-auto mb-2" />
            Add New Shop
          </Link>
          <Link
            to="/product/create-product"
            className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors text-center"
          >
            <CubeIcon className="h-6 w-6 mx-auto mb-2" />
            Add New Product
          </Link>
          <Link
            to="/inventory/create-inventory"
            className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors text-center"
          >
            <ChartBarIcon className="h-6 w-6 mx-auto mb-2" />
            Add Inventory
          </Link>
          <Link
            to="/dispatch/create-dispatch"
            className="bg-orange-600 text-white p-4 rounded-lg hover:bg-orange-700 transition-colors text-center"
          >
            <TruckIcon className="h-6 w-6 mx-auto mb-2" />
            Create Dispatch
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Dispatches</h2>
        <div className="space-y-3">
          {dispatches.slice(0, 5).map((dispatch) => (
            <div
              key={dispatch.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded"
            >
              <div>
                <p className="font-medium">{dispatch.dispatchReference}</p>
                <p className="text-sm text-gray-600">
                  {dispatch.sourceShopName} → {dispatch.destinationShopName}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded ${
                    dispatch.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : dispatch.status === "RECIEVED"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {dispatch.status}
                </span>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(dispatch.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
          {dispatches.length === 0 && (
            <p className="text-gray-500 text-center py-4">No dispatches yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
