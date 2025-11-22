# StockMaster API - Backend Implementation Guide

## Quick Reference for Backend Developer

This document provides a quick overview of all API endpoints needed for the StockMaster Inventory Management System.

## Base URL
```
http://localhost:5000/api
```

## Authentication
- **Type**: JWT Bearer Token
- **Header**: `Authorization: Bearer <token>`
- **Token Storage**: Frontend stores in localStorage
- **Token Expiry**: 24 hours recommended

---

## Endpoints Summary

### Authentication (No Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | User login |
| POST | `/auth/signup` | User registration |
| POST | `/auth/request-reset` | Request password reset OTP |
| POST | `/auth/verify-otp` | Verify OTP code |
| POST | `/auth/reset-password` | Reset password with OTP |

### Users (Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get user by ID |
| GET | `/users/role/:role` | Get users by role |
| GET | `/users/stats/summary` | Get user statistics |

### Products (Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | Get all products (supports query params) |
| GET | `/products/:id` | Get product by ID |
| POST | `/products` | Create new product |
| PUT | `/products/:id` | Update product |
| DELETE | `/products/:id` | Delete product |
| GET | `/products/low-stock` | Get low stock products |

### Warehouses (Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/warehouses` | Get all warehouses |
| GET | `/warehouses/:id` | Get warehouse by ID |
| POST | `/warehouses` | Create warehouse |
| PUT | `/warehouses/:id` | Update warehouse |
| DELETE | `/warehouses/:id` | Delete warehouse |

### Receipts - Incoming Stock (Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/receipts` | Get all receipts |
| GET | `/receipts/:id` | Get receipt by ID |
| POST | `/receipts` | Create receipt (status: draft) |
| PUT | `/receipts/:id` | Update receipt |
| POST | `/receipts/:id/validate` | Validate receipt → **Increases stock** |
| POST | `/receipts/:id/cancel` | Cancel receipt |

### Deliveries - Outgoing Stock (Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/deliveries` | Get all deliveries |
| GET | `/deliveries/:id` | Get delivery by ID |
| POST | `/deliveries` | Create delivery (status: draft) |
| PUT | `/deliveries/:id` | Update delivery |
| POST | `/deliveries/:id/pick` | Mark as picked (status: waiting) |
| POST | `/deliveries/:id/pack` | Mark as packed (status: ready) |
| POST | `/deliveries/:id/validate` | Validate delivery → **Decreases stock** |
| POST | `/deliveries/:id/cancel` | Cancel delivery |

### Internal Transfers (Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/transfers` | Get all transfers |
| GET | `/transfers/:id` | Get transfer by ID |
| POST | `/transfers` | Create transfer (status: draft) |
| PUT | `/transfers/:id` | Update transfer |
| POST | `/transfers/:id/validate` | Validate transfer → **Moves stock between warehouses** |
| POST | `/transfers/:id/cancel` | Cancel transfer |

### Inventory Adjustments (Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/adjustments` | Get all adjustments |
| GET | `/adjustments/:id` | Get adjustment by ID |
| POST | `/adjustments` | Create adjustment → **Auto-updates stock** |

### Stock Movements - Ledger (Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/movements` | Get all movements (supports filters) |
| GET | `/movements/product/:productId` | Get movements for product |

### Dashboard (Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/kpis` | Get KPI metrics |
| GET | `/dashboard/recent-activity` | Get recent activity feed |

---

## Important Implementation Notes

### 1. Stock Management Logic

#### Receipt Validation
```javascript
// When POST /receipts/:id/validate is called:
// 1. Change receipt status to "done"
// 2. Set receivedDate to current timestamp
// 3. For each item in receipt:
//    - Increase product stock by quantity
//    - Update stock in the specified warehouse location
// 4. Create stock movement record (type: "receipt")
```

#### Delivery Validation
```javascript
// When POST /deliveries/:id/validate is called:
// 1. Change delivery status to "done"
// 2. Set deliveryDate to current timestamp
// 3. For each item in delivery:
//    - Decrease product stock by quantity
//    - Update stock in the specified warehouse location
// 4. Create stock movement record (type: "delivery")
```

#### Transfer Validation
```javascript
// When POST /transfers/:id/validate is called:
// 1. Change transfer status to "done"
// 2. Set transferDate to current timestamp
// 3. For each item in transfer:
//    - Decrease stock in source warehouse
//    - Increase stock in destination warehouse
//    - Total product stock remains same
// 4. Create stock movement record (type: "transfer")
```

#### Adjustment Creation
```javascript
// When POST /adjustments is called:
// 1. Get current recorded quantity from product/warehouse
// 2. Calculate difference (countedQuantity - recordedQuantity)
// 3. Update product stock to countedQuantity
// 4. Create adjustment record with difference
// 5. Create stock movement record (type: "adjustment")
```

### 2. Status Flow

All operations (receipts, deliveries, transfers) follow this status flow:
```
draft → waiting → ready → done
         ↓         ↓       ↓
      canceled  canceled canceled
```

