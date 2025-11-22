import React, { useState } from "react";
import { MainLayout } from "../components/layout/MainLayout";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import "./Warehouse.css";

interface Warehouse {
  id: string;
  name: string;
  shortCode: string;
  address: string;
  isActive: boolean;
  createdAt?: string;
}

export const Warehouse: React.FC = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([
    {
      id: "1",
      name: "Main Warehouse",
      shortCode: "WH-001",
      address: "123 Storage St, City",
      isActive: true,
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Production Floor",
      shortCode: "WH-002",
      address: "456 Factory Rd, City",
      isActive: true,
      createdAt: "2024-02-20",
    },
    {
      id: "3",
      name: "Distribution Center",
      shortCode: "WH-003",
      address: "789 Logistics Ave, City",
      isActive: false,
      createdAt: "2024-03-10",
    },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    shortCode: "",
    address: "",
    isActive: true,
  });

  const filteredWarehouses = warehouses.filter(
    (warehouse) =>
      warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.shortCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newWarehouse: Warehouse = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setWarehouses([...warehouses, newWarehouse]);
    setFormData({ name: "", shortCode: "", address: "", isActive: true });
    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this warehouse?")) {
      setWarehouses(warehouses.filter((w) => w.id !== id));
    }
  };

  return (
    <MainLayout title="Warehouse">
      <div className="warehouse-page">
        <div className="warehouse-header">
          <div className="warehouse-search">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search warehouses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <Button
            icon={<Plus size={20} />}
            onClick={() => setIsFormOpen(!isFormOpen)}
          >
            Add Warehouse
          </Button>
        </div>

        {isFormOpen && (
          <div className="warehouse-form-container card">
            <h3>Add New Warehouse</h3>
            <form onSubmit={handleSubmit} className="warehouse-form">
              <div className="form-row">
                <div className="form-field">
                  <label>Name:</label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter warehouse name"
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Short Code:</label>
                  <Input
                    type="text"
                    value={formData.shortCode}
                    onChange={(e) =>
                      setFormData({ ...formData, shortCode: e.target.value })
                    }
                    placeholder="e.g., WH-001"
                    required
                  />
                </div>
              </div>
              <div className="form-field">
                <label>Address:</label>
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Enter warehouse address"
                  required
                  rows={3}
                  className="warehouse-textarea"
                />
              </div>
              <div className="form-field checkbox-field">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                />
                <label htmlFor="isActive">Active Warehouse</label>
              </div>
              <div className="form-actions">
                <Button type="submit">Save Warehouse</Button>
                <Button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    setFormData({ name: "", shortCode: "", address: "", isActive: true });
                  }}
                  style={{ background: "var(--error-color)" }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="warehouse-list">
          {filteredWarehouses.map((warehouse) => (
            <div key={warehouse.id} className="warehouse-card card">
              <div className="warehouse-card-header">
                <div>
                  <h3>{warehouse.name}</h3>
                  <span className={`status-badge ${warehouse.isActive ? 'status-active' : 'status-inactive'}`}>
                    {warehouse.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="warehouse-actions">
                  <button className="action-btn action-btn-edit" title="Edit">
                    <Edit size={16} />
                  </button>
                  <button
                    className="action-btn action-btn-delete"
                    title="Delete"
                    onClick={() => handleDelete(warehouse.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="warehouse-card-body">
                <div className="warehouse-info">
                  <span className="warehouse-label">Short Code:</span>
                  <span className="warehouse-value">{warehouse.shortCode}</span>
                </div>
                <div className="warehouse-info">
                  <span className="warehouse-label">Address:</span>
                  <span className="warehouse-value">{warehouse.address}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};
