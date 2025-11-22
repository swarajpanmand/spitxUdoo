import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import connectDB from '../config/db.js';

// Load environment variables
dotenv.config();

// Sample data for Inventory Managers and Warehouse Staff
const users = [
    // Inventory Managers
    {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@spitxudoo.com',
        role: 'Inventory Manager',
        permissions: ['manage_stock', 'view_reports', 'approve_transfers', 'manage_incoming', 'manage_outgoing'],
        department: 'Inventory Control',
        isActive: true
    },
    {
        name: 'Michael Chen',
        email: 'michael.chen@spitxudoo.com',
        role: 'Inventory Manager',
        permissions: ['manage_stock', 'view_reports', 'approve_transfers', 'manage_incoming', 'manage_outgoing'],
        department: 'Inventory Control',
        isActive: true
    },
    {
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@spitxudoo.com',
        role: 'Inventory Manager',
        permissions: ['manage_stock', 'view_reports', 'approve_transfers', 'manage_incoming', 'manage_outgoing'],
        department: 'Supply Chain',
        isActive: true
    },

    // Warehouse Staff
    {
        name: 'David Martinez',
        email: 'david.martinez@spitxudoo.com',
        role: 'Warehouse Staff',
        permissions: ['perform_transfers', 'picking', 'shelving', 'counting'],
        department: 'Warehouse Operations',
        isActive: true
    },
    {
        name: 'Lisa Anderson',
        email: 'lisa.anderson@spitxudoo.com',
        role: 'Warehouse Staff',
        permissions: ['perform_transfers', 'picking', 'shelving', 'counting'],
        department: 'Warehouse Operations',
        isActive: true
    },
    {
        name: 'James Wilson',
        email: 'james.wilson@spitxudoo.com',
        role: 'Warehouse Staff',
        permissions: ['perform_transfers', 'picking', 'shelving', 'counting'],
        department: 'Warehouse Operations',
        isActive: true
    },
    {
        name: 'Maria Garcia',
        email: 'maria.garcia@spitxudoo.com',
        role: 'Warehouse Staff',
        permissions: ['perform_transfers', 'picking', 'shelving', 'counting'],
        department: 'Warehouse Operations',
        isActive: true
    },
    {
        name: 'Robert Taylor',
        email: 'robert.taylor@spitxudoo.com',
        role: 'Warehouse Staff',
        permissions: ['perform_transfers', 'picking', 'shelving', 'counting'],
        department: 'Warehouse Operations',
        isActive: true
    }
];

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        console.log('🗑️  Clearing existing users...');
        await User.deleteMany({});

        console.log('📝 Inserting seed data...');
        const createdUsers = await User.insertMany(users);

        console.log(`✅ Successfully created ${createdUsers.length} users:`);

        // Group by role
        const inventoryManagers = createdUsers.filter(u => u.role === 'Inventory Manager');
        const warehouseStaff = createdUsers.filter(u => u.role === 'Warehouse Staff');

        console.log(`\n👔 Inventory Managers (${inventoryManagers.length}):`);
        inventoryManagers.forEach(user => {
            console.log(`   - ${user.name} (${user.email})`);
        });

        console.log(`\n👷 Warehouse Staff (${warehouseStaff.length}):`);
        warehouseStaff.forEach(user => {
            console.log(`   - ${user.name} (${user.email})`);
        });

        console.log('\n✨ Database seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run the seed function
seedDatabase();
