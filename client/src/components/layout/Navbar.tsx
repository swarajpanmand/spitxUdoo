import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  History,
  Settings,
  LogOut,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [operationsOpen, setOperationsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Check if we're on any settings page
  const isSettingsActive = location.pathname.startsWith("/settings");
  // Check if we're on any operations page
  const isOperationsActive = location.pathname.startsWith("/operations");

  const navItems = [
    {
      to: "/dashboard",
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
    },
    { to: "/stock", icon: <Package size={20} />, label: "Stock" },
    { to: "/history", icon: <History size={20} />, label: "Move History" },
  ];

  return (
    <aside className="navbar">
      {/* User Profile at Top */}
      <div className="navbar-user">
        <div className="navbar-user-avatar">
          <User size={40} />
        </div>
        <div className="navbar-user-info">
          <p className="navbar-user-name">{user?.name || "User"}</p>
          <p className="navbar-user-role">
            {user?.email || "user@example.com"}
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="navbar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive ? "navbar-link navbar-link-active" : "navbar-link"
            }
          >
            <span className="navbar-icon">{item.icon}</span>
            <span className="navbar-label">{item.label}</span>
          </NavLink>
        ))}

        {/* Operations Dropdown */}
        <div className="navbar-dropdown">
          <button
            className={`navbar-link navbar-dropdown-trigger ${
              isOperationsActive ? "navbar-link-active" : ""
            }`}
            onClick={() => setOperationsOpen(!operationsOpen)}
          >
            <span className="navbar-icon">
              <ClipboardList size={20} />
            </span>
            <span className="navbar-label">Operations</span>
            <span className="navbar-chevron">
              {operationsOpen ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </span>
          </button>
          {operationsOpen && (
            <div className="navbar-dropdown-content">
              <NavLink
                to="/receipts"
                className={({ isActive }) =>
                  isActive
                    ? "navbar-dropdown-link navbar-dropdown-link-active"
                    : "navbar-dropdown-link"
                }
              >
                Receipt
              </NavLink>
              <NavLink
                to="/delivery"
                className={({ isActive }) =>
                  isActive
                    ? "navbar-dropdown-link navbar-dropdown-link-active"
                    : "navbar-dropdown-link"
                }
              >
                Delivery
              </NavLink>
            </div>
          )}
        </div>

        {/* Settings Dropdown */}
        <div className="navbar-dropdown">
          <button
            className={`navbar-link navbar-dropdown-trigger ${
              isSettingsActive ? "navbar-link-active" : ""
            }`}
            onClick={() => setSettingsOpen(!settingsOpen)}
          >
            <span className="navbar-icon">
              <Settings size={20} />
            </span>
            <span className="navbar-label">Settings</span>
            <span className="navbar-chevron">
              {settingsOpen ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </span>
          </button>
          {settingsOpen && (
            <div className="navbar-dropdown-content">
              <NavLink
                to="/settings/warehouse"
                className={({ isActive }) =>
                  isActive
                    ? "navbar-dropdown-link navbar-dropdown-link-active"
                    : "navbar-dropdown-link"
                }
              >
                Warehouse
              </NavLink>
              <NavLink
                to="/settings/location"
                className={({ isActive }) =>
                  isActive
                    ? "navbar-dropdown-link navbar-dropdown-link-active"
                    : "navbar-dropdown-link"
                }
              >
                Location
              </NavLink>
            </div>
          )}
        </div>
      </nav>

      {/* Logout at Bottom */}
      <div className="navbar-footer">
        <button onClick={logout} className="navbar-logout">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
