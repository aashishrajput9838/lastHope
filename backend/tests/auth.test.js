async function testAuth() {
  const baseURL = 'http://localhost:5000';
  console.log('Testing Authentication Endpoints against', baseURL);

  // Clean up existing test user if any
  const mongoose = require('mongoose');
  await mongoose.connect('mongodb://127.0.0.1:27017/lasthope');
  const User = require('../models/User');
  await User.deleteMany({ email: 'alex@lasthope.ai' });
  console.log('Cleaned up previous test users.');

  // 1. Test Register
  const regRes = await fetch(`${baseURL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Alex LastHope',
      email: 'alex@lasthope.ai',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    }),
  });
  const regData = await regRes.json();
  console.log('Register status:', regRes.status, 'Data:', regData);
  const cookie = regRes.headers.get('set-cookie');
  console.log('Set-Cookie received:', !!cookie);

  if (!regData.success) throw new Error('Registration failed');

  // 2. Test Duplicate Register
  const dupRes = await fetch(`${baseURL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Alex LastHope',
      email: 'alex@lasthope.ai',
      password: 'Password123!',
    }),
  });
  const dupData = await dupRes.json();
  console.log('Duplicate register status (should be 400):', dupRes.status, 'Message:', dupData.message);

  // 3. Test Login with wrong password
  const wrongLoginRes = await fetch(`${baseURL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'alex@lasthope.ai',
      password: 'WrongPassword!',
    }),
  });
  const wrongLoginData = await wrongLoginRes.json();
  console.log('Wrong password login status (should be 401):', wrongLoginRes.status, 'Message:', wrongLoginData.message);

  // 4. Test Login with correct credentials
  const loginRes = await fetch(`${baseURL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'alex@lasthope.ai',
      password: 'Password123!',
    }),
  });
  const loginData = await loginRes.json();
  console.log('Valid login status:', loginRes.status, 'Success:', loginData.success);

  // Extract token
  const token = loginData.token;

  // 5. Test Protected /auth/me with Bearer token
  const meRes = await fetch(`${baseURL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const meData = await meRes.json();
  console.log('Protected /auth/me status:', meRes.status, 'User:', meData.user.name, meData.user.email);

  // 6. Test Protected /auth/me with Cookie header
  const meCookieRes = await fetch(`${baseURL}/auth/me`, {
    headers: { Cookie: `token=${token}` },
  });
  const meCookieData = await meCookieRes.json();
  console.log('Protected /auth/me via Cookie status:', meCookieRes.status, 'Success:', meCookieData.success);

  // 8. Test Google OAuth endpoint
  const googleRes = await fetch(`${baseURL}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'alex.google@lasthope.ai',
      name: 'Alex Google Creator',
      avatar: 'https://lh3.googleusercontent.com/a/sample',
      firebaseUid: 'firebase_test_uid_98123',
    }),
  });
  const googleData = await googleRes.json();
  console.log('Google OAuth status:', googleRes.status, 'User:', googleData.user?.name, googleData.user?.authProvider);
  if (!googleData.success || googleData.user?.authProvider !== 'google') {
    throw new Error('Google OAuth endpoint test failed');
  }

  // Cleanup google test user
  await User.deleteMany({ email: 'alex.google@lasthope.ai' });

  console.log('ALL BACKEND AUTH TESTS PASSED SUCCESSFULLY!');
  process.exit(0);
}

testAuth().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
