export async function apiGet<T>(path: string): Promise<T> {
  // Use the configured API base URL, falling back to localhost in development.
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  // Send a GET request to the resolved API endpoint.
  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      // Indicate that the client expects JSON content.
      'Content-Type': 'application/json',
    },
  });

  // Throw an error when the server responds with a non-success status code.
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  // Parse and return the JSON response as the requested generic type.
  return response.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  // Use the configured API base URL, falling back to localhost in development.
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  // Send a POST request to the resolved API endpoint.
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: {
      // Indicate that the client sends and expects JSON content.
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  // Throw an error when the server responds with a non-success status code.
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  // Parse and return the JSON response as the requested generic type.
  return response.json() as Promise<T>;
}