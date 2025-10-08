import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import NavLinkItem from "./NavLinkItem";
import { useAuth } from "../../context/AuthContext";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({});
  const { user, logout } = useAuth();

  // Define menu items with role restrictions
  const allMenuItems = [
    { path: "/admin-dashboard", label: "Dashboard", roles: ["ADMIN", "CEO"] },
    {
      path: "/workshop-dashboard",
      label: "Dashboard",
      roles: ["WORKSHOP_MANAGER"],
    },
    { path: "/shop-dashboard", label: "Dashboard", roles: ["SHOP_MANAGER"] },
    {
      label: "HR",
      roles: ["ADMIN", "CEO"],
      children: [
        { path: "/employee", label: "Employees", roles: ["ADMIN", "CEO"] },
        { path: "/user", label: "Users", roles: ["ADMIN", "CEO"] },
      ],
    },
    {
      label: "Workshop",
      roles: ["ADMIN", "CEO", "WORKSHOP_MANAGER"],
      children: [
        { path: "/workshop", label: "Overview", roles: ["WORKSHOP_MANAGER"] },
        {
          path: "/category",
          label: "Categories",
          roles: ["ADMIN", "CEO", "WORKSHOP_MANAGER"],
        },
        {
          path: "/product",
          label: "Products",
          roles: ["ADMIN", "CEO", "WORKSHOP_MANAGER"],
        },
        {
          path: "/inventory",
          label: "Inventory",
          roles: ["ADMIN", "CEO", "WORKSHOP_MANAGER", "SHOP_MANAGER"],
        },
        {
          path: "/dispatch",
          label: "Dispatch",
          roles: ["ADMIN", "CEO", "WORKSHOP_MANAGER", "SHOP_MANAGER"],
        },
      ],
    },
    { path: "/shop", label: "Shop", roles: ["ADMIN", "CEO"] },
    {
      path: "/profile",
      label: "Profile",
      roles: ["ADMIN", "CEO", "WORKSHOP_MANAGER", "SHOP_MANAGER", "USER"],
    },
  ];

  // Filter menu items based on user role
  const hasAccess = (item) => {
    if (!item.roles) return true; // No role restriction
    if (!user || !user.role) return false;
    return item.roles.includes(user.role);
  };

  const menuItems = allMenuItems
    .filter((item) => {
      if (item.children) {
        // For parent items with children, show if user has access to parent or any child
        return (
          hasAccess(item) || item.children.some((child) => hasAccess(child))
        );
      }
      return hasAccess(item);
    })
    .map((item) => {
      if (item.children) {
        return {
          ...item,
          children: item.children.filter((child) => hasAccess(child)),
        };
      }
      return item;
    });

  const toggleSubMenu = (label) =>
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));

  const renderMenuItem = (item) => {
    if (item.children) {
      return (
        <div key={item.label}>
          <button
            onClick={() => toggleSubMenu(item.label)}
            className="flex items-center justify-between w-full px-2 py-2 hover:bg-slate-700 rounded"
          >
            <span>{item.label}</span>
            <ChevronDownIcon
              className={`h-4 w-4 transition-transform ${
                openMenus[item.label] ? "rotate-180" : ""
              }`}
            />
          </button>
          {openMenus[item.label] && (
            <div className="ml-4 space-y-1">
              {item.children.map((child) => (
                <NavLinkItem
                  key={child.path}
                  to={child.path}
                  label={child.label}
                  onClick={() => setIsOpen(false)}
                />
              ))}
            </div>
          )}
        </div>
      );
    }
    return (
      <NavLinkItem
        key={item.path}
        to={item.path}
        label={item.label}
        onClick={() => setIsOpen(false)}
      />
    );
  };

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 w-64 h-screen bg-slate-800 text-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-8 text-gray-100">MyApp</h2>
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => renderMenuItem(item))}
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

      {/* Mobile topbar */}
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

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="md:hidden fixed top-12 right-0 w-[90%] h-[80vh] bg-slate-700 text-gray-200 shadow-lg p-4 space-y-2 z-40 overflow-y-auto">
          {menuItems.map((item) => renderMenuItem(item))}
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
