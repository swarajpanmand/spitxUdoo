import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Briefcase, UserPlus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

export const Signup: React.FC = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'warehouse',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            await signup(formData.name, formData.email, formData.password, formData.role);
            // Redirect to email verification page
            navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
        } catch (err) {
            setError('Failed to create account. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
              <video
            className="auth-video-bg"
            autoPlay
            loop
            muted
            playsInline
        >
            <source src="/src/assets/hero.mp4" type="video/mp4" />
        </video>
            <div className="auth-background"></div>
            <div className="auth-card glass animate-fade-in">
                <div className="auth-header">
                    <div className="auth-logo">
                        <div className="logo-icon gradient-bg">
                            <UserPlus size={32} color="white" />
                        </div>
                        <h1 className="gradient-text">StockMaster</h1>
                    </div>
                    <p className="auth-subtitle">Create your account</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && (
                        <div className="auth-error">
                            <p>{error}</p>
                        </div>
                    )}

                    <Input
                        type="text"
                        name="name"
                        label="Full Name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        icon={<User size={20} />}
                        fullWidth
                        required
                    />

                    <Input
                        type="email"
                        name="email"
                        label="Email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        icon={<Mail size={20} />}
                        fullWidth
                        required
                    />

                    <div className="input-wrapper input-full-width">
                        <label className="input-label">Role</label>
                        <div className="input-container">
                            <span className="input-icon">
                                <Briefcase size={20} />
                            </span>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="input input-with-icon"
                                required
                            >
                                <option value="warehouse">Warehouse Staff</option>
                                <option value="manager">Inventory Manager</option>
                                <option value="admin">Administrator</option>
                            </select>
                        </div>
                    </div>

                    <Input
                        type="password"
                        name="password"
                        label="Password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        icon={<Lock size={20} />}
                        fullWidth
                        required
                    />

                    <Input
                        type="password"
                        name="confirmPassword"
                        label="Confirm Password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        icon={<Lock size={20} />}
                        fullWidth
                        required
                    />

                    <Button type="submit" fullWidth loading={loading} icon={<UserPlus size={20} />}>
                        Create Account
                    </Button>

                    <div className="auth-footer">
                        <p>
                            Already have an account?{' '}
                            <Link to="/login" className="auth-link-primary">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </form>
            </div >
        </div >
    );
};
