import { BrowserGlobal, createChatWidget } from './index.js';

declare const version = "0.1.0";
declare const init: typeof createChatWidget;
declare const browserGlobal: BrowserGlobal;
declare global {
    interface Window {
        ChatWidget?: BrowserGlobal;
    }
}

export { browserGlobal, createChatWidget, init, version };
