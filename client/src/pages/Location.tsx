import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "../components/layout/MainLayout";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import "./Location.css";

interface Location {
  id: string;
  name: string;
  shortCode: string;
  warehouse: string;
  aisle?: string;
  rack?: string;
  bin?: string;
}

export const Location: React.FC = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<Location[]>([
    {
      id: "1",
      name: "Rack A1",
      shortCode: "LOC-A1",
      warehouse: "WH-001",
      aisle: "A1",
      rack: "R1",
      bin: "B1",
    },
    {
      id: "2",
      name: "Rack B2",
      shortCode: "LOC-B2",
      warehouse: "WH-001",
      aisle: "A2",
      rack: "R2",
      bin: "B2",
    },
    {
      id: "3",
      name: "Production Shelf 1",
      shortCode: "LOC-PS1",
      warehouse: "WH-002",
      aisle: "P1",
      rack: "R1",
      bin: "B1",
    },
    {
      id: "4",
      name: "Storage Unit 5",
      shortCode: "LOC-SU5",
      warehouse: "WH-003",
    },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    shortCode: "",
    warehouse: "",
    aisle: "",
    rack: "",
    bin: "",
  });

  const warehouses = [
    { id: "WH-001", name: "Main Warehouse" },
    { id: "WH-002", name: "Production Floor" },
    { id: "WH-003", name: "Distribution Center" },
  ];

  const filteredLocations = locations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.shortCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLocation: Location = {
      id: Date.now().toString(),
      ...formData,
    };
    setLocations([...locations, newLocation]);
    setFormData({
      name: "",
      shortCode: "",
      warehouse: "",
      aisle: "",
      rack: "",
      bin: "",
    });
    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      setLocations(locations.filter((l) => l.id !== id));
    }
  };

  const getWarehouseName = (warehouseId: string) => {
    return warehouses.find((w) => w.id === warehouseId)?.name || warehouseId;
  };

  const handleWarehouseClick = () => {
    navigate("/settings/warehouse");
  };

  return (
    <MainLayout title="Location">
      <div className="location-page">
        <div className="location-header">
          <div className="location-search">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <Button
            icon={<Plus size={20} />}
            onClick={() => setIsFormOpen(!isFormOpen)}
          >
            Add Location
          </Button>
        </div>

        {isFormOpen && (
          <div className="location-form-container card">
            <h3>Add New Location</h3>
            <form onSubmit={handleSubmit} className="location-form">
              <div className="form-row">
                <div className="form-field">
                  <label>Name:</label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter location name"
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
                    placeholder="e.g., LOC-A1"
                    required
                  />
                </div>
              </div>
              <div className="form-field">
                <label>Warehouse:</label>
                <select
                  value={formData.warehouse}
                  onChange={(e) =>
                    setFormData({ ...formData, warehouse: e.target.value })
                  }
                  className="location-select"
                  required
                >
                  <option value="">Select warehouse</option>
                  {warehouses.map((wh) => (
                    <option key={wh.id} value={wh.id}>
                      {wh.name} ({wh.id})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label>Aisle:</label>
                  <Input
                    type="text"
                    value={formData.aisle}
                    onChange={(e) =>
                      setFormData({ ...formData, aisle: e.target.value })
                    }
                    placeholder="e.g., A1"
                  />
                </div>
                <div className="form-field">
                  <label>Rack:</label>
                  <Input
                    type="text"
                    value={formData.rack}
                    onChange={(e) =>
                      setFormData({ ...formData, rack: e.target.value })
                    }
                    placeholder="e.g., R1"
                  />
                </div>
                <div className="form-field">
                  <label>Bin:</label>
                  <Input
                    type="text"
                    value={formData.bin}
                    onChange={(e) =>
                      setFormData({ ...formData, bin: e.target.value })
                    }
                    placeholder="e.g., B1"
                  />
                </div>
              </div>
              <div className="form-actions">
                <Button type="submit">Save Location</Button>
                <Button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    setFormData({
                      name: "",
                      shortCode: "",
                      warehouse: "",
                      aisle: "",
                      rack: "",
                      bin: "",
                    });
                  }}
                  style={{ background: "var(--error-color)" }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="location-list">
          {filteredLocations.map((location) => (
            <div key={location.id} className="location-card card">
              <div className="location-card-header">
                <h3>{location.name}</h3>
                <div className="location-actions">
                  <button className="action-btn action-btn-edit" title="Edit">
                    <Edit size={16} />
                  </button>
                  <button
                    className="action-btn action-btn-delete"
                    title="Delete"
                    onClick={() => handleDelete(location.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="location-card-body">
                <div className="location-info">
                  <span className="location-label">Short Code:</span>
                  <span className="location-value">{location.shortCode}</span>
                </div>
                <div className="location-info">
                  <span className="location-label">Warehouse:</span>
                  <span
                    className="location-value warehouse-link"
                    onClick={handleWarehouseClick}
                  >
                    {getWarehouseName(location.warehouse)}
                  </span>
                </div>
                {location.aisle && (
                  <div className="location-info">
                    <span className="location-label">Aisle:</span>
                    <span className="location-value">{location.aisle}</span>
                  </div>
                )}
                {location.rack && (
                  <div className="location-info">
                    <span className="location-label">Rack:</span>
                    <span className="location-value">{location.rack}</span>
                  </div>
                )}
                {location.bin && (
                  <div className="location-info">
                    <span className="location-label">Bin:</span>
                    <span className="location-value">{location.bin}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};
