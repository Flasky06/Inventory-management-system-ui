import React from "react";
import { useUser } from "../../context/UserContext";
import { Link } from "react-router-dom";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useShop } from "../../context/ShopContext";

const User = () => {
  const { users, loading, deleteUser } = useUser();
  const { shops } = useShop();

  if (loading) return <p className="p-4">Loading users...</p>;
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">User Management</h1>
        <Link
          to="/user/create-user"
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New User
        </Link>
      </div>

      <table className="w-full border-collapse bg-white rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3 border-b">Name</th>
            <th className="p-3 border-b">User Type</th>
            <th className="p-3 border-b text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="p-3 border-b">{user.username}</td>
              <td className="p-3 border-b">
                {user.role}
                {user.shopId
                  ? ` - ${shops.find((shop) => shop.id === user.shopId)?.name}`
                  : ""}
              </td>
              <td className="p-3 border-b text-center">
                <div className="flex justify-center gap-2">
                  <Link
                    to={`/user/create-user/${user.id}`}
                    className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                  >
                    <PencilIcon className="h-4 w-4" />
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center p-4 text-gray-500">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default User;
