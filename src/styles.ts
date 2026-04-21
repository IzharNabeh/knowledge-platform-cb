import type { ChatWidgetTheme } from "./types";

const STYLE_ELEMENT_ID = "kp-chat-widget-styles";

export function ensureStyles(shadowRoot: ShadowRoot, theme: ChatWidgetTheme): void {
  if (shadowRoot.getElementById(STYLE_ELEMENT_ID)) {
    return;
  }

  const style = document.createElement("style");
  style.id = STYLE_ELEMENT_ID;
  style.textContent = getCss(theme);
  shadowRoot.appendChild(style);
}

function getCss(theme: ChatWidgetTheme): string {
  return `
    :host {
      all: initial;
    }

    .kp-chat-widget {
      --kp-accent: ${theme.accent};
      --kp-accent-soft: ${theme.accentSoft};
      --kp-panel-background: ${theme.panelBackground};
      --kp-surface-background: ${theme.surfaceBackground};
      --kp-text: ${theme.text};
      --kp-muted-text: ${theme.mutedText};
      --kp-border-color: ${theme.borderColor};
      --kp-shadow: ${theme.shadow};
      --kp-z-index: ${theme.zIndex};
      --kp-font-family: ${theme.fontFamily};
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: var(--kp-z-index);
      font-family: var(--kp-font-family);
      color: var(--kp-text);
      box-sizing: border-box;
    }

    .kp-chat-widget.bottom-left {
      left: 24px;
      right: auto;
    }

    .kp-launcher {
      width: 72px;
      height: 72px;
      border: none;
      border-radius: 999px;
      cursor: pointer;
      background: radial-gradient(circle at 30% 30%, #f8fffe 0%, #ecfdf5 52%, #d6f4ef 100%);
      box-shadow: 0 16px 32px rgba(15, 118, 110, 0.18);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 140ms ease, box-shadow 140ms ease;
      color: var(--kp-accent);
    }

    .kp-launcher:hover {
      transform: translateY(-1px);
      box-shadow: 0 20px 36px rgba(15, 118, 110, 0.22);
    }

    .kp-launcher:focus-visible,
    .kp-close:focus-visible,
    .kp-send:focus-visible,
    .kp-suggestion:focus-visible,
    .kp-input:focus-visible {
      outline: 2px solid var(--kp-accent);
      outline-offset: 2px;
    }

    .kp-spark {
      font-size: 30px;
      line-height: 1;
    }

    .kp-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.18);
      opacity: 0;
      pointer-events: none;
      transition: opacity 160ms ease;
    }

    .kp-overlay.visible {
      opacity: 1;
      pointer-events: auto;
    }

    .kp-panel {
      position: fixed;
      top: 24px;
      right: 24px;
      width: 420px;
      max-width: calc(100vw - 24px);
      height: min(760px, calc(100vh - 48px));
      background: var(--kp-panel-background);
      border: 1px solid rgba(255, 255, 255, 0.35);
      border-radius: 20px;
      box-shadow: var(--kp-shadow);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      opacity: 0;
      transform: translateX(12px);
      pointer-events: none;
      transition: opacity 160ms ease, transform 160ms ease;
    }

    .kp-chat-widget.bottom-left .kp-panel {
      left: 24px;
      right: auto;
      transform: translateX(-12px);
    }

    .kp-panel.open {
      opacity: 1;
      transform: translateX(0);
      pointer-events: auto;
    }

    .kp-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      padding: 18px 18px 12px;
      border-bottom: 1px solid var(--kp-border-color);
      background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
    }

    .kp-title {
      margin: 0;
      font-size: 20px;
      line-height: 1.3;
      font-weight: 700;
      color: var(--kp-text);
    }

    .kp-subtitle {
      margin-top: 4px;
      font-size: 13px;
      line-height: 1.5;
      color: var(--kp-muted-text);
    }

    .kp-close {
      border: none;
      background: transparent;
      font-size: 24px;
      line-height: 1;
      color: var(--kp-muted-text);
      cursor: pointer;
      padding: 0;
    }

    .kp-body {
      flex: 1;
      overflow: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px;
      background: var(--kp-surface-background);
    }

    .kp-bubble {
      max-width: 85%;
      padding: 12px 14px;
      border-radius: 18px;
      font-size: 14px;
      line-height: 1.5;
      white-space: pre-wrap;
      border: 1px solid var(--kp-border-color);
      background: #ffffff;
    }

    .kp-bubble.user {
      align-self: flex-end;
      background: var(--kp-accent-soft);
      border-color: rgba(15, 118, 110, 0.22);
    }

    .kp-bubble.bot {
      align-self: flex-start;
    }

    .kp-meta {
      font-size: 11px;
      line-height: 1.4;
      color: var(--kp-muted-text);
      margin-top: 6px;
    }

    .kp-suggestions {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .kp-suggestion {
      border: 1px solid rgba(15, 118, 110, 0.18);
      background: #ffffff;
      color: var(--kp-text);
      border-radius: 999px;
      padding: 11px 14px;
      cursor: pointer;
      text-align: left;
      font-size: 14px;
      line-height: 1.35;
    }

    .kp-footer {
      padding: 14px 16px 16px;
      border-top: 1px solid var(--kp-border-color);
      background: #ffffff;
    }

    .kp-form {
      display: flex;
      align-items: center;
      gap: 10px;
      border: 1px solid var(--kp-border-color);
      border-radius: 16px;
      padding: 8px 10px;
      background: #ffffff;
    }

    .kp-input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      color: var(--kp-text);
      font-size: 14px;
      line-height: 1.5;
      min-width: 0;
    }

    .kp-send {
      width: 40px;
      height: 40px;
      border: none;
      border-radius: 999px;
      background: var(--kp-accent-soft);
      color: var(--kp-accent);
      cursor: pointer;
      font-size: 20px;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .kp-note {
      margin-top: 8px;
      text-align: center;
      font-size: 11px;
      line-height: 1.4;
      color: var(--kp-muted-text);
    }

    .kp-loading {
      font-size: 13px;
      line-height: 1.4;
      color: var(--kp-muted-text);
      padding: 4px 2px;
    }

    @media (max-width: 640px) {
      .kp-chat-widget,
      .kp-chat-widget.bottom-left {
        left: auto;
        right: 16px;
        bottom: 16px;
      }

      .kp-panel,
      .kp-chat-widget.bottom-left .kp-panel {
        inset: 0;
        width: 100vw;
        max-width: none;
        height: 100vh;
        border-radius: 0;
        transform: translateY(12px);
      }

      .kp-panel.open {
        transform: translateY(0);
      }
    }
  `;
}
