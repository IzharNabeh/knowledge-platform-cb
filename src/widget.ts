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
  accessTokenProvider: ResolvedChatWidgetConfig["getAccessToken"];
  historyLoaded: boolean;
  menuOpen: boolean;
};

export function createChatWidget(config: ChatWidgetConfig): ChatWidgetInstance {
  if (typeof document === "undefined") {
    throw new Error("Chat widget can only be initialized in a browser.");
  }

  const resolvedConfig = resolveConfig(config);
  const state: WidgetState = {
    chatId: resolveChatId(resolvedConfig),
    open: false,
    accessTokenProvider: resolvedConfig.getAccessToken,
    historyLoaded: false,
    menuOpen: false
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
  renderSuggestions(suggestions, resolvedConfig.initialSuggestions, async (text) => {
    input.value = text;
    await instance.sendMessage(text);
  });

  function open(): void {
    if (state.open) {
      return;
    }

    state.open = true;
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

  async function sendMessage(message: string): Promise<void> {
    const trimmed = message.trim();

    if (!trimmed) {
      return;
    }

    appendMessage(body, "user", trimmed);
    input.value = "";
    body.scrollTop = body.scrollHeight;

    const loading = createElement("div", "kp-loading", "Thinking...");
    body.appendChild(loading);
    body.scrollTop = body.scrollHeight;

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

      appendMessage(body, "bot", response.answer, response.citations?.length);

      if (response.suggestions?.length) {
        renderSuggestions(suggestions, response.suggestions, async (text) => {
          input.value = text;
          await instance.sendMessage(text);
        });
      }
    } catch (error) {
      const normalized = reportWidgetError(resolvedConfig, error);

      if (loading.isConnected) {
        loading.remove();
      }

      appendMessage(body, "bot", `Request failed: ${normalized.message}`);
    }
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
    clearRenderedConversation(body, hero, suggestions);
    renderSuggestions(
      suggestions,
      resolvedConfig.initialSuggestions,
      async (text) => {
        input.value = text;
        await instance.sendMessage(text);
      }
    );
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
        clearRenderedConversation(body, hero, suggestions);
        renderHistory(body, messages);
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
    if (state.menuOpen) closeMenu();
    else openMenu();
  });
  newChatAction.addEventListener("click", resetConversation);
  myChatsAction.addEventListener("click", async () => {
    closeMenu();
    await instance.loadHistory();
  });
  openAssistantAction.addEventListener("click", () => {
    closeMenu();
    open();
  });
  panel.addEventListener("click", (event) => {
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

  function handleEscapeKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape" && state.open) {
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

function renderHistory(
  body: HTMLDivElement,
  messages: ChatHistoryMessage[]
): void {
  for (const message of messages) {
    appendMessage(body, message.role === "assistant" ? "bot" : "user", message.text);
  }
}
