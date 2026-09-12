import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BrandLogo from '../components/auth/BrandLogo';
import {
  Coffee,
  Play,
  LogOut,
  Volume2,
  VolumeX,
  User,
  Clock,
  Coins,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  Flame,
  Settings,
} from 'lucide-react';

export default function GamePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [shiftActive, setShiftActive] = useState(false);
  const [shiftSeconds, setShiftSeconds] = useState(0);
  const [servedOrders, setServedOrders] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);

  const handleStartShift = () => {
    setShiftActive(true);
  };

  const handleServeOrder = () => {
    setServedOrders((prev) => prev + 1);
    setCoinsEarned((prev) => prev + 18);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="game-page-container">
      {/* Top Game Bar */}
      <header className="game-top-bar" role="banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <BrandLogo size="small" />
            <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--coffee-crema)' }}>
              Barista Game
            </span>
          </Link>

          <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>

          {/* Player Badge */}
          <div className="game-barista-badge">
            <div className="game-avatar-circle">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || 'Barista'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                />
              ) : (
                user?.name?.charAt(0).toUpperCase() || 'B'
              )}
            </div>
            <div className="game-barista-info">
              <h3>{user?.name || 'Barista'}</h3>
              <p>Level 1 Barista • lastHope Café</p>
            </div>
          </div>
        </div>

        {/* Top Actions */}
        <div className="game-top-actions">
          {/* Sound Toggle */}
          <button
            type="button"
            className="btn-coffee-text"
            onClick={() => setSoundEnabled(!soundEnabled)}
            style={{ color: '#FFF', padding: '6px 12px' }}
            title={soundEnabled ? 'Mute Game Audio' : 'Unmute Game Audio'}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} color="#94A3B8" />}
          </button>

          {/* Profile / Account Link */}
          <Link
            to="/dashboard"
            className="btn-coffee-secondary"
            style={{
              padding: '6px 14px',
              fontSize: '13px',
              background: 'rgba(255,255,255,0.08)',
              color: '#FFF',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            <User size={14} />
            <span>Profile</span>
          </Link>

          {/* Return to Landing */}
          <Link
            to="/"
            className="btn-coffee-secondary"
            style={{
              padding: '6px 14px',
              fontSize: '13px',
              background: 'rgba(255,255,255,0.08)',
              color: '#FFF',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            <ArrowLeft size={14} />
            <span>Landing</span>
          </Link>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="btn-coffee-text"
            style={{ color: '#F87171', padding: '6px 12px', fontSize: '13px' }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Game Interface */}
      <main className="game-main-content">
        {/* Welcome Shift Banner */}
        <div className="game-welcome-banner animate-fade-in">
          <div className="game-welcome-text">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#FBBF24', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              <Sparkles size={16} />
              <span>MORNING SHIFT • STATION #1</span>
            </div>
            <h1>Welcome to the Café, {user?.name || 'Barista'}!</h1>
            <p>Your first order is waiting.</p>
          </div>

          {!shiftActive ? (
            <button
              type="button"
              onClick={handleStartShift}
              className="game-shift-action-btn"
              id="start-shift-btn"
            >
              <Play size={20} fill="#FFF" />
              <span>START SHIFT</span>
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', color: '#86EFAC', fontWeight: 800, textTransform: 'uppercase' }}>
                  ● SHIFT LIVE
                </span>
                <h3 style={{ fontSize: '18px', color: '#FBBF24', fontWeight: 900 }}>
                  ${coinsEarned} Earned
                </h3>
              </div>
              <button
                type="button"
                onClick={handleServeOrder}
                className="game-shift-action-btn"
                style={{ padding: '12px 24px' }}
              >
                <Coffee size={18} />
                <span>Serve Next Order</span>
              </button>
            </div>
          )}
        </div>

        {/* Café Workstation Layout */}
        <div className="game-station-grid">
          {/* Active Ticket Card */}
          <div className="game-card-panel">
            <div className="game-panel-title">
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Coffee size={18} color="var(--coffee-caramel)" />
                Current Order Ticket
              </span>
              <span style={{ fontSize: '12px', color: '#86EFAC', background: 'rgba(34, 197, 94, 0.12)', padding: '2px 8px', borderRadius: '6px' }}>
                Active
              </span>
            </div>

            <div style={{ background: '#25150C', borderRadius: '14px', padding: '18px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--coffee-crema)', fontWeight: 700 }}>
                  TICKET #101
                </span>
                <span style={{ fontSize: '12px', color: '#FBBF24', fontWeight: 700 }}>
                  Reward: +$18.00
                </span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFF', marginBottom: '4px' }}>
                Customer: Oliver (Regular)
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--coffee-caramel)', fontWeight: 600, marginBottom: '14px' }}>
                Double Shot Americano • Splash of Oat Milk
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.75)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={15} color="#22C55E" />
                  <span>Grind: Medium-Fine Espresso Blend</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={15} color="#22C55E" />
                  <span>Extraction: 28 seconds • 9 Bar Pressure</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={15} color="#22C55E" />
                  <span>Water: 94°C Filtered Hot Water</span>
                </div>
              </div>
            </div>

            {shiftActive && (
              <button
                type="button"
                onClick={handleServeOrder}
                className="btn-coffee-primary"
                style={{ width: '100%', height: '46px', marginTop: 'auto' }}
              >
                Deliver Order to Oliver
              </button>
            )}
          </div>

          {/* Station Diagnostics & Shift Metrics */}
          <div className="game-card-panel">
            <div className="game-panel-title">
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Flame size={18} color="#E25B2D" />
                Equipment & Station Status
              </span>
              <span style={{ fontSize: '12px', color: 'var(--coffee-crema)' }}>
                All Systems Calibrated
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: '#25150C', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '11.5px', color: 'var(--coffee-crema)', fontWeight: 700 }}>
                  ESP MACHINE BOILER
                </span>
                <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#FFF', marginTop: '4px' }}>
                  93.5 °C
                </h4>
                <p style={{ fontSize: '11px', color: '#86EFAC' }}>Ready to pull</p>
              </div>

              <div style={{ background: '#25150C', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '11.5px', color: 'var(--coffee-crema)', fontWeight: 700 }}>
                  BURR GRINDER
                </span>
                <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#FFF', marginTop: '4px' }}>
                  Setting 3.2
                </h4>
                <p style={{ fontSize: '11px', color: '#86EFAC' }}>Calibrated</p>
              </div>

              <div style={{ background: '#25150C', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '11.5px', color: 'var(--coffee-crema)', fontWeight: 700 }}>
                  ORDERS SERVED
                </span>
                <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#FFF', marginTop: '4px' }}>
                  {servedOrders}
                </h4>
                <p style={{ fontSize: '11px', color: 'var(--coffee-caramel)' }}>Goal: 10 today</p>
              </div>

              <div style={{ background: '#25150C', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '11.5px', color: 'var(--coffee-crema)', fontWeight: 700 }}>
                  CUSTOMER RATING
                </span>
                <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#FBBF24', marginTop: '4px' }}>
                  4.98 ★
                </h4>
                <p style={{ fontSize: '11px', color: '#86EFAC' }}>Flawless Service</p>
              </div>
            </div>

            {/* Quick Helper */}
            <div style={{ padding: '12px 14px', background: 'rgba(226, 91, 45, 0.08)', borderRadius: '12px', border: '1px solid rgba(226, 91, 45, 0.2)', fontSize: '12.5px', color: 'var(--coffee-cream)' }}>
              💡 <strong>Barista Tip:</strong> Keep steam wand purged and wiped down between latte orders for maximum foam silkiness!
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
