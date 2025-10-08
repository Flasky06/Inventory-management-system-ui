import { useShop } from "../../context/ShopContext";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import TitleHeader from "../../components/common/TitleHeader";

export default function ShopManagement() {
  const { shops, loading, deleteShop } = useShop();
  const { user } = useAuth();

  // Filter shops based on user role
  const filteredShops = shops.filter((shop) => {
    if (user?.role === "SHOP_MANAGER") {
      return shop.id === user.shopId;
    }
    return true; // ADMIN, CEO, WORKSHOP_MANAGER see all shops
  });

  if (loading) return <p className="p-4">Loading shops...</p>;

  return (
    <div className="p-6">
      <TitleHeader
        pageTitle="Shop Management"
        linkTitle={
          user?.role === "ADMIN" || user?.role === "CEO" ? "New Shop" : null
        }
        linkTo={
          user?.role === "ADMIN" || user?.role === "CEO"
            ? "/shop/create-shop"
            : null
        }
      />

      <table className="w-full border-collapse bg-white rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3 border-b">Name</th>
            <th className="p-3 border-b">Location</th>
            <th className="p-3 border-b">Type</th>
            <th className="p-3 border-b text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredShops.map((shop) => (
            <tr key={shop.id} className="hover:bg-gray-50">
              <td className="p-3 border-b">{shop.name}</td>
              <td className="p-3 border-b">{shop.location}</td>
              <td className="p-3 border-b">{shop.shopType}</td>
              <td className="p-3 border-b text-center">
                <div className="flex justify-center gap-2">
                  <Link
                    to={`/shop/${shop.id}`}
                    className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                  >
                    <PencilIcon className="h-4 w-4" />
                    Edit
                  </Link>
                  {(user?.role === "ADMIN" || user?.role === "CEO") && (
                    <button
                      onClick={() => deleteShop(shop.id)}
                      className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                    >
                      <TrashIcon className="h-4 w-4" />
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {filteredShops.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center p-4 text-gray-500">
                No shops found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
