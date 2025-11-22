import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Button } from '../components/ui/Button';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { productsAPI } from '../services/api';
import './Products.css';

interface Product {
    _id: string;
    name: string;
    sku: string;
    categoryId?: string; // Backend returns ID currently
    stockLevel: number; // Calculated by backend
    reorderPoint: number;
    isActive: boolean;
}

export const Products: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await productsAPI.getAll();
            if (data.success) {
                setProducts(data.data);
            }
        } catch (err) {
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatus = (stock: number, reorderPoint: number) => {
        if (stock === 0) return 'Out of Stock';
        if (stock <= reorderPoint) return 'Low Stock';
        return 'In Stock';
    };

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
                    {loading ? (
                        <p style={{ textAlign: 'center', padding: '2rem' }}>Loading products...</p>
                    ) : filteredProducts.length === 0 ? (
                        <p style={{ textAlign: 'center', padding: '2rem' }}>No products found</p>
                    ) : (
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
                                {filteredProducts.map((product) => {
                                    const status = getStatus(product.stockLevel, product.reorderPoint);
                                    return (
                                        <tr key={product._id}>
                                            <td className="font-medium">{product.sku}</td>
                                            <td>{product.name}</td>
                                            <td>{product.categoryId || 'N/A'}</td>
                                            <td>{product.stockLevel}</td>
                                            <td>{product.reorderPoint}</td>
                                            <td>
                                                <span className={`status-badge ${getStatusClass(status)}`}>
                                                    {status}
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
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};
