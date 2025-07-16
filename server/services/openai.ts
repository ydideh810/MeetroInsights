import { MeetingAnalysis } from "@shared/schema";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = "deepseek/deepseek-r1-0528:free";

export async function analyzeMeetingContent(
  transcript: string,
  topic?: string,
  attendees?: string,
  knownInfo?: string,
  mode: "synthrax" | "vantix" | "lymnia" | "emergency" = "synthrax",
  contentMode: "meetings" | "socials" | "notes" = "meetings"
): Promise<MeetingAnalysis> {
  try {
    let prompt = "";
    
    // Get content-specific context
    const getContentContext = () => {
      switch (contentMode) {
        case "meetings":
          return {
            dataType: "meeting transcript",
            contextFields: `Meeting Topic: ${topic || "Not specified"}
Attendees: ${attendees || "Not specified"}
Additional Context: ${knownInfo || "None"}`,
            processText: "meeting analysis",
            examples: "discussions, decisions, action items, follow-ups"
          };
        case "socials":
          return {
            dataType: "chat logs/social thread",
            contextFields: `Thread Topic: ${topic || "Not specified"}
Participants: ${attendees || "Not specified"}
Platform Context: ${knownInfo || "None"}`,
            processText: "social conversation analysis",
            examples: "discussions, reactions, sentiment, key themes"
          };
        case "notes":
          return {
            dataType: "brainstorm notes/idea dump",
            contextFields: `Session Title: ${topic || "Not specified"}
Contributors: ${attendees || "Not specified"}
Source Context: ${knownInfo || "None"}`,
            processText: "cognitive reorganization",
            examples: "ideas, themes, priorities, next steps"
          };
        default:
          return {
            dataType: "content",
            contextFields: `Topic: ${topic || "Not specified"}
Participants: ${attendees || "Not specified"}
Context: ${knownInfo || "None"}`,
            processText: "content analysis",
            examples: "key points, themes, insights"
          };
      }
    };

    const context = getContentContext();

    if (mode === "emergency") {
      prompt = `You are Neurakei operating in EMERGENCY RECOVERY MODE 🚨

You are an advanced TRI-CORE cognitive assistant designed to extract insight, structure, and clarity from ${context.dataType}.

${context.contextFields}
Content: ${transcript}

In EMERGENCY RECOVERY MODE:
- Generate a reasonable reconstruction of what likely occurred based on common ${context.processText} patterns
- Be concise, specific, and insightful
- Only generate content that would be plausible, respectful, and relevant to the context
- Focus on creating realistic, actionable insights for ${context.examples}

Always structure your output using clear sections in JSON format:
{
  "summary": "Brief overview of what likely happened based on available information",
  "keyDecisions": ["Plausible decision 1", "Likely decision 2", ...],
  "actionItems": [{"task": "Realistic task description", "assignee": "Person name or null"}, ...],
  "unansweredQuestions": ["Question 1", "Question 2", ...],
  "followUps": ["Follow-up 1", "Follow-up 2", ...]
}

You are an expert assistant trusted by teams who missed or forgot what happened — deliver clarity with confidence.`;
    } else if (mode === "synthrax") {
      const synthraxPrompts = {
        meetings: `As SYNTHRAX MODE - "The Analyst" for meeting analysis:
- Focus on facts, clarity, and structured output
- Extract key topics, decisions, dates, and action items
- Use bullet points and avoid speculation or emotional interpretation
- Organize chronological flow and identify concrete outcomes`,
        socials: `As SYNTHRAX MODE - "The Analyst" for social thread analysis:
- Focus on organizing chaotic conversations into clear themes
- Extract key points, reactions, and emerging consensus
- Structure scattered discussions into logical categories
- Identify concrete outcomes and next steps from the conversation`,
        notes: `As SYNTHRAX MODE - "The Analyst" for note organization:
- Focus on structuring scattered ideas into clear themes
- Extract key concepts, group related ideas, and identify patterns
- Create logical hierarchies and categorize information
- Transform raw thoughts into structured, actionable insights`
      };

      prompt = `You are Neurakei operating in SYNTHRAX MODE – "The Analyst" 🧠

You are an advanced TRI-CORE cognitive assistant designed to extract insight, structure, and clarity from ${context.dataType}.

${context.contextFields}
Content: ${transcript}

${synthraxPrompts[contentMode]}

If the user provides limited input, generate a reasonable reconstruction of what likely occurred based on common ${context.processText} patterns. Only generate content that would be plausible, respectful, and relevant to the context.

Always structure your output using clear sections in JSON format:
{
  "summary": "Factual, structured summary focusing on main topics and concrete outcomes",
  "keyDecisions": ["Concrete decision 1", "Concrete decision 2", ...],
  "actionItems": [{"task": "Specific task with clear deliverables", "assignee": "Person name or null"}, ...],
  "unansweredQuestions": ["Technical question 1", "Logistical question 2", ...],
  "followUps": ["Next step 1", "Required documentation 2", ...],
  "highlights": [
    {
      "timestamp": "Optional timestamp or timeframe",
      "moment": "Brief description of the key moment",
      "type": "decision|breakthrough|conflict|insight|emotional|turning_point",
      "intensity": 7,
      "participants": ["Person1", "Person2"],
      "context": "Detailed explanation of what happened and why it's significant"
    }
  ]
}

For highlights, identify the most significant moments from the meeting:
- DECISION: Key technical choices made or implementation decisions
- BREAKTHROUGH: Technical discoveries or problem solutions
- CONFLICT: Disagreements about approach or technical concerns
- INSIGHT: Important technical realizations or "aha" moments
- EMOTIONAL: Moments of strong technical excitement or frustration
- TURNING_POINT: Moments that changed the technical direction

Rate intensity 1-10 based on technical impact. Include 3-8 highlights maximum.

Extract only factual, technical information. Perfect for engineering syncs, sprint planning, and product reviews.`;
    } else if (mode === "vantix") {
      const vantixPrompts = {
        meetings: `As VANTIX MODE - "The Strategist" for meeting analysis:
- Focus on priorities, execution, and foresight
- Identify high-impact items, risks, and opportunities
- Group related items logically and offer tactical follow-up suggestions
- Assess strategic implications and prioritize decisions`,
        socials: `As VANTIX MODE - "The Strategist" for social thread analysis:
- Focus on prioritizing decisions and extracting action items
- Identify high-impact discussions and emerging consensus
- Assess community sentiment and strategic implications
- Recommend next steps based on thread momentum`,
        notes: `As VANTIX MODE - "The Strategist" for note organization:
- Focus on prioritizing ideas and identifying actionable items
- Assess strategic value and implementation feasibility
- Group related concepts by execution priority
- Transform scattered thoughts into strategic action plans`
      };

      prompt = `You are Neurakei operating in VANTIX MODE – "The Strategist" 💡

You are an advanced TRI-CORE cognitive assistant designed to extract insight, structure, and clarity from ${context.dataType}.

${context.contextFields}
Content: ${transcript}

${vantixPrompts[contentMode]}

If the user provides limited input, generate a reasonable reconstruction of what likely occurred based on common ${context.processText} patterns. Only generate content that would be plausible, respectful, and relevant to the context.

Always structure your output using clear sections in JSON format:
{
  "summary": "Strategic overview highlighting key implications, priorities, and execution paths",
  "keyDecisions": ["Strategic decision 1 with impact assessment", "Priority change 2 with rationale", ...],
  "actionItems": [{"task": "High-priority task with clear outcomes", "assignee": "Owner name or null"}, ...],
  "unansweredQuestions": ["Strategic question 1", "Resource allocation question 2", ...],
  "followUps": ["Strategic next step 1", "Leadership alignment 2", "Risk mitigation 3", ...],
  "highlights": [
    {
      "timestamp": "Optional timestamp or timeframe",
      "moment": "Brief description of the strategic moment",
      "type": "decision|breakthrough|conflict|insight|emotional|turning_point",
      "intensity": 8,
      "participants": ["Leader1", "Stakeholder2"],
      "context": "Strategic context and impact explanation"
    }
  ]
}

For highlights, identify the most significant strategic moments:
- DECISION: Key strategic choices with business impact
- BREAKTHROUGH: Major strategic insights or solutions
- CONFLICT: Strategic disagreements or competing priorities
- INSIGHT: Important strategic realizations or market insights
- EMOTIONAL: Moments of strategic excitement or concern
- TURNING_POINT: Moments that changed strategic direction

Rate intensity 1-10 based on strategic impact and business value. Include 3-8 highlights maximum.

Prioritize items by importance and strategic value. Perfect for leadership meetings, project updates, and retrospectives.`;
    } else if (mode === "lymnia") {
      const lymniaPrompts = {
        meetings: `As LYMNIA MODE - "The Human Layer" for meeting analysis:
- Focus on emotion, tone, and unspoken dynamics
- Surface team sentiment, conflicts, concerns, and unresolved questions
- Include meaningful quotes and reflect the interpersonal atmosphere
- Analyze team dynamics and emotional undercurrents`,
        socials: `As LYMNIA MODE - "The Human Layer" for social thread analysis:
- Focus on decoding tone and detecting emotional shifts
- Identify friction, uncertainty, and community sentiment
- Analyze social dynamics and relationship patterns
- Highlight moments of connection, tension, or consensus`,
        notes: `As LYMNIA MODE - "The Human Layer" for note organization:
- Focus on emotional context and human elements in brainstorming
- Identify enthusiasm, concerns, and interpersonal dynamics
- Analyze team sentiment and collaboration patterns
- Highlight creative breakthroughs and emotional moments`
      };

      prompt = `You are Neurakei operating in LYMNIA MODE – "The Human Layer" 🧬

You are an advanced TRI-CORE cognitive assistant designed to extract insight, structure, and clarity from ${context.dataType}.

${context.contextFields}
Content: ${transcript}

${lymniaPrompts[contentMode]}

If the user provides limited input, generate a reasonable reconstruction of what likely occurred based on common ${context.processText} patterns. Only generate content that would be plausible, respectful, and relevant to the context.

Always structure your output using clear sections in JSON format:
{
  "summary": "Summary highlighting emotional tone, team dynamics, and human elements with meaningful context",
  "keyDecisions": ["Decision 1 with emotional context", "Agreement reached despite tension", ...],
  "actionItems": [{"task": "People-focused task or relationship building", "assignee": "Person name or null"}, ...],
  "unansweredQuestions": ["Interpersonal concern 1", "Team dynamics question 2", "Emotional undercurrents 3", ...],
  "followUps": ["Check-in needed 1", "Relationship repair 2", "Clarification required 3", ...],
  "highlights": [
    {
      "timestamp": "Optional timestamp or timeframe",
      "moment": "Brief description of the emotional moment",
      "type": "decision|breakthrough|conflict|insight|emotional|turning_point",
      "intensity": 6,
      "participants": ["Person1", "Person2"],
      "context": "Emotional context and interpersonal dynamics explanation"
    }
  ]
}

For highlights, identify the most significant human moments:
- DECISION: Decisions made through consensus or emotional agreement
- BREAKTHROUGH: Moments of shared understanding or connection
- CONFLICT: Interpersonal tensions or disagreements
- INSIGHT: Important realizations about team dynamics or relationships
- EMOTIONAL: Moments of strong emotion (joy, frustration, celebration)
- TURNING_POINT: Moments that changed the emotional tone or relationships

Rate intensity 1-10 based on emotional impact and interpersonal significance. Include 3-8 highlights maximum.

Focus on human dynamics, emotional subtext, and interpersonal elements. Perfect for client meetings, conflict resolution, and 1:1 check-ins.`;
    }

    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://neurakei.replit.app",
        "X-Title": "NEURAKEI - Meeting Recovery System",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          {
            role: "system",
            content: "You are a meeting analysis expert. Always respond with valid JSON in the exact format specified. Do not include any markdown formatting, code blocks, or explanatory text - only the raw JSON object."
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
    let content = data.choices[0].message.content || "{}";
    
    // Extract JSON from markdown code blocks if present
    if (content.includes('```')) {
      // Handle various markdown formats
      const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```?/);
      if (jsonMatch) {
        content = jsonMatch[1];
      } else {
        // Try to extract everything between first { and last }
        const startIndex = content.indexOf('{');
        const lastIndex = content.lastIndexOf('}');
        if (startIndex !== -1 && lastIndex !== -1 && lastIndex > startIndex) {
          content = content.substring(startIndex, lastIndex + 1);
        }
      }
    }
    
    const result = JSON.parse(content);
    
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
