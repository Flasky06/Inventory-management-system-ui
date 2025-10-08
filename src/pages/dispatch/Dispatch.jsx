import React, { useState, useMemo } from "react";
import { useDispatch } from "../../context/DispatchContext";
import TitleHeadComponent from "../../components/common/TitleHeader";
import { useProduct } from "../../context/ProductContext";
import { useShop } from "../../context/ShopContext";
import { Link } from "react-router-dom";
import {
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const Dispatch = () => {
  const { dispatches, loading, acknowledgeDispatch, cancelDispatch } =
    useDispatch();
  const { products } = useProduct();
  const { shops } = useShop();

  const [statusFilter, setStatusFilter] = useState("");
  const [shopFilter, setShopFilter] = useState("");

  const filteredDispatches = useMemo(() => {
    return dispatches.filter((dispatch) => {
      const statusMatch = !statusFilter || dispatch.status === statusFilter;
      const shopMatch =
        !shopFilter ||
        dispatch.sourceShopId === shopFilter ||
        dispatch.destinationShopId === shopFilter;
      return statusMatch && shopMatch;
    });
  }, [dispatches, statusFilter, shopFilter]);

  const handleAcknowledge = async (dispatchId, accept) => {
    try {
      await acknowledgeDispatch(dispatchId, accept);
      alert(
        accept
          ? "Dispatch accepted successfully"
          : "Dispatch rejected successfully"
      );
    } catch (err) {
      alert("Error acknowledging dispatch: " + err.message);
    }
  };

  const handleCancel = async (dispatchId) => {
    if (window.confirm("Are you sure you want to cancel this dispatch?")) {
      try {
        await cancelDispatch(dispatchId);
        alert("Dispatch cancelled successfully");
      } catch (err) {
        alert("Error cancelling dispatch: " + err.message);
      }
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: "bg-yellow-100 text-yellow-800",
      RECIEVED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
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

  if (loading) return <p className="p-4">Loading dispatches...</p>;

  return (
    <div>
      <TitleHeadComponent
        title="Dispatches"
        pageTitle="Dispatch Management"
        linkTitle="New Dispatch"
        linkTo="/dispatch/create-dispatch"
      />

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <option value="PENDING">Pending</option>
              <option value="RECIEVED">Received</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

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

          <div className="flex items-end">
            <button
              onClick={() => {
                setStatusFilter("");
                setShopFilter("");
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
            <th className="p-3 border-b">Reference</th>
            <th className="p-3 border-b">Source Shop</th>
            <th className="p-3 border-b">Destination Shop</th>
            <th className="p-3 border-b">Products</th>
            <th className="p-3 border-b">Total Items</th>
            <th className="p-3 border-b">Status</th>
            <th className="p-3 border-b">Dispatched At</th>
            <th className="p-3 border-b text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDispatches.map((dispatch) => {
            const sourceShop = shops.find(
              (s) => s.id === dispatch.sourceShopId
            );
            const destinationShop = shops.find(
              (s) => s.id === dispatch.destinationShopId
            );

            // Calculate total items from dispatch items
            const totalItems = dispatch.items.reduce(
              (sum, item) => sum + item.quantity,
              0
            );

            return (
              <tr key={dispatch.id} className="hover:bg-gray-50">
                <td className="p-3 border-b font-mono text-sm">
                  {dispatch.dispatchReference}
                </td>
                <td className="p-3 border-b">
                  {sourceShop?.name || "Unknown"}
                </td>
                <td className="p-3 border-b">
                  {destinationShop?.name || "Unknown"}
                </td>
                <td className="p-3 border-b">
                  <div className="max-w-xs">
                    {dispatch.items.map((item, idx) => {
                      const product = products.find(
                        (p) => p.id === item.productId
                      );
                      return (
                        <div key={idx} className="text-sm">
                          {product?.productName || "Unknown"} ({item.quantity})
                        </div>
                      );
                    })}
                  </div>
                </td>
                <td className="p-3 border-b font-semibold">{totalItems}</td>
                <td className="p-3 border-b">
                  {getStatusBadge(dispatch.status)}
                </td>
                <td className="p-3 border-b text-sm">
                  {new Date(dispatch.dispatchedAt).toLocaleString()}
                </td>
                <td className="p-3 border-b">
                  <div className="flex justify-center gap-2">
                    {dispatch.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => handleAcknowledge(dispatch.id, true)}
                          className="text-green-600 hover:text-green-800"
                          title="Accept Dispatch"
                        >
                          <CheckCircleIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleAcknowledge(dispatch.id, false)}
                          className="text-red-600 hover:text-red-800"
                          title="Reject Dispatch"
                        >
                          <XCircleIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleCancel(dispatch.id)}
                          className="text-orange-600 hover:text-orange-800"
                          title="Cancel Dispatch"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </>
                    )}
                    {dispatch.status !== "PENDING" && (
                      <span className="text-gray-400 text-sm">No actions</span>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
          {filteredDispatches.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center p-4 text-gray-500">
                {dispatches.length === 0
                  ? "No dispatches found"
                  : "No dispatches match the current filters"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Dispatch;
