import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BrandLogo from '../components/auth/BrandLogo';
import AuthBackground from '../components/auth/AuthBackground';
import SocialButtons from '../components/auth/SocialButtons';

export default function SignupPage() {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleSignIn = async () => {
    setServerError('');
    setIsSubmitting(true);
    const result = await loginWithGoogle();
    setIsSubmitting(false);

    if (result.success) {
      navigate('/dashboard', { replace: true });
    } else if (result.error && !result.error.includes('cancelled')) {
      setServerError(result.error);
    }
  };

  return (
    <div className="auth-page-container">
      <AuthBackground />

      <main className="auth-card animate-fade-in" role="main" style={{ maxWidth: '480px' }}>
        {/* Brand Header */}
        <header className="auth-header">
          <BrandLogo size="default" />
          <h1 className="auth-title">Welcome to lastHope</h1>
          <p className="auth-subtitle">Create or access your account using Google.</p>
        </header>

        {/* Server Error Alert */}
        {serverError && (
          <div className="auth-banner-error" role="alert">
            <AlertCircle size={18} />
            <span>{serverError}</span>
          </div>
        )}

        {/* Single Google Sign-In Action */}
        <div style={{ marginTop: '8px', marginBottom: '8px' }}>
          {isSubmitting ? (
            <button
              type="button"
              className="btn-primary"
              disabled
              style={{ width: '100%', height: '48px' }}
            >
              <div className="spinner" />
              <span>Connecting with Google...</span>
            </button>
          ) : (
            <SocialButtons onGoogleClick={handleGoogleSignIn} />
          )}
        </div>

        {/* Footer Terms */}
        <footer className="auth-footer-terms" style={{ marginTop: '24px' }}>
          By continuing, you agree to lastHope's{' '}
          <a href="#terms" onClick={(e) => e.preventDefault()}>
            Terms and Conditions
          </a>{' '}
          and{' '}
          <a href="#privacy" onClick={(e) => e.preventDefault()}>
            Privacy Policy
          </a>
          .
        </footer>
      </main>
    </div>
  );
}
