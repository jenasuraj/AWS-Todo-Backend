import { Request, Response } from "express";
import { HumanMessage } from "@langchain/core/messages";
import { graph } from "./graph";

/**
 * POST /call-ai-agent
 * Body: { "prompt": "Write about the benefits of browser automation" }
 */
export default async function CallAiAgentHandler(req: Request, res: Response) {
  const prompt = typeof req.body?.prompt === "string" ? req.body.prompt.trim() : "";
  if (!prompt) {
    res.status(400).json({ error: 'Send a JSON body like { "prompt": "..." }' });
    return;
  }

  try {
    const result = await graph.invoke({
      messages: [new HumanMessage(prompt)],
    });

    // result.messages = [HumanMessage, AIMessage (writer), AIMessage (summariser)]
    const [, written, summary] = result.messages;

    res.json({
      prompt,
      written: written?.content,
      summary: summary?.content,
      messages: result.messages.map((m) => ({ role: m.getType(), content: m.content })),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
}
