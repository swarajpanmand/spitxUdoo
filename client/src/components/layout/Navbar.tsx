import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    ClipboardList,
    History,
    Settings,
    LogOut,
    User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export const Navbar: React.FC = () => {
    const { user, logout } = useAuth();

    const navItems = [
        { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { to: '/operations', icon: <ClipboardList size={20} />, label: 'Operations' },
        { to: '/stock', icon: <Package size={20} />, label: 'Stock' },
        { to: '/history', icon: <History size={20} />, label: 'Move History' },
        { to: '/settings', icon: <Settings size={20} />, label: 'Settings' },
    ];

    return (
        <aside className="navbar">
            {/* User Profile at Top */}
            <div className="navbar-user">
                <div className="navbar-user-avatar">
                    <User size={40} />
                </div>
                <div className="navbar-user-info">
                    <p className="navbar-user-name">{user?.name || 'User'}</p>
                    <p className="navbar-user-role">{user?.email || 'user@example.com'}</p>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="navbar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            isActive ? 'navbar-link navbar-link-active' : 'navbar-link'
                        }
                    >
                        <span className="navbar-icon">{item.icon}</span>
                        <span className="navbar-label">{item.label}</span>
                    </NavLink>
                ))}
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
