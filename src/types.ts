export type WidgetPosition = "bottom-right" | "bottom-left";

export type ChatWidgetTheme = {
  accent: string;
  accentSoft: string;
  panelBackground: string;
  surfaceBackground: string;
  text: string;
  mutedText: string;
  borderColor: string;
  shadow: string;
  zIndex: number;
  fontFamily: string;
};

export type UserContext = {
  userId?: string;
  displayName?: string;
  email?: string;
  roles?: string[];
};

export type KnowledgeRagConfig = {
  chatId?: string;
  chatIdFactory?: () => string;
  knowledgeNames?: string[];
  getKnowledgeNames?:
    | (() => Promise<string[] | null> | string[] | null)
    | undefined;
  enableReferences?: boolean;
  loadHistoryOnOpen?: boolean;
};

export type RagCitation = {
  sourceDocument?: string | null;
  score?: number | null;
  pageNumber?: number | null;
  sheetName?: string | null;
  rowNumber?: number | null;
  knowledgeName?: string | null;
};

export type SendMessageRequest = {
  message: string;
  chatId: string;
  knowledgeNames: string[];
  editLastQa?: boolean;
  enableReferences?: boolean;
};

export type SendMessageResponse = {
  chatId: string;
  answer: string;
  suggestions?: string[];
  citations?: RagCitation[];
};

export type ChatHistoryMessage = {
  role: "user" | "assistant";
  text: string;
};

export type ChatWidgetConfig = {
  apiBaseUrl: string;
  endpoints: {
    ask: string;
    askStream?: string;
    history?: string;
    deleteChat?: string;
    deleteLastQa?: string;
  };
  mount?: HTMLElement;
  position?: WidgetPosition;
  title?: string;
  subtitle?: string;
  welcomeMessage?: string;
  inputPlaceholder?: string;
  launcherAriaLabel?: string;
  closeAriaLabel?: string;
  theme?: Partial<ChatWidgetTheme>;
  initialSuggestions?: string[];
  sourceApp?: string;
  locale?: string;
  customHeaders?: Record<string, string>;
  rag?: KnowledgeRagConfig;
  getAccessToken?: () => Promise<string | null> | string | null;
  getUserContext?: () => Promise<UserContext | null> | UserContext | null;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Error) => void;
};

export type ChatWidgetInstance = {
  open: () => void;
  close: () => void;
  toggle: () => void;
  destroy: () => void;
  sendMessage: (message: string) => Promise<void>;
  setAccessTokenProvider: (provider: ChatWidgetConfig["getAccessToken"]) => void;
  getChatId: () => string;
  loadHistory: () => Promise<ChatHistoryMessage[]>;
};

export type ResolvedChatWidgetConfig = Omit<
  Required<
    Pick<
      ChatWidgetConfig,
      | "apiBaseUrl"
      | "endpoints"
      | "position"
      | "title"
      | "subtitle"
      | "welcomeMessage"
      | "inputPlaceholder"
      | "launcherAriaLabel"
      | "closeAriaLabel"
      | "initialSuggestions"
      | "sourceApp"
      | "locale"
      | "customHeaders"
      | "rag"
    >
  >,
  never
> & {
  mount: HTMLElement;
  theme: ChatWidgetTheme;
  getAccessToken?: ChatWidgetConfig["getAccessToken"];
  getUserContext?: ChatWidgetConfig["getUserContext"];
  onOpen?: ChatWidgetConfig["onOpen"];
  onClose?: ChatWidgetConfig["onClose"];
  onError?: ChatWidgetConfig["onError"];
};

export type BrowserGlobal = {
  init: (config: ChatWidgetConfig) => ChatWidgetInstance;
  createChatWidget: (config: ChatWidgetConfig) => ChatWidgetInstance;
  version: string;
};
