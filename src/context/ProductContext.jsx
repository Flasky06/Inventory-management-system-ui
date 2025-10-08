import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const ProductContext = createContext();
export const useProduct = () => useContext(ProductContext);

const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchProducts = async () => {
    // ADMIN, CEO, and WORKSHOP_MANAGER can access products
    if (
      !user ||
      (user.role !== "ADMIN" &&
        user.role !== "CEO" &&
        user.role !== "WORKSHOP_MANAGER")
    ) {
      console.log("User does not have permission to fetch products");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/product", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData) => {
    if (
      !user ||
      (user.role !== "ADMIN" &&
        user.role !== "CEO" &&
        user.role !== "WORKSHOP_MANAGER")
    ) {
      throw new Error(
        "Unauthorized: Only ADMIN, CEO, or WORKSHOP_MANAGER can create products"
      );
    }

    try {
      const response = await fetch("http://localhost:8080/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(productData),
      });
      if (!response.ok) throw new Error("Failed to create product");
      await fetchProducts();
    } catch (err) {
      console.error("Error creating product:", err);
      throw err;
    }
  };

  const getProductById = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/product/${id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch product");
      return await response.json();
    } catch (err) {
      console.error("Error fetching product:", err);
      return null;
    }
  };

  const updateProduct = async (id, productData) => {
    if (
      !user ||
      (user.role !== "ADMIN" &&
        user.role !== "CEO" &&
        user.role !== "WORKSHOP_MANAGER")
    ) {
      throw new Error(
        "Unauthorized: Only ADMIN, CEO, or WORKSHOP_MANAGER can update products"
      );
    }

    try {
      const response = await fetch(`http://localhost:8080/api/product/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(productData),
      });
      if (!response.ok) throw new Error("Failed to update product");
      await fetchProducts();
    } catch (err) {
      console.error("Error updating product:", err);
      throw err;
    }
  };

  const searchProducts = async (searchParams = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (searchParams.productName)
        queryParams.append("productName", searchParams.productName);
      if (searchParams.categoryId)
        queryParams.append("categoryId", searchParams.categoryId);

      const url = `http://localhost:8080/api/product/search${
        queryParams.toString() ? "?" + queryParams.toString() : ""
      }`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to search products");
      return await response.json();
    } catch (err) {
      console.error("Error searching products:", err);
      throw err;
    }
  };

  const deleteProduct = async (productId) => {
    if (
      !user ||
      (user.role !== "ADMIN" &&
        user.role !== "CEO" &&
        user.role !== "WORKSHOP_MANAGER")
    ) {
      throw new Error(
        "Unauthorized: Only ADMIN, CEO, or WORKSHOP_MANAGER can delete products"
      );
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/product/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to delete product");
      await fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
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
      fetchProducts();
    }
  }, [user]);

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        createProduct,
        updateProduct,
        deleteProduct,
        fetchProducts,
        getProductById,
        searchProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
