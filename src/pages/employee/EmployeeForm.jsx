import React, { useState, useEffect } from "react";
import { useEmployee } from "../../context/EmployeeContext";
import { useNavigate, useParams } from "react-router-dom";
import { useShop } from "../../context/ShopContext";

const EmployeeForm = () => {
  const navigate = useNavigate();
  const { employeeId } = useParams();

  const { employees, createEmployee, updateEmployee } = useEmployee();
  const { shops } = useShop();

  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [idNo, setIdNo] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [shopId, setShopId] = useState("");

  // prefill form when editing
  useEffect(() => {
    if (employeeId && employees.length > 0) {
      const emp = employees.find((e) => e.id === employeeId);
      if (emp) {
        setFullName(emp.fullName);
        setRole(emp.role);
        setIdNo(emp.idNo);
        setPhoneNo(emp.phoneNo);
        setDob(emp.dob);
        setGender(emp.gender);
        setShopId(emp.shopId);
      }
    }
  }, [employeeId, employees]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      fullName,
      role,
      idNo,
      phoneNo,
      dob,
      gender,
      shopId,
    };
    if (employeeId) {
      await updateEmployee(employeeId, payload);
    } else {
      await createEmployee(payload);
    }
    navigate("/employee");
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">
        {employeeId ? "Edit Employee" : "Create Employee"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <input
              type="text"
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="+254712345678"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">ID Number</label>
            <input
              type="text"
              value={idNo}
              onChange={(e) => setIdNo(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Enter ID number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select role</option>
              <option value="CEO">CEO</option>
              <option value="WORKSHOP_MANAGER">Workshop Manager</option>
              <option value="SHOP_MANAGER">Shop Manager</option>
              <option value="EMPLOYEE">Employee</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Shop Assignment
            </label>
            <select
              value={shopId}
              onChange={(e) => setShopId(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">No shop assignment</option>
              {shops.map((shop) => (
                <option key={shop.id} value={shop.id}>
                  {shop.name} ({shop.shopType})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded text-sm font-medium"
          >
            {employeeId ? "Update Employee" : "Create Employee"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/employee")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
