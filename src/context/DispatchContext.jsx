import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const DispatchContext = createContext();
export const useDispatch = () => useContext(DispatchContext);

const DispatchProvider = ({ children }) => {
  const [dispatches, setDispatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchDispatches = async () => {
    // All authenticated users can view dispatches
    if (!user) {
      console.log("User not authenticated");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/dispatches", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch dispatches");
      const data = await res.json();
      setDispatches(data);
    } catch (err) {
      console.error("Error fetching dispatches:", err);
    } finally {
      setLoading(false);
    }
  };

  const createDispatch = async (dispatchRequest) => {
    try {
      const response = await fetch("http://localhost:8080/api/dispatches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(dispatchRequest),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create dispatch");
      }
      await fetchDispatches();
    } catch (err) {
      console.error("Error creating dispatch:", err);
      throw err;
    }
  };

  const getDispatchById = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/dispatches/${id}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch dispatch");
      return await response.json();
    } catch (err) {
      console.error("Error fetching dispatch:", err);
      return null;
    }
  };

  const acknowledgeDispatch = async (dispatchId, accept) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/dispatches/${dispatchId}/acknowledge?accept=${accept}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to acknowledge dispatch");
      await fetchDispatches();
    } catch (err) {
      console.error("Error acknowledging dispatch:", err);
      throw err;
    }
  };

  const cancelDispatch = async (dispatchId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/dispatches/${dispatchId}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to cancel dispatch");
      await fetchDispatches();
    } catch (err) {
      console.error("Error cancelling dispatch:", err);
      throw err;
    }
  };

  const getDispatchesBySourceShop = async (sourceShopId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/dispatches/source-shop/${sourceShopId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok)
        throw new Error("Failed to fetch dispatches by source shop");
      return await response.json();
    } catch (err) {
      console.error("Error fetching dispatches by source shop:", err);
      return [];
    }
  };

  const getDispatchesByDestinationShop = async (destinationShopId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/dispatches/destination-shop/${destinationShopId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok)
        throw new Error("Failed to fetch dispatches by destination shop");
      return await response.json();
    } catch (err) {
      console.error("Error fetching dispatches by destination shop:", err);
      return [];
    }
  };

  useEffect(() => {
    if (user) {
      fetchDispatches();
    }
  }, [user]);

  return (
    <DispatchContext.Provider
      value={{
        dispatches,
        loading,
        createDispatch,
        fetchDispatches,
        getDispatchById,
        acknowledgeDispatch,
        cancelDispatch,
        getDispatchesBySourceShop,
        getDispatchesByDestinationShop,
      }}
    >
      {children}
    </DispatchContext.Provider>
  );
};

export default DispatchProvider;
