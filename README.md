# StockMaster - Inventory Management System

A modern, full-stack inventory management system built with React, TypeScript, Express, and MongoDB. StockMaster helps businesses manage warehouses, track stock movements, handle receipts and deliveries, and monitor inventory in real-time.

## Features

### Warehouse Management

- Create and manage multiple warehouses
- Track warehouse locations with aisle, rack, and bin details
- Active/inactive status management
- Short code system for quick identification

### Dashboard & Analytics

- Real-time KPI metrics (stock levels, pending operations)
- Recent activity feed with stock movements
- Low stock and out-of-stock alerts
- Interactive filters by warehouse and category

### Operations Management

- **Receipts**: Manage incoming inventory
- **Deliveries**: Track outgoing shipments
- **Adjustments**: Handle stock corrections and adjustments
- Detailed view for each operation type

### Stock Management

- Real-time stock tracking across warehouses
- Product-wise inventory view
- Multiple view modes (List, Grid, Kanban)
- Advanced search and filtering

### Move History

- Complete audit trail of all stock movements
- Three viewing modes: List, Grid, and Kanban
- Filter by type, date, and status
- Detailed movement information with references

### Authentication & Security

- JWT-based authentication
- Email verification system
- Password reset with OTP
- Role-based access control (Admin, Manager, Warehouse Staff)

## Tech Stack

### Frontend

- **React 19** - Modern UI library
- **TypeScript** - Type-safe JavaScript
- **React Router 7** - Client-side routing
- **Axios** - HTTP client
- **Lucide Icons** - Beautiful icon system
- **Vite** - Lightning-fast build tool

### Backend

- **Node.js** - Runtime environment
- **Express 4** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose 8** - ODM for MongoDB
- **JWT** - Secure authentication
- **Bcrypt** - Password hashing

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/swarajpanmand/spitxUdoo.git
cd spitxUdoo
```

2. **Install server dependencies**

```bash
cd server
npm install
```

3. **Install client dependencies**

```bash
cd ../client
npm install
```

4. **Configure environment variables**

Create `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h
NODE_ENV=development

# Email Configuration (optional)
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

Create `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

5. **Start the application**

Start backend server:

```bash
cd server
npm run dev
```

Start frontend development server:

```bash
cd client
npm run dev
```

The application will be available at:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## Project Structure

```
spitxUdoo/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React context providers
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   ├── styles/        # Global styles
│   │   └── types/         # TypeScript types
│   └── package.json
│
├── server/                # Express backend
│   ├── controllers/       # Request handlers
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── services/         # Business logic
│   ├── utils/            # Helper functions
│   └── package.json
│
└── README.md
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Verify email with OTP
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with OTP

### Dashboard

- `GET /api/dashboard/kpis` - Get KPI metrics
- `GET /api/dashboard/recent-activity` - Get recent stock movements

### Warehouses

- `GET /api/warehouses` - List all warehouses
- `POST /api/warehouses` - Create new warehouse
- `PUT /api/warehouses/:id` - Update warehouse
- `DELETE /api/warehouses/:id` - Delete warehouse

### Products

- `GET /api/products` - List all products
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Operations

- `GET /api/receipts` - List receipts
- `GET /api/delivery` - List deliveries
- `GET /api/adjustments` - List adjustments
- `GET /api/move-history` - Get stock movement history

## User Roles

- **Admin**: Full system access, user management
- **Manager**: Warehouse operations, reporting
- **Warehouse Staff**: Basic operations (receipts, deliveries)

## UI Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Sidebar**: Modern teal-themed navigation
- **Dropdown Navigation**: Organized menu for Operations and Settings
- **Multiple View Modes**: List, Grid, and Kanban views
- **Real-time Updates**: Live dashboard metrics
- **Search & Filters**: Advanced filtering options

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Email verification
- Protected API routes
- Role-based authorization
- Input validation

## Development

### Available Scripts

**Client:**

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

**Server:**

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Contact

For any queries or support, please reach out to the development team.

---

**Built with care by the StockMaster Team**
