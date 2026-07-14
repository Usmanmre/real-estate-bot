import { openaiAnalysis } from "./openai";
import { addMessage } from "./memory";

export type QueryResult = {
  id: string;
  score: number;
  metadata?: Record<string, unknown>;
};
export async function queryPinecone(
  query: string,
  sessionId: string,
  topK = 3,
) {
  try {
   const openaiResponse = await openaiAnalysis(query, sessionId);
   addMessage(sessionId, { role: "assistant", content: openaiResponse });
    return {response: openaiResponse};
  } catch (err: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e = err as any;
    console.error("queryPinecone error:", e?.message ?? e);
    return {response: "Sorry, something went wrong. Please try again."};
  }
}

export default queryPinecone;
