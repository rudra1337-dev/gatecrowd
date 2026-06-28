const mockResponses = [
  "I'm analyzing the crowd data for your venue right now.",
  'Based on current occupancy trends, I recommend opening Gate 3 for better flow.',
  'The occupancy forecast shows a peak at 7:30 PM. Consider alerting staff.',
  'All zones are within safe capacity limits at this time.',
];

export async function fetchAIResponse(userMessage) {
  const delay = 1500 + Math.random() * 1200;
  await new Promise((resolve) => setTimeout(resolve, delay));

  if (Math.random() < 0.1) {
    throw new Error('AI service temporarily unavailable. Please try again.');
  }

  const random = mockResponses[Math.floor(Math.random() * mockResponses.length)];
  return `${random}\n\n*(This is a mock response to: "${userMessage}")*`;
}
