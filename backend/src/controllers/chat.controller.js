const simulatedReplies = {
  crowd: "Current crowd density is within safe limits. Zone B is at 78% capacity.",
  gate: "Gate 2 and Gate 4 are currently open. Gate 1 closes at 9 PM.",
  occupancy: "Total venue occupancy is at 62%. Peak expected around 8:30 PM.",
  alert: "No active alerts at this time. All zones are operating normally.",
  safety: "Emergency exits are clear. Security personnel are stationed at all entry points.",
  default: "I'm analyzing your query. For real-time data, ensure your venue sensors are connected."
};

export async function postChatMessage(req, res) {
  try {
    const { message } = req.body ?? {};

    if (typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ error: "message is required" });
    }

    await new Promise((resolve) => setTimeout(resolve, 800));

    const normalizedMessage = message.toLowerCase();
    const matchedKeyword = Object.keys(simulatedReplies).find(
      (keyword) => keyword !== "default" && normalizedMessage.includes(keyword)
    );
    const reply = simulatedReplies[matchedKeyword] ?? simulatedReplies.default;

    return res.status(200).json({
      reply,
      timestamp: new Date().toISOString()
    });
  } catch {
    return res.status(500).json({ error: "Something went wrong" });
  }
}
