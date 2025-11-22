import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import './Auth.css';

export const ResetOTP: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email') || '';
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!email) {
            navigate('/forgot-password');
        }
    }, [email, navigate]);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!otp || otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://localhost:5002/api/auth/verify-reset-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Invalid OTP');
            }

            // Navigate to reset password page with the reset token
            navigate(`/reset-password?token=${data.resetToken}&email=${email}`);
        } catch (err: any) {
            setError(err.message || 'Invalid or expired OTP');
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
                            <Lock size={32} color="white" />
                        </div>
                        <h1 className="gradient-text">Enter OTP</h1>
                    </div>
                    <p className="auth-subtitle">
                        We've sent a 6-digit code to<br />
                        <strong>{email}</strong>
                    </p>
                </div>

                <form onSubmit={handleVerify} className="auth-form">
                    {error && (
                        <div className="auth-error">
                            <p>{error}</p>
                        </div>
                    )}

                    <Input
                        type="text"
                        label="Reset Code"
                        placeholder="Enter 6-digit code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        icon={<Lock size={20} />}
                        fullWidth
                        required
                        maxLength={6}
                    />

                    <Button type="submit" fullWidth loading={loading} icon={<CheckCircle size={20} />}>
                        Verify Code
                    </Button>

                    <div className="auth-footer">
                        <p>
                            Didn't receive the code?{' '}
                            <button
                                type="button"
                                onClick={() => navigate('/forgot-password')}
                                className="auth-link-primary"
                                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                Request new code
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};
