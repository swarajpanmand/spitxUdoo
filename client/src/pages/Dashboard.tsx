import React, { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import {
    Filter,
    Truck,
    ClipboardList,
} from 'lucide-react';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        documentType: 'all',
        status: 'all',
        warehouse: 'all',
        category: 'all',
    });

    const recentActivity = [
        { id: 1, type: 'Receipt', ref: 'RCP-001', product: 'Steel Rods', qty: 50, time: '2 hours ago' },
        { id: 2, type: 'Delivery', ref: 'DEL-045', product: 'Chairs', qty: 10, time: '3 hours ago' },
        { id: 3, type: 'Transfer', ref: 'TRF-023', product: 'Bolts', qty: 200, time: '5 hours ago' },
        { id: 4, type: 'Adjustment', ref: 'ADJ-012', product: 'Steel', qty: -3, time: '6 hours ago' },
    ];

    return (
        <MainLayout title="Dashboard">
            <div className="dashboard">
                {/* KPIs Section - Large Cards */}
                <div className="dashboard-kpis-large">
                    {/* Receipt Card - Teal Theme */}
                    <div
                        className="kpi-large-card clickable-card theme-teal"
                        onClick={() => navigate('/receipts')}
                    >
                        <div className="kpi-main">
                            <div className="kpi-header">
                                <div className="kpi-icon-box">
                                    <ClipboardList size={20} />
                                </div>
                                <h3 className="kpi-title">Receipts</h3>
                            </div>
                            <div className="kpi-metric-container">
                                <span className="kpi-value-large">4</span>
                                <span className="kpi-label-large">To Receive</span>
                            </div>
                            <ClipboardList className="kpi-bg-icon" />
                        </div>
                        <div className="kpi-sidebar">
                            <div className="stat-row">
                                <span className="stat-label">Late</span>
                                <span className="stat-value">1</span>
                            </div>
                            <div className="stat-row">
                                <span className="stat-label">Operations</span>
                                <span className="stat-value">6</span>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Card - Olive Theme */}
                    <div
                        className="kpi-large-card clickable-card theme-olive"
                        onClick={() => navigate('/delivery')}
                    >
                        <div className="kpi-main">
                            <div className="kpi-header">
                                <div className="kpi-icon-box">
                                    <Truck size={20} />
                                </div>
                                <h3 className="kpi-title">Delivery</h3>
                            </div>
                            <div className="kpi-metric-container">
                                <span className="kpi-value-large">4</span>
                                <span className="kpi-label-large">To Deliver</span>
                            </div>
                            <Truck className="kpi-bg-icon" />
                        </div>
                        <div className="kpi-sidebar">
                            <div className="stat-row">
                                <span className="stat-label">Late</span>
                                <span className="stat-value">1</span>
                            </div>
                            <div className="stat-row">
                                <span className="stat-label">Waiting</span>
                                <span className="stat-value">2</span>
                            </div>
                            <div className="stat-row">
                                <span className="stat-label">Operations</span>
                                <span className="stat-value">6</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="dashboard-grid">
                    {/* Left Column: Activity Feed */}
                    <div className="dashboard-content">
                        <div className="section-header">
                            <h3>Recent Activity</h3>
                            <button className="btn-link">View All</button>
                        </div>
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

                    {/* Right Column: Filters & Quick Actions */}
                    <div className="dashboard-sidebar">
                        <div className="dashboard-filters card">
                            <div className="filter-header">
                                <Filter size={20} />
                                <h3>Quick Filters</h3>
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
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};
