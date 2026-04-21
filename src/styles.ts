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

    *,
    *::before,
    *::after {
      box-sizing: border-box;
      font-family: inherit;
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
      transition: transform 140ms ease, box-shadow 140ms ease, opacity 140ms ease;
      color: var(--kp-accent);
      position: relative;
      overflow: hidden;
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

    .kp-launcher.hidden {
      opacity: 0;
      pointer-events: none;
      transform: translateY(8px) scale(0.96);
    }

    .kp-star-cluster {
      position: relative;
      width: 42px;
      height: 42px;
      animation: kp-cluster-rotate 7s linear infinite;
    }

    .kp-star {
      position: absolute;
      color: #08384c;
      line-height: 1;
      transform-origin: center;
    }

    .kp-star.main {
      inset: 50% auto auto 50%;
      font-size: 28px;
      transform: translate(-50%, -50%) scale(1);
      animation: kp-main-pulse 2.6s ease-in-out infinite;
    }

    .kp-star.orbit-a {
      top: 3px;
      left: 7px;
      font-size: 14px;
      animation: kp-orbit-a 2.6s ease-in-out infinite;
    }

    .kp-star.orbit-b {
      right: 1px;
      top: 12px;
      font-size: 12px;
      animation: kp-orbit-b 2.6s ease-in-out infinite;
    }

    .kp-star.orbit-c {
      bottom: 4px;
      left: 10px;
      font-size: 11px;
      animation: kp-orbit-c 2.6s ease-in-out infinite;
    }

    .kp-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.18);
      opacity: 0;
      pointer-events: none;
      transition: opacity 220ms ease;
    }

    .kp-overlay.visible {
      opacity: 1;
      pointer-events: auto;
    }

    .kp-panel {
      position: fixed;
      bottom: 112px;
      right: 24px;
      width: 480px;
      max-width: calc(100vw - 24px);
      height: min(700px, calc(100vh - 136px));
      background: var(--kp-panel-background);
      border: 1px solid rgba(255, 255, 255, 0.35);
      border-radius: 20px;
      box-shadow: var(--kp-shadow);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      opacity: 0;
      transform: translateX(44px) scale(0.985);
      transform-origin: bottom right;
      pointer-events: none;
      transition: opacity 220ms ease, transform 220ms ease;
    }

    .kp-chat-widget.bottom-left .kp-panel {
      left: 24px;
      right: auto;
      transform: translateX(-44px) scale(0.985);
      transform-origin: bottom left;
    }

    .kp-panel.open {
      opacity: 1;
      transform: translateX(0);
      pointer-events: auto;
    }

    .kp-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      padding: 18px 18px 8px;
      background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
    }

    .kp-toolbar {
      position: relative;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .kp-tool-button {
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 10px;
      background: transparent;
      color: #0f4f68;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      transition: background 140ms ease;
    }

    .kp-tool-button:hover {
      background: rgba(15, 118, 110, 0.08);
    }

    .kp-pencil-icon {
      width: 18px;
      height: 18px;
      border: 2px solid currentColor;
      border-radius: 4px;
      position: relative;
      display: inline-block;
    }

    .kp-pencil-icon::before {
      content: "";
      position: absolute;
      width: 10px;
      height: 2px;
      background: currentColor;
      transform: rotate(-45deg);
      top: -1px;
      right: -4px;
      border-radius: 999px;
    }

    .kp-chevron {
      font-size: 16px;
      color: var(--kp-muted-text);
      transition: transform 160ms ease;
    }

    .kp-menu-trigger.open .kp-chevron {
      transform: rotate(180deg);
    }

    .kp-dropdown {
      position: absolute;
      top: 40px;
      left: 0;
      width: 164px;
      background: #ffffff;
      border: 1px solid rgba(15, 79, 104, 0.12);
      border-radius: 10px;
      box-shadow: 0 18px 40px rgba(15, 23, 42, 0.16);
      padding: 8px;
      opacity: 0;
      transform: translateY(-6px);
      pointer-events: none;
      transition: opacity 150ms ease, transform 150ms ease;
      z-index: 2;
    }

    .kp-dropdown.open {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }

    .kp-dropdown-item {
      width: 100%;
      border: none;
      background: transparent;
      text-align: left;
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 14px;
      color: var(--kp-text);
      cursor: pointer;
    }

    .kp-dropdown-item:hover {
      background: rgba(15, 118, 110, 0.08);
    }

    .kp-title-wrap {
      display: none;
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
      padding: 10px 16px 16px;
      background: linear-gradient(180deg, #ffffff 0%, var(--kp-surface-background) 100%);
    }

    .kp-hero {
      display: flex;
      gap: 10px;
      padding: 4px 2px 8px;
      align-items: flex-start;
    }

    .kp-hero-icon {
      color: #0ea5b7;
      font-size: 28px;
      line-height: 1;
      margin-top: 2px;
    }

    .kp-hero-text {
      font-size: 20px;
      line-height: 1.45;
      font-weight: 700;
      color: #374151;
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
      margin-top: auto;
    }

    .kp-suggestion {
      border: 1px solid rgba(15, 118, 110, 0.18);
      background: rgba(247, 251, 255, 0.92);
      color: var(--kp-text);
      border-radius: 999px;
      padding: 11px 14px;
      cursor: pointer;
      text-align: left;
      font-size: 14px;
      line-height: 1.35;
    }

    .kp-footer {
      padding: 10px 16px 12px;
      border-top: 1px solid rgba(219, 228, 238, 0.85);
      background: #ffffff;
    }

    .kp-form {
      display: flex;
      align-items: center;
      gap: 10px;
      border: 1px solid var(--kp-border-color);
      border-radius: 14px;
      padding: 10px 12px;
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
      background: #e4f1f8;
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
        transform-origin: center;
      }

      .kp-panel.open {
        transform: translateY(0);
      }
    }

    @keyframes kp-cluster-rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes kp-main-pulse {
      0%, 100% { transform: translate(-50%, -50%) scale(0.96); }
      30% { transform: translate(-50%, -50%) scale(1.08); }
      55% { transform: translate(-50%, -50%) scale(1); }
    }

    @keyframes kp-orbit-a {
      0%, 100% { transform: translate(0, 0) scale(0.8); opacity: 0.55; }
      35% { transform: translate(10px, 10px) scale(1); opacity: 1; }
      60% { transform: translate(4px, 5px) scale(0.9); opacity: 0.85; }
    }

    @keyframes kp-orbit-b {
      0%, 100% { transform: translate(0, 0) scale(0.8); opacity: 0.45; }
      35% { transform: translate(-11px, 4px) scale(1); opacity: 1; }
      60% { transform: translate(-4px, 2px) scale(0.9); opacity: 0.78; }
    }

    @keyframes kp-orbit-c {
      0%, 100% { transform: translate(0, 0) scale(0.75); opacity: 0.42; }
      35% { transform: translate(7px, -10px) scale(1); opacity: 0.95; }
      60% { transform: translate(3px, -4px) scale(0.88); opacity: 0.74; }
    }
  `;
}
