import { useShop } from "../../context/ShopContext";
import { Link } from "react-router-dom";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

export default function ShopManagement() {
  const { shops, loading, deleteShop } = useShop();

  if (loading) return <p className="p-4">Loading shops...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Shop Management</h1>
        <Link
          to="/shop/create-shop"
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Shop
        </Link>
      </div>

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
          {shops.map((shop) => (
            <tr key={shop.id} className="hover:bg-gray-50">
              <td className="p-3 border-b">{shop.name}</td>
              <td className="p-3 border-b">{shop.location}</td>
              <td className="p-3 border-b">{shop.shopType}</td>
              <td className="p-3 border-b text-center flex justify-center gap-3">
                <Link
                  to={`/shop/${shop.id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <PencilIcon className="h-5 w-5" />
                </Link>
                <button
                  onClick={() => deleteShop(shop.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
          {shops.length === 0 && (
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
