import React, { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Search, Plus, LayoutList, Kanban, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Receipts.css';

interface Receipt {
    id: string;
    reference: string;
    from: string;
    to: string;
    contact: string;
    scheduleDate: string;
    status: 'Ready' | 'Draft' | 'Done';
}

export const Receipts: React.FC = () => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

    const receipts: Receipt[] = [
        {
            id: '1',
            reference: 'WH/IN/0001',
            from: 'Vendor',
            to: 'WH/Stock',
            contact: 'Azure Interior',
            scheduleDate: '2023-11-22',
            status: 'Ready',
        },
        {
            id: '2',
            reference: 'WH/IN/0002',
            from: 'Vendor',
            to: 'WH/Stock',
            contact: 'Azure Interior',
            scheduleDate: '2023-11-23',
            status: 'Ready',
        },
    ];

    return (
        <MainLayout title="Receipts">
            <div className="receipts-page">
                {/* Page Header */}
                <div className="page-header">
                    <div className="header-left">
                        <button className="btn-new">
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
                            <input type="text" placeholder="Search..." />
                        </div>
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
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Reference</th>
                                    <th>From</th>
                                    <th>To</th>
                                    <th>Contact</th>
                                    <th>Schedule Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {receipts.map((receipt) => (
                                    <tr
                                        key={receipt.id}
                                        onClick={() => navigate(`/receipts/${receipt.id}`)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <td className="font-medium text-teal-900">{receipt.reference}</td>
                                        <td>{receipt.from}</td>
                                        <td>{receipt.to}</td>
                                        <td>{receipt.contact}</td>
                                        <td>{receipt.scheduleDate}</td>
                                        <td>
                                            <span className={`status-badge status-${receipt.status.toLowerCase()}`}>
                                                {receipt.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};
