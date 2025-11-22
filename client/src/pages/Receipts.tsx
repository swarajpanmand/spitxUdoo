import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Search, Plus, LayoutList, Kanban, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Receipts.css';

interface ReceiptItem {
    productId: {
        _id: string;
        name: string;
        sku?: string;
    };
    qty: number;
}

interface Receipt {
    _id: string;
    supplier?: string;
    warehouseId: string;
    status: 'DRAFT' | 'WAITING' | 'READY' | 'DONE' | 'CANCELED';
    expectedDate?: string;
    notes?: string;
    items: ReceiptItem[];
    createdAt: string;
    updatedAt: string;
}

export const Receipts: React.FC = () => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');

    useEffect(() => {
        fetchReceipts();
    }, [statusFilter]);

    const fetchReceipts = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const params = new URLSearchParams();
            if (statusFilter) params.append('status', statusFilter);

            const response = await fetch(`http://localhost:5002/api/receipts?${params}`, {
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
                throw new Error('Failed to fetch receipts');
            }

            const data = await response.json();
            setReceipts(data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching receipts:', error);
            setLoading(false);
        }
    };

    const filteredReceipts = receipts.filter(receipt =>
    (receipt.supplier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt._id.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'DONE':
                return 'status-done';
            case 'READY':
                return 'status-ready';
            case 'WAITING':
                return 'status-waiting';
            case 'DRAFT':
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

    const getTotalItems = (items: ReceiptItem[]) => {
        return items.reduce((sum, item) => sum + item.qty, 0);
    };

    return (
        <MainLayout title="Receipts">
            <div className="receipts-page">
                {/* Page Header */}
                <div className="page-header">
                    <div className="header-left">
                        <button className="btn-new" onClick={() => navigate('/receipts/new')}>
                            <Plus size={18} />
                            NEW
                        </button>
                        <div className="title-section">
                            <button className="btn-back" onClick={() => navigate('/dashboard')}>
                                <ArrowLeft size={20} />
                            </button>
                            <h1 className="page-title">Receipts</h1>
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
                            <option value="DRAFT">Draft</option>
                            <option value="WAITING">Waiting</option>
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
                            <p style={{ textAlign: 'center', padding: '2rem' }}>Loading receipts...</p>
                        ) : filteredReceipts.length === 0 ? (
                            <p style={{ textAlign: 'center', padding: '2rem' }}>No receipts found</p>
                        ) : (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Reference</th>
                                        <th>Supplier</th>
                                        <th>Items</th>
                                        <th>Total Qty</th>
                                        <th>Expected Date</th>
                                        <th>Created</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredReceipts.map((receipt) => (
                                        <tr
                                            key={receipt._id}
                                            onClick={() => navigate(`/receipts/${receipt._id}`)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <td className="font-medium text-teal-900">
                                                {receipt._id.slice(-8).toUpperCase()}
                                            </td>
                                            <td>{receipt.supplier || 'N/A'}</td>
                                            <td>{receipt.items.length} items</td>
                                            <td>{getTotalItems(receipt.items)} units</td>
                                            <td>{formatDate(receipt.expectedDate)}</td>
                                            <td>{formatDate(receipt.createdAt)}</td>
                                            <td>
                                                <span className={`status-badge ${getStatusBadgeClass(receipt.status)}`}>
                                                    {receipt.status}
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
                        {['DRAFT', 'WAITING', 'READY', 'DONE'].map(status => (
                            <div key={status} className="kanban-column">
                                <h3 className="kanban-header">{status}</h3>
                                <div className="kanban-cards">
                                    {filteredReceipts
                                        .filter(r => r.status === status)
                                        .map(receipt => (
                                            <div
                                                key={receipt._id}
                                                className="kanban-card"
                                                onClick={() => navigate(`/receipts/${receipt._id}`)}
                                            >
                                                <h4>{receipt._id.slice(-8).toUpperCase()}</h4>
                                                <p><strong>Supplier:</strong> {receipt.supplier || 'N/A'}</p>
                                                <p><strong>Items:</strong> {receipt.items.length}</p>
                                                <p><strong>Total:</strong> {getTotalItems(receipt.items)} units</p>
                                                <p className="text-sm">{formatDate(receipt.expectedDate)}</p>
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
