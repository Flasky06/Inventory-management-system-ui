import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";

const UserManagementForm = () => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("USER");
  const [password, setPassword] = useState("");

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
      await updateUser(userId, { username, role, password });
    } else {
      await createUser({ username, role, password });
    }

    navigate("/user");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">
        {userId ? "Edit User" : "Create New User"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="ADMIN">Admin</option>
            <option value="CEO">CEO</option>
            <option value="WORKSHOP_MANAGER">Workshop Manager</option>
            <option value="SHOP_MANAGER">Shop Manager</option>
            <option value="EMPLOYEE">Employee</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            required={!userId} // required only when creating
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {userId ? "Update User" : "Save User"}
        </button>
      </form>
    </div>
  );
};

export default UserManagementForm;
