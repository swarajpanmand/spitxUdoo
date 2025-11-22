import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    TruckIcon,
    Send,
    ArrowLeftRight,
    Settings,
    Warehouse,
    History,
    User,
    LogOut,
    FileText,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

export const Sidebar: React.FC = () => {
    const { user, logout } = useAuth();

    const navItems = [
        { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { to: '/products', icon: <Package size={20} />, label: 'Products' },
        { to: '/receipts', icon: <TruckIcon size={20} />, label: 'Receipts' },
        { to: '/deliveries', icon: <Send size={20} />, label: 'Deliveries' },
        { to: '/transfers', icon: <ArrowLeftRight size={20} />, label: 'Transfers' },
        { to: '/adjustments', icon: <FileText size={20} />, label: 'Adjustments' },
        { to: '/history', icon: <History size={20} />, label: 'Move History' },
        { to: '/warehouses', icon: <Warehouse size={20} />, label: 'Warehouses' },
        { to: '/settings', icon: <Settings size={20} />, label: 'Settings' },
    ];

    return (
        <aside className="sidebar glass">
            <div className="sidebar-header">
                <div className="sidebar-logo gradient-bg">
                    <Package size={28} color="white" />
                </div>
                <h2 className="sidebar-title gradient-text">StockMaster</h2>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                        }
                    >
                        <span className="sidebar-link-icon">{item.icon}</span>
                        <span className="sidebar-link-label">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="sidebar-user">
                    <div className="sidebar-user-avatar gradient-bg">
                        <User size={20} color="white" />
                    </div>
                    <div className="sidebar-user-info">
                        <p className="sidebar-user-name">{user?.name}</p>
                        <p className="sidebar-user-role">{user?.role}</p>
                    </div>
                </div>
                <button onClick={logout} className="sidebar-logout">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};
