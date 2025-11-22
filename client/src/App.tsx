import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { PasswordReset } from './pages/auth/PasswordReset';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<PasswordReset />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receipts"
            element={
              <ProtectedRoute>
                <div style={{ padding: '2rem' }}>
                  <h1>Receipts - Coming Soon</h1>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/deliveries"
            element={
              <ProtectedRoute>
                <div style={{ padding: '2rem' }}>
                  <h1>Deliveries - Coming Soon</h1>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/transfers"
            element={
              <ProtectedRoute>
                <div style={{ padding: '2rem' }}>
                  <h1>Internal Transfers - Coming Soon</h1>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/adjustments"
            element={
              <ProtectedRoute>
                <div style={{ padding: '2rem' }}>
                  <h1>Inventory Adjustments - Coming Soon</h1>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <div style={{ padding: '2rem' }}>
                  <h1>Move History - Coming Soon</h1>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/warehouses"
            element={
              <ProtectedRoute>
                <div style={{ padding: '2rem' }}>
                  <h1>Warehouses - Coming Soon</h1>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <div style={{ padding: '2rem' }}>
                  <h1>Settings - Coming Soon</h1>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
