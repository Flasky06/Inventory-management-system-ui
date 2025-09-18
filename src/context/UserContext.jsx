import React, { createContext, useState, useEffect, useContext } from "react";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // fetch all users
  const fetchUsers = async () => {
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
    fetchUsers();
  }, []);

  // create user
  const createUser = async (userData) => {
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
    }
  };

  // update user
  const updateUser = async (id, userData) => {
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
    }
  };

  // delete user
  const deleteUser = async (userId) => {
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
