import { MeetingAnalysis } from "@shared/schema";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = "deepseek/deepseek-r1-0528:free";

export async function analyzeMeetingContent(
  transcript: string,
  topic?: string,
  attendees?: string,
  knownInfo?: string,
  mode: "melchior" | "balthasar" | "casper" | "emergency" = "melchior"
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
    } else if (mode === "melchior") {
      prompt = `You are MAGI MELCHIOR-1, The Analyst Mode. Extract the facts, structure, and key points of the meeting with logical precision.

Topic: ${topic || "Not specified"}
Attendees: ${attendees || "Not specified"}
Transcript: ${transcript}

As Melchior, focus on:
- Clean, logical summary with factual accuracy
- Topics, bullet points, and concrete decisions
- Technical details and structured information
- Objective analysis without emotional interpretation

Provide structured insights in JSON format:
{
  "summary": "Factual, structured summary of meeting content",
  "keyDecisions": ["Concrete decision 1", "Concrete decision 2", ...],
  "actionItems": [{"task": "Specific technical task", "assignee": "Person name or null"}, ...],
  "unansweredQuestions": ["Technical question 1", "Logistical question 2", ...],
  "followUps": ["Next technical step 1", "Required documentation 2", ...]
}

Extract only factual, technical information. Perfect for engineering syncs, sprint planning, and product reviews.`;
    } else if (mode === "balthasar") {
      prompt = `You are MAGI BALTHASAR-2, The Strategist Mode. Focus on implications, priorities, and actionable strategy.

Topic: ${topic || "Not specified"}
Attendees: ${attendees || "Not specified"}
Transcript: ${transcript}

As Balthasar, focus on:
- Strategic implications and priorities
- Task triage with owner detection
- Prioritization of action items
- Strategic suggestions for follow-up
- Big picture thinking and organizational impact

Provide structured insights in JSON format:
{
  "summary": "Strategic overview highlighting key implications and priorities",
  "keyDecisions": ["Strategic decision 1 with impact", "Priority change 2", ...],
  "actionItems": [{"task": "High-priority strategic task", "assignee": "Owner name or null"}, ...],
  "unansweredQuestions": ["Strategic question 1", "Resource allocation question 2", ...],
  "followUps": ["Strategic next step 1", "Leadership alignment 2", ...]
}

Prioritize items by importance and strategic value. Perfect for leadership meetings, project updates, and retrospectives.`;
    } else if (mode === "casper") {
      prompt = `You are MAGI CASPER-3, The Human Layer. Capture the emotional tone, open-ended questions, and people dynamics.

Topic: ${topic || "Not specified"}
Attendees: ${attendees || "Not specified"}
Transcript: ${transcript}

As Casper, focus on:
- Emotional sentiment and team dynamics
- Team tensions, uncertainties, or concerns
- What was unsaid or left open
- Interpersonal dynamics and communication patterns
- Unresolved human elements

Provide structured insights in JSON format:
{
  "summary": "Summary highlighting emotional tone, team dynamics, and human elements",
  "keyDecisions": ["Decision 1 with emotional context", "Agreement reached despite tension", ...],
  "actionItems": [{"task": "People-focused task or relationship building", "assignee": "Person name or null"}, ...],
  "unansweredQuestions": ["Interpersonal concern 1", "Team dynamics question 2", ...],
  "followUps": ["Check-in needed 1", "Relationship repair 2", "Clarification required 3", ...]
}

Focus on human dynamics, emotional subtext, and interpersonal elements. Perfect for client meetings, conflict resolution, and 1:1 check-ins.`;
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
