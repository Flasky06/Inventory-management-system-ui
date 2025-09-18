import { useShop } from "../../context/ShopContext";
import { Link } from "react-router-dom";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import TitleHeadComponent from "../../component/TitleHeadComponent";

export default function ShopManagement() {
  const { shops, loading, deleteShop } = useShop();

  if (loading) return <p className="p-4">Loading shops...</p>;

  return (
    <div className="p-6">
      <TitleHeadComponent
        pageTitle="Shop Management"
        linkTitle="New Shop"
        linkTo="/shop/create-shop"
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
