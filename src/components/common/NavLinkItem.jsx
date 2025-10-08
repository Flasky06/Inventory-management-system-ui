import { NavLink } from "react-router-dom";

export default function NavLinkItem({ to, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `block px-4 py-2 rounded-lg transition ${
          isActive ? "bg-slate-600 text-white" : "hover:bg-slate-700"
        }`
      }
    >
      {label}
    </NavLink>
  );
}
