import React, { useState, useMemo } from "react";
import { useShop } from "../../context/ShopContext";
import TitleHeader from "../../components/common/TitleHeader";
import { useProduct } from "../../context/ProductContext";
import { useInventory } from "../../context/InventoryContext";
import { Link } from "react-router-dom";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const Inventory = () => {
  const { shops } = useShop();
  const { products } = useProduct();
  const {
    inventories,
    loading: inventoryLoading,
    deleteInventory,
  } = useInventory();

  const [shopFilter, setShopFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredInventories = useMemo(() => {
    return inventories.filter((inventory) => {
      const shopMatch = !shopFilter || inventory.shopId === shopFilter;
      const statusMatch =
        !statusFilter || getStatus(inventory.quantity) === statusFilter;
      return shopMatch && statusMatch;
    });
  }, [inventories, shopFilter, statusFilter]);

  const getStatus = (quantity) => {
    if (quantity === 0) return "Out of Stock";
    if (quantity < 10) return "Low Stock";
    return "In Stock";
  };

  const getStatusBadge = (quantity) => {
    const status = getStatus(quantity);
    const styles = {
      "Out of Stock": "bg-red-100 text-red-800",
      "Low Stock": "bg-yellow-100 text-yellow-800",
      "In Stock": "bg-green-100 text-green-800",
    };
    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded ${
          styles[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div>
      <TitleHeader
        title=" Inventory"
        pageTitle="Inventory Management"
        linkTitle="New Inventory Item"
        linkTo="/inventory/create-inventory"
      />

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Filter by Shop
            </label>
            <select
              value={shopFilter}
              onChange={(e) => setShopFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Shops</option>
              {shops.map((shop) => (
                <option key={shop.id} value={shop.id}>
                  {shop.name} - {shop.shopType}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setShopFilter("");
                setStatusFilter("");
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <table className="w-full border-collapse bg-white rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3 border-b">Shop</th>
            <th className="p-3 border-b">Product</th>
            <th className="p-3 border-b">Quantity</th>
            <th className="p-3 border-b">Status</th>
            <th className="p-3 border-b">Last Updated</th>
            <th className="p-3 border-b text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredInventories.map((inventory) => (
            <tr key={inventory.id} className="hover:bg-gray-50">
              <td className="p-3 border-b">
                {shops.find((shop) => shop.id === inventory.shopId)?.name ||
                  "Unknown"}
              </td>
              <td className="p-3 border-b">
                {products.find((product) => product.id === inventory.productId)
                  ?.productName || "Unknown"}
              </td>
              <td className="p-3 border-b font-semibold">
                {inventory.quantity}
              </td>
              <td className="p-3 border-b">
                {getStatusBadge(inventory.quantity)}
              </td>
              <td className="p-3 border-b text-sm text-gray-600">
                {new Date(inventory.lastUpdated).toLocaleDateString()}
              </td>
              <td className="p-3 border-b text-center">
                <div className="flex justify-center gap-2">
                  <Link
                    to={`/inventory/${inventory.id}`}
                    className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                  >
                    <PencilIcon className="h-4 w-4" />
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteInventory(inventory.id)}
                    className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {filteredInventories.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center p-4 text-gray-500">
                {inventories.length === 0
                  ? "No inventories found"
                  : "No inventories match the current filters"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Inventory;
