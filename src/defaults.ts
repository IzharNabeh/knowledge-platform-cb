import type { ChatWidgetTheme, ResolvedChatWidgetConfig } from "./types";

export const defaultTheme: ChatWidgetTheme = {
  accent: "#0f766e",
  accentSoft: "#ecfeff",
  panelBackground: "#ffffff",
  surfaceBackground: "#f8fafc",
  text: "#1f2937",
  mutedText: "#64748b",
  borderColor: "#dbe4ee",
  shadow: "0 24px 64px rgba(15, 23, 42, 0.20)",
  zIndex: 2147483000,
  fontFamily:
    "\"Segoe UI\", -apple-system, BlinkMacSystemFont, \"Helvetica Neue\", sans-serif"
};

export const defaultConfigValues: Omit<
  ResolvedChatWidgetConfig,
  "apiBaseUrl" | "endpoints" | "mount"
> = {
  position: "bottom-right",
  title: "Knowledge Assistant",
  subtitle: "Answers are generated based on your access permissions",
  welcomeMessage: "How can I assist you today?",
  inputPlaceholder: "Ask your question...",
  launcherAriaLabel: "Open chat assistant",
  closeAriaLabel: "Close chat assistant",
  initialSuggestions: [
    "Which indicators reflect the achievements of Vision KSA goals?",
    "Case studies of real estate initiatives for economic growth",
    "Study of UX for the ministry external portal"
  ],
  sourceApp: "knowledge-platform",
  locale: "en",
  customHeaders: {},
  rag: {
    knowledgeNames: [],
    enableReferences: true,
    loadHistoryOnOpen: false
  },
  theme: defaultTheme,
  getAccessToken: undefined,
  getUserContext: undefined,
  onOpen: undefined,
  onClose: undefined,
  onError: undefined
};
