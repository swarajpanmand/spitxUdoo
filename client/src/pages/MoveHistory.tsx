

import React, { useState, useEffect } from "react";
import { MainLayout } from "../components/layout/MainLayout";
import { Search, List, Grid, LayoutGrid } from "lucide-react";
import { movementsAPI } from "../services/api";
import "./MoveHistory.css";

interface MoveRecord {
  id: string;
  reference: string;
  date: string;
  contact: string;
  from: string;
  to: string;
  quantity: number;
  status: "Ready" | "Done" | "Cancelled";
  type: "in" | "out" | "internal";
  products?: Array<{
    name: string;
    quantity: number;
  }>;
}

type ViewMode = "list" | "grid" | "kanban";

export const MoveHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [moves, setMoves] = useState<MoveRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMoves();
  }, []);

  const fetchMoves = async () => {
    try {
      const { data } = await movementsAPI.getAll();
      if (data.success) {
        const mappedMoves: MoveRecord[] = data.data.map((item: any) => {
          const isIncoming = ['RECEIPT', 'ADJUSTMENT_IN'].includes(item.type) || (item.type === 'ADJUSTMENT' && item.qty > 0);
          const isOutgoing = ['DELIVERY', 'ADJUSTMENT_OUT'].includes(item.type) || (item.type === 'ADJUSTMENT' && item.qty < 0);

          let type: "in" | "out" | "internal" = "internal";
          if (isIncoming) type = "in";
          else if (isOutgoing) type = "out";

          return {
            id: item._id,
            reference: item.referenceId || item.type,
            date: new Date(item.createdAt).toLocaleDateString(),
            contact: item.warehouseId?.name || 'N/A',
            from: item.fromLocation || (type === 'in' ? 'Vendor' : 'Warehouse'),
            to: item.toLocation || (type === 'out' ? 'Customer' : 'Warehouse'),
            quantity: Math.abs(item.qty),
            status: "Done", // History is always done
            type: type,
            products: [{
              name: item.productId?.name || 'Unknown Product',
              quantity: Math.abs(item.qty)
            }]
          };
        });
        setMoves(mappedMoves);
      }
    } catch (err) {
      console.error("Error fetching move history:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMoves = moves.filter(
    (move) =>
      move.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      move.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusClass = (status: string, type: string) => {
    if (type === "in") return "status-in";
    if (type === "out") return "status-out";
    return "";
  };

  return (
    <MainLayout title="Move History">
      <div className="move-history-page">
        {/* Header with Search and View Toggle */}
        <div className="move-history-header">
          <div className="move-history-search">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search by reference or contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
              title="List View"
            >
              <List size={20} />
            </button>
            <button
              className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
              title="Grid View"
            >
              <Grid size={20} />
            </button>
            <button
              className={`view-btn ${viewMode === "kanban" ? "active" : ""}`}
              onClick={() => setViewMode("kanban")}
              title="Kanban View"
            >
              <LayoutGrid size={20} />
            </button>
          </div>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '2rem' }}>Loading history...</p>
        ) : filteredMoves.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem' }}>No move history found</p>
        ) : (
          <>
            {/* Table View */}
            {viewMode === "list" && (
              <div className="move-history-table-container card">
                <table className="move-history-table">
                  <thead>
                    <tr>
                      <th>Reference</th>
                      <th>Date</th>
                      <th>Contact</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Quantity</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMoves.map((move) => (
                      <React.Fragment key={move.id}>
                        <tr
                          className={`move-row ${move.products ? "has-products" : ""
                            }`}
                        >
                          <td className="font-medium">{move.reference}</td>
                          <td>{move.date}</td>
                          <td>{move.contact}</td>
                          <td>{move.from}</td>
                          <td>{move.to}</td>
                          <td>{move.quantity}</td>
                          <td>
                            <span
                              className={`status-badge ${getStatusClass(
                                move.status,
                                move.type
                              )}`}
                            >
                              {move.status}
                            </span>
                          </td>
                        </tr>
                        {move.products &&
                          move.products.map((product, idx) => (
                            <tr
                              key={`${move.id}-product-${idx}`}
                              className="product-row"
                            >
                              <td colSpan={2}></td>
                              <td colSpan={3} className="product-name">
                                ↳ {product.name}
                              </td>
                              <td>{product.quantity}</td>
                              <td></td>
                            </tr>
                          ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="move-history-grid">
                {filteredMoves.map((move) => (
                  <div key={move.id} className="move-card card">
                    <div className="move-card-header">
                      <h3>{move.reference}</h3>
                      <span
                        className={`status-badge ${getStatusClass(
                          move.status,
                          move.type
                        )}`}
                      >
                        {move.status}
                      </span>
                    </div>
                    <div className="move-card-body">
                      <div className="move-info">
                        <span className="move-label">Date:</span>
                        <span className="move-value">{move.date}</span>
                      </div>
                      <div className="move-info">
                        <span className="move-label">Contact:</span>
                        <span className="move-value">{move.contact}</span>
                      </div>
                      <div className="move-info">
                        <span className="move-label">From:</span>
                        <span className="move-value">{move.from}</span>
                      </div>
                      <div className="move-info">
                        <span className="move-label">To:</span>
                        <span className="move-value">{move.to}</span>
                      </div>
                      <div className="move-info">
                        <span className="move-label">Quantity:</span>
                        <span className="move-value">{move.quantity}</span>
                      </div>
                      {move.products && (
                        <div className="move-products">
                          <span className="move-label">Products:</span>
                          {move.products.map((product, idx) => (
                            <div key={idx} className="product-item">
                              • {product.name} ({product.quantity})
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Kanban View */}
            {viewMode === "kanban" && (
              <div className="move-history-kanban">
                {/* Since all history is "Done", we might want to group by Type instead */}
                {['in', 'out', 'internal'].map(type => (
                  <div key={type} className="kanban-column">
                    <div className="kanban-header">
                      <h3>{type.toUpperCase()}</h3>
                      <span className="kanban-count">
                        {filteredMoves.filter((m) => m.type === type).length}
                      </span>
                    </div>
                    <div className="kanban-items">
                      {filteredMoves
                        .filter((m) => m.type === type)
                        .map((move) => (
                          <div key={move.id} className="kanban-card card">
                            <h4>{move.reference}</h4>
                            <p className="kanban-contact">{move.contact}</p>
                            <div className="kanban-route">
                              {move.from} → {move.to}
                            </div>
                            <div className="kanban-quantity">
                              Qty: {move.quantity}
                            </div>
                            <span
                              className={`status-badge ${getStatusClass(
                                move.status,
                                move.type
                              )}`}
                            >
                              {move.type === "in" ? "IN" : "OUT"}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};
