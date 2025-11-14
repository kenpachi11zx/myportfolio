import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "@/env";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, history, context } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    // Choose model from env if provided. Default to gemini-2.5-flash.
    // You can set `GEMINI_MODEL` in your environment (e.g. `.env.local`) to override.
    // Available models: gemini-2.5-flash, gemini-pro, gemini-1.5-pro
    const modelName = env.GEMINI_MODEL ?? "gemini-2.5-flash";
    const model = genAI.getGenerativeModel({ model: modelName });

    // Filter and build conversation history
    // Gemini requires: first message must be from user, messages must alternate
    const messages = Array.isArray(history) ? history : [];
    
    // Build history - skip any initial assistant messages, start from first user message
    const chatHistory: Array<{ role: string; parts: Array<{ text: string }> }> = [];
    let foundFirstUser = false;
    
    for (const msg of messages) {
      if (!msg || typeof msg !== "object" || !msg.content || typeof msg.content !== "string") {
        continue;
      }
      
      // Skip assistant messages until we find the first user message
      if (!foundFirstUser && msg.role === "assistant") {
        continue;
      }
      
      if (msg.role === "user") {
        foundFirstUser = true;
      }
      
      // Only add messages after we've found the first user message
      if (foundFirstUser) {
        chatHistory.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: String(msg.content) }],
        });
      }
    }

    console.log("Chat history length:", chatHistory.length);
    console.log("Sending message:", message);

    const chat = model.startChat({
      history: chatHistory.length > 0 ? chatHistory : undefined,
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 1024,
      },
    });

    // Portfolio assistant instructions
    const portfolioPrompt = `You are the personal assistant for Sahil Islam, a Full Stack Developer. Use the following structured portfolio information to answer questions accurately and helpfully.

PORTFOLIO INFORMATION:
${context ? JSON.stringify(context, null, 2) : "No context provided"}

INSTRUCTIONS:
- Always use the EXACT information from the portfolio context above. Never use placeholders like [Owner's Name] or [Owner's Email].
- When asked about projects, provide them in a structured format:
  * Project name
  * Brief description
  * Type/category
  * Live URL or Code URL (whichever is available)
- When asked about technologies, organize them by category (Languages, Frontend, Backend, Databases, Tools, Other).
- When asked about soft skills, list: Teamwork, Problem Solving, Time Management, Adaptability, Quick Learner, Communication.
- When asked about extracurricular activities, mention: Cricket, Video Editing, Graphic Designing.
- When asked about languages, list: English, Hindi, Assamese (all Read/Write/Speak).
- When asked about certificates/achievements, provide:
  * Certificate name
  * Issuing organization
  * Completion date
- When asked about personal details, provide: DOB (30 April, 2004), Hometown (Guwahati, Assam), Nationality (India).
- When asked about contact information, provide:
  * Email: sahilislam619@gmail.com
  * Phone: +91 6003021379
  * LinkedIn: https://www.linkedin.com/in/sahil-islam-b1955825a/
  * GitHub: https://github.com/kenpachi11zx
- Keep answers concise and well-structured (2-4 sentences for short answers, more if asked for details).
- Be friendly, professional, and helpful.
- Format lists with clear structure and bullet points.
- If asked about something not in the context, say you don't have that information rather than making it up.
`;

    const composedMessage = `${portfolioPrompt}\n\nUser: ${String(message)}`;

    const result = await chat.sendMessage(composedMessage);
    const response = await result.response;
    const text = response.text();
    
    console.log("Received response, length:", text?.length || 0);

    if (!text || text.trim().length === 0) {
      console.error("Empty response from Gemini");
      return res.status(500).json({ 
        error: "Empty response from AI",
        details: "The AI returned an empty response"
      });
    }

    return res.status(200).json({ message: text });
  } catch (error) {
    console.error("Gemini API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorDetails = error instanceof Error ? (error as any).stack : undefined;
    console.error("Error details:", errorDetails);

    // If the error looks like an unsupported/unknown model (404)
    const statusCode = (error as any)?.status;
    if (statusCode === 404 || (typeof errorMessage === "string" && errorMessage.includes("is not found"))) {
      console.error("Model not found. Try using: gemini-pro, gemini-1.5-pro, or check Google AI Studio for available models.");
      return res.status(500).json({
        error: "Model not found or unsupported for this API version",
        details: errorMessage,
        suggestion:
          "Set GEMINI_MODEL to a supported model (e.g., gemini-pro) in .env.local and restart the dev server.",
      });
    }

    // Provide more helpful error messages
    let userFriendlyError = "Failed to get response from AI";
    if (errorMessage.includes("API_KEY")) {
      userFriendlyError = "API key is missing or invalid. Please check your GEMINI_API_KEY environment variable.";
    } else if (errorMessage.includes("quota") || errorMessage.includes("rate limit")) {
      userFriendlyError = "API quota exceeded. Please check your Google Cloud billing and quotas.";
    } else if (errorMessage.includes("not found") || errorMessage.includes("404")) {
      userFriendlyError = "Model not found. Please check your GEMINI_MODEL environment variable.";
    }

    return res.status(500).json({
      error: userFriendlyError,
      details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
}

