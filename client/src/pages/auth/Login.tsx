import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-background"></div>
            <div className="auth-card glass animate-fade-in">
                <div className="auth-header">
                    <div className="auth-logo">
                        <div className="logo-icon gradient-bg">
                            <LogIn size={32} color="white" />
                        </div>
                        <h1 className="gradient-text">StockMaster</h1>
                    </div>
                    <p className="auth-subtitle">Sign in to manage your inventory</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && (
                        <div className="auth-error">
                            <p>{error}</p>
                        </div>
                    )}

                    <Input
                        type="email"
                        label="Email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        icon={<Mail size={20} />}
                        fullWidth
                        required
                    />

                    <Input
                        type="password"
                        label="Password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        icon={<Lock size={20} />}
                        fullWidth
                        required
                    />

                    <div className="auth-options">
                        <Link to="/forgot-password" className="auth-link">
                            Forgot password?
                        </Link>
                    </div>

                    <Button type="submit" fullWidth loading={loading} icon={<LogIn size={20} />}>
                        Sign In
                    </Button>

                    <div className="auth-footer">
                        <p>
                            Don't have an account?{' '}
                            <Link to="/signup" className="auth-link-primary">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};