- **draft**: Initial creation
- **waiting**: In progress (e.g., items picked for delivery)
- **ready**: Ready for final validation (e.g., items packed)
- **done**: Completed and stock updated
- **canceled**: Canceled at any point

### 3. User Roles & Permissions

#### Inventory Manager
```json
{
  "role": "Inventory Manager",
  "permissions": [
    "manage_stock",
    "view_reports",
    "approve_transfers",
    "manage_incoming",
    "manage_outgoing"
  ]
}
```

#### Warehouse Staff
```json
{
  "role": "Warehouse Staff",
  "permissions": [
    "perform_transfers",
    "picking",
    "shelving",
    "counting"
  ]
}
```

### 4. Product Stock Tracking

Products should track stock at multiple levels:
```json
{
  "stockLevel": 150,  // Total across all warehouses
  "locations": [
    {
      "warehouseId": "wh_1",
      "warehouseName": "Main Warehouse",
      "quantity": 100,
      "rack": "A-12"  // Optional
    },
    {
      "warehouseId": "wh_2",
      "warehouseName": "Warehouse 2",
      "quantity": 50,
      "rack": "B-05"
    }
  ]
}
```

### 5. Stock Movement Ledger

Every stock change should create a movement record:
```json
{
  "productId": "prod_1",
  "productName": "Steel Rods",
  "type": "receipt|delivery|transfer|adjustment",
  "quantity": 50,  // Positive for increase, negative for decrease
  "warehouseId": "wh_1",
  "warehouseName": "Main Warehouse",
  "referenceNumber": "RCP-001",  // Link to source document
  "createdAt": "2025-01-22T10:00:00Z",
  "createdBy": "user_1"
}
```

### 6. Error Handling

Always return consistent error format:
```json
{
  "success": false,
  "error": "Error message here"
}
```

Common HTTP status codes:
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (missing/invalid token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **500**: Internal Server Error

### 7. Date Format

Use ISO 8601 format for all dates:
```
2025-01-22T10:30:00Z
```

### 8. Validation Rules

#### Products
- `name`: Required, string, max 255 chars
- `sku`: Required, unique, string, max 50 chars
- `category`: Required, string
- `unitOfMeasure`: Required, string (e.g., "kg", "pcs", "liters")
- `reorderPoint`: Optional, number >= 0
- `initialStock`: Optional, number >= 0

#### Receipts/Deliveries/Transfers
- Must have at least one item
- Each item must reference valid product
- Quantities must be positive numbers
- Warehouse IDs must be valid

#### Adjustments
- `productId`: Required, must exist
- `warehouseId`: Required, must exist
- `countedQuantity`: Required, number >= 0
- `reason`: Optional, string

---

## Testing Checklist

- [ ] User can login and receive JWT token
- [ ] Token is validated on protected routes
- [ ] Products can be created, read, updated, deleted
- [ ] Receipt validation increases stock correctly
- [ ] Delivery validation decreases stock correctly
- [ ] Transfer validation moves stock between warehouses
- [ ] Adjustment updates stock based on physical count
- [ ] Stock movements are logged for all operations
- [ ] Dashboard KPIs calculate correctly
- [ ] Low stock alerts work
- [ ] Status transitions follow the correct flow
- [ ] Error responses are consistent

---

## Database Schema Suggestions

### Users Table
```
id, name, email, password_hash, role, permissions (JSON), 
department, is_active, created_at, updated_at
```

### Products Table
```
id, name, sku (unique), category, unit_of_measure, 
stock_level, reorder_point, created_at, updated_at
```

### Product Locations Table (for multi-warehouse)
```
id, product_id, warehouse_id, quantity, rack, 
created_at, updated_at
```

### Warehouses Table
```
id, name, code (unique), address, is_active, 
created_at, updated_at
```

### Receipts Table
```
id, receipt_number (unique), supplier, status, 
received_date, created_at, created_by, updated_at
```

### Receipt Items Table
```
id, receipt_id, product_id, quantity, warehouse_id
```

### Deliveries Table
```
id, order_number (unique), customer, status, 
delivery_date, created_at, created_by, updated_at
```

### Delivery Items Table
```
id, delivery_id, product_id, quantity, warehouse_id, 
picked, packed
```

### Transfers Table
```
id, transfer_number (unique), source_warehouse_id, 
destination_warehouse_id, status, transfer_date, 
created_at, created_by, updated_at
```

### Transfer Items Table
```
id, transfer_id, product_id, quantity
```

### Adjustments Table
```
id, adjustment_number (unique), product_id, warehouse_id, 
recorded_quantity, counted_quantity, difference, reason, 
created_at, created_by
```

### Stock Movements Table (Ledger)
```
id, product_id, type (enum), quantity, warehouse_id, 
reference_number, created_at, created_by
```

---

## Quick Start Commands

```bash
# Install dependencies
npm install express mongoose dotenv cors bcryptjs jsonwebtoken

# Create .env file
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=24h

# Start server
npm start
```

---

## Full JSON Documentation

For complete request/response examples, see: `API_DOCUMENTATION.json`

---

## Questions?

Contact the frontend team if you need clarification on any endpoint behavior or data structures.
