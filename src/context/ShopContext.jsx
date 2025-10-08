import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const ShopContext = createContext();
export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchShops = async () => {
    // All authenticated users can view shops
    if (!user) {
      console.log("User not authenticated");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/shop", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch shops");
      const data = await res.json();
      setShops(data);
    } catch (err) {
      console.error("Error fetching shops:", err);
    } finally {
      setLoading(false);
    }
  };

  const createShop = async (shopData) => {
    if (!user || (user.role !== "ADMIN" && user.role !== "CEO")) {
      throw new Error("Unauthorized: Only ADMIN or CEO can create shops");
    }

    try {
      const response = await fetch("http://localhost:8080/api/shop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(shopData),
      });
      if (!response.ok) throw new Error("Failed to create shop");
      await fetchShops();
    } catch (err) {
      console.error("Error creating shop:", err);
      throw err;
    }
  };

  const updateShop = async (id, shopData) => {
    if (!user || (user.role !== "ADMIN" && user.role !== "CEO")) {
      throw new Error("Unauthorized: Only ADMIN or CEO can update shops");
    }

    try {
      const response = await fetch(`http://localhost:8080/api/shop/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(shopData),
      });
      if (!response.ok) throw new Error("Failed to update shop");
      await fetchShops();
    } catch (err) {
      console.error("Error updating shop:", err);
      throw err;
    }
  };

  const getShopById = async (shopId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/shop/${shopId}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch shop");
      return await response.json();
    } catch (err) {
      console.error("Error fetching shop by ID:", err);
      throw err;
    }
  };

  const getShopsByType = async (shopType) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/shop/type?shopType=${shopType}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch shops by type");
      return await response.json();
    } catch (err) {
      console.error("Error fetching shops by type:", err);
      throw err;
    }
  };

  const deleteShop = async (shopId) => {
    if (!user || (user.role !== "ADMIN" && user.role !== "CEO")) {
      throw new Error("Unauthorized: Only ADMIN or CEO can delete shops");
    }

    try {
      const response = await fetch(`http://localhost:8080/api/shop/${shopId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete shop");
      await fetchShops();
    } catch (err) {
      console.error("Error deleting shop:", err);
      throw err;
    }
  };

  useEffect(() => {
    if (user) {
      fetchShops();
    }
  }, [user]);

  return (
    <ShopContext.Provider
      value={{
        shops,
        loading,
        fetchShops,
        createShop,
        updateShop,
        deleteShop,
        getShopById,
        getShopsByType,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
