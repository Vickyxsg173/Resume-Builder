import axios from 'axios';

const API_URL = 'http://localhost:5000/auth';

async function testFullResetFlow() {
  const email = 'full_test@example.com';
  const password = 'oldpass123';
  const newPassword = 'newpass456';

  try {
    // 1. Signup
    console.log("Signing up...");
    await axios.post(`${API_URL}/signup`, { email, password, displayName: 'Full Test' });
    console.log("Signup success.");

    // 2. Forgot Password
    console.log("Requesting reset link...");
    // We expect the link to be printed to console. Since we can't see it, 
    // I'll take a peek at the DB in a moment.
    await axios.post(`${API_URL}/forgot-password`, { email });

    // 3. Peeking DB for token
    // (I'll need to run another command for this)
    console.log("Please run a command to get the token from DB for " + email);

  } catch (err) {
    console.error(err.response?.data || err.message);
  }
}

testFullResetFlow();
