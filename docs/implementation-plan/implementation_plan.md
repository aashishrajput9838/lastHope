# Production Authentication System for LastHope

This plan outlines the end-to-end implementation of a production-quality authentication system for the **lastHope** project, consisting of:
1. A frontend Sign In / Sign Up experience faithfully recreating the referenced Dribbble design ([Dribbble Shot #25456400](https://dribbble.com/shots/25456400-SAAS-Application-Signin-Signup-UI-Design) by Nazmul Haque Shanto) using the exact design language, palette, typography, button gradients, and micro-interactions.
2. A secure, production-grade backend API built with Node.js, Express, MongoDB (Mongoose), JWT, bcrypt, and HTTP-only cookies, with route protection and session persistence.

---

## User Review Required

> [!IMPORTANT]
> **Database & Architecture Verification**:
> - MongoDB is already installed and actively running on your machine at `127.0.0.1:27017`. We will connect the backend to `mongodb://127.0.0.1:27017/lasthope`.
> - The existing `backend/` was an empty package placeholder. We will structure it with clean Express + Mongoose MVC architecture (`models/`, `controllers/`, `routes/`, `middleware/`).
> - The frontend is built with React 19 + Vite. We will add `react-router-dom` for route management (`/login`, `/signup`, `/forgot-password`, `/dashboard`) and `lucide-react` for crisp icons.
> - Authentication tokens will be stored in **secure HTTP-only cookies** and support Bearer authorization headers for maximum security and zero token leakage.

---

## Dribbble Design Recreation Breakdown

Based on our direct inspection of high-resolution artifacts from Dribbble shot `25456400`:
- **Palette**:
  - Off-white background: `#F6F6F6` with subtle geometric celestial arcs and faint nodes.
  - Borders & Inactive state: `#BEC1C1` / `#E5E7EB`.
  - Primary Red & Coral: `#E5181C` and `#DC7D70` (used in brand spark icon, active input focus ring, and button gradient).
  - Rose / Mauve Accent: `#D8A8B3`.
  - Deep Black: `#0A0A0A` (headings, primary label text, social button text).
  - Neutral Muted: `#504E4D` (subheadings, placeholders, helper text).
- **Branding**:
  - Distinctive 4-point sparkle icon with accent star in coral/red gradient.
  - Clean brand mark: **lastHope**.
- **Layout & Interaction Flow**:
  - Centered elevated card (`border-radius: 24px`, subtle shadow `0 20px 50px rgba(0,0,0,0.04)`, pure white surface).
  - Social buttons: "Continue with Google" and "Continue with Apple" with clean borders and official SVGs.
  - Divider: "Continue with Email" with hairline border.
  - Progressive input flow:
    - **Step 1 (Email)**: Email input with envelope icon -> vibrant gradient "Continue →" button.
    - **Step 2 (Password)**: Password input with lock icon, visibility toggle (Eye/EyeOff) -> "Back" button + gradient "Login →" button + "Forget Password?" link.
    - **Sign Up Mode**: Unified registration form with Full Name, Email, Password, Confirm Password, strength meter, and terms consent.
    - Seamless switching between Sign In and Sign Up states.
  - Primary button: Horizontal vibrant gradient (`#FF4B2B` -> `#E5181C` -> `#DC7D70`), rounded-xl (12px), glowing drop shadow (`box-shadow: 0 10px 25px -5px rgba(229, 24, 28, 0.4)`), smooth hover and press animation.

---

## Proposed Changes

### Backend Implementation (`backend/`)

#### [MODIFY] [package.json](file:///c:/github/lasthope/lastHope/backend/package.json)
- Add dependencies: `express`, `mongoose`, `bcryptjs`, `jsonwebtoken`, `cookie-parser`, `cors`, `dotenv`.
- Add dev script: `"dev": "node server.js"`, `"start": "node server.js"`.

#### [NEW] [.env.example](file:///c:/github/lasthope/lastHope/backend/.env.example) & [.env](file:///c:/github/lasthope/lastHope/backend/.env)
- Environment variables: `PORT=5000`, `MONGODB_URI=mongodb://127.0.0.1:27017/lasthope`, `JWT_SECRET`, `JWT_EXPIRES_IN=7d`, `CLIENT_URL=http://localhost:5173`.

#### [NEW] [models/User.js](file:///c:/github/lasthope/lastHope/backend/models/User.js)
- Schema fields:
  - `name`: String, required, trimmed.
  - `email`: String, required, unique, lowercase, trimmed, validated.
  - `password`: String, required, hashed with bcrypt.
  - `resetPasswordToken`: String, hashed token for password recovery.
  - `resetPasswordExpires`: Date, token expiration time.
  - `createdAt`, `updatedAt`: Timestamps.
- Methods: `comparePassword(candidatePassword)`.

#### [NEW] [middleware/auth.js](file:///c:/github/lasthope/lastHope/backend/middleware/auth.js)
- Middleware `protect`: Extracts JWT from HTTP-only cookie `token` or `Authorization: Bearer <token>`, verifies signature, fetches active user, attaches `req.user`. Handles expired or invalid tokens cleanly.

#### [NEW] [controllers/authController.js](file:///c:/github/lasthope/lastHope/backend/controllers/authController.js)
- `register`: Validates name, email, password strength, duplicate check, hashes password, generates JWT, sets HTTP-only cookie, returns safe user object (`id`, `name`, `email`).
- `login`: Validates credentials, verifies bcrypt hash, generates JWT, sets HTTP-only cookie, returns safe user object.
- `logout`: Clears HTTP-only cookie, returns success response.
- `getMe`: Returns current authenticated user profile from `req.user`.
- `forgotPassword`: Generates secure crypto reset token, stores expiration, returns success message.
- `resetPassword`: Validates token & expiration, hashes new password, saves user, returns success.

#### [NEW] [routes/authRoutes.js](file:///c:/github/lasthope/lastHope/backend/routes/authRoutes.js)
- Mounts:
  - `POST /register`
  - `POST /login`
  - `POST /logout`
  - `GET /me` (protected)
  - `POST /forgot-password`
  - `POST /reset-password`

#### [NEW] [server.js](file:///c:/github/lasthope/lastHope/backend/server.js)
- Express app setup with `cors({ origin: 'http://localhost:5173', credentials: true })`, `express.json()`, `cookieParser()`.
- Connects to MongoDB with reconnection handling.
- Mounts `/auth` and `/api/auth` routes.
- Global error handler returning standard JSON format `{ success: false, message: '...' }`.

---

### Frontend Implementation (`frontend/`)

#### [MODIFY] [package.json](file:///c:/github/lasthope/lastHope/frontend/package.json)
- Add dependencies: `react-router-dom`, `lucide-react`.

#### [MODIFY] [vite.config.js](file:///c:/github/lasthope/lastHope/frontend/vite.config.js)
- Configure API proxy so `/auth` and `/api` requests seamlessly route to backend `http://localhost:5000` during local development without CORS friction.

#### [NEW] [src/context/AuthContext.jsx](file:///c:/github/lasthope/lastHope/frontend/src/context/AuthContext.jsx)
- Central authentication state provider:
  - `user`: User data or `null`.
  - `loading`: Initial startup check status (prevents auth flicker).
  - `isAuthenticated`: Boolean helper.
  - `login(email, password)`
  - `register(name, email, password)`
  - `logout()`
  - Initial `GET /auth/me` on mount with cookie credentials.

#### [NEW] [src/components/ProtectedRoute.jsx](file:///c:/github/lasthope/lastHope/frontend/src/components/ProtectedRoute.jsx)
- Guards routes requiring authentication. If not logged in, redirects to `/login`.
- If already logged in, guards `/login` and `/signup` and redirects to `/dashboard`.

#### [NEW] [src/components/auth/AuthLayout.jsx](file:///c:/github/lasthope/lastHope/frontend/src/components/auth/AuthLayout.jsx)
- Recreates the exact Dribbble ambient backdrop:
  - Clean light background `#F6F6F6` with subtle SVGs representing the elegant geometric celestial curves and dotted nodes.
  - Centered floating card with responsive padding and soft elevation.
  - Brand header with the LastHope glowing spark logo and brand typography.
  - Footer with Terms of Service and Privacy Policy links.

#### [NEW] [src/components/auth/BrandLogo.jsx](file:///c:/github/lasthope/lastHope/frontend/src/components/auth/BrandLogo.jsx)
- Renders the custom LastHope brand mark with 4-point sparkle icon in gradient `#E5181C` to `#DC7D70`.

#### [NEW] [src/components/auth/SocialButtons.jsx](file:///c:/github/lasthope/lastHope/frontend/src/components/auth/SocialButtons.jsx)
- Google and Apple pill buttons styled exactly like the Dribbble design with high-fidelity vector icons and hover states.

#### [NEW] [src/components/auth/PasswordStrength.jsx](file:///c:/github/lasthope/lastHope/frontend/src/components/auth/PasswordStrength.jsx)
- Visual indicator showing strength bar and requirements (length, number, symbol) that react dynamically to user input.

#### [NEW] [src/pages/LoginPage.jsx](file:///c:/github/lasthope/lastHope/frontend/src/pages/LoginPage.jsx)
- Faithfully reproduces the Dribbble design:
  - Header: "Welcome to lastHope", "Sign in to unlock your creative potential."
  - Social login options.
  - Divider: "Continue with Email".
  - Progressive 2-step interaction:
    - Step 1: "Your email" input -> "Continue →" gradient button.
    - Step 2: Shows entered email with quick edit option, "Your password" input with visibility toggle, "Back" button, and gradient "Login →" button.
  - "Forget Password?" link.
  - "Don't have an account? Sign up" switch.
  - Clean inline validation, error banners, and loading spinner inside the button.

#### [NEW] [src/pages/SignupPage.jsx](file:///c:/github/lasthope/lastHope/frontend/src/pages/SignupPage.jsx)
- Header: "Welcome to lastHope", "Sign up to unlock your creative potential."
- Fields: Full Name, Email, Password, Confirm Password with live validation.
- Password strength indicator.
- Primary button: "Create Account →" with signature gradient and glow.
- "Already have an account? Sign in" switch.

#### [NEW] [src/pages/ForgotPasswordPage.jsx](file:///c:/github/lasthope/lastHope/frontend/src/pages/ForgotPasswordPage.jsx)
- Clean password reset request and token reset form adhering to the same visual language.

#### [NEW] [src/pages/DashboardPage.jsx](file:///c:/github/lasthope/lastHope/frontend/src/pages/DashboardPage.jsx)
- Protected application landing page for authenticated users.
- Displays user profile, session timestamp, token status, and an interactive "Sign Out" button to test the complete logout lifecycle.

#### [MODIFY] [src/App.jsx](file:///c:/github/lasthope/lastHope/frontend/src/App.jsx)
- Sets up `BrowserRouter`, `AuthProvider`, and routes:
  - `/login` -> LoginPage (public, redirects to `/dashboard` if logged in)
  - `/signup` -> SignupPage (public, redirects to `/dashboard` if logged in)
  - `/forgot-password` -> ForgotPasswordPage
  - `/dashboard` -> DashboardPage (protected, redirects to `/login` if unauthenticated)
  - `/` -> redirects to `/dashboard` (or `/login` if unauthenticated)

#### [MODIFY] [src/index.css](file:///c:/github/lasthope/lastHope/frontend/src/index.css)
- Implement design system tokens:
  - Font family: Inter / system sans-serif.
  - Color tokens: `#F6F6F6`, `#BEC1C1`, `#E5181C`, `#D8A8B3`, `#0A0A0A`, `#504E4D`, `#DC7D70`.
  - Gradient tokens, shadows, input focus rings, transitions.

---

## Verification Plan

### Automated & Backend Tests
- Start MongoDB and Express server on `http://localhost:5000`.
- Run curl/PowerShell API requests against all endpoints:
  - `POST /auth/register` with valid data -> verify 201 + cookie + user object.
  - `POST /auth/register` with duplicate email -> verify 400 with clean error message.
  - `POST /auth/register` with invalid email / short password -> verify 400 validation error.
  - `POST /auth/login` with valid credentials -> verify 200 + cookie.
  - `POST /auth/login` with incorrect password -> verify 401.
  - `GET /auth/me` with cookie -> verify 200 with user profile.
  - `POST /auth/logout` -> verify cookie cleared.
  - `GET /auth/me` after logout -> verify 401 unauthorized.

### Frontend & End-to-End Verification
- Start Vite dev server on `http://localhost:5173`.
- Use the browser agent to:
  1. Open `/login`: verify visual fidelity against Dribbble reference (header, spark icon, colors, cards, social buttons, gradient button).
  2. Test responsive layouts at 375px (mobile), 768px (tablet), 1280px (desktop), 1920px (large screen).
  3. Navigate to `/signup`: test input validation, password strength meter, password mismatch.
  4. Submit a new test account registration -> verify automatic redirect to `/dashboard`.
  5. On `/dashboard`: verify user details are shown.
  6. Refresh page -> verify session persists without flash.
  7. Click "Sign Out" -> verify redirect to `/login`.
  8. Attempt to access `/dashboard` directly while logged out -> verify redirect to `/login`.
  9. Login with the created account -> verify successful login and redirect to `/dashboard`.
  10. Attempt to access `/login` while logged in -> verify redirect to `/dashboard`.
