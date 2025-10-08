import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useShop } from "../../context/ShopContext";

export default function ShopManagementForm() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [shopType, setShopType] = useState("");
  const { createShop, updateShop, shops, fetchShops } = useShop();
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch shops when editing
  useEffect(() => {
    if (id) {
      fetchShops();
      const shop = shops.find((s) => s.id === id);
      if (shop) {
        setName(shop.name);
        setLocation(shop.location);
        setShopType(shop.shopType);
      }
    }
  }, [id, shops, fetchShops]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
      await updateShop(id, { name, location, shopType });
    } else {
      await createShop({ name, location, shopType });
    }
    navigate("/shop");
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">
        {id ? "Edit Shop" : "Create Shop"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Shop Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Enter shop name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Enter shop location"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Shop Type</label>
          <select
            value={shopType}
            onChange={(e) => setShopType(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select shop type</option>
            <option value="RETAIL">Retail</option>
            <option value="WORKSHOP">Workshop</option>
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded text-sm font-medium"
          >
            {id ? "Update Shop" : "Create Shop"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/shop")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
