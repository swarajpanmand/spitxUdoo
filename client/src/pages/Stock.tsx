import React, { useEffect, useState } from "react";
import axios from "axios";
import { MainLayout } from "../components/layout/MainLayout";
import "./Stock.css";
import "./StockTable.css";

const StockTable = ({ products }) => {
    return (
        <div className="stock-table-container">
            <h2 className="stock-title">Stock Overview</h2>

            <table className="stock-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>SKU</th>
                        <th>Recent Stock In</th>
                        <th>Current Stock</th>
                    </tr>
                </thead>

                <tbody>
                    {products?.map((p) => {
                        const totalStock = p.warehouses?.reduce(
                            (sum, w) => sum + (w.totalQty || 0),
                            0
                        );

                        return (
                            <tr key={p._id}>
                                <td>{p.name}</td>
                                <td>{p.sku}</td>
                                <td>{p.recentStock || 0}</td>
                                <td>{totalStock || 0}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export const Stock: React.FC = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get("http://localhost:5002/api/products", {
                    withCredentials: true, // sends cookies (auth)
                });

                setProducts(res.data.products || res.data);
            } catch (err) {
                console.error("Error fetching products:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <MainLayout title="Stock">
            <div className="stock-page">
                {loading ? <p>Loading...</p> : <StockTable products={products} />}
            </div>
        </MainLayout>
    );
};
