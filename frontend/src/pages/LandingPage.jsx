import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BrandLogo from '../components/auth/BrandLogo';
import {
  Coffee,
  Sparkles,
  Users,
  Store,
  Trophy,
  ArrowRight,
  Clock,
  Coins,
  Star,
  CheckCircle2,
  Sliders,
  Menu,
  X,
  Flame,
  UserCheck,
} from 'lucide-react';

export default function LandingPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [interactiveBrewStep, setInteractiveBrewStep] = useState(1);

  const handlePlayNow = () => {
    if (isAuthenticated) {
      navigate('/game');
    } else {
      navigate('/login', { state: { from: { pathname: '/game' } } });
    }
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="coffee-landing">
      {/* ====================================================================
          TOP NAVIGATION BAR
          ==================================================================== */}
      <nav className="coffee-nav" role="navigation" aria-label="Main Navigation">
        <div className="coffee-nav-container">
          <Link to="/" className="coffee-nav-brand">
            <BrandLogo size="default" />
            <div className="coffee-brand-badge">
              <span className="coffee-game-tag">Barista Game</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="coffee-nav-links">
            <li>
              <a
                href="#hero"
                className="coffee-nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('hero');
                }}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#features"
                className="coffee-nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('features');
                }}
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#how-to-play"
                className="coffee-nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('how-to-play');
                }}
              >
                How to Play
              </a>
            </li>
            <li>
              <a
                href="#preview"
                className="coffee-nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('preview');
                }}
              >
                Game Preview
              </a>
            </li>
          </ul>

          {/* Nav Actions / Dynamic Auth State */}
          <div className="coffee-nav-actions">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="btn-coffee-text"
                  title="View your LastHope Account & Profile"
                  id="nav-profile-btn"
                >
                  <UserCheck size={16} color="var(--coffee-caramel)" />
                  <span>Profile</span>
                </Link>
                <button
                  type="button"
                  onClick={handlePlayNow}
                  className="btn-coffee-primary"
                  id="nav-continue-shift-btn"
                >
                  <Coffee size={16} />
                  <span>Continue Shift</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn-coffee-text"
                  state={{ from: { pathname: '/game' } }}
                  id="nav-login-btn"
                >
                  Sign In
                </Link>
                <button
                  type="button"
                  onClick={handlePlayNow}
                  className="btn-coffee-primary"
                  id="nav-play-now-btn"
                >
                  <Coffee size={16} />
                  <span>Play Now</span>
                </button>
              </>
            )}

            {/* Mobile Nav Hamburger */}
            <button
              type="button"
              className="mobile-nav-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            style={{
              padding: '20px 24px',
              backgroundColor: '#FFFFFF',
              borderBottom: '1px solid var(--coffee-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <a
              href="#hero"
              className="coffee-nav-link"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('hero');
              }}
            >
              Home
            </a>
            <a
              href="#features"
              className="coffee-nav-link"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('features');
              }}
            >
              Features
            </a>
            <a
              href="#how-to-play"
              className="coffee-nav-link"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('how-to-play');
              }}
            >
              How to Play
            </a>
            <a
              href="#preview"
              className="coffee-nav-link"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('preview');
              }}
            >
              Game Preview
            </a>
            <hr style={{ border: 'none', borderTop: '1px solid var(--coffee-border)' }} />
            {isAuthenticated ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link to="/dashboard" className="btn-coffee-secondary" style={{ width: '100%' }}>
                  Profile ({user?.name || 'Player'})
                </Link>
                <button
                  type="button"
                  onClick={handlePlayNow}
                  className="btn-coffee-primary"
                  style={{ width: '100%' }}
                >
                  Continue Shift →
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link to="/login" className="btn-coffee-secondary" style={{ width: '100%' }}>
                  Sign In
                </Link>
                <button
                  type="button"
                  onClick={handlePlayNow}
                  className="btn-coffee-primary"
                  style={{ width: '100%' }}
                >
                  Play Now →
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* ====================================================================
          HERO SECTION
          ==================================================================== */}
      <header className="coffee-hero" id="hero">
        <div className="hero-glow-bg" />

        <div className="hero-content">
          {/* Pill Badge */}
          <div className="hero-pill-badge">
            <Sparkles size={14} color="#E25B2D" />
            <span>SEASON 1 • CASUAL COFFEE SIMULATION</span>
          </div>

          {/* Dynamic Authenticated Welcome Banner */}
          {isAuthenticated && (
            <div className="hero-user-greeting">
              <div className="hero-user-greeting-avatar">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                  />
                ) : (
                  user?.name?.charAt(0).toUpperCase() || 'B'
                )}
              </div>
              <div className="hero-user-greeting-text">
                <h4>Welcome back, {user?.name || 'Barista'}!</h4>
                <p>Your café counter is prepped and the morning rush awaits.</p>
              </div>
            </div>
          )}

          {/* Headline & Subtitle */}
          <h1 className="hero-title">
            BREW. SERVE.{' '}
            <span className="highlight-coffee">BUILD.</span>
          </h1>

          <p className="hero-subtitle">
            Step behind the counter and build your coffee empire, one perfect cup at a time.
            Master authentic recipes, manage demanding regulars, and upgrade your cozy counter
            into the city's favorite café.
          </p>

          {/* Hero CTAs */}
          <div className="hero-actions">
            <button
              type="button"
              onClick={handlePlayNow}
              className="btn-coffee-primary"
              id="hero-main-cta"
            >
              <Coffee size={20} />
              <span>{isAuthenticated ? 'CONTINUE SHIFT' : 'PLAY NOW'}</span>
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('features')}
              className="btn-coffee-secondary"
              id="hero-explore-cta"
            >
              <span>EXPLORE GAME</span>
            </button>
          </div>

          {/* Social Proof Bar */}
          <div className="hero-proof-bar">
            <div className="hero-proof-item">
              <Star size={16} fill="#F59E0B" color="#F59E0B" />
              <span>4.9 / 5 Rating</span>
            </div>
            <div className="hero-proof-item">
              <Users size={16} color="var(--coffee-caramel)" />
              <span>25,000+ Baristas</span>
            </div>
            <div className="hero-proof-item">
              <Flame size={16} color="#E25B2D" />
              <span>100% Free Casual Game</span>
            </div>
          </div>
        </div>

        {/* Hero Visual: Cozy Barista Counter Scene */}
        <div className="hero-visual">
          <div className="barista-scene-card">
            {/* Top HUD inside card */}
            <div className="scene-header-hud">
              <div className="scene-hud-status">
                <span className="scene-hud-status-dot" />
                <span>Café Open • Table 4 Waiting</span>
              </div>
              <div className="scene-hud-coins">
                <Coins size={15} color="#D97706" />
                <span>$1,480 Tips</span>
              </div>
            </div>

            {/* Visual Illustration Area */}
            <div className="scene-illustration">
              {/* Animated Steam Particles */}
              <div className="steam-particle steam-1" />
              <div className="steam-particle steam-2" />
              <div className="steam-particle steam-3" />

              {/* Vector Barista Counter Artwork */}
              <svg width="340" height="240" viewBox="0 0 340 240" fill="none">
                {/* Counter Wooden Top */}
                <rect x="10" y="180" width="320" height="48" rx="10" fill="#4A2E1B" />
                <rect x="10" y="180" width="320" height="8" fill="#5B3822" />

                {/* Espresso Machine Body */}
                <rect x="50" y="70" width="160" height="110" rx="14" fill="#2E3338" />
                <rect x="55" y="75" width="150" height="30" rx="8" fill="#1F2327" />
                <rect x="65" y="110" width="130" height="60" rx="6" fill="#40464D" />

                {/* Machine Chrome Top Cup Warmer */}
                <rect x="60" y="60" width="140" height="12" rx="4" fill="#94A3B8" />
                <path d="M70 56 H90 V60 H70 Z" fill="#CBD5E1" />
                <path d="M100 56 H120 V60 H100 Z" fill="#CBD5E1" />

                {/* Pressure Gauge */}
                <circle cx="130" cy="90" r="11" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
                <line
                  x1="130"
                  y1="90"
                  x2="135"
                  y2="83"
                  stroke="#DC2626"
                  strokeWidth="2"
                  strokeLinecap="round"
                  style={{ animation: 'gaugeJiggle 3s ease-in-out infinite' }}
                />

                {/* Dual Portafilters */}
                <rect x="85" y="118" width="22" height="18" rx="3" fill="#64748B" />
                <rect x="92" y="136" width="8" height="24" rx="3" fill="#1E293B" />
                <rect x="145" y="118" width="22" height="18" rx="3" fill="#64748B" />
                <rect x="152" y="136" width="8" height="24" rx="3" fill="#1E293B" />

                {/* Steaming Coffee Streams */}
                <line x1="96" y1="136" x2="96" y2="152" stroke="#78350F" strokeWidth="2" strokeDasharray="3 2" />
                <line x1="156" y1="136" x2="156" y2="152" stroke="#78350F" strokeWidth="2" strokeDasharray="3 2" />

                {/* Steaming Coffee Cup with Latte Art */}
                <g transform="translate(130, 150)">
                  <path d="M0 8 C0 26 8 32 26 32 C44 32 52 26 52 8 Z" fill="#FFFFFF" />
                  <path d="M48 14 C56 14 58 24 48 26" stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round" />
                  {/* Crema & Heart Latte Art */}
                  <ellipse cx="26" cy="9" rx="23" ry="5" fill="#C87D38" />
                  <path
                    d="M26 12 C24 10 21 8 21 6.5 C21 5.5 22 4.5 23.5 4.5 C24.8 4.5 25.6 5.2 26 6 C26.4 5.2 27.2 4.5 28.5 4.5 C30 4.5 31 5.5 31 6.5 C31 8 28 10 26 12 Z"
                    fill="#FDFBF7"
                  />
                </g>

                {/* Coffee Grinder on the right */}
                <rect x="230" y="90" width="45" height="90" rx="8" fill="#1E293B" />
                <path d="M235 65 L270 65 L265 90 L240 90 Z" fill="#475569" opacity="0.85" />
                {/* Beans in Hopper */}
                <ellipse cx="252" cy="74" rx="6" ry="4" fill="#78350F" />
                <ellipse cx="245" cy="80" rx="5" ry="3.5" fill="#451A03" />
                <ellipse cx="258" cy="81" rx="5.5" ry="4" fill="#92400E" />

                {/* Fresh Baked Croissant Plate */}
                <ellipse cx="40" cy="180" rx="20" ry="7" fill="#E2E8F0" />
                <path d="M26 178 C30 172 48 171 54 178 C48 174 34 175 26 178 Z" fill="#D97706" />

                {/* Tip Jar with Coins */}
                <rect x="288" y="145" width="28" height="35" rx="5" fill="#E2E8F0" opacity="0.75" />
                <rect x="286" y="142" width="32" height="4" rx="2" fill="#94A3B8" />
                <circle cx="298" cy="162" r="5" fill="#F59E0B" />
                <circle cx="304" cy="169" r="4.5" fill="#FBBF24" />
              </svg>

              {/* Ticket Note Pin */}
              <div className="scene-ticket-tag">
                <span>Table 4: Oat Macchiato</span>
              </div>

              {/* Floating Game Badge */}
              <div className="scene-float-badge">
                <div className="scene-float-badge-icon">
                  <Trophy size={16} />
                </div>
                <div className="scene-float-badge-text">
                  <h5>Master Brewer</h5>
                  <p>Level 8 • 4.9 ★ Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ====================================================================
          FEATURE SECTION: WHY YOU'LL LOVE THE GAME
          ==================================================================== */}
      <section className="coffee-section" id="features">
        <div className="section-header">
          <span className="section-tag">GAMEPLAY HIGHLIGHTS</span>
          <h2 className="section-title">Everything You Need to Build a Coffee Legend</h2>
          <p className="section-desc">
            Experience the satisfying blend of fast-paced espresso brewing mechanics, café
            strategy, and cozy casual progression.
          </p>
        </div>

        <div className="features-grid">
          {/* Feature 1 */}
          <div className="feature-card">
            <div className="feature-card-icon-wrap">
              <Coffee size={26} />
            </div>
            <span className="feature-card-step">FEATURE 01</span>
            <h3 className="feature-card-title">Master the Brew</h3>
            <p className="feature-card-text">
              Dial in bean grind sizes, balance water pressure, froth silky oat microfoam, and pour
              intricate latte art across 10+ artisan recipes.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="feature-card">
            <div className="feature-card-icon-wrap">
              <Users size={26} />
            </div>
            <span className="feature-card-step">FEATURE 02</span>
            <h3 className="feature-card-title">Serve Your Regulars</h3>
            <p className="feature-card-text">
              Meet 20+ distinct customer archetypes—from impatient tech founders to relaxed bookworms.
              Keep their patience high for bonus coins and glowing reviews.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="feature-card">
            <div className="feature-card-icon-wrap">
              <Store size={26} />
            </div>
            <span className="feature-card-step">FEATURE 03</span>
            <h3 className="feature-card-title">Build Your Café</h3>
            <p className="feature-card-text">
              Upgrade to dual-boiler commercial machines, install artisan bean grinders, expand
              seating, and decorate with cozy wood-and-copper aesthetics.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="feature-card">
            <div className="feature-card-icon-wrap">
              <Trophy size={26} />
            </div>
            <span className="feature-card-step">FEATURE 04</span>
            <h3 className="feature-card-title">Become a Legend</h3>
            <p className="feature-card-text">
              Conquer morning rush hour challenges, unlock seasonal ingredient drops, climb global
              barista leaderboards, and expand into prime city locations.
            </p>
          </div>
        </div>
      </section>

      {/* ====================================================================
          HOW TO PLAY SECTION: THE COFFEE LOOP
          ==================================================================== */}
      <section className="coffee-section" id="how-to-play" style={{ background: '#FAF6F0', borderRadius: '32px' }}>
        <div className="section-header">
          <span className="section-tag">THE GAMEPLAY LOOP</span>
          <h2 className="section-title">How to Play in 5 Satisfying Steps</h2>
          <p className="section-desc">
            From the initial ticket ping to counting your tips, here is how your daily café shift
            unfolds behind the counter.
          </p>
        </div>

        <div className="how-to-play-grid">
          {/* Step 1 */}
          <div className="step-card">
            <div className="step-number">1</div>
            <div className="step-icon-bubble">
              <Clock size={22} />
            </div>
            <h3 className="step-title">Take the Order</h3>
            <p className="step-desc">
              Review the customer’s drink ticket, roast preference, milk choice, and sweet syrups.
            </p>
          </div>

          {/* Step 2 */}
          <div className="step-card">
            <div className="step-number">2</div>
            <div className="step-icon-bubble">
              <Coffee size={22} />
            </div>
            <h3 className="step-title">Brew the Coffee</h3>
            <p className="step-desc">
              Grind freshly roasted beans, lock the portafilter, pull a golden shot, and steam milk.
            </p>
          </div>

          {/* Step 3 */}
          <div className="step-card">
            <div className="step-number">3</div>
            <div className="step-icon-bubble">
              <Sparkles size={22} />
            </div>
            <h3 className="step-title">Serve With Care</h3>
            <p className="step-desc">
              Deliver the steaming drink before the customer’s patience gauge drops to zero.
            </p>
          </div>

          {/* Step 4 */}
          <div className="step-card">
            <div className="step-number">4</div>
            <div className="step-icon-bubble">
              <Coins size={22} />
            </div>
            <h3 className="step-title">Earn Coins & Tips</h3>
            <p className="step-desc">
              Pocket earnings and satisfaction stars. Fast, accurate orders earn generous tips!
            </p>
          </div>

          {/* Step 5 */}
          <div className="step-card">
            <div className="step-number">5</div>
            <div className="step-icon-bubble">
              <Store size={22} />
            </div>
            <h3 className="step-title">Upgrade Café</h3>
            <p className="step-desc">
              Reinvest in commercial multi-group machines, organic roasts, and bakery cases.
            </p>
          </div>
        </div>
      </section>

      {/* ====================================================================
          IN-GAME PREVIEW SECTION: "STEP INSIDE THE CAFÉ"
          ==================================================================== */}
      <section className="coffee-section" id="preview">
        <div className="section-header">
          <span className="section-tag">LIVE SIMULATION PREVIEW</span>
          <h2 className="section-title">Step Inside the Café</h2>
          <p className="section-desc">
            Take a look at your live barista workstation. Click through the brewing steps below to
            preview the in-game mechanics!
          </p>
        </div>

        <div className="game-mockup-wrapper">
          {/* Mockup Window Titlebar */}
          <div className="mockup-window-bar">
            <div className="mockup-window-controls">
              <span className="mockup-dot" style={{ background: '#EF4444' }} />
              <span className="mockup-dot" style={{ background: '#F59E0B' }} />
              <span className="mockup-dot" style={{ background: '#10B981' }} />
            </div>
            <span className="mockup-window-title">lastHope Barista Station v1.2 — Live Counter</span>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>60 FPS</span>
          </div>

          {/* In-Game HUD Bar */}
          <div className="mockup-game-hud">
            <div className="hud-stat-group">
              <div className="hud-stat hud-stat-gold">
                <Coins size={16} />
                <span>$2,490</span>
              </div>
              <div className="hud-stat">
                <Star size={16} fill="#F59E0B" color="#F59E0B" />
                <span>4.95 Rating</span>
              </div>
              <div className="hud-stat" style={{ color: '#93C5FD' }}>
                <Clock size={16} />
                <span>Shift: 02:45 remaining</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <span style={{ color: '#86EFAC', fontWeight: 700 }}>● Rush Hour Active</span>
            </div>
          </div>

          {/* Counter Stage */}
          <div className="mockup-counter-stage">
            {/* Left: Active Order Slip */}
            <div className="mockup-order-slip">
              <div>
                <span className="order-slip-badge">ORDER #402 • PRIORITY</span>
                <h3 className="order-slip-customer">Customer: Maya (Regular)</h3>
                <p className="order-slip-drink">★ Triple Oat Caramel Macchiato</p>

                <ul className="order-slip-checklist">
                  <li>
                    <CheckCircle2 size={16} color={interactiveBrewStep >= 2 ? '#16A34A' : '#94A3B8'} />
                    <span>Grind Dark Colombian Roast</span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} color={interactiveBrewStep >= 3 ? '#16A34A' : '#94A3B8'} />
                    <span>Extract 25s Double Espresso Shot</span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} color={interactiveBrewStep >= 4 ? '#16A34A' : '#94A3B8'} />
                    <span>Steam Oat Milk to 65°C</span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} color={interactiveBrewStep >= 5 ? '#16A34A' : '#94A3B8'} />
                    <span>Drizzle Salted Caramel Syrup</span>
                  </li>
                </ul>
              </div>

              <div className="patience-bar-container">
                <div className="patience-bar-label">
                  <span>Customer Patience</span>
                  <span>78%</span>
                </div>
                <div className="patience-bar-track">
                  <div className="patience-bar-fill" />
                </div>
              </div>
            </div>

            {/* Right: Interactive Brewing Controls Station */}
            <div className="mockup-brewing-station">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--coffee-dark)' }}>
                  Interactive Station Console
                </h4>
                <span style={{ fontSize: '12px', color: 'var(--coffee-accent)', fontWeight: 700 }}>
                  Step {interactiveBrewStep} of 4
                </span>
              </div>

              {/* Controls Grid */}
              <div className="brewing-controls-grid">
                <div
                  className="brewing-tool-card"
                  onClick={() => setInteractiveBrewStep(2)}
                  style={{
                    borderColor: interactiveBrewStep === 1 ? 'var(--coffee-accent)' : undefined,
                    background: interactiveBrewStep >= 2 ? '#F0FDF4' : undefined,
                  }}
                >
                  <Sliders size={22} color={interactiveBrewStep >= 2 ? '#16A34A' : '#D97706'} />
                  <span className="brewing-tool-name">1. Burr Grinder</span>
                  <span className="brewing-tool-status">
                    {interactiveBrewStep >= 2 ? '✓ Beans Ground' : 'Click to Grind'}
                  </span>
                </div>

                <div
                  className="brewing-tool-card"
                  onClick={() => setInteractiveBrewStep(3)}
                  style={{
                    borderColor: interactiveBrewStep === 2 ? 'var(--coffee-accent)' : undefined,
                    background: interactiveBrewStep >= 3 ? '#F0FDF4' : undefined,
                  }}
                >
                  <Coffee size={22} color={interactiveBrewStep >= 3 ? '#16A34A' : '#92400E'} />
                  <span className="brewing-tool-name">2. Portafilter</span>
                  <span className="brewing-tool-status">
                    {interactiveBrewStep >= 3 ? '✓ Shot Pulled' : 'Click to Extract'}
                  </span>
                </div>

                <div
                  className="brewing-tool-card"
                  onClick={() => setInteractiveBrewStep(4)}
                  style={{
                    borderColor: interactiveBrewStep === 3 ? 'var(--coffee-accent)' : undefined,
                    background: interactiveBrewStep >= 4 ? '#F0FDF4' : undefined,
                  }}
                >
                  <Flame size={22} color={interactiveBrewStep >= 4 ? '#16A34A' : '#E25B2D'} />
                  <span className="brewing-tool-name">3. Steam Wand</span>
                  <span className="brewing-tool-status">
                    {interactiveBrewStep >= 4 ? '✓ Milk Steamed' : 'Click to Froth'}
                  </span>
                </div>
              </div>

              {/* Action Preview Button */}
              <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setInteractiveBrewStep((prev) => (prev >= 4 ? 1 : prev + 1))}
                  className="btn-coffee-primary"
                  style={{ flex: 1, height: '48px' }}
                >
                  {interactiveBrewStep >= 4 ? '✓ Drink Ready! Reset Step' : `Proceed to Step ${interactiveBrewStep + 1} →`}
                </button>
                <button
                  type="button"
                  onClick={handlePlayNow}
                  className="btn-coffee-secondary"
                  style={{ padding: '0 20px' }}
                >
                  Launch Full Game
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          GAME STATS / SOCIAL PROOF SECTION
          ==================================================================== */}
      <section className="coffee-stats-section">
        <div className="stats-grid">
          <div>
            <div className="stat-item-number">10+</div>
            <div className="stat-item-label">Coffee Recipes</div>
            <div className="stat-item-sub">From Ristretto to Cold Brew</div>
          </div>
          <div>
            <div className="stat-item-number">20+</div>
            <div className="stat-item-label">Customer Personalities</div>
            <div className="stat-item-sub">Unique moods, tips, & stories</div>
          </div>
          <div>
            <div className="stat-item-number">50+</div>
            <div className="stat-item-label">Café Upgrades</div>
            <div className="stat-item-sub">Machines, cups, decor & syrups</div>
          </div>
          <div>
            <div className="stat-item-number">∞</div>
            <div className="stat-item-label">Cups to Brew</div>
            <div className="stat-item-sub">Endless gameplay progression</div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          FINAL CTA BANNER
          ==================================================================== */}
      <section className="coffee-cta-banner">
        <div className="cta-banner-card">
          <h2 className="cta-banner-title">READY TO BREW?</h2>
          <p className="cta-banner-desc">
            Your first customer is already waiting at the counter. Step into the café, tie on your
            apron, and pour your first espresso shot.
          </p>

          <button
            type="button"
            onClick={handlePlayNow}
            className="btn-coffee-primary"
            id="footer-main-cta"
            style={{
              padding: '16px 36px',
              fontSize: '17px',
              backgroundColor: '#FFFFFF',
              color: 'var(--coffee-dark)',
              background: '#FFFFFF',
              boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
            }}
          >
            <Coffee size={20} color="#E25B2D" />
            <span>{isAuthenticated ? 'CONTINUE SHIFT NOW' : 'PLAY NOW — FREE'}</span>
            <ArrowRight size={18} color="#E25B2D" />
          </button>
        </div>
      </section>

      {/* ====================================================================
          FOOTER
          ==================================================================== */}
      <footer className="coffee-footer">
        <div className="coffee-footer-container">
          <div className="footer-top">
            <div className="footer-brand">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BrandLogo size="default" />
                <span className="coffee-game-tag">Barista Game</span>
              </div>
              <p>Built for coffee lovers and future café legends.</p>
            </div>

            <ul className="footer-nav">
              <li>
                <a href="#hero" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}>
                  Home
                </a>
              </li>
              <li>
                <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>
                  Features
                </a>
              </li>
              <li>
                <a href="#how-to-play" onClick={(e) => { e.preventDefault(); scrollToSection('how-to-play'); }}>
                  How to Play
                </a>
              </li>
              <li>
                <Link to={isAuthenticated ? '/game' : '/login'}>
                  Play Now
                </Link>
              </li>
              <li>
                <Link to="/dashboard">
                  Account Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} lastHope Studios. All rights reserved.</span>
            <span>Crafted with freshly roasted beans & clean code.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
