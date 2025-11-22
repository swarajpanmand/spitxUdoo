import React, { useState } from "react";
import { MainLayout } from "../components/layout/MainLayout";
import { Search, List, Grid, LayoutGrid } from "lucide-react";
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
  type: "in" | "out";
  products?: Array<{
    name: string;
    quantity: number;
  }>;
}

type ViewMode = "list" | "grid" | "kanban";

export const MoveHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  // Mock data - will be replaced with API
  const moves: MoveRecord[] = [
    {
      id: "1",
      reference: "WH/IN/0001",
      date: "12/1/2001",
      contact: "Azure Interior",
      from: "vendor",
      to: "WH/Stock1",
      quantity: 50,
      status: "Ready",
      type: "in",
    },
    {
      id: "2",
      reference: "WH/OUT/0002",
      date: "12/1/2001",
      contact: "Determined Chimpanzee",
      from: "WH/Stock1",
      to: "vendor",
      quantity: 30,
      status: "Ready",
      type: "out",
    },
    {
      id: "3",
      reference: "WH/OUT/0002",
      date: "12/1/2001",
      contact: "Azure Interior",
      from: "WH/Stock2",
      to: "vendor",
      quantity: 20,
      status: "Ready",
      type: "out",
      products: [
        { name: "Steel Rods", quantity: 10 },
        { name: "Bolts", quantity: 10 },
      ],
    },
    {
      id: "4",
      reference: "WH/IN/0003",
      date: "12/2/2001",
      contact: "Global Supplies",
      from: "vendor",
      to: "WH/Stock1",
      quantity: 100,
      status: "Done",
      type: "in",
    },
    {
      id: "5",
      reference: "WH/OUT/0004",
      date: "12/2/2001",
      contact: "Tech Corp",
      from: "WH/Stock2",
      to: "customer",
      quantity: 45,
      status: "Cancelled",
      type: "out",
    },
  ];

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
                      className={`move-row ${
                        move.products ? "has-products" : ""
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
            <div className="kanban-column">
              <div className="kanban-header">
                <h3>Ready</h3>
                <span className="kanban-count">
                  {filteredMoves.filter((m) => m.status === "Ready").length}
                </span>
              </div>
              <div className="kanban-items">
                {filteredMoves
                  .filter((m) => m.status === "Ready")
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

            <div className="kanban-column">
              <div className="kanban-header">
                <h3>Done</h3>
                <span className="kanban-count">
                  {filteredMoves.filter((m) => m.status === "Done").length}
                </span>
              </div>
              <div className="kanban-items">
                {filteredMoves
                  .filter((m) => m.status === "Done")
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

            <div className="kanban-column">
              <div className="kanban-header">
                <h3>Cancelled</h3>
                <span className="kanban-count">
                  {filteredMoves.filter((m) => m.status === "Cancelled").length}
                </span>
              </div>
              <div className="kanban-items">
                {filteredMoves
                  .filter((m) => m.status === "Cancelled")
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
          </div>
        )}
      </div>
    </MainLayout>
  );
};
