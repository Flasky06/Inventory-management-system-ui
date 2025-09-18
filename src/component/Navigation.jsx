import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import NavLinkItem from "./NavLinkItem";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const menuItems = [
    { path: "/admin-dashboard", label: "Dashboard" },
    { path: "/user", label: "User" },
    { path: "/employee", label: "Employees" },
    { path: "/shop", label: "Shop" },
    { path: "/category", label: "Category" },
    { path: "/product", label: "Products" },
    { path: "/workshop", label: "Workshop" },
    { path: "/profile", label: "Profile" },
  ];

  return (
    <>
      {/* ===== Desktop Sidebar ===== */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 w-64 h-screen bg-slate-800 text-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-8 text-gray-100">MyApp</h2>
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <NavLinkItem key={item.path} to={item.path} label={item.label} />
          ))}
        </nav>
        <div>
          {user ? (
            <button
              onClick={logout}
              className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="block text-center bg-gray-100 text-slate-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-200"
            >
              Login
            </Link>
          )}
        </div>
      </aside>

      {/* ===== Mobile Sticky Topbar ===== */}
      <nav className="md:hidden fixed top-0 left-0 w-full bg-slate-800 text-gray-100 px-4 py-3 flex justify-between items-center z-50">
        <h2 className="text-lg font-bold">MyApp</h2>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* ===== Mobile Dropdown Menu ===== */}
      {isOpen && (
        <div className="md:hidden fixed top-12 right-0 w-[90%] h-[80vh] bg-slate-700 text-gray-200 shadow-lg p-4 space-y-2 z-40">
          {menuItems.map((item) => (
            <NavLinkItem
              key={item.path}
              to={item.path}
              label={item.label}
              onClick={() => setIsOpen(false)}
            />
          ))}
          {user ? (
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="block w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="block text-center bg-gray-100 text-slate-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-200"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </>
  );
}
