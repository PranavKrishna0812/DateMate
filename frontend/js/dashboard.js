// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// DOM Elements
const navLinks = document.querySelectorAll('.nav-link[data-page]');
const contentSections = document.querySelectorAll('.content-section');
const logoutBtn = document.getElementById('logoutBtn');
const filterForm = document.getElementById('filterForm');
const matchesGrid = document.getElementById('matchesGrid');
const conversationsList = document.getElementById('conversationsList');
const chatWindow = document.getElementById('chatWindow');
const messageForm = document.getElementById('messageForm');
const profileForm = document.getElementById('profileForm');
const changePictureBtn = document.getElementById('changePictureBtn');

// State
let currentUser = null;
let currentMatch = null;
let currentConversation = null;

// Check Authentication
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/index.html';
        return;
    }
    
    // Fetch user profile
    fetchUserProfile();
}

// Navigation
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = e.target.dataset.page;
        showPage(page);
    });
});

function showPage(page) {
    // Update active nav link
    navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.page === page);
    });
    
    // Show corresponding section
    contentSections.forEach(section => {
        section.classList.toggle('d-none', section.id !== `${page}Section`);
    });
    
    // Load page data
    switch (page) {
        case 'matches':
            loadMatches();
            break;
        case 'messages':
            loadConversations();
            break;
        case 'profile':
            loadProfile();
            break;
    }
}

// Matches Section
async function loadMatches() {
    try {
        const response = await fetch(`${API_BASE_URL}/matches`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        const matches = await response.json();
        displayMatches(matches);
    } catch (error) {
        showAlert('error', 'Failed to load matches');
    }
}

function displayMatches(matches) {
    matchesGrid.innerHTML = matches.map(match => `
        <div class="col-md-6 col-lg-4">
            <div class="card match-card shadow-sm">
                <img src="${match.profile_picture || 'images/default-profile.jpg'}" class="card-img-top" alt="${match.name}">
                <div class="match-info">
                    <h5 class="match-name">${match.name}, ${match.age}</h5>
                    <p class="match-details">
                        <i class="fas fa-map-marker-alt"></i> ${match.location}<br>
                        <i class="fas fa-graduation-cap"></i> ${match.education}<br>
                        <i class="fas fa-briefcase"></i> ${match.occupation}
                    </p>
                    <div class="d-flex gap-2">
                        <button class="btn btn-primary btn-sm" onclick="likeMatch(${match.user_id})">
                            <i class="fas fa-heart"></i> Like
                        </button>
                        <button class="btn btn-outline-primary btn-sm" onclick="viewProfile(${match.user_id})">
                            <i class="fas fa-user"></i> Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Messages Section
async function loadConversations() {
    try {
        const response = await fetch(`${API_BASE_URL}/conversations`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        const conversations = await response.json();
        displayConversations(conversations);
    } catch (error) {
        showAlert('error', 'Failed to load conversations');
    }
}

function displayConversations(conversations) {
    conversationsList.innerHTML = conversations.map(conv => `
        <div class="conversation-item ${conv.id === currentConversation?.id ? 'active' : ''}" 
             onclick="selectConversation(${conv.id})">
            <div class="conversation-name">${conv.name}</div>
            <div class="conversation-preview">${conv.last_message}</div>
        </div>
    `).join('');
}

async function selectConversation(conversationId) {
    try {
        const response = await fetch(`${API_BASE_URL}/messages/${conversationId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        const messages = await response.json();
        displayMessages(messages);
        currentConversation = { id: conversationId };
    } catch (error) {
        showAlert('error', 'Failed to load messages');
    }
}

function displayMessages(messages) {
    chatWindow.innerHTML = messages.map(message => `
        <div class="message ${message.sender_id === currentUser.id ? 'sent' : 'received'}">
            ${message.message_text}
        </div>
    `).join('');
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Profile Section
async function loadProfile() {
    try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        const profile = await response.json();
        displayProfile(profile);
    } catch (error) {
        showAlert('error', 'Failed to load profile');
    }
}

function displayProfile(profile) {
    document.getElementById('profileName').value = profile.name;
    document.getElementById('profileLocation').value = profile.location || '';
    document.getElementById('profileEducation').value = profile.education || '';
    document.getElementById('profileOccupation').value = profile.occupation || '';
    document.getElementById('profileBio').value = profile.bio || '';
    document.getElementById('profileInterests').value = profile.interests || '';
    
    if (profile.profile_picture) {
        document.getElementById('profilePicture').src = profile.profile_picture;
    }
}

// Event Handlers
filterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const filters = {
        min_age: document.getElementById('minAge').value,
        max_age: document.getElementById('maxAge').value,
        gender: document.getElementById('genderFilter').value,
        location: document.getElementById('locationFilter').value
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/matches/filter`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(filters)
        });
        
        const matches = await response.json();
        displayMatches(matches);
    } catch (error) {
        showAlert('error', 'Failed to apply filters');
    }
});

messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentConversation) return;
    
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    if (!message) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                conversation_id: currentConversation.id,
                message: message
            })
        });
        
        if (response.ok) {
            messageInput.value = '';
            selectConversation(currentConversation.id);
        }
    } catch (error) {
        showAlert('error', 'Failed to send message');
    }
});

profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('profileName').value,
        location: document.getElementById('profileLocation').value,
        education: document.getElementById('profileEducation').value,
        occupation: document.getElementById('profileOccupation').value,
        bio: document.getElementById('profileBio').value,
        interests: document.getElementById('profileInterests').value
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            showAlert('success', 'Profile updated successfully');
        }
    } catch (error) {
        showAlert('error', 'Failed to update profile');
    }
});

changePictureBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const formData = new FormData();
        formData.append('profile_picture', file);
        
        try {
            const response = await fetch(`${API_BASE_URL}/profile/picture`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });
            
            if (response.ok) {
                const data = await response.json();
                document.getElementById('profilePicture').src = data.profile_picture;
                showAlert('success', 'Profile picture updated successfully');
            }
        } catch (error) {
            showAlert('error', 'Failed to update profile picture');
        }
    };
    input.click();
});

logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    window.location.href = '/index.html';
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
    
    document.querySelector('.container').prepend(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
}); 