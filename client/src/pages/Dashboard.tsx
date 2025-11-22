import React, { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { KPICard } from '../components/dashboard/KPICard';
import {
    Package,
    AlertTriangle,
    TruckIcon,
    Send,
    ArrowLeftRight,
    Filter,
} from 'lucide-react';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
    const [filters, setFilters] = useState({
        documentType: 'all',
        status: 'all',
        warehouse: 'all',
        category: 'all',
    });

    const kpis = [
        {
            title: 'Total Products in Stock',
            value: '1,247',
            icon: Package,
            color: 'primary' as const,
            trend: { value: 12, isPositive: true },
        },
        {
            title: 'Low Stock Items',
            value: '23',
            icon: AlertTriangle,
            color: 'warning' as const,
            trend: { value: 5, isPositive: false },
        },
        {
            title: 'Pending Receipts',
            value: '15',
            icon: TruckIcon,
            color: 'secondary' as const,
        },
        {
            title: 'Pending Deliveries',
            value: '8',
            icon: Send,
            color: 'success' as const,
        },
        {
            title: 'Internal Transfers',
            value: '12',
            icon: ArrowLeftRight,
            color: 'primary' as const,
        },
    ];

    const recentActivity = [
        { id: 1, type: 'Receipt', ref: 'RCP-001', product: 'Steel Rods', qty: 50, time: '2 hours ago' },
        { id: 2, type: 'Delivery', ref: 'DEL-045', product: 'Chairs', qty: 10, time: '3 hours ago' },
        { id: 3, type: 'Transfer', ref: 'TRF-023', product: 'Bolts', qty: 200, time: '5 hours ago' },
        { id: 4, type: 'Adjustment', ref: 'ADJ-012', product: 'Steel', qty: -3, time: '6 hours ago' },
    ];

    return (
        <MainLayout title="Dashboard">
            <div className="dashboard">
                {/* Filters */}
                <div className="dashboard-filters card">
                    <div className="filter-header">
                        <Filter size={20} />
                        <h3>Filters</h3>
                    </div>
                    <div className="filter-grid">
                        <div className="filter-item">
                            <label>Document Type</label>
                            <select
                                value={filters.documentType}
                                onChange={(e) => setFilters({ ...filters, documentType: e.target.value })}
                            >
                                <option value="all">All Types</option>
                                <option value="receipts">Receipts</option>
                                <option value="deliveries">Deliveries</option>
                                <option value="transfers">Internal Transfers</option>
                                <option value="adjustments">Adjustments</option>
                            </select>
                        </div>
                        <div className="filter-item">
                            <label>Status</label>
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            >
                                <option value="all">All Status</option>
                                <option value="draft">Draft</option>
                                <option value="waiting">Waiting</option>
                                <option value="ready">Ready</option>
                                <option value="done">Done</option>
                                <option value="canceled">Canceled</option>
                            </select>
                        </div>
                        <div className="filter-item">
                            <label>Warehouse</label>
                            <select
                                value={filters.warehouse}
                                onChange={(e) => setFilters({ ...filters, warehouse: e.target.value })}
                            >
                                <option value="all">All Warehouses</option>
                                <option value="main">Main Warehouse</option>
                                <option value="wh2">Warehouse 2</option>
                            </select>
                        </div>
                        <div className="filter-item">
                            <label>Category</label>
                            <select
                                value={filters.category}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                            >
                                <option value="all">All Categories</option>
                                <option value="raw">Raw Materials</option>
                                <option value="finished">Finished Goods</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* KPIs */}
                <div className="dashboard-kpis">
                    {kpis.map((kpi, index) => (
                        <KPICard key={index} {...kpi} />
                    ))}
                </div>

                {/* Recent Activity */}
                <div className="dashboard-activity card">
                    <h3 className="activity-title">Recent Activity</h3>
                    <div className="activity-list">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="activity-item">
                                <div className="activity-badge">{activity.type.charAt(0)}</div>
                                <div className="activity-details">
                                    <div className="activity-header">
                                        <span className="activity-ref">{activity.ref}</span>
                                        <span className="activity-time">{activity.time}</span>
                                    </div>
                                    <p className="activity-description">
                                        {activity.type}: {activity.product} ({activity.qty > 0 ? '+' : ''}{activity.qty} units)
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};
