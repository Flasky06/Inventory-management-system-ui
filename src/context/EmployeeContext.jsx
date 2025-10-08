import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const EmployeeContext = createContext();
export const useEmployee = () => useContext(EmployeeContext);

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchEmployees = async () => {
    // Only ADMIN and CEO can access employees
    if (!user || (user.role !== "ADMIN" && user.role !== "CEO")) {
      console.log("User does not have permission to fetch employees");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/employee", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch employees");
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    } finally {
      setLoading(false);
    }
  };

  const createEmployee = async (employeeData) => {
    if (!user || (user.role !== "ADMIN" && user.role !== "CEO")) {
      throw new Error("Unauthorized: Only ADMIN or CEO can create employees");
    }

    try {
      const response = await fetch("http://localhost:8080/api/employee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(employeeData),
      });
      if (!response.ok) throw new Error("Failed to create employee");
      await fetchEmployees();
    } catch (err) {
      console.error("Error creating employee:", err);
      throw err;
    }
  };

  const updateEmployee = async (employeeId, employeeData) => {
    if (!user || (user.role !== "ADMIN" && user.role !== "CEO")) {
      throw new Error("Unauthorized: Only ADMIN or CEO can update employees");
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/employee/${employeeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
          body: JSON.stringify(employeeData),
        }
      );
      if (!response.ok) throw new Error("Failed to update employee");
      await fetchEmployees();
    } catch (err) {
      console.error("Error updating employee:", err);
      throw err;
    }
  };

  const getEmployeeById = async (employeeId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/employee/${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch employee");
      return await response.json();
    } catch (err) {
      console.error("Error fetching employee by ID:", err);
      throw err;
    }
  };

  const deleteEmployee = async (employeeId) => {
    if (!user || (user.role !== "ADMIN" && user.role !== "CEO")) {
      throw new Error("Unauthorized: Only ADMIN or CEO can delete employees");
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/employee/${employeeId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to delete employee");
      await fetchEmployees();
    } catch (err) {
      console.error("Error deleting employee:", err);
      throw err;
    }
  };

  useEffect(() => {
    if (user && (user.role === "ADMIN" || user.role === "CEO")) {
      fetchEmployees();
    }
  }, [user]);

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        loading,
        fetchEmployees,
        createEmployee,
        updateEmployee,
        deleteEmployee,
        getEmployeeById,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};
