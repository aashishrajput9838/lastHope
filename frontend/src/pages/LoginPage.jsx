import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BrandLogo from '../components/auth/BrandLogo';
import AuthBackground from '../components/auth/AuthBackground';
import SocialButtons from '../components/auth/SocialButtons';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithGoogle, login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectAfterAuth = () => {
    const from = location.state?.from?.pathname || '/game';
    navigate(from, { replace: true });
  };

  const handleGoogleSignIn = async () => {
    setServerError('');
    setIsSubmitting(true);
    const result = await loginWithGoogle();
    setIsSubmitting(false);

    if (result.success) {
      redirectAfterAuth();
    } else if (result.error && !result.error.includes('cancelled')) {
      setServerError(result.error);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setServerError('Please enter both email and password.');
      return;
    }

    setServerError('');
    setIsSubmitting(true);
    const result = await login(email.trim(), password);
    setIsSubmitting(false);

    if (result.success) {
      redirectAfterAuth();
    } else {
      setServerError(result.error || 'Invalid credentials. Please try again.');
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
          <p className="auth-subtitle">Sign in to start your café shift & enter the game.</p>
        </header>

        {/* Server Error Alert */}
        {serverError && (
          <div className="auth-banner-error" role="alert">
            <AlertCircle size={18} />
            <span>{serverError}</span>
          </div>
        )}

        {/* Google Sign-In Action */}
        <div style={{ marginTop: '8px', marginBottom: '14px' }}>
          {isSubmitting && !showEmailForm ? (
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

        {/* Divider / Toggle */}
        <div className="auth-divider" style={{ margin: '14px 0 16px' }}>
          <span>OR</span>
        </div>

        {!showEmailForm ? (
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setShowEmailForm(true)}
            style={{ width: '100%', height: '46px', fontSize: '13.5px' }}
          >
            Sign in with Email & Password
          </button>
        ) : (
          <form onSubmit={handleEmailSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">
                Email Address
              </label>
              <div className="input-wrapper">
                <span className="input-icon-left">
                  <Mail size={18} />
                </span>
                <input
                  id="login-email"
                  type="email"
                  className="form-input"
                  placeholder="barista@lasthope.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" htmlFor="login-password">
                  Password
                </label>
                <Link to="/forgot-password" className="forgot-password-link" style={{ fontSize: '12px' }}>
                  Forgot?
                </Link>
              </div>
              <div className="input-wrapper">
                <span className="input-icon-left">
                  <Lock size={18} />
                </span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input has-right-btn"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="input-action-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
              style={{ marginTop: '4px' }}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In to Game</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowEmailForm(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: '12.5px',
                cursor: 'pointer',
                textAlign: 'center',
                marginTop: '6px',
              }}
            >
              ← Back to 1-click login
            </button>
          </form>
        )}

        {/* Switch to Signup */}
        <div className="auth-sub-links" style={{ marginTop: '18px' }}>
          <p className="auth-switch-text">
            Don't have an account?
            <Link to="/signup" className="auth-switch-link">
              Sign up
            </Link>
          </p>
        </div>

        {/* Footer Terms */}
        <footer className="auth-footer-terms" style={{ marginTop: '20px' }}>
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
