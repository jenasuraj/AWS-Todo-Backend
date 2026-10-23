import { ChatOpenAI } from "@langchain/openai";

/**
 * OpenRouter wrapper.
 *
 * OpenRouter exposes an OpenAI-compatible API, so we reuse LangChain's ChatOpenAI
 * and just point it at OpenRouter's base URL. Any model on https://openrouter.ai/models
 * works, e.g. "openai/gpt-4o-mini", "anthropic/claude-sonnet-4.5", "google/gemini-2.5-flash".
 */
export function getLLM(model = process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini") {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not set. Add it to your .env file.");
  }

  return new ChatOpenAI({
    model,
    apiKey,
    temperature: 0.7,
    configuration: {
      baseURL: "https://openrouter.ai/api/v1",
    },
  });
}
