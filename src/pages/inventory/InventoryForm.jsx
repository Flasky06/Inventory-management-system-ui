import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useShop } from "../../context/ShopContext";
import { useInventory } from "../../context/InventoryContext";
import { useProduct } from "../../context/ProductContext";

const InventoryManagementForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getInventoryById,
    createInventory,
    updateInventory,
    setQuantity,
    addInventory,
    reduceInventory,
  } = useInventory();
  const { shops } = useShop();
  const { products } = useProduct();

  const [shopId, setShopId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantityValue] = useState("");
  const [operationQuantity, setOperationQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");

  // Fixed: Properly load inventory data asynchronously
  useEffect(() => {
    const loadInventory = async () => {
      if (id) {
        try {
          setInitialLoading(true);
          const inventory = await getInventoryById(id);
          if (inventory) {
            setShopId(inventory.shopId);
            setProductId(inventory.productId);
            setQuantityValue(inventory.quantity.toString());
          }
        } catch (error) {
          console.error("Error loading inventory:", error);
          setError("Failed to load inventory");
        } finally {
          setInitialLoading(false);
        }
      } else {
        setInitialLoading(false);
      }
    };

    loadInventory();
  }, [id]); // Removed getInventoryById from dependencies

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (id) {
        await updateInventory(id, {
          shopId,
          productId,
          quantity: parseInt(quantity),
        });
      } else {
        await createInventory({
          shopId,
          productId,
          quantity: parseInt(quantity),
        });
      }
      navigate("/inventory");
    } catch (error) {
      setError(error.message || "An error occurred");
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSetQuantity = async () => {
    if (!shopId || !productId || !operationQuantity) {
      alert("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await setQuantity(
        shopId,
        productId,
        parseInt(operationQuantity)
      );
      // Update the main quantity display
      setQuantityValue(result.quantity.toString());
      alert("Quantity set successfully");
      setOperationQuantity("");
    } catch (error) {
      setError(error.message || "An error occurred");
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuantity = async () => {
    if (!shopId || !productId || !operationQuantity) {
      alert("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await addInventory(
        shopId,
        productId,
        parseInt(operationQuantity)
      );
      // Update the main quantity display
      setQuantityValue(result.quantity.toString());
      alert("Quantity added successfully");
      setOperationQuantity("");
    } catch (error) {
      setError(error.message || "An error occurred");
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReduceQuantity = async () => {
    if (!shopId || !productId || !operationQuantity) {
      alert("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await reduceInventory(
        shopId,
        productId,
        parseInt(operationQuantity)
      );
      // Update the main quantity display
      setQuantityValue(result.quantity.toString());
      alert("Quantity reduced successfully");
      setOperationQuantity("");
    } catch (error) {
      setError(error.message || "An error occurred");
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while fetching initial data
  if (initialLoading) {
    return (
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Loading inventory data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">
        {id ? "Edit Inventory" : "Inventory Management"}
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Create/Update Form */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">
          {id ? "Update Inventory Item" : "Create New Inventory Item"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Shop</label>
              <select
                value={shopId}
                onChange={(e) => setShopId(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={loading || id}
              >
                <option value="">Select a shop</option>
                {shops.map((shop) => (
                  <option key={shop.id} value={shop.id}>
                    {shop.name} - {shop.shopType}
                  </option>
                ))}
              </select>
              {id && (
                <p className="text-xs text-gray-500 mt-1">
                  Shop cannot be changed when editing
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Product</label>
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={loading || id}
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.productName}
                  </option>
                ))}
              </select>
              {id && (
                <p className="text-xs text-gray-500 mt-1">
                  Product cannot be changed when editing
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Current Quantity:{" "}
              <span className="font-bold text-blue-600">{quantity || "0"}</span>
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantityValue(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading
              ? "Processing..."
              : id
              ? "Update Inventory"
              : "Create Inventory Item"}
          </button>
        </form>
      </div>

      {/* Quick Operations - Only show when editing */}
      {id && (
        <div className="border-t pt-8">
          <h3 className="text-lg font-medium mb-4">
            Quick Quantity Operations
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Use these operations to quickly adjust inventory without manually
            calculating totals.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Operation Quantity
              </label>
              <input
                type="number"
                value={operationQuantity}
                onChange={(e) => setOperationQuantity(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                placeholder="Enter quantity"
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={handleSetQuantity}
                disabled={loading || !operationQuantity}
                className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                title="Replace current quantity with this value"
              >
                Set Quantity
              </button>
              <button
                onClick={handleAddQuantity}
                disabled={loading || !operationQuantity}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                title="Add this value to current quantity"
              >
                Add Quantity
              </button>
              <button
                onClick={handleReduceQuantity}
                disabled={loading || !operationQuantity}
                className="bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                title="Subtract this value from current quantity"
              >
                Reduce Quantity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagementForm;
