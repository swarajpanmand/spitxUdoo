import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import './Auth.css';

export const EmailVerification: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email') || '';
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);

    useEffect(() => {
        if (!email) {
            navigate('/signup');
        }
    }, [email, navigate]);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!otp || otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://localhost:5002/api/auth/verify-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Verification failed');
            }

            setSuccess('Email verified successfully!');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err: any) {
            setError(err.message || 'Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setError('');
        setSuccess('');
        setResending(true);

        try {
            const response = await fetch('http://localhost:5002/api/auth/resend-verification-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to resend OTP');
            }

            setSuccess('OTP has been resent to your email');
        } catch (err: any) {
            setError(err.message || 'Failed to resend OTP');
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-background"></div>
            <div className="auth-card glass animate-fade-in">
                <div className="auth-header">
                    <div className="auth-logo">
                        <div className="logo-icon gradient-bg">
                            <Mail size={32} color="white" />
                        </div>
                        <h1 className="gradient-text">Verify Email</h1>
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

                    {success && (
                        <div className="auth-success">
                            <CheckCircle size={20} />
                            <p>{success}</p>
                        </div>
                    )}

                    <Input
                        type="text"
                        label="Verification Code"
                        placeholder="Enter 6-digit code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        icon={<Mail size={20} />}
                        fullWidth
                        required
                        maxLength={6}
                    />

                    <Button type="submit" fullWidth loading={loading} icon={<CheckCircle size={20} />}>
                        Verify Email
                    </Button>

                    <div className="auth-footer">
                        <p>
                            Didn't receive the code?{' '}
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                className="auth-link-primary"
                                disabled={resending}
                                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                {resending ? 'Sending...' : 'Resend OTP'}
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};
