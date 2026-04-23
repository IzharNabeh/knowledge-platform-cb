import { fetchHistory, reportWidgetError, postMessage } from "./api";
import { resolveConfig } from "./config";
import { createElement } from "./dom";
import { ensureStyles } from "./styles";
import type {
  ChatHistoryMessage,
  ChatWidgetConfig,
  ChatWidgetInstance,
  ResolvedChatWidgetConfig
} from "./types";

type WidgetState = {
  chatId: string;
  open: boolean;
  fullPageOpen: boolean;
  accessTokenProvider: ResolvedChatWidgetConfig["getAccessToken"];
  historyLoaded: boolean;
  menuOpen: boolean;
  recentActivity: string[];
};

type ConversationView = {
  body: HTMLDivElement;
  input: HTMLInputElement;
  suggestions: HTMLDivElement;
  hero: HTMLDivElement;
};

export function createChatWidget(config: ChatWidgetConfig): ChatWidgetInstance {
  if (typeof document === "undefined") {
    throw new Error("Chat widget can only be initialized in a browser.");
  }

  const resolvedConfig = resolveConfig(config);
  const state: WidgetState = {
    chatId: resolveChatId(resolvedConfig),
    open: false,
    fullPageOpen: false,
    accessTokenProvider: resolvedConfig.getAccessToken,
    historyLoaded: false,
    menuOpen: false,
    recentActivity: (resolvedConfig.initialSuggestions ?? []).slice(0, 4)
  };

  const host = document.createElement("div");
  host.dataset.chatWidgetHost = "true";
  resolvedConfig.mount.appendChild(host);

  const shadowRoot = host.attachShadow({ mode: "open" });
  ensureStyles(shadowRoot, resolvedConfig.theme);

  const shell = createElement("div", `kp-chat-widget ${resolvedConfig.position}`);
  const overlay = createElement("div", "kp-overlay");
  const launcher = createElement("button", "kp-launcher");
  launcher.type = "button";
  launcher.setAttribute("aria-label", resolvedConfig.launcherAriaLabel);
  launcher.innerHTML = [
    '<span class="kp-star-cluster" aria-hidden="true">',
    '<span class="kp-star orbit-a">✦</span>',
    '<span class="kp-star orbit-b">✦</span>',
    '<span class="kp-star orbit-c">✦</span>',
    '<span class="kp-star main">✦</span>',
    "</span>"
  ].join("");

  const panel = createElement("section", "kp-panel");
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "true");
  panel.setAttribute("aria-label", resolvedConfig.title);

  const header = createElement("div", "kp-header");
  const toolbar = createElement("div", "kp-toolbar");
  const menuTrigger = createElement("button", "kp-tool-button kp-menu-trigger");
  menuTrigger.type = "button";
  menuTrigger.setAttribute("aria-label", "Open chat actions");
  menuTrigger.innerHTML = [
    '<span class="kp-pencil-icon" aria-hidden="true"></span>',
    '<span class="kp-chevron" aria-hidden="true">⌄</span>'
  ].join("");
  const dropdown = createElement("div", "kp-dropdown");
  const newChatAction = createElement("button", "kp-dropdown-item", "New Chat");
  newChatAction.type = "button";
  const myChatsAction = createElement("button", "kp-dropdown-item", "My Chats");
  myChatsAction.type = "button";
  const openAssistantAction = createElement(
    "button",
    "kp-dropdown-item",
    "Open Knowledge Assistant"
  );
  openAssistantAction.type = "button";
  dropdown.append(newChatAction, myChatsAction, openAssistantAction);
  toolbar.append(menuTrigger, dropdown);

  const headingWrap = createElement("div", "kp-title-wrap");
  const title = createElement("h2", "kp-title", resolvedConfig.title);
  const subtitle = createElement("div", "kp-subtitle", resolvedConfig.subtitle);
  headingWrap.appendChild(title);
  headingWrap.appendChild(subtitle);

  const closeButton = createElement("button", "kp-close", "×");
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", resolvedConfig.closeAriaLabel);
  header.append(toolbar, headingWrap, closeButton);

  const body = createElement("div", "kp-body");
  const hero = createElement("div", "kp-hero");
  const heroIcon = createElement("div", "kp-hero-icon", "✦");
  const heroText = createElement("div", "kp-hero-text", resolvedConfig.welcomeMessage);
  hero.append(heroIcon, heroText);
  const footer = createElement("div", "kp-footer");
  const form = createElement("form", "kp-form");
  const input = createElement("input", "kp-input");
  input.type = "text";
  input.autocomplete = "off";
  input.placeholder = resolvedConfig.inputPlaceholder;

  const sendButton = createElement("button", "kp-send", "➜");
  sendButton.type = "submit";

  const note = createElement(
    "div",
    "kp-note",
    "Auth token is forwarded from the host app when configured."
  );

  form.append(input, sendButton);
  footer.append(form, note);
  panel.append(header, body, footer);
  shell.append(overlay, launcher, panel);
  shadowRoot.appendChild(shell);

  body.appendChild(hero);

  const suggestions = createElement("div", "kp-suggestions");
  body.appendChild(suggestions);
  const panelView: ConversationView = { body, input, suggestions, hero };

  const fullPage = createElement("section", "kp-full-page");
  fullPage.setAttribute("role", "dialog");
  fullPage.setAttribute("aria-modal", "true");
  fullPage.setAttribute("aria-label", `${resolvedConfig.title} page`);

  const fullPageShell = createElement("div", "kp-full-page-shell");
  const fullPageHeader = createElement("div", "kp-full-page-header");
  const fullPageBrand = createElement("div", "kp-full-page-brand");
  const fullPageMark = createElement("div", "kp-full-page-brand-mark", "✦");
  const fullPageBrandText = createElement(
    "div",
    "kp-full-page-brand-text",
    resolvedConfig.title
  );
  fullPageBrand.append(fullPageMark, fullPageBrandText);

  const fullPageHeaderActions = createElement("div", "kp-full-page-header-actions");
  const fullPageBadge = createElement("div", "kp-full-page-badge", "Knowledge Assistant");
  const fullPageClose = createElement("button", "kp-full-page-close", "×");
  fullPageClose.type = "button";
  fullPageClose.setAttribute("aria-label", "Close knowledge assistant page");
  fullPageHeaderActions.append(fullPageBadge, fullPageClose);
  fullPageHeader.append(fullPageBrand, fullPageHeaderActions);

  const fullPageBreadCrumb = createElement(
    "div",
    "kp-full-page-breadcrumb",
    "Home  ›  Knowledge Assistant"
  );

  const fullPageContent = createElement("div", "kp-full-page-content");
  const fullPageSidebar = createElement("aside", "kp-full-page-sidebar");
  const fullPageNewChat = createElement("button", "kp-full-page-new-chat", "+ New Chat");
  fullPageNewChat.type = "button";

  const fullPageSearchWrap = createElement("div", "kp-full-page-search");
  const fullPageSearchInput = createElement("input", "kp-full-page-search-input");
  fullPageSearchInput.type = "search";
  fullPageSearchInput.placeholder = "Search Chat";
  const fullPageSearchIcon = createElement("span", "kp-full-page-search-icon", "⌕");
  fullPageSearchWrap.append(fullPageSearchInput, fullPageSearchIcon);

  const fullPageRecentLabel = createElement("div", "kp-full-page-section-label", "Recent Activity");
  const fullPageRecentList = createElement("div", "kp-full-page-recent-list");
  const fullPagePinnedLabel = createElement("div", "kp-full-page-section-label", "Pinned Collections");
  const fullPagePinnedList = createElement("div", "kp-full-page-pinned-list");
  fullPageSidebar.append(
    fullPageNewChat,
    fullPageSearchWrap,
    fullPageRecentLabel,
    fullPageRecentList,
    fullPagePinnedLabel,
    fullPagePinnedList
  );

  const fullPageMain = createElement("main", "kp-full-page-main");
  const fullPagePanel = createElement("section", "kp-full-page-panel");
  const fullPageBody = createElement("div", "kp-full-page-body");
  const fullPageHero = createElement("div", "kp-full-page-hero");
  const fullPageHeroBadge = createElement("div", "kp-full-page-hero-badge");
  fullPageHeroBadge.innerHTML = [
    '<span class="kp-star-cluster kp-star-cluster-static" aria-hidden="true">',
    '<span class="kp-star orbit-a">✦</span>',
    '<span class="kp-star orbit-b">✦</span>',
    '<span class="kp-star orbit-c">✦</span>',
    '<span class="kp-star main">✦</span>',
    "</span>"
  ].join("");
  const fullPageHeroText = createElement("div", "kp-full-page-hero-text", resolvedConfig.welcomeMessage);
  fullPageHero.append(fullPageHeroBadge, fullPageHeroText);

  const fullPageSuggestions = createElement("div", "kp-suggestions kp-full-page-suggestions");
  fullPageBody.append(fullPageHero, fullPageSuggestions);

  const fullPageFooter = createElement("div", "kp-full-page-footer");
  const fullPageForm = createElement("form", "kp-form kp-full-page-form");
  const fullPageInput = createElement("input", "kp-input kp-full-page-input");
  fullPageInput.type = "text";
  fullPageInput.autocomplete = "off";
  fullPageInput.placeholder = resolvedConfig.inputPlaceholder;
  const fullPageSend = createElement("button", "kp-send kp-full-page-send", "➜");
  fullPageSend.type = "submit";
  const fullPageNote = createElement(
    "div",
    "kp-note kp-full-page-note",
    "Answers are generated based on your access permissions"
  );
  fullPageForm.append(fullPageInput, fullPageSend);
  fullPageFooter.append(fullPageForm, fullPageNote);
  fullPagePanel.append(fullPageBody, fullPageFooter);
  fullPageMain.appendChild(fullPagePanel);
  fullPageContent.append(fullPageSidebar, fullPageMain);
  fullPageShell.append(fullPageHeader, fullPageBreadCrumb, fullPageContent);
  fullPage.appendChild(fullPageShell);
  shell.appendChild(fullPage);

  const fullPageView: ConversationView = {
    body: fullPageBody,
    input: fullPageInput,
    suggestions: fullPageSuggestions,
    hero: fullPageHero
  };

  syncSuggestionButtons(panelView, resolvedConfig.initialSuggestions, async (text) => {
    await sendMessageToView(text, panelView);
  });
  syncSuggestionButtons(fullPageView, resolvedConfig.initialSuggestions, async (text) => {
    await sendMessageToView(text, fullPageView);
  });
  renderRecentActivity(fullPageRecentList, state.recentActivity);
  renderPinnedCollections(fullPagePinnedList, resolvedConfig.initialSuggestions);

  function open(): void {
    if (state.open) {
      return;
    }

    state.open = true;
    state.fullPageOpen = false;
    fullPage.classList.remove("open");
    launcher.classList.add("hidden");
    overlay.classList.add("visible");
    panel.classList.add("open");
    resolvedConfig.onOpen?.();
    if (resolvedConfig.rag.loadHistoryOnOpen && !state.historyLoaded) {
      void instance.loadHistory();
    }
    queueMicrotask(() => input.focus());
  }

  function close(): void {
    if (!state.open) {
      return;
    }

    closeMenu();
    state.open = false;
    launcher.classList.remove("hidden");
    overlay.classList.remove("visible");
    panel.classList.remove("open");
    resolvedConfig.onClose?.();
  }

  async function sendMessageToView(
    message: string,
    view: ConversationView
  ): Promise<void> {
    const trimmed = message.trim();

    if (!trimmed) {
      return;
    }

    appendMessage(view.body, "user", trimmed);
    view.input.value = "";
    view.body.scrollTop = view.body.scrollHeight;

    const loading = createElement("div", "kp-loading", "Thinking...");
    view.body.appendChild(loading);
    view.body.scrollTop = view.body.scrollHeight;

    try {
      const response = await postMessage(
        {
          ...resolvedConfig,
          getAccessToken: state.accessTokenProvider
        },
        {
          message: trimmed,
          chatId: state.chatId,
          knowledgeNames: await resolveKnowledgeNames(resolvedConfig),
          ...(resolvedConfig.rag.enableReferences !== undefined
            ? { enableReferences: resolvedConfig.rag.enableReferences }
            : {})
        }
      );

      if (loading.isConnected) {
        loading.remove();
      }

      appendMessage(view.body, "bot", response.answer, response.citations?.length);
      rememberRecentActivity(state, trimmed);
      renderRecentActivity(fullPageRecentList, state.recentActivity);

      if (response.suggestions?.length) {
        syncSuggestionButtons(view, response.suggestions, async (text) => {
          await sendMessageToView(text, view);
        });
      }
    } catch (error) {
      const normalized = reportWidgetError(resolvedConfig, error);

      if (loading.isConnected) {
        loading.remove();
      }

      appendMessage(view.body, "bot", `Request failed: ${normalized.message}`);
    }
  }

  async function sendMessage(message: string): Promise<void> {
    const targetView = state.fullPageOpen ? fullPageView : panelView;
    await sendMessageToView(message, targetView);
  }

  function openFullPage(): void {
    state.chatId = resolveChatId(resolvedConfig);
    state.historyLoaded = false;
    state.fullPageOpen = true;
    state.open = false;
    closeMenu();
    panel.classList.remove("open");
    overlay.classList.remove("visible");
    launcher.classList.add("hidden");
    resetConversationView(fullPageView);
    syncSuggestionButtons(fullPageView, resolvedConfig.initialSuggestions, async (text) => {
      await sendMessageToView(text, fullPageView);
    });
    fullPage.classList.add("open");
    queueMicrotask(() => fullPageInput.focus());
  }

  function closeFullPage(): void {
    if (!state.fullPageOpen) {
      return;
    }

    state.fullPageOpen = false;
    fullPage.classList.remove("open");
    launcher.classList.remove("hidden");
  }

  function openMenu(): void {
    state.menuOpen = true;
    menuTrigger.classList.add("open");
    dropdown.classList.add("open");
  }

  function closeMenu(): void {
    state.menuOpen = false;
    menuTrigger.classList.remove("open");
    dropdown.classList.remove("open");
  }

  function resetConversation(): void {
    state.chatId = resolveChatId(resolvedConfig);
    state.historyLoaded = false;
    resetConversationView(panelView);
    syncSuggestionButtons(panelView, resolvedConfig.initialSuggestions, async (text) => {
      await sendMessageToView(text, panelView);
    });
    closeMenu();
  }

  const instance: ChatWidgetInstance = {
    open,
    close,
    toggle() {
      if (state.open) {
        close();
        return;
      }

      open();
    },
    destroy() {
      document.removeEventListener("keydown", handleEscapeKeydown);
      host.remove();
    },
    sendMessage,
    setAccessTokenProvider(provider) {
      state.accessTokenProvider = provider;
    },
    getChatId() {
      return state.chatId;
    },
    async loadHistory() {
      const messages = await fetchHistory(
        {
          ...resolvedConfig,
          getAccessToken: state.accessTokenProvider
        },
        state.chatId
      );

      if (messages.length > 0) {
        clearRenderedConversation(panelView.body, panelView.hero, panelView.suggestions);
        renderHistory(panelView.body, messages);
      }

      state.historyLoaded = true;
      return messages;
    }
  };

  launcher.addEventListener("click", () => instance.toggle());
  closeButton.addEventListener("click", close);
  overlay.addEventListener("click", close);
  menuTrigger.addEventListener("click", (event) => {
    event.stopPropagation();
    if (!state.menuOpen) {
      openMenu();
    }
  });
  newChatAction.addEventListener("click", resetConversation);
  myChatsAction.addEventListener("click", async () => {
    closeMenu();
    await instance.loadHistory();
  });
  openAssistantAction.addEventListener("click", () => {
    openFullPage();
  });
  fullPageClose.addEventListener("click", closeFullPage);
  fullPageNewChat.addEventListener("click", () => {
    state.chatId = resolveChatId(resolvedConfig);
    resetConversationView(fullPageView);
    syncSuggestionButtons(fullPageView, resolvedConfig.initialSuggestions, async (text) => {
      await sendMessageToView(text, fullPageView);
    });
    queueMicrotask(() => fullPageInput.focus());
  });
  panel.addEventListener("click", (event) => {
    if (
      state.menuOpen &&
      !dropdown.contains(event.target as Node) &&
      !menuTrigger.contains(event.target as Node)
    ) {
      closeMenu();
    }
    event.stopPropagation();
  });
  shadowRoot.addEventListener("click", (event) => {
    const target = event.target;
    if (
      state.menuOpen &&
      target instanceof Node &&
      !dropdown.contains(target) &&
      !menuTrigger.contains(target)
    ) {
      closeMenu();
    }
  });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await sendMessage(input.value);
  });
  fullPageForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await sendMessageToView(fullPageInput.value, fullPageView);
  });

  function handleEscapeKeydown(event: KeyboardEvent): void {
    if (event.key !== "Escape") {
      return;
    }

    if (state.fullPageOpen) {
      closeFullPage();
      return;
    }

    if (state.open) {
      close();
    }
  }

  document.addEventListener("keydown", handleEscapeKeydown);

  return instance;
}

