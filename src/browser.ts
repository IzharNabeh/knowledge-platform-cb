import { createChatWidget } from "./widget";
import type { BrowserGlobal } from "./types";

const version = "0.1.0";
const init = createChatWidget;

const browserGlobal: BrowserGlobal = {
  init,
  createChatWidget,
  version
};

declare global {
  interface Window {
    ChatWidget?: BrowserGlobal;
  }
}

if (typeof window !== "undefined") {
  window.ChatWidget = browserGlobal;
}

export { browserGlobal, createChatWidget, init, version };
