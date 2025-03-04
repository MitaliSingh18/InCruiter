document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const forgotForm = document.getElementById('forgot-form');
  const logoutBtn = document.getElementById('logout-btn');
  const messageEl = document.getElementById('message');
  const authContainer = document.querySelector('.auth-container');
  const profileContainer = document.querySelector('.profile-container');
  const userName = document.getElementById('user-name');
  const userEmail = document.getElementById('user-email');

  // Check if user is logged in
  checkAuth();

  // Tab switching
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons and panes
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));
      
      // Add active class to clicked button and corresponding pane
      btn.classList.add('active');
      const tabId = btn.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
      
      // Clear message
      clearMessage();
    });
  });

  // Login form submission
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        showMessage(data.msg || 'Login failed', 'error');
        return;
      }
      
      // Save token to localStorage
      localStorage.setItem('token', data.token);
      
      // Show success message and redirect to profile
      showMessage('Login successful!', 'success');
      
      // Get user data and show profile
      await getUserData();
      
    } catch (error) {
      showMessage('An error occurred. Please try again.', 'error');
      console.error(error);
    }
  });

  // Register form submission
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;
    
    // Check if passwords match
    if (password !== confirmPassword) {
      showMessage('Passwords do not match', 'error');
      return;
    }
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        showMessage(data.msg || 'Registration failed', 'error');
        return;
      }
      
      // Save token to localStorage
      localStorage.setItem('token', data.token);
      
      // Show success message and redirect to profile
      showMessage('Registration successful!', 'success');
      
      // Get user data and show profile
      await getUserData();
      
    } catch (error) {
      showMessage('An error occurred. Please try again.', 'error');
      console.error(error);
    }
  });

  // Forgot password form submission
  forgotForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('forgot-email').value;
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        showMessage(data.msg || 'Password reset failed', 'error');
        return;
      }
      
      showMessage('Password reset email sent. Please check your inbox.', 'success');
      document.getElementById('forgot-email').value = '';
      
    } catch (error) {
      showMessage('An error occurred. Please try again.', 'error');
      console.error(error);
    }
  });

  // Logout button
  logoutBtn.addEventListener('click', () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Show auth container and hide profile
    authContainer.style.display = 'block';
    profileContainer.style.display = 'none';
    
    // Show message
    showMessage('Logged out successfully', 'info');
    
    // Reset forms
    loginForm.reset();
    registerForm.reset();
    forgotForm.reset();
  });

  // Check if user is authenticated
  async function checkAuth() {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return;
    }
    
    try {
      await getUserData();
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
    }
  }

  // Get user data
  async function getUserData() {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return;
    }
    
    try {
      const response = await fetch('/api/auth/user', {
        headers: {
          'x-auth-token': token
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to get user data');
      }
      
      const user = await response.json();
      
      // Update profile
      userName.textContent = user.name;
      userEmail.textContent = user.email;
      
      // Show profile and hide auth container
      authContainer.style.display = 'none';
      profileContainer.style.display = 'block';
      
    } catch (error) {
      console.error('Get user data failed:', error);
      localStorage.removeItem('token');
    }
  }

  // Show message
  function showMessage(text, type = 'info') {
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
    messageEl.style.display = 'block';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
      clearMessage();
    }, 5000);
  }

  // Clear message
  function clearMessage() {
    messageEl.textContent = '';
    messageEl.className = 'message';
    messageEl.style.display = 'none';
  }
});