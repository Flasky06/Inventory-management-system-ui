import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const CategoryContext = createContext();
export const useCategory = () => useContext(CategoryContext);

export default CategoryContext;

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchCategories = async () => {
    // ADMIN, CEO, and WORKSHOP_MANAGER can access categories
    if (
      !user ||
      (user.role !== "ADMIN" &&
        user.role !== "CEO" &&
        user.role !== "WORKSHOP_MANAGER")
    ) {
      console.log("User does not have permission to fetch categories");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/category", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData) => {
    if (
      !user ||
      (user.role !== "ADMIN" &&
        user.role !== "CEO" &&
        user.role !== "WORKSHOP_MANAGER")
    ) {
      throw new Error(
        "Unauthorized: Only ADMIN, CEO, or WORKSHOP_MANAGER can create categories"
      );
    }

    try {
      const response = await fetch("http://localhost:8080/api/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(categoryData),
      });
      if (!response.ok) throw new Error("Failed to create category");
      await fetchCategories();
    } catch (err) {
      console.error("Error creating category:", err);
      throw err;
    }
  };

  const updateCategory = async (id, categoryData) => {
    if (
      !user ||
      (user.role !== "ADMIN" &&
        user.role !== "CEO" &&
        user.role !== "WORKSHOP_MANAGER")
    ) {
      throw new Error(
        "Unauthorized: Only ADMIN, CEO, or WORKSHOP_MANAGER can update categories"
      );
    }

    try {
      const response = await fetch(`http://localhost:8080/api/category/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(categoryData), // Fixed: was shopData
      });
      if (!response.ok) throw new Error("Failed to update category");
      await fetchCategories();
    } catch (err) {
      console.error("Error updating category:", err);
      throw err;
    }
  };

  const getCategoryById = async (categoryId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/category/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch category");
      return await response.json();
    } catch (err) {
      console.error("Error fetching category by ID:", err);
      throw err;
    }
  };

  const deleteCategory = async (categoryId) => {
    if (
      !user ||
      (user.role !== "ADMIN" &&
        user.role !== "CEO" &&
        user.role !== "WORKSHOP_MANAGER")
    ) {
      throw new Error(
        "Unauthorized: Only ADMIN, CEO, or WORKSHOP_MANAGER can delete categories"
      );
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/category/${categoryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to delete category");
      await fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
      throw err;
    }
  };

  useEffect(() => {
    if (
      user &&
      (user.role === "ADMIN" ||
        user.role === "CEO" ||
        user.role === "WORKSHOP_MANAGER")
    ) {
      fetchCategories();
    }
  }, [user]);

  return (
    <CategoryContext.Provider
      value={{
        categories,
        loading,
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory,
        getCategoryById,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
