import React, { useState, useEffect } from "react";
import { MainLayout } from "../components/layout/MainLayout";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Warehouse.css";

interface Warehouse {
  _id: string;
  name: string;
  address?: string;
  isActive: boolean;
  locations?: Array<{
    _id: string;
    name: string;
    aisle?: string;
    rack?: string;
    bin?: string;
  }>;
  createdAt?: string;
}

export const Warehouse: React.FC = () => {
  const navigate = useNavigate();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    isActive: true,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5002/api/warehouses', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        throw new Error('Failed to fetch warehouses');
      }

      const data = await response.json();
      setWarehouses(data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      setLoading(false);
    }
  };

  const filteredWarehouses = warehouses.filter(
    (warehouse) =>
      warehouse.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const url = editingId
        ? `http://localhost:5002/api/warehouses/${editingId}`
        : 'http://localhost:5002/api/warehouses';

      const method = editingId ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${editingId ? 'update' : 'create'} warehouse`);
      }

      await fetchWarehouses();
      setFormData({ name: "", address: "", isActive: true });
      setIsFormOpen(false);
      setEditingId(null);
    } catch (error) {
      console.error('Error saving warehouse:', error);
      alert(`Failed to ${editingId ? 'update' : 'create'} warehouse`);
    }
  };

  const handleEdit = (warehouse: Warehouse) => {
    setFormData({
      name: warehouse.name,
      address: warehouse.address || "",
      isActive: warehouse.isActive,
    });
    setEditingId(warehouse._id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this warehouse?")) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Since there's no delete endpoint, we'll deactivate it instead
      const response = await fetch(`http://localhost:5002/api/warehouses/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: false }),
      });

      if (!response.ok) {
        throw new Error('Failed to deactivate warehouse');
      }

      await fetchWarehouses();
    } catch (error) {
      console.error('Error deleting warehouse:', error);
      alert('Failed to delete warehouse');
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
            <h3>{editingId ? 'Edit Warehouse' : 'Add New Warehouse'}</h3>
            <form onSubmit={handleSubmit} className="warehouse-form">
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
                    setFormData({
                      name: "",
                      address: "",
                      isActive: true,
                    });
                    setEditingId(null);
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
          {loading ? (
            <p style={{ textAlign: 'center', padding: '2rem' }}>Loading warehouses...</p>
          ) : filteredWarehouses.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '2rem' }}>No warehouses found</p>
          ) : (
            filteredWarehouses.map((warehouse) => (
              <div key={warehouse._id} className="warehouse-card card">
                <div className="warehouse-card-header">
                  <div>
                    <h3>{warehouse.name}</h3>
                    <span
                      className={`status-badge ${warehouse.isActive ? "status-active" : "status-inactive"
                        }`}
                    >
                      {warehouse.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="warehouse-actions">
                    <button
                      className="action-btn action-btn-edit"
                      title="Edit"
                      onClick={() => handleEdit(warehouse)}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="action-btn action-btn-delete"
                      title="Delete"
                      onClick={() => handleDelete(warehouse._id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="warehouse-card-body">
                  <div className="warehouse-info">
                    <span className="warehouse-label">Address:</span>
                    <span className="warehouse-value">{warehouse.address || 'N/A'}</span>
                  </div>
                  <div className="warehouse-info">
                    <span className="warehouse-label">Locations:</span>
                    <span className="warehouse-value">{warehouse.locations?.length || 0} locations</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
};
