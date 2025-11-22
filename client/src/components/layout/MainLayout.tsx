import React from 'react';
import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import './MainLayout.css';

interface MainLayoutProps {
    children: ReactNode;
    title: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, title }) => {
    return (
        <div className="main-layout">
            <Sidebar />
            <div className="main-content">
                <Header title={title} />
                <main className="main-body">{children}</main>
            </div>
        </div>
    );
};
