import React, { useEffect, useState } from "react";
import { useInventory } from "../../context/InventoryContext";
import { useDispatch } from "../../context/DispatchContext";
import { useShop } from "../../context/ShopContext";
import { useProduct } from "../../context/ProductContext";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import {
  CubeIcon,
  TruckIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const ShopDashboard = () => {
  const { inventories, getInventoryByShop } = useInventory();
  const {
    dispatches,
    getDispatchesByDestinationShop,
    getDispatchesBySourceShop,
  } = useDispatch();
  const { shops } = useShop();
  const { products } = useProduct();
  const { user } = useAuth();

  const [shopInventory, setShopInventory] = useState([]);
  const [incomingDispatches, setIncomingDispatches] = useState([]);
  const [outgoingDispatches, setOutgoingDispatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadShopData = async () => {
      if (!user?.shopId) return;

      try {
        setLoading(true);

        // Get shop inventory
        const inv = await getInventoryByShop(user.shopId);
        setShopInventory(inv || []);

        // Get incoming dispatches (where shop is destination)
        const incoming = await getDispatchesByDestinationShop(user.shopId);
        setIncomingDispatches(incoming || []);

        // Get outgoing dispatches (where shop is source)
        const outgoing = await getDispatchesBySourceShop(user.shopId);
        setOutgoingDispatches(outgoing || []);
      } catch (error) {
        console.error("Error loading shop data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadShopData();
  }, [
    user?.shopId,
    getInventoryByShop,
    getDispatchesByDestinationShop,
    getDispatchesBySourceShop,
  ]);

  const shop = shops.find((s) => s.id === user?.shopId);

  const totalInventory = shopInventory.reduce(
    (sum, inv) => sum + inv.quantity,
    0
  );
  const outOfStockItems = shopInventory.filter((inv) => inv.quantity === 0);
  const lowStockItems = shopInventory.filter(
    (inv) => inv.quantity > 0 && inv.quantity < 10
  );
  const pendingIncoming = incomingDispatches.filter(
    (d) => d.status === "PENDING"
  );

  if (loading) {
    return <div className="p-6">Loading shop dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Shop Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome to {shop?.name || "Shop"} - Manage your inventory and sales
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Inventory
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {totalInventory}
              </p>
            </div>
            <CubeIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Products in Stock
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {shopInventory.length - outOfStockItems.length}
              </p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Pending Deliveries
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {pendingIncoming.length}
              </p>
            </div>
            <ArrowRightIcon className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-3xl font-bold text-gray-900">
                {outOfStockItems.length}
              </p>
            </div>
            <XCircleIcon className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Alerts */}
      {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Inventory Alerts:</strong>
                {lowStockItems.length > 0 &&
                  ` ${lowStockItems.length} items low on stock.`}
                {outOfStockItems.length > 0 &&
                  ` ${outOfStockItems.length} items out of stock.`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/inventory"
            className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            <CubeIcon className="h-6 w-6 mx-auto mb-2" />
            Manage Inventory
          </Link>
          <Link
            to="/dispatch"
            className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors text-center"
          >
            <TruckIcon className="h-6 w-6 mx-auto mb-2" />
            View Dispatches
          </Link>
          <Link
            to="/dispatch/create-dispatch"
            className="bg-orange-600 text-white p-4 rounded-lg hover:bg-orange-700 transition-colors text-center"
          >
            <ArrowLeftIcon className="h-6 w-6 mx-auto mb-2" />
            Send Products
          </Link>
        </div>
      </div>

      {/* Current Inventory */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Current Inventory</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Product</th>
                <th className="text-left p-3">Quantity</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {shopInventory.map((inv) => {
                const product = products.find((p) => p.id === inv.productId);
                const isOutOfStock = inv.quantity === 0;
                const isLowStock = inv.quantity > 0 && inv.quantity < 10;
                return (
                  <tr key={inv.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{product?.productName || "Unknown"}</td>
                    <td className="p-3 font-semibold">{inv.quantity}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          isOutOfStock
                            ? "bg-red-100 text-red-800"
                            : isLowStock
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {isOutOfStock
                          ? "Out of Stock"
                          : isLowStock
                          ? "Low Stock"
                          : "In Stock"}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {new Date(inv.lastUpdated).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
              {shopInventory.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-gray-500">
                    No inventory items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Incoming Dispatches */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Pending Deliveries</h2>
        <div className="space-y-3">
          {pendingIncoming.map((dispatch) => (
            <div
              key={dispatch.id}
              className="flex items-center justify-between p-4 bg-blue-50 rounded-lg"
            >
              <div>
                <p className="font-medium">{dispatch.dispatchReference}</p>
                <p className="text-sm text-gray-600">
                  From: {dispatch.sourceShopName}
                </p>
                <p className="text-sm text-gray-600">
                  Items:{" "}
                  {dispatch.items.reduce((sum, item) => sum + item.quantity, 0)}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm">
                  Accept
                </button>
                <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm">
                  Reject
                </button>
              </div>
            </div>
          ))}
          {pendingIncoming.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No pending deliveries
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopDashboard;
