import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import './Operations.css';

export const Operations: React.FC = () => {
    return (
        <MainLayout title="Operations">
            <div className="operations-page">
                <h2>Operations - Coming Soon</h2>
                <p>Manage receipts, deliveries, transfers, and adjustments.</p>
            </div>
        </MainLayout>
    );
};
