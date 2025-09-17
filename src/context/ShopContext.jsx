import React, { createContext, useContext, useState, useEffect } from "react";

const ShopContext = createContext();
export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchShops = async () => {
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
    }
  };

  const updateShop = async (id, shopData) => {
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
    }
  };

  const deleteShop = async (shopId) => {
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
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  return (
    <ShopContext.Provider
      value={{
        shops,
        loading,
        fetchShops,
        createShop,
        updateShop,
        deleteShop,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
