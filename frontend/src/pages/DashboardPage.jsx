import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BrandLogo from '../components/auth/BrandLogo';
import AuthBackground from '../components/auth/AuthBackground';
import { LogOut, ShieldCheck, User, Mail, Calendar, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
    navigate('/login', { replace: true });
  };

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recent';

  return (
    <div className="auth-page-container">
      <AuthBackground />

      <main className="auth-card animate-fade-in" style={{ maxWidth: '580px' }} role="main">
        <header className="auth-header">
          <BrandLogo size="large" />
          <h1 className="auth-title">Welcome, {user?.name || 'Creator'}!</h1>
          <p className="auth-subtitle">
            Your LastHope workspace is ready. You are authenticated.
          </p>
        </header>

        {/* Security & Status Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#F0FDF4',
            border: '1px solid #DCFCE7',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '24px',
            fontSize: '13.5px',
            color: '#166534',
            fontWeight: 500,
          }}
        >
          <ShieldCheck size={20} color="#16A34A" />
          <span>Session verified & secured via HTTP-only cookie</span>
        </div>

        {/* User Details Card */}
        <div
          style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            marginBottom: '28px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'var(--btn-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFF',
                fontWeight: 700,
                fontSize: 18,
                boxShadow: '0 4px 12px rgba(229, 24, 28, 0.3)',
                overflow: 'hidden',
              }}
            >
              {user?.avatar && !imgError ? (
                <img
                  src={user.avatar}
                  alt={user.name || 'User profile'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  onError={() => setImgError(true)}
                />
              ) : user?.name ? (
                user.name.charAt(0).toUpperCase()
              ) : (
                'U'
              )}
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {user?.name}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                {user?.authProvider === 'google' ? 'Google Verified Member' : 'Verified Member'}
              </p>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0' }} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <Mail size={16} color="var(--brand-coral)" />
              <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {user?.email}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <Calendar size={16} color="var(--brand-coral)" />
              <span>Joined {formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div style={{ marginBottom: '28px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: 'var(--text-secondary)' }}>
            <Sparkles size={16} color="var(--brand-red)" />
            <span>AI workspace session active with MongoDB persistence</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: 'var(--text-secondary)' }}>
            <ShieldCheck size={16} color="var(--brand-red)" />
            <span>Protected route guarded against unauthenticated access</span>
          </div>
        </div>

        {/* Sign Out Action */}
        <button
          type="button"
          id="btn-dashboard-logout"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="btn-secondary"
          style={{ width: '100%', gap: '8px', color: '#DC2626', borderColor: '#FEE2E2' }}
        >
          {isLoggingOut ? (
            <div className="spinner" style={{ borderColor: 'rgba(220,38,38,0.2)', borderTopColor: '#DC2626' }} />
          ) : (
            <>
              <LogOut size={18} />
              <span>Sign Out of lastHope</span>
            </>
          )}
        </button>
      </main>
    </div>
  );
}
