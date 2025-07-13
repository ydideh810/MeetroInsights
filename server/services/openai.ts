import { MeetingAnalysis } from "@shared/schema";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = "deepseek/deepseek-r1-0528:free";

export async function analyzeMeetingContent(
  transcript: string,
  topic?: string,
  attendees?: string,
  knownInfo?: string,
  mode: "standard" | "emergency" = "standard"
): Promise<MeetingAnalysis> {
  try {
    let prompt = "";
    
    if (mode === "emergency") {
      prompt = `You are an AI meeting recovery assistant. Based on the limited information provided, generate a plausible meeting recovery log.

Topic: ${topic || "Unknown"}
Attendees: ${attendees || "Unknown"}
Known Information: ${knownInfo || "None"}
Transcript/Content: ${transcript}

Please analyze this information and provide a structured recovery log in JSON format with the following structure:
{
  "summary": "Brief overview of what likely happened in the meeting",
  "keyDecisions": ["Decision 1", "Decision 2", ...],
  "actionItems": [{"task": "Task description", "assignee": "Person name or null"}, ...],
  "unansweredQuestions": ["Question 1", "Question 2", ...],
  "followUps": ["Follow-up 1", "Follow-up 2", ...]
}

Focus on creating realistic, actionable insights based on the provided information.`;
    } else {
      prompt = `You are an AI meeting recovery assistant. Analyze the following meeting transcript and extract key insights.

Topic: ${topic || "Not specified"}
Attendees: ${attendees || "Not specified"}
Transcript: ${transcript}

Please analyze this meeting content and provide structured insights in JSON format with the following structure:
{
  "summary": "Concise 2-3 sentence summary of the meeting",
  "keyDecisions": ["Decision 1", "Decision 2", ...],
  "actionItems": [{"task": "Task description", "assignee": "Person name or null"}, ...],
  "unansweredQuestions": ["Question 1", "Question 2", ...],
  "followUps": ["Follow-up 1", "Follow-up 2", ...]
}

Extract only factual information from the transcript. If no information is available for a category, return an empty array.`;
    }

    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://meetro.replit.app",
        "X-Title": "MEETRO - Meeting Recovery System",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          {
            role: "system",
            content: "You are a meeting analysis expert. Always respond with valid JSON in the specified format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content || "{}");
    
    return {
      summary: result.summary || "No summary available",
      keyDecisions: result.keyDecisions || [],
      actionItems: result.actionItems || [],
      unansweredQuestions: result.unansweredQuestions || [],
      followUps: result.followUps || []
    };
  } catch (error) {
    console.error("OpenRouter API Error:", error);
    throw new Error("Failed to analyze meeting content. Please check your API key and try again.");
  }
}
