// src/api.js

// Function signature now accepts the base URL
export async function getUser(baseUrl, id) {
    const response = await fetch(`${baseUrl}/api/users/${id}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}
