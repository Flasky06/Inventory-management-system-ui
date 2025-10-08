import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProduct } from "../../context/ProductContext";
import { useShop } from "../../context/ShopContext";
import { useDispatch } from "../../context/DispatchContext";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

const DispatchProducts = () => {
  const { id } = useParams();
  const { createDispatch, getDispatchById } = useDispatch();
  const { products } = useProduct();
  const { shops } = useShop();
  const navigate = useNavigate();

  const [sourceShopId, setSourceShopId] = useState("");
  const [destinationShopId, setDestinationShopId] = useState("");
  const [productRows, setProductRows] = useState([
    { id: Date.now(), productId: "", quantity: "" },
  ]);
  const [loading, setLoading] = useState(false);

  // Prepopulate when editing an existing dispatch
  useEffect(() => {
    const loadDispatch = async () => {
      if (id) {
        const dispatch = await getDispatchById(id);
        if (dispatch) {
          setSourceShopId(dispatch.sourceShopId);
          setDestinationShopId(dispatch.destinationShopId);

          // Map dispatch items to product rows
          const rows = dispatch.items.map((item) => ({
            id: Date.now() + Math.random(),
            productId: item.productId,
            quantity: item.quantity.toString(),
          }));
          setProductRows(rows);
        }
      }
    };
    loadDispatch();
  }, [id, getDispatchById]);

  const addProductRow = () => {
    setProductRows([
      ...productRows,
      { id: Date.now() + Math.random(), productId: "", quantity: "" },
    ]);
  };

  const removeProductRow = (rowId) => {
    if (productRows.length > 1) {
      setProductRows(productRows.filter((row) => row.id !== rowId));
    }
  };

  const updateProductRow = (rowId, field, value) => {
    setProductRows(
      productRows.map((row) =>
        row.id === rowId ? { ...row, [field]: value } : row
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sourceShopId || !destinationShopId) {
      alert("Please select both source and destination shops");
      return;
    }

    if (sourceShopId === destinationShopId) {
      alert("Source and destination shops must be different");
      return;
    }

    const invalidRows = productRows.filter(
      (row) => !row.productId || !row.quantity || row.quantity <= 0
    );
    if (invalidRows.length > 0) {
      alert(
        "Please fill in all product selections and quantities (must be greater than 0)"
      );
      return;
    }

    const productIds = productRows.map((row) => row.productId);
    const duplicateProducts = productIds.filter(
      (id, index) => productIds.indexOf(id) !== index
    );
    if (duplicateProducts.length > 0) {
      alert(
        "Each product can only be selected once. Please remove duplicates."
      );
      return;
    }

    // Create request matching backend CreateDispatchRequest structure
    const dispatchRequest = {
      sourceShopId,
      destinationShopId,
      items: productRows.map((row) => ({
        productId: row.productId,
        quantity: parseInt(row.quantity, 10),
      })),
    };

    try {
      setLoading(true);
      await createDispatch(dispatchRequest);
      navigate("/dispatch");
    } catch (err) {
      console.error("Error creating dispatch:", err);
      alert(err.message || "Error creating dispatch. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getAvailableProducts = (currentProductId) => {
    const selectedProductIds = productRows
      .filter((row) => row.productId && row.productId !== currentProductId)
      .map((row) => row.productId);

    return products.filter(
      (product) => !selectedProductIds.includes(product.id)
    );
  };

  const totalItems = productRows.reduce(
    (sum, row) => sum + (parseInt(row.quantity) || 0),
    0
  );
  const validProductCount = productRows.filter((row) => row.productId).length;

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">
        {id ? "Edit Dispatch" : "Create Multi-Product Dispatch"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Source Shop
            </label>
            <select
              value={sourceShopId}
              onChange={(e) => setSourceShopId(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={loading}
            >
              <option value="">Select Source Shop</option>
              {shops.map((shop) => (
                <option key={shop.id} value={shop.id}>
                  {shop.name} - {shop.shopType} - {shop.location}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Destination Shop
            </label>
            <select
              value={destinationShopId}
              onChange={(e) => setDestinationShopId(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={loading}
            >
              <option value="">Select Destination Shop</option>
              {shops.map((shop) => (
                <option key={shop.id} value={shop.id}>
                  {shop.name} - {shop.shopType} - {shop.location}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Products to Dispatch</h3>
            <button
              type="button"
              onClick={addProductRow}
              disabled={loading}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <PlusIcon className="h-4 w-4" />
              Add Product
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {productRows.map((row) => {
                  const availableProducts = getAvailableProducts(row.productId);

                  return (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <select
                          value={row.productId}
                          onChange={(e) =>
                            updateProductRow(
                              row.id,
                              "productId",
                              e.target.value
                            )
                          }
                          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                          disabled={loading}
                        >
                          <option value="">Select Product</option>
                          {row.productId &&
                            !availableProducts.find(
                              (p) => p.id === row.productId
                            ) && (
                              <option key={row.productId} value={row.productId}>
                                {
                                  products.find((p) => p.id === row.productId)
                                    ?.productName
                                }
                              </option>
                            )}
                          {availableProducts.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.productName}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="1"
                          value={row.quantity}
                          onChange={(e) =>
                            updateProductRow(row.id, "quantity", e.target.value)
                          }
                          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter quantity"
                          required
                          disabled={loading}
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => removeProductRow(row.id)}
                          disabled={productRows.length === 1 || loading}
                          className={`p-1 rounded-md transition-colors ${
                            productRows.length === 1 || loading
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-red-600 hover:text-red-800 hover:bg-red-50"
                          }`}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Dispatch Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <p>
              Total Products:{" "}
              <span className="font-medium">{validProductCount}</span>
            </p>
            <p>
              Total Items: <span className="font-medium">{totalItems}</span>
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/dispatch")}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading
              ? "Creating..."
              : id
              ? "Update Dispatch"
              : "Create Dispatch"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DispatchProducts;
