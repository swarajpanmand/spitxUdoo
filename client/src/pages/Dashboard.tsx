import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import {
    Filter,
    Truck,
    ClipboardList,
} from 'lucide-react';
import './Dashboard.css';

interface KPIData {
    totalProductsInStock: number;
    totalStockUnits: number;
    lowStockCount: number;
    outOfStockCount: number;
    pendingReceiptsCount: number;
    pendingDeliveriesCount: number;
    internalTransfersScheduledCount: number;
}

interface ActivityItem {
    id: string;
    type: string;
    referenceNumber: string | null;
    productName: string | null;
    quantity: number;
    timestamp: string;
    userName: string | null;
}

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        documentType: 'all',
        status: 'all',
        warehouse: 'all',
        category: 'all',
    });
    const [kpis, setKpis] = useState<KPIData>({
        totalProductsInStock: 0,
        totalStockUnits: 0,
        lowStockCount: 0,
        outOfStockCount: 0,
        pendingReceiptsCount: 0,
        pendingDeliveriesCount: 0,
        internalTransfersScheduledCount: 0,
    });
    const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, [filters.warehouse, filters.category]);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            // Build query params
            const params = new URLSearchParams();
            if (filters.warehouse !== 'all') params.append('warehouseId', filters.warehouse);
            if (filters.category !== 'all') params.append('categoryId', filters.category);

            // Fetch KPIs
            const kpisResponse = await fetch(`http://localhost:5002/api/dashboard/kpis?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!kpisResponse.ok) {
                if (kpisResponse.status === 401) {
                    navigate('/login');
                    return;
                }
                throw new Error('Failed to fetch KPIs');
            }

            const kpisData = await kpisResponse.json();
            setKpis(kpisData.data);

            // Fetch recent activity
            const activityParams = new URLSearchParams();
            if (filters.warehouse !== 'all') activityParams.append('warehouseId', filters.warehouse);
            activityParams.append('limit', '10');

            const activityResponse = await fetch(`http://localhost:5002/api/dashboard/recent-activity?${activityParams}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (activityResponse.ok) {
                const activityData = await activityResponse.json();
                setRecentActivity(activityData.data);
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        }
    };

    const formatTimeAgo = (timestamp: string) => {
        const now = new Date();
        const then = new Date(timestamp);
        const diffMs = now.getTime() - then.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    };

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
                                <span className="kpi-value-large">{loading ? '...' : kpis.pendingReceiptsCount}</span>
                                <span className="kpi-label-large">To Receive</span>
                            </div>
                            <ClipboardList className="kpi-bg-icon" />
                        </div>
                        <div className="kpi-sidebar">
                            <div className="stat-row">
                                <span className="stat-label">Products</span>
                                <span className="stat-value">{loading ? '...' : kpis.totalProductsInStock}</span>
                            </div>
                            <div className="stat-row">
                                <span className="stat-label">Low Stock</span>
                                <span className="stat-value">{loading ? '...' : kpis.lowStockCount}</span>
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
                                <span className="kpi-value-large">{loading ? '...' : kpis.pendingDeliveriesCount}</span>
                                <span className="kpi-label-large">To Deliver</span>
                            </div>
                            <Truck className="kpi-bg-icon" />
                        </div>
                        <div className="kpi-sidebar">
                            <div className="stat-row">
                                <span className="stat-label">Transfers</span>
                                <span className="stat-value">{loading ? '...' : kpis.internalTransfersScheduledCount}</span>
                            </div>
                            <div className="stat-row">
                                <span className="stat-label">Out of Stock</span>
                                <span className="stat-value">{loading ? '...' : kpis.outOfStockCount}</span>
                            </div>
                            <div className="stat-row">
                                <span className="stat-label">Total Units</span>
                                <span className="stat-value">{loading ? '...' : kpis.totalStockUnits}</span>
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
                            {loading ? (
                                <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Loading...</p>
                            ) : recentActivity.length === 0 ? (
                                <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No recent activity</p>
                            ) : (
                                recentActivity.map((activity) => (
                                    <div key={activity.id} className="activity-item">
                                        <div className="activity-badge">{activity.type.charAt(0).toUpperCase()}</div>
                                        <div className="activity-details">
                                            <div className="activity-header">
                                                <span className="activity-ref">{activity.referenceNumber || 'N/A'}</span>
                                                <span className="activity-time">{formatTimeAgo(activity.timestamp)}</span>
                                            </div>
                                            <p className="activity-description">
                                                {activity.type}: {activity.productName || 'Unknown'} ({activity.quantity > 0 ? '+' : ''}{activity.quantity} units)
                                                {activity.userName && <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}> by {activity.userName}</span>}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
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
