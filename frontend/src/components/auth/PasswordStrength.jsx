import React from 'react';

export default function PasswordStrength({ password = '' }) {
  if (!password) return null;

  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', 'active-weak', 'active-fair', 'active-good', 'active-strong'];

  const strengthLabel = labels[score] || 'Too short';
  const activeClass = colors[score] || 'active-weak';

  return (
    <div className="password-strength-container animate-fade-in">
      <div className="password-strength-bar">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`strength-segment ${score >= step ? activeClass : ''}`}
          />
        ))}
      </div>
      <span className="strength-label">Password strength: {strengthLabel}</span>
    </div>
  );
}
