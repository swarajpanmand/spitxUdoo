import React, { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Search, Plus, LayoutList, Kanban, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Receipts.css'; // Reusing Receipts CSS for consistent styling

interface Delivery {
    id: string;
    reference: string;
    from: string;
    to: string;
    contact: string;
    scheduleDate: string;
    status: 'Ready' | 'Draft' | 'Done';
}

export const Delivery: React.FC = () => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

    const deliveries: Delivery[] = [
        {
            id: '1',
            reference: 'WH/OUT/0001',
            from: 'WH/Stock1',
            to: 'Vendor',
            contact: 'Azure Interior',
            scheduleDate: '2023-11-22',
            status: 'Ready',
        },
        {
            id: '2',
            reference: 'WH/OUT/0002',
            from: 'WH/Stock1',
            to: 'Vendor',
            contact: 'Azure Interior',
            scheduleDate: '2023-11-23',
            status: 'Ready',
        },
    ];

    return (
        <MainLayout title="Delivery">
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
                            <h1 className="page-title">Delivery</h1>
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
                                {deliveries.map((delivery) => (
                                    <tr
                                        key={delivery.id}
                                        onClick={() => navigate(`/delivery/${delivery.id}`)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <td className="font-medium text-teal-900">{delivery.reference}</td>
                                        <td>{delivery.from}</td>
                                        <td>{delivery.to}</td>
                                        <td>{delivery.contact}</td>
                                        <td>{delivery.scheduleDate}</td>
                                        <td>
                                            <span className={`status-badge status-${delivery.status.toLowerCase()}`}>
                                                {delivery.status}
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
