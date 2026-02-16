const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Helper to get token
const getToken = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("central_access_token");
    }
    return null;
};

const request = async (endpoint, method, body = null) => {
    const token = getToken();
    const headers = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const config = {
        method,
        headers,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${endpoint}`, config);

    // Handle 401 (Unauthorized) -> Logout?
    if (response.status === 401) {
        console.warn("Unauthorized access");
        // Optional: window.location.href = "/login";
    }

    // Attempt to parse JSON
    let data;
    try {
        data = await response.json();
    } catch (error) {
        data = null;
    }

    if (!response.ok) {
        throw new Error(data?.detail || "API Error");
    }

    return { data, status: response.status };
};

export const api = {
    get: (endpoint) => request(endpoint, "GET"),
    post: (endpoint, body) => request(endpoint, "POST", body),
    patch: (endpoint, body) => request(endpoint, "PATCH", body),
    delete: (endpoint) => request(endpoint, "DELETE"),

    // Specific Auth Methods
    login: async (formData) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            body: formData,
        });
        if (!response.ok) throw new Error("Login failed");
        return response.json();
    },

    verifySession: async (systemId, redirectUrl, token) => {
        const response = await fetch(`${API_URL}/auth/verify-session-browser?system_id=${systemId}&redirect_url=${encodeURIComponent(redirectUrl)}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response;
    }
};
