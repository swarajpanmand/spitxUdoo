import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import './Header.css';

interface HeaderProps {
    title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
    return (
        <header className="header">
            <div className="header-left">
                <button className="header-menu-btn">
                    <Menu size={24} />
                </button>
                <h1 className="header-title">{title}</h1>
            </div>

            <div className="header-right">
                <div className="header-search">
                    <Search size={20} className="header-search-icon" />
                    <input
                        type="text"
                        placeholder="Search products, orders..."
                        className="header-search-input"
                    />
                </div>

                <button className="header-notification">
                    <Bell size={20} />
                    <span className="header-notification-badge">3</span>
                </button>
            </div>
        </header>
    );
};
