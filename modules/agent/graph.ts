import { Annotation, END, START, StateGraph, messagesStateReducer } from "@langchain/langgraph";
import { BaseMessage, SystemMessage } from "@langchain/core/messages";
import { getLLM } from "../../lib/llm";

/**
 * State
 *
 * Python equivalent:
 *   class State(TypedDict):
 *       messages: Annotated[list, add_messages]
 *
 * `messagesStateReducer` is the JS version of `add_messages`: whatever a node returns
 * under `messages` is APPENDED to the existing list instead of replacing it.
 */
export const State = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: messagesStateReducer,
    default: () => [],
  }),
});

const WRITER_PROMPT =
  "You are a helpful writer. Write a clear, well-structured piece of about 200-300 words " +
  "on the topic the user asks for.";

const SUMMARISER_PROMPT =
  "You are a summariser. Summarise the most recent piece of writing in this conversation " +
  "in 3 short bullet points.";

/**
 * Node 1: writer
 * Reads state.messages (the user's request), returns the AI's written piece.
 */
async function writer(state: typeof State.State) {
  const llm = getLLM();
  const response = await llm.invoke([new SystemMessage(WRITER_PROMPT), ...state.messages]);
  return { messages: [response] }; // appended by the reducer
}

/**
 * Node 2: summariser
 * Sees everything so far (user request + writer's output) and summarises it.
 */
async function summariser(state: typeof State.State) {
  const llm = getLLM();
  const response = await llm.invoke([new SystemMessage(SUMMARISER_PROMPT), ...state.messages]);
  return { messages: [response] };
}

/**
 * Graph:  START -> writer -> summariser -> END
 *
 * Python equivalent:
 *   graph_node = StateGraph(State)
 *   graph_node.add_node("writer", writer)
 *   ...
 *   graph = graph_node.compile()
 */
const graphNode = new StateGraph(State)
  .addNode("writer", writer)
  .addNode("summariser", summariser)
  .addEdge(START, "writer")
  .addEdge("writer", "summariser")
  .addEdge("summariser", END);

export const graph = graphNode.compile();