async function resolveKnowledgeNames(
  config: ResolvedChatWidgetConfig
): Promise<string[]> {
  if (config.rag.getKnowledgeNames) {
    const names = await config.rag.getKnowledgeNames();
    return Array.isArray(names) ? names.filter(Boolean) : [];
  }

  return (config.rag.knowledgeNames ?? []).filter(Boolean);
}

function resolveChatId(config: ResolvedChatWidgetConfig): string {
  if (config.rag.chatId?.trim()) {
    return config.rag.chatId;
  }

  if (config.rag.chatIdFactory) {
    return config.rag.chatIdFactory();
  }

  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `kp-chat-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function appendMessage(
  body: HTMLDivElement,
  kind: "bot" | "user",
  text: string,
  citationCount?: number
): HTMLDivElement {
  const bubble = createElement("div", `kp-bubble ${kind}`, text);

  if (citationCount) {
    const meta = createElement(
      "div",
      "kp-meta",
      `${citationCount} citation${citationCount > 1 ? "s" : ""} attached`
    );
    bubble.appendChild(meta);
  }

  body.appendChild(bubble);
  body.scrollTop = body.scrollHeight;
  return bubble;
}

function renderSuggestions(
  container: HTMLDivElement,
  suggestions: string[],
  onClick: (text: string) => Promise<void>
): void {
  container.textContent = "";

  for (const suggestion of suggestions) {
    const button = createElement("button", "kp-suggestion", suggestion);
    button.type = "button";
    button.addEventListener("click", async () => {
      await onClick(suggestion);
    });
    container.appendChild(button);
  }
}

function syncSuggestionButtons(
  view: ConversationView,
  suggestions: string[],
  onClick: (text: string) => Promise<void>
): void {
  renderSuggestions(view.suggestions, suggestions, async (text) => {
    view.input.value = text;
    await onClick(text);
  });
}

function clearRenderedConversation(
  body: HTMLDivElement,
  hero: HTMLDivElement,
  suggestions: HTMLDivElement
): void {
  const preservedNodes = new Set([hero, suggestions]);
  for (const child of Array.from(body.children)) {
    if (!preservedNodes.has(child as HTMLDivElement)) {
      child.remove();
    }
  }
}

function resetConversationView(
  view: ConversationView
): void {
  clearRenderedConversation(view.body, view.hero, view.suggestions);
  view.input.value = "";
}

function renderHistory(
  body: HTMLDivElement,
  messages: ChatHistoryMessage[]
): void {
  for (const message of messages) {
    appendMessage(body, message.role === "assistant" ? "bot" : "user", message.text);
  }
}

function rememberRecentActivity(state: WidgetState, message: string): void {
  state.recentActivity = [
    message,
    ...state.recentActivity.filter((item) => item !== message)
  ].slice(0, 4);
}

function renderRecentActivity(container: HTMLDivElement, items: string[]): void {
  container.textContent = "";

  for (const item of items) {
    const entry = createElement("div", "kp-full-page-item", item);
    container.appendChild(entry);
  }
}

function renderPinnedCollections(
  container: HTMLDivElement,
  suggestions: string[]
): void {
  container.textContent = "";

  for (const suggestion of suggestions.slice(0, 3)) {
    const entry = createElement("div", "kp-full-page-item kp-full-page-item-pinned", suggestion);
    container.appendChild(entry);
  }
}
