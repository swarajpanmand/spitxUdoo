import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { ArrowLeft, Plus, Printer } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './ReceiptDetail.css'; // Reusing styles
import './DeliveryDetail.css'; // Specific styles for delivery

type DeliveryStatus = 'Draft' | 'Waiting' | 'Ready' | 'Done';

interface ProductLine {
    id: string;
    product: string;
    quantity: number;
    inStock: boolean;
}

export const DeliveryDetail: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    // Mock data
    const [status, setStatus] = useState<DeliveryStatus>('Draft');
    const [reference] = useState(id === 'new' ? 'WH/OUT/New' : 'WH/OUT/0001');
    const [products] = useState<ProductLine[]>([
        { id: '1', product: '[DESK001] Desk', quantity: 6, inStock: false } // Mocking out of stock
    ]);

    const handleCheckAvailability = () => {
        // Mock logic: if all products in stock, move to Ready, else Waiting
        const allInStock = products.every(p => p.inStock);
        setStatus(allInStock ? 'Ready' : 'Waiting');
    };

    const handleValidate = () => setStatus('Done');
    const handlePrint = () => window.print();
    const handleCancel = () => navigate('/delivery');

    return (
        <MainLayout title="Delivery">
            <div className="receipt-detail-page">
                {/* Header */}
                <div className="page-header">
                    <div className="header-left">
                        <button className="btn-new">
                            <Plus size={18} />
                            NEW
                        </button>
                        <div className="title-section">
                            <button className="btn-back" onClick={() => navigate('/delivery')}>
                                <ArrowLeft size={20} />
                            </button>
                            <h1 className="page-title">Delivery</h1>
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="action-bar">
                    <div className="action-buttons">
                        {(status === 'Draft' || status === 'Waiting') && (
                            <button className="btn-action btn-primary" onClick={handleCheckAvailability}>
                                Check Availability
                            </button>
                        )}
                        {status === 'Ready' && (
                            <button className="btn-action btn-primary" onClick={handleValidate}>
                                Validate
                            </button>
                        )}
                        <button className="btn-action btn-secondary" onClick={handlePrint} disabled={status !== 'Done'}>
                            <Printer size={16} />
                            Print
                        </button>
                        <button className="btn-action btn-secondary" onClick={handleCancel}>
                            Cancel
                        </button>
                    </div>
                    <div className="status-steps">
                        <div className={`step ${status === 'Draft' ? 'active' : ''} ${['Waiting', 'Ready', 'Done'].includes(status) ? 'completed' : ''}`}>
                            Draft
                        </div>
                        <div className="step-separator">›</div>
                        <div className={`step ${status === 'Waiting' ? 'active' : ''} ${['Ready', 'Done'].includes(status) ? 'completed' : ''}`}>
                            Waiting
                        </div>
                        <div className="step-separator">›</div>
                        <div className={`step ${status === 'Ready' ? 'active' : ''} ${status === 'Done' ? 'completed' : ''}`}>
                            Ready
                        </div>
                        <div className="step-separator">›</div>
                        <div className={`step ${status === 'Done' ? 'active' : ''}`}>
                            Done
                        </div>
                    </div>
                </div>

                {/* Main Form */}
                <div className="detail-card">
                    <h2 className="receipt-ref">{reference}</h2>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Delivery Address</label>
                            <input type="text" defaultValue="Azure Interior" className="form-input" />
                        </div>
                        <div className="form-group">
                            <label>Schedule Date</label>
                            <input type="date" defaultValue="2023-11-22" className="form-input" />
                        </div>
                        <div className="form-group">
                            <label>Responsible</label>
                            <input
                                type="text"
                                value={user?.name || 'Admin'}
                                readOnly
                                className="form-input readonly"
                            />
                        </div>
                        <div className="form-group">
                            <label>Operation Type</label>
                            <select className="form-input">
                                <option>Delivery Orders</option>
                            </select>
                        </div>
                    </div>

                    {/* Products Table */}
                    <div className="products-section">
                        <h3>Products</h3>
                        <table className="products-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th style={{ width: '150px' }}>Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p.id} className={!p.inStock && status !== 'Done' ? 'row-out-of-stock' : ''}>
                                        <td>
                                            {p.product}
                                            {!p.inStock && status !== 'Done' && (
                                                <span className="stock-alert"> (Not in Stock)</span>
                                            )}
                                        </td>
                                        <td>{p.quantity}</td>
                                    </tr>
                                ))}
                                <tr className="new-product-row">
                                    <td colSpan={2}>
                                        <button className="btn-add-line">Add a line</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};
