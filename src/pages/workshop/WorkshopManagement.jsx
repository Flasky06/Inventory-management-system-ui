import { useShop } from "../../context/ShopContext";
import { Link } from "react-router-dom";
import TitleHeader from "../../components/common/TitleHeader";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function WorkshopManagement() {
  const { shops, loading, deleteShop } = useShop();

  // Filter only workshops
  const workshops = shops.filter((shop) => shop.shopType === "WORKSHOP");

  if (loading) return <p className="p-4">Loading workshops...</p>;

  return (
    <div className="p-6">
      <TitleHeader
        pageTitle="Workshop Management"
        linkTitle="New Workshop"
        linkTo="/workshop/create-workshop"
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
          {workshops.map((workshop) => (
            <tr key={workshop.id} className="hover:bg-gray-50">
              <td className="p-3 border-b">{workshop.name}</td>
              <td className="p-3 border-b">{workshop.location}</td>
              <td className="p-3 border-b">{workshop.shopType}</td>
              <td className="p-3 border-b text-center">
                <div className="flex justify-center gap-2">
                  <Link
                    to={`/workshop/${workshop.id}`}
                    className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                  >
                    <PencilIcon className="h-4 w-4" />
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteShop(workshop.id)}
                    className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {workshops.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center p-4 text-gray-500">
                No workshops found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
