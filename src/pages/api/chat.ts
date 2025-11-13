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

  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    // Using gemini-1.5-flash (stable). For latest experimental, use "gemini-2.0-flash-exp"
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

    const result = await chat.sendMessage(String(message));
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
    const errorDetails = error instanceof Error ? error.stack : undefined;
    console.error("Error details:", errorDetails);
    
    return res.status(500).json({ 
      error: "Failed to get response from AI",
      details: errorMessage
    });
  }
}

