import React, { createContext, useContext, useState, useEffect } from "react";

const EmployeeContext = createContext();
export const useEmployee = () => useContext(EmployeeContext);

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEmployees = async () => {
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
    }
  };

  const updateEmployee = async (employeeId, employeeData) => {
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
    }
  };

  const deleteEmployee = async (employeeId) => {
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
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        loading,
        fetchEmployees,
        createEmployee,
        updateEmployee,
        deleteEmployee,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};
