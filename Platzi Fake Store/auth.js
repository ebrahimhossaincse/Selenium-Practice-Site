// API Base URL
const API_BASE_URL = "https://api.escuelajs.co/api/v1/auth";

// Login Function
async function login(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) throw new Error("Authentication failed");

        const { access_token, refresh_token } = await response.json();
        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("refreshToken", refresh_token);

        window.location.href = "profile.html";
    } catch (error) {
        alert(error.message || "Login failed");
    }
}

// Load Profile
async function getProfile() {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) throw new Error("Failed to load profile");

        const profile = await response.json();
        document.getElementById("userName").textContent = profile.name;
        document.getElementById("userEmail").textContent = profile.email;
        document.getElementById("avatarImg").src = profile.avatar;
    } catch (error) {
        alert(error.message || "Profile load failed");
    }
}

// Refresh Token
async function refreshToken() {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return;

    try {
        const response = await fetch(`${API_BASE_URL}/refresh-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) throw new Error("Token renewal failed");

        const { access_token, refresh_token } = await response.json();
        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("refreshToken", refresh_token);

        alert("Tokens renewed successfully");
    } catch (error) {
        alert(error.message || "Token renewal failed");
    }
}

// Logout
function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "login.html";
}

// Auto Load Profile on Page Load
if (window.location.pathname.includes("profile.html")) {
    window.onload = getProfile;
}
