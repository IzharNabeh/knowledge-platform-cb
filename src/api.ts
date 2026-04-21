import { joinUrl, normalizeError } from "./utils";
import type {
  ChatHistoryMessage,
  ResolvedChatWidgetConfig,
  SendMessageRequest,
  SendMessageResponse
} from "./types";

type RagResponseItem = {
  answer?: string;
  content?: {
    source_documents?: Array<string | null>;
    scores?: Array<number | null> | null;
    page_numbers?: Array<number | null> | null;
    sheet_names?: Array<string | null> | null;
    row_numbers?: Array<number | null> | null;
    knowledge_names?: Array<string | null> | null;
  };
};

function buildHeaders(
  config: ResolvedChatWidgetConfig,
  token: string | null
): Record<string, string> {
  return {
    "Content-Type": "application/json",
    ...config.customHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export async function postMessage(
  config: ResolvedChatWidgetConfig,
  payload: SendMessageRequest
): Promise<SendMessageResponse> {
  const token = config.getAccessToken ? await config.getAccessToken() : null;
  const url = joinUrl(config.apiBaseUrl, config.endpoints.ask);

  const response = await fetch(url, {
    method: "POST",
    headers: buildHeaders(config, token),
    body: JSON.stringify({
      query: payload.message,
      chat_id: payload.chatId,
      knowledge_names: payload.knowledgeNames,
      edit_last_qa: payload.editLastQa ?? false,
      enable_references: payload.enableReferences ?? true
    })
  });

  if (!response.ok) {
    throw new Error(`Chat backend returned ${response.status}.`);
  }

  const data = (await response.json()) as RagResponseItem[];
  const firstAnswer = data[0];

  if (!firstAnswer?.answer || typeof firstAnswer.answer !== "string") {
    throw new Error("Chat backend response is missing a valid answer.");
  }

  const content = firstAnswer.content;
  const sourceDocuments = content?.source_documents ?? [];
  const scores = content?.scores ?? [];
  const pageNumbers = content?.page_numbers ?? [];
  const sheetNames = content?.sheet_names ?? [];
  const rowNumbers = content?.row_numbers ?? [];
  const knowledgeNames = content?.knowledge_names ?? [];

  const citations = sourceDocuments.map((sourceDocument, index) => ({
    sourceDocument,
    score: scores[index] ?? null,
    pageNumber: pageNumbers[index] ?? null,
    sheetName: sheetNames[index] ?? null,
    rowNumber: rowNumbers[index] ?? null,
    knowledgeName: knowledgeNames[index] ?? null
  }));

  return {
    chatId: payload.chatId,
    answer: firstAnswer.answer,
    suggestions: [],
    citations
  };
}

export async function fetchHistory(
  config: ResolvedChatWidgetConfig,
  chatId: string
): Promise<ChatHistoryMessage[]> {
  if (!config.endpoints.history) {
    return [];
  }

  const token = config.getAccessToken ? await config.getAccessToken() : null;
  const url = new URL(joinUrl(config.apiBaseUrl, config.endpoints.history));
  url.searchParams.set("chat_id", chatId);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: buildHeaders(config, token)
  });

  if (!response.ok) {
    throw new Error(`Chat history endpoint returned ${response.status}.`);
  }

  const data = (await response.json()) as unknown;

  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const candidate = item as Record<string, unknown>;
      const roleValue =
        candidate.role ?? candidate.type ?? candidate.sender ?? candidate.author;
      const textValue =
        candidate.text ?? candidate.message ?? candidate.content ?? candidate.answer;

      if (typeof textValue !== "string") {
        return null;
      }

      const loweredRole =
        typeof roleValue === "string" ? roleValue.toLowerCase() : "assistant";

      return {
        role:
          loweredRole === "user" || loweredRole === "human"
            ? "user"
            : "assistant",
        text: textValue
      } satisfies ChatHistoryMessage;
    })
    .filter((message): message is ChatHistoryMessage => Boolean(message));
}

export function reportWidgetError(
  config: ResolvedChatWidgetConfig,
  error: unknown
): Error {
  const normalized = normalizeError(error);
  config.onError?.(normalized);
  return normalized;
}
