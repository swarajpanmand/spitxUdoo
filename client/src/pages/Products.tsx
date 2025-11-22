import React, { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Button } from '../components/ui/Button';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import './Products.css';

interface Product {
    id: string;
    name: string;
    sku: string;
    category: string;
    stock: number;
    reorderPoint: number;
    status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export const Products: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    // Mock data
    const products: Product[] = [
        { id: '1', name: 'Steel Rods', sku: 'STL-001', category: 'Raw Materials', stock: 150, reorderPoint: 50, status: 'In Stock' },
        { id: '2', name: 'Bolts', sku: 'BLT-002', category: 'Hardware', stock: 30, reorderPoint: 100, status: 'Low Stock' },
        { id: '3', name: 'Chairs', sku: 'CHR-003', category: 'Finished Goods', stock: 0, reorderPoint: 20, status: 'Out of Stock' },
        { id: '4', name: 'Tables', sku: 'TBL-004', category: 'Finished Goods', stock: 45, reorderPoint: 15, status: 'In Stock' },
        { id: '5', name: 'Screws', sku: 'SCR-005', category: 'Hardware', stock: 500, reorderPoint: 200, status: 'In Stock' },
    ];

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'In Stock':
                return 'status-success';
            case 'Low Stock':
                return 'status-warning';
            case 'Out of Stock':
                return 'status-error';
            default:
                return '';
        }
    };

    return (
        <MainLayout title="Products">
            <div className="products-page">
                <div className="products-header">
                    <div className="products-search">
                        <Search size={20} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search products by name or SKU..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <Button icon={<Plus size={20} />}>Add Product</Button>
                </div>

                <div className="products-table-container card">
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>SKU</th>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th>Stock Level</th>
                                <th>Reorder Point</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => (
                                <tr key={product.id}>
                                    <td className="font-medium">{product.sku}</td>
                                    <td>{product.name}</td>
                                    <td>{product.category}</td>
                                    <td>{product.stock}</td>
                                    <td>{product.reorderPoint}</td>
                                    <td>
                                        <span className={`status-badge ${getStatusClass(product.status)}`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            <button className="action-btn action-btn-edit" title="Edit">
                                                <Edit size={16} />
                                            </button>
                                            <button className="action-btn action-btn-delete" title="Delete">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </MainLayout>
    );
};
