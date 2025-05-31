// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const getStartedBtn = document.getElementById('getStartedBtn');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

// Modal Instances
const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
const signupModal = new bootstrap.Modal(document.getElementById('signupModal'));

// Event Listeners
loginBtn.addEventListener('click', () => loginModal.show());
signupBtn.addEventListener('click', () => signupModal.show());
getStartedBtn.addEventListener('click', () => signupModal.show());

// Form Submissions
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Store token
            localStorage.setItem('token', data.access_token);
            // Redirect to dashboard
            window.location.href = '/dashboard.html';
        } else {
            showAlert('error', data.error || 'Login failed');
        }
    } catch (error) {
        showAlert('error', 'An error occurred. Please try again.');
    }
});

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('signupName').value,
        email: document.getElementById('signupEmail').value,
        password: document.getElementById('signupPassword').value,
        gender: document.getElementById('signupGender').value,
        age: parseInt(document.getElementById('signupAge').value)
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showAlert('success', 'Registration successful! Please login.');
            signupModal.hide();
            loginModal.show();
        } else {
            showAlert('error', data.error || 'Registration failed');
        }
    } catch (error) {
        showAlert('error', 'An error occurred. Please try again.');
    }
});

// Utility Functions
function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type === 'error' ? 'danger' : 'success'} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    document.querySelector('.modal-body').prepend(alertDiv);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Form Validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('is-invalid');
        } else {
            input.classList.remove('is-invalid');
        }
    });
    
    return isValid;
}

// Add input validation listeners
document.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('input', () => {
        if (input.value.trim()) {
            input.classList.remove('is-invalid');
        }
    });
});

// Check Authentication Status
function checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
        // User is logged in
        loginBtn.style.display = 'none';
        signupBtn.style.display = 'none';
        // Add logout button
        const logoutBtn = document.createElement('a');
        logoutBtn.className = 'nav-link';
        logoutBtn.href = '#';
        logoutBtn.textContent = 'Logout';
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.reload();
        });
        document.querySelector('.navbar-nav').appendChild(logoutBtn);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
}); 