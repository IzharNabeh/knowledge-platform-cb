import type { BrowserGlobal } from "../src/types";

declare global {
  interface Window {
    ChatWidget?: BrowserGlobal;
  }
}

export function mountChatWidgetForAngular(authService: any, currentUser: any) {
  return window.ChatWidget?.init({
    apiBaseUrl: "http://localhost:8787",
    endpoints: {
      ask: "/knowledge_rag/ask",
      history: "/knowledge_rag/get_chat_history"
    },
    rag: {
      chatId: currentUser?.id || "user-123",
      knowledgeNames: ["sample-kb"],
      enableReferences: true
    },
    title: "Knowledge Assistant",
    welcomeMessage: "Welcome. How can I help you today?",
    sourceApp: "angular-dummy-app",
    getAccessToken: async () => {
      if (typeof authService?.getAccessToken === "function") {
        return authService.getAccessToken();
      }
      return "dummy-local-token";
    },
    getUserContext: async () => ({
      userId: currentUser?.id || "user-123",
      displayName: currentUser?.name || "Local Angular User"
    })
  });
}
