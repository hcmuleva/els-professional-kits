export async function getUser(id) {
    const baseUrl = process.env.API_BASE_URL || "http://127.0.0.1:3344";  // 👈 force IPv4
    const response = await fetch(`${baseUrl}/api/users/${id}`);
    if (!response.ok) throw new Error("Network error");
    return response.json();
  }
  