import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Search, Plus, LayoutList, Kanban, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Receipts.css'; // Reusing Receipts CSS for consistent styling

interface DeliveryItem {
    productId: {
        _id: string;
        name: string;
        sku?: string;
    };
    qty: number;
    batchNo?: string;
}

interface Delivery {
    _id: string;
    customerName?: string;
    customerPhone?: string;
    customerAddress?: string;
    warehouseId: string;
    status: 'PICK' | 'PACK' | 'READY' | 'DONE' | 'CANCELED';
    driver?: {
        name?: string;
        phone?: string;
    };
    vehicleNumber?: string;
    items: DeliveryItem[];
    createdAt: string;
    updatedAt: string;
}

export const Delivery: React.FC = () => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
    const [deliveries, setDeliveries] = useState<Delivery[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');

    useEffect(() => {
        fetchDeliveries();
    }, [statusFilter]);

    const fetchDeliveries = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const params = new URLSearchParams();
            if (statusFilter) params.append('status', statusFilter);

            const response = await fetch(`http://localhost:5002/api/deliveries?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    navigate('/login');
                    return;
                }
                throw new Error('Failed to fetch deliveries');
            }

            const data = await response.json();
            setDeliveries(data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching deliveries:', error);
            setLoading(false);
        }
    };

    const filteredDeliveries = deliveries.filter(delivery =>
    (delivery.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'DONE':
                return 'status-done';
            case 'READY':
                return 'status-ready';
            case 'PACK':
                return 'status-waiting';
            case 'PICK':
                return 'status-draft';
            case 'CANCELED':
                return 'status-canceled';
            default:
                return '';
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    const getTotalItems = (items: DeliveryItem[]) => {
        return items.reduce((sum, item) => sum + item.qty, 0);
    };

    return (
        <MainLayout title="Delivery">
            <div className="receipts-page">
                {/* Page Header */}
                <div className="page-header">
                    <div className="header-left">
                        <button className="btn-new" onClick={() => navigate('/delivery/new')}>
                            <Plus size={18} />
                            NEW
                        </button>
                        <div className="title-section">
                            <button className="btn-back" onClick={() => navigate('/dashboard')}>
                                <ArrowLeft size={20} />
                            </button>
                            <h1 className="page-title">Delivery</h1>
                        </div>
                    </div>
                    <div className="header-right">
                        <div className="search-box">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="status-filter"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Status</option>
                            <option value="PICK">Pick</option>
                            <option value="PACK">Pack</option>
                            <option value="READY">Ready</option>
                            <option value="DONE">Done</option>
                            <option value="CANCELED">Canceled</option>
                        </select>
                        <div className="view-toggles">
                            <button
                                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                                onClick={() => setViewMode('list')}
                            >
                                <LayoutList size={18} />
                            </button>
                            <button
                                className={`view-btn ${viewMode === 'kanban' ? 'active' : ''}`}
                                onClick={() => setViewMode('kanban')}
                            >
                                <Kanban size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* List View */}
                {viewMode === 'list' && (
                    <div className="table-container card">
                        {loading ? (
                            <p style={{ textAlign: 'center', padding: '2rem' }}>Loading deliveries...</p>
                        ) : filteredDeliveries.length === 0 ? (
                            <p style={{ textAlign: 'center', padding: '2rem' }}>No deliveries found</p>
                        ) : (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Reference</th>
                                        <th>Customer</th>
                                        <th>Phone</th>
                                        <th>Items</th>
                                        <th>Total Qty</th>
                                        <th>Vehicle</th>
                                        <th>Created</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredDeliveries.map((delivery) => (
                                        <tr
                                            key={delivery._id}
                                            onClick={() => navigate(`/delivery/${delivery._id}`)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <td className="font-medium text-teal-900">
                                                {delivery._id.slice(-8).toUpperCase()}
                                            </td>
                                            <td>{delivery.customerName || 'N/A'}</td>
                                            <td>{delivery.customerPhone || 'N/A'}</td>
                                            <td>{delivery.items.length} items</td>
                                            <td>{getTotalItems(delivery.items)} units</td>
                                            <td>{delivery.vehicleNumber || 'N/A'}</td>
                                            <td>{formatDate(delivery.createdAt)}</td>
                                            <td>
                                                <span className={`status-badge ${getStatusBadgeClass(delivery.status)}`}>
                                                    {delivery.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* Kanban View */}
                {viewMode === 'kanban' && (
                    <div className="kanban-container">
                        {['PICK', 'PACK', 'READY', 'DONE'].map(status => (
                            <div key={status} className="kanban-column">
                                <h3 className="kanban-header">{status}</h3>
                                <div className="kanban-cards">
                                    {filteredDeliveries
                                        .filter(d => d.status === status)
                                        .map(delivery => (
                                            <div
                                                key={delivery._id}
                                                className="kanban-card"
                                                onClick={() => navigate(`/delivery/${delivery._id}`)}
                                            >
                                                <h4>{delivery._id.slice(-8).toUpperCase()}</h4>
                                                <p><strong>Customer:</strong> {delivery.customerName || 'N/A'}</p>
                                                <p><strong>Phone:</strong> {delivery.customerPhone || 'N/A'}</p>
                                                <p><strong>Items:</strong> {delivery.items.length}</p>
                                                <p><strong>Total:</strong> {getTotalItems(delivery.items)} units</p>
                                                {delivery.vehicleNumber && (
                                                    <p className="text-sm"><strong>Vehicle:</strong> {delivery.vehicleNumber}</p>
                                                )}
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
};
