import React from "react";
import { useEmployee } from "../../context/EmployeeContext";
import { Link } from "react-router-dom";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function Employee() {
  const { employees, loading, deleteEmployee } = useEmployee();

  if (loading) return <p className="p-4">Loading employees...</p>;

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center items-start gap-4 mb-6">
        <h1 className="text-xl font-bold">Employee Management</h1>
        <Link
          to="/employee/create-employee"
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full sm:w-auto justify-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Employee
        </Link>
      </div>

      <div className="overflow-x-auto">
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
                <td className="p-3 border-b text-center">
                  <div className="flex flex-col sm:flex-row justify-center gap-2">
                    <Link
                      to={`/employee/${employee.id}`}
                      className="flex items-center justify-center gap-1 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm w-full sm:w-auto"
                    >
                      <PencilIcon className="h-4 w-4" />
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteEmployee(employee.id)}
                      className="flex items-center justify-center gap-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm w-full sm:w-auto"
                    >
                      <TrashIcon className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
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
    </div>
  );
}
