import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { ArrowLeft, Plus, Printer } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './ReceiptDetail.css';

type ReceiptStatus = 'Draft' | 'Ready' | 'Done';

interface ProductLine {
    id: string;
    product: string;
    quantity: number;
}

export const ReceiptDetail: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    // Mock data - in a real app, fetch based on ID
    const [status, setStatus] = useState<ReceiptStatus>('Draft');
    const [reference] = useState(id === 'new' ? 'WH/IN/New' : 'WH/IN/0001');
    const [products] = useState<ProductLine[]>([
        { id: '1', product: '[DESK001] Desk', quantity: 6 }
    ]);

    const handleMarkAsTodo = () => setStatus('Ready');
    const handleValidate = () => setStatus('Done');
    const handlePrint = () => window.print();
    const handleCancel = () => navigate('/receipts');

    return (
        <MainLayout title="Receipt">
            <div className="receipt-detail-page">
                {/* Header */}
                <div className="page-header">
                    <div className="header-left">
                        <button className="btn-new">
                            <Plus size={18} />
                            NEW
                        </button>
                        <div className="title-section">
                            <button className="btn-back" onClick={() => navigate('/receipts')}>
                                <ArrowLeft size={20} />
                            </button>
                            <h1 className="page-title">Receipt</h1>
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="action-bar">
                    <div className="action-buttons">
                        {status === 'Draft' && (
                            <button className="btn-action btn-primary" onClick={handleMarkAsTodo}>
                                Mark as Todo
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
                        <div className={`step ${status === 'Draft' ? 'active' : ''} ${['Ready', 'Done'].includes(status) ? 'completed' : ''}`}>
                            Draft
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
                            <label>Receive From</label>
                            <input type="text" defaultValue="Vendor" className="form-input" />
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
                                    <tr key={p.id}>
                                        <td>{p.product}</td>
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
