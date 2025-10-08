import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // fetch all users - only if user has permission
  const fetchUsers = async () => {
    // Check if user has permission to fetch users
    if (!user || (user.role !== "ADMIN" && user.role !== "CEO")) {
      console.log("User does not have permission to fetch users");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/auth/users", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch users if the user is logged in and has appropriate role
    if (user && (user.role === "ADMIN" || user.role === "CEO")) {
      fetchUsers();
    }
  }, [user]);

  // create user
  const createUser = async (userData) => {
    if (!user || (user.role !== "ADMIN" && user.role !== "CEO")) {
      throw new Error("Unauthorized: Only ADMIN or CEO can create users");
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error("Failed to create user");
      await fetchUsers();
    } catch (err) {
      console.error("Error creating user:", err);
      throw err;
    }
  };

  // update user
  const updateUser = async (id, userData) => {
    if (!user || (user.role !== "ADMIN" && user.role !== "CEO")) {
      throw new Error("Unauthorized: Only ADMIN or CEO can update users");
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/auth/users/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
          body: JSON.stringify(userData),
        }
      );
      if (!response.ok) throw new Error("Failed to update user");
      await fetchUsers();
    } catch (err) {
      console.error("Error updating user:", err);
      throw err;
    }
  };

  // delete user
  const deleteUser = async (userId) => {
    if (!user || (user.role !== "ADMIN" && user.role !== "CEO")) {
      throw new Error("Unauthorized: Only ADMIN or CEO can delete users");
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/auth/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to delete user");
      await fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      throw err;
    }
  };

  return (
    <UserContext.Provider
      value={{ users, loading, fetchUsers, createUser, updateUser, deleteUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
