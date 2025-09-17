import React from "react";
import { useEmployee } from "../../context/EmployeeContext";
import { Link } from "react-router-dom";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function Employee() {
  const { employees, loading, deleteEmployee } = useEmployee();

  if (loading) return <p className="p-4">Loading employees...</p>;


  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Employee Management</h1>
        <Link
          to="/employee/create-employee"
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Employee
        </Link>
      </div>

      <table className="w-full border-collapse bg-white rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3 border-b">Name</th>
            <th className="p-3 border-b">Gender</th>
            <th className="p-3 border-b">Role</th>
            <th className="p-3 border-b">Id No</th>
            <th className="p-3 border-b">Phone No</th>
            <th className="p-3 border-b">dob</th>
            <th className="p-3 border-b">Shop</th>
            <th className="p-3 border-b text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id} className="hover:bg-gray-50">
              <td className="p-3 border-b">{employee.fullName}</td>
              <td className="p-3 border-b">{employee.gender}</td>
              <td className="p-3 border-b">{employee.role}</td>
              <td className="p-3 border-b">{employee.idNo}</td>
              <td className="p-3 border-b">{employee.phoneNo}</td>
              <td className="p-3 border-b">{employee.dob}</td>
              <td className="p-3 border-b">{employee.shopName}</td>
              <td className="p-3 border-b text-center flex justify-center gap-3">
                <Link
                  to={`/employee/${employee.id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <PencilIcon className="h-5 w-5" />
                </Link>
                <button
                  onClick={() => deleteEmployee(employee.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
          {employees.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center p-4 text-gray-500">
                No employees found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
