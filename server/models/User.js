import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    role: {
        type: String,
        required: [true, 'Role is required'],
        enum: {
            values: ['Inventory Manager', 'Warehouse Staff'],
            message: '{VALUE} is not a valid role'
        }
    },
    permissions: {
        type: [String],
        default: []
    },
    department: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Add index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

// Virtual for user's full info
userSchema.virtual('info').get(function () {
    return `${this.name} (${this.role})`;
});

const User = mongoose.model('User', userSchema);

export default User;
