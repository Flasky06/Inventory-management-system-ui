import React, { createContext, useContext, useEffect, useState } from "react";

const CategoryContext = createContext();
export const useCategory = () => useContext(CategoryContext);

export default CategoryContext;
export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
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
    }
  };

  const updateCategory = async (id, categoryData) => {
    try {
      const response = await fetch(`http://localhost:8080/api/category/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(shopData),
      });
      if (!response.ok) throw new Error("Failed to update category");
      await fetchCategories();
    } catch (err) {
      console.error("Error updating category:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const deleteCategory = async (categoryId) => {
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
    }
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        loading,
        createCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
