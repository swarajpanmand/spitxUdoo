import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import './Stock.css';

export const Stock: React.FC = () => {
    return (
        <MainLayout title="Stock">
            <div className="stock-page">
                <h2>Stock Management - Coming Soon</h2>
                <p>View and manage all stock items across warehouses.</p>
            </div>
        </MainLayout>
    );
};
