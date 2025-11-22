import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import './Auth.css';

export const NewPassword: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const resetToken = searchParams.get('token') || '';
    const email = searchParams.get('email') || '';
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!resetToken || !email) {
            navigate('/forgot-password');
        }
    }, [resetToken, email, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.newPassword || !formData.confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://localhost:5002/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resetToken,
                    newPassword: formData.newPassword
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Password reset failed');
            }

            // Auto-login after successful password reset
            if (data.token && data.user) {
                const userWithPermissions = {
                    ...data.user,
                    permissions: getPermissionsForRole(data.user.role),
                    isActive: true
                };

                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(userWithPermissions));

                // Redirect to dashboard
                window.location.href = '/dashboard';
            }
        } catch (err: any) {
            setError(err.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    const getPermissionsForRole = (role: string): string[] => {
        switch (role) {
            case 'admin':
                return [
                    'manage_stock', 'view_reports', 'approve_transfers',
                    'perform_transfers', 'picking', 'shelving', 'counting',
                    'manage_users', 'manage_settings'
                ];
            case 'manager':
                return ['manage_stock', 'view_reports', 'approve_transfers'];
            case 'warehouse':
                return ['perform_transfers', 'picking', 'shelving', 'counting'];
            default:
                return [];
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-background"></div>
            <div className="auth-card glass animate-fade-in">
                <div className="auth-header">
                    <div className="auth-logo">
                        <div className="logo-icon gradient-bg">
                            <Lock size={32} color="white" />
                        </div>
                        <h1 className="gradient-text">New Password</h1>
                    </div>
                    <p className="auth-subtitle">Enter your new password</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && (
                        <div className="auth-error">
                            <p>{error}</p>
                        </div>
                    )}

                    <Input
                        type="password"
                        label="New Password"
                        placeholder="Enter new password"
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        icon={<Lock size={20} />}
                        fullWidth
                        required
                    />

                    <Input
                        type="password"
                        label="Confirm Password"
                        placeholder="Confirm new password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        icon={<Lock size={20} />}
                        fullWidth
                        required
                    />

                    <Button type="submit" fullWidth loading={loading} icon={<CheckCircle size={20} />}>
                        Reset Password
                    </Button>
                </form>
            </div>
        </div>
    );
};
