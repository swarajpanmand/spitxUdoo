import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, KeyRound } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import './Auth.css';

export const PasswordReset: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!email) {
            setError('Please enter your email');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://localhost:5002/api/auth/request-reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send OTP');
            }

            setMessage('OTP sent to your email');
            // Redirect to reset-otp page
            setTimeout(() => navigate(`/reset-otp?email=${email}`), 1500);
        } catch (err: any) {
            setError(err.message || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!otp || otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            // TODO: Replace with actual API call
            // await authAPI.verifyOTP(email, otp);

            // Mock success
            await new Promise(resolve => setTimeout(resolve, 1000));
            setStep('password');
        } catch (err) {
            setError('Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!newPassword || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            // TODO: Replace with actual API call
            // await authAPI.resetPassword(email, otp, newPassword);

            // Mock success
            await new Promise(resolve => setTimeout(resolve, 1000));
            setMessage('Password reset successful!');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError('Failed to reset password. Please try again.');
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
                            <KeyRound size={32} color="white" />
                        </div>
                        <h1 className="gradient-text">Reset Password</h1>
                    </div>
                    <p className="auth-subtitle">
                        {step === 'email' && 'Enter your email to receive OTP'}
                        {step === 'otp' && 'Enter the OTP sent to your email'}
                        {step === 'password' && 'Create a new password'}
                    </p>
                </div>

                {message && (
                    <div className="auth-success">
                        <p>{message}</p>
                    </div>
                )}

                {error && (
                    <div className="auth-error">
                        <p>{error}</p>
                    </div>
                )}

                {step === 'email' && (
                    <form onSubmit={handleEmailSubmit} className="auth-form">
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

                        <Button type="submit" fullWidth loading={loading}>
                            Send OTP
                        </Button>

                        <div className="auth-footer">
                            <Link to="/login" className="auth-link">
                                Back to login
                            </Link>
                        </div>
                    </form>
                )}

                {step === 'otp' && (
                    <form onSubmit={handleOtpSubmit} className="auth-form">
                        <Input
                            type="text"
                            label="OTP"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            icon={<KeyRound size={20} />}
                            maxLength={6}
                            fullWidth
                            required
                        />

                        <Button type="submit" fullWidth loading={loading}>
                            Verify OTP
                        </Button>

                        <div className="auth-footer">
                            <button
                                type="button"
                                onClick={() => setStep('email')}
                                className="auth-link"
                            >
                                Change email
                            </button>
                        </div>
                    </form>
                )}

                {step === 'password' && (
                    <form onSubmit={handlePasswordSubmit} className="auth-form">
                        <Input
                            type="password"
                            label="New Password"
                            placeholder="Create a new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            icon={<Lock size={20} />}
                            fullWidth
                            required
                        />

                        <Input
                            type="password"
                            label="Confirm Password"
                            placeholder="Confirm your new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            icon={<Lock size={20} />}
                            fullWidth
                            required
                        />

                        <Button type="submit" fullWidth loading={loading}>
                            Reset Password
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
};
