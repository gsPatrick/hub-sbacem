const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = {
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
    },

    getUsers: async (token) => {
        const response = await fetch(`${API_URL}/users/`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.json();
    }
};
