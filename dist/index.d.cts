type WidgetPosition = "bottom-right" | "bottom-left";
type ChatWidgetTheme = {
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
type UserContext = {
    userId?: string;
    displayName?: string;
    email?: string;
    roles?: string[];
};
type KnowledgeRagConfig = {
    chatId?: string;
    chatIdFactory?: () => string;
    knowledgeNames?: string[];
    getKnowledgeNames?: (() => Promise<string[] | null> | string[] | null) | undefined;
    enableReferences?: boolean;
    loadHistoryOnOpen?: boolean;
};
type RagCitation = {
    sourceDocument?: string | null;
    score?: number | null;
    pageNumber?: number | null;
    sheetName?: string | null;
    rowNumber?: number | null;
    knowledgeName?: string | null;
};
type SendMessageRequest = {
    message: string;
    chatId: string;
    knowledgeNames: string[];
    editLastQa?: boolean;
    enableReferences?: boolean;
};
type SendMessageResponse = {
    chatId: string;
    answer: string;
    suggestions?: string[];
    citations?: RagCitation[];
};
type ChatHistoryMessage = {
    role: "user" | "assistant";
    text: string;
};
type ChatWidgetConfig = {
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
type ChatWidgetInstance = {
    open: () => void;
    close: () => void;
    toggle: () => void;
    destroy: () => void;
    sendMessage: (message: string) => Promise<void>;
    setAccessTokenProvider: (provider: ChatWidgetConfig["getAccessToken"]) => void;
    getChatId: () => string;
    loadHistory: () => Promise<ChatHistoryMessage[]>;
};
type BrowserGlobal = {
    init: (config: ChatWidgetConfig) => ChatWidgetInstance;
    createChatWidget: (config: ChatWidgetConfig) => ChatWidgetInstance;
    version: string;
};

declare function createChatWidget(config: ChatWidgetConfig): ChatWidgetInstance;

export { type BrowserGlobal, type ChatWidgetConfig, type ChatWidgetInstance, type ChatWidgetTheme, type SendMessageRequest, type SendMessageResponse, type UserContext, type WidgetPosition, createChatWidget };
