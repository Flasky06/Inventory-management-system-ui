import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const InventoryContext = createContext();
export const useInventory = () => useContext(InventoryContext);

const API_BASE = "http://localhost:8080/api/inventory";

export const InventoryProvider = ({ children }) => {
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
  });

  // Create new inventory
  const createInventory = async (inventoryData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_BASE, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(inventoryData),
      });
      if (!response.ok) throw new Error("Failed to create inventory");
      const data = await response.json();
      await fetchInventories();
      return data;
    } catch (err) {
      setError(err.message);
      console.error("Error creating inventory:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get all inventories
  const fetchInventories = async () => {
    // All authenticated users can view inventory
    if (!user) {
      console.log("User not authenticated");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetch(API_BASE, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch inventories");
      const data = await res.json();
      setInventories(data);
      return data;
    } catch (err) {
      setError(err.message);
      console.error("Error fetching inventories:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get inventory by ID
  const getInventoryById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/${id}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch inventory");
      const data = await res.json();
      return data;
    } catch (err) {
      setError(err.message);
      console.error("Error fetching inventory by ID:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get inventory by shop
  const getInventoryByShop = async (shopId) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/shop/${shopId}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch shop inventory");
      const data = await res.json();
      return data;
    } catch (err) {
      setError(err.message);
      console.error("Error fetching shop inventory:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get inventory by shop and product
  const getInventoryByShopAndProduct = async (shopId, productId) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(
        `${API_BASE}/shop/${shopId}/product/${productId}`,
        {
          headers: getAuthHeaders(),
        }
      );
      if (!res.ok) throw new Error("Failed to fetch inventory");
      const data = await res.json();
      return data;
    } catch (err) {
      setError(err.message);
      console.error("Error fetching inventory by shop and product:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update inventory
  const updateInventory = async (id, inventoryData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(inventoryData),
      });
      if (!response.ok) throw new Error("Failed to update inventory");
      const data = await response.json();
      await fetchInventories();
      return data;
    } catch (err) {
      setError(err.message);
      console.error("Error updating inventory:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Set quantity
  const setQuantity = async (shopId, productId, quantity) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${API_BASE}/shop/${shopId}/product/${productId}/set-quantity?quantity=${quantity}`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
        }
      );
      if (!response.ok) throw new Error("Failed to set quantity");
      const data = await response.json();
      await fetchInventories();
      return data;
    } catch (err) {
      setError(err.message);
      console.error("Error setting quantity:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add inventory
  const addInventory = async (shopId, productId, quantity) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${API_BASE}/shop/${shopId}/product/${productId}/add?quantity=${quantity}`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
        }
      );
      if (!response.ok) throw new Error("Failed to add inventory");
      const data = await response.json();
      await fetchInventories();
      return data;
    } catch (err) {
      setError(err.message);
      console.error("Error adding inventory:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reduce inventory
  const reduceInventory = async (shopId, productId, quantity) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${API_BASE}/shop/${shopId}/product/${productId}/reduce?quantity=${quantity}`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
        }
      );
      if (!response.ok) throw new Error("Failed to reduce inventory");
      const data = await response.json();
      await fetchInventories();
      return data;
    } catch (err) {
      setError(err.message);
      console.error("Error reducing inventory:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete inventory
  const deleteInventory = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to delete inventory");
      await fetchInventories();
    } catch (err) {
      setError(err.message);
      console.error("Error deleting inventory:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchInventories();
    }
  }, [user]);

  return (
    <InventoryContext.Provider
      value={{
        inventories,
        loading,
        error,
        createInventory,
        fetchInventories,
        getInventoryById,
        getInventoryByShop,
        getInventoryByShopAndProduct,
        updateInventory,
        setQuantity,
        addInventory,
        reduceInventory,
        deleteInventory,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};
