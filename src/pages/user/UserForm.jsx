import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import { useShop } from "../../context/ShopContext";

const UserManagementForm = () => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("USER");
  const [password, setPassword] = useState("");
  const [shopId, setShopId] = useState("");

  const { shops } = useShop();

  const { createUser, updateUser, users, fetchUsers } = useUser();
  const navigate = useNavigate();
  const { userId } = useParams();

  // fetch all users once if editing
  useEffect(() => {
    if (userId) {
      fetchUsers();
    }
  }, [userId]);

  // populate form fields when users array updates
  useEffect(() => {
    if (userId) {
      const user = users.find((u) => u.id === userId);
      if (user) {
        setUsername(user.username);
        setRole(user.role);
      }
    }
  }, [userId, users]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userId) {
      await updateUser(userId, { username, role, password, shopId });
    } else {
      await createUser({ username, role, password, shopId });
    }

    navigate("/user");
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">
        {userId ? "Edit User" : "Create User"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Enter username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="ADMIN">Admin</option>
            <option value="CEO">CEO</option>
            <option value="WORKSHOP_MANAGER">Workshop Manager</option>
            <option value="SHOP_MANAGER">Shop Manager</option>
            <option value="EMPLOYEE">Employee</option>
            <option value="USER">User</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Password {!userId && "(required)"}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={!userId}
            placeholder={
              userId ? "Leave blank to keep current" : "Enter password"
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Shop Assignment
          </label>
          <select
            value={shopId}
            onChange={(e) => setShopId(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">No shop assignment</option>
            {shops.map((shop) => (
              <option key={shop.id} value={shop.id}>
                {shop.name} ({shop.shopType})
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded text-sm font-medium"
          >
            {userId ? "Update User" : "Create User"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/user")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserManagementForm;
