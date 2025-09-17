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
    <div className="max-w-lg mx-auto bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">
        {employeeId ? "Edit Employee" : "Create New Employee"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">SELECT ROLE</option>
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
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">SELECT GENDER</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone No</label>
          <input
            type="text"
            value={phoneNo}
            onChange={(e) => setPhoneNo(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Id No</label>
          <input
            type="text"
            value={idNo}
            onChange={(e) => setIdNo(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">DOB</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Shop</label>
          <select
            value={shopId}
            onChange={(e) => setShopId(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">SELECT SHOP</option>
            {shops.map((shop) => (
              <option key={shop.id} value={shop.id}>
                {shop.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate("/employee")}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            {employeeId ? "Update Employee" : "Save Employee"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
