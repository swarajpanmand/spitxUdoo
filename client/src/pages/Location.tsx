import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "../components/layout/MainLayout";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Plus, Search } from "lucide-react";
import "./Location.css";

interface Warehouse {
  _id: string;
  name: string;
  locations?: LocationData[];
}

interface LocationData {
  _id: string;
  name: string;
  aisle?: string;
  rack?: string;
  bin?: string;
}

export const Location: React.FC = () => {
  const navigate = useNavigate();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    warehouseId: "",
    aisle: "",
    rack: "",
    bin: "",
  });

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

  // Flatten all locations from all warehouses for display
  const allLocations = warehouses.flatMap(warehouse =>
    (warehouse.locations || []).map(location => ({
      ...location,
      warehouseId: warehouse._id,
      warehouseName: warehouse.name,
    }))
  );

  const filteredLocations = allLocations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.warehouseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:5002/api/warehouses/${formData.warehouseId}/locations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          aisle: formData.aisle,
          rack: formData.rack,
          bin: formData.bin,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create location');
      }

      await fetchWarehouses();
      setFormData({
        name: "",
        warehouseId: "",
        aisle: "",
        rack: "",
        bin: "",
      });
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error saving location:', error);
      alert('Failed to create location');
    }
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
              <div className="form-field">
                <label>Warehouse:</label>
                <select
                  value={formData.warehouseId}
                  onChange={(e) =>
                    setFormData({ ...formData, warehouseId: e.target.value })
                  }
                  className="location-select"
                  required
                >
                  <option value="">Select warehouse</option>
                  {warehouses.map((wh) => (
                    <option key={wh._id} value={wh._id}>
                      {wh.name}
                    </option>
                  ))}
                </select>
              </div>
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
                      warehouseId: "",
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
          {loading ? (
            <p style={{ textAlign: 'center', padding: '2rem' }}>Loading locations...</p>
          ) : filteredLocations.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '2rem' }}>No locations found</p>
          ) : (
            filteredLocations.map((location) => (
              <div key={location._id} className="location-card card">
                <div className="location-card-header">
                  <h3>{location.name}</h3>
                </div>
                <div className="location-card-body">
                  <div className="location-info">
                    <span className="location-label">Warehouse:</span>
                    <span
                      className="location-value warehouse-link"
                      onClick={handleWarehouseClick}
                    >
                      {location.warehouseName}
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
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
};
