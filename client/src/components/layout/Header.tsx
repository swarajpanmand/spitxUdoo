import React from 'react';
import { Search, Bell } from 'lucide-react';
import './Header.css';

interface HeaderProps {
    title: string;
}

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
};

export const Header: React.FC<HeaderProps> = () => {
    const userName = 'Alex'; // This could come from auth context

    return (
        <header className="header">
            <div className="header-left">
                <div className="header-greeting">
                    <h1 className="greeting-text">{getGreeting()}, <span className="user-name">{userName}</span></h1>
                    <p className="greeting-subtitle">Here's what's happening today</p>
                </div>
            </div>

            <div className="header-right">
                <div className="header-search">
                    <Search size={20} className="header-search-icon" />
                    <input
                        type="text"
                        placeholder="Search..."
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
