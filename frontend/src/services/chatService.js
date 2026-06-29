export async function fetchAIResponse(userMessage) {
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  const response = await fetch(`${baseURL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userMessage }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to get response');
  }

  const data = await response.json();
  return data.reply;
}
