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
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">
        {id ? "Edit Shop" : "Create New Shop"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Shop Type</label>
          <select
            value={shopType}
            onChange={(e) => setShopType(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option>Select Shop Type</option>
            <option value="WORKSHOP">Workshop</option>
            <option value="RETAIL">Retail</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {id ? "Update Shop" : "Save Shop"}
        </button>
      </form>
    </div>
  );
}
