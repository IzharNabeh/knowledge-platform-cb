"use strict";var ChatWidget=(()=>{var X=Object.defineProperty;var Ye=Object.getOwnPropertyDescriptor;var Ge=Object.getOwnPropertyNames;var Je=Object.prototype.hasOwnProperty;var Qe=(e,t)=>{for(var n in t)X(e,n,{get:t[n],enumerable:!0})},Ze=(e,t,n,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of Ge(t))!Je.call(e,r)&&r!==n&&X(e,r,{get:()=>t[r],enumerable:!(a=Ye(t,r))||a.enumerable});return e};var et=e=>Ze(X({},"__esModule",{value:!0}),e);var st={};Qe(st,{createChatWidget:()=>He});function ye(e){return!!e&&typeof e=="object"&&!Array.isArray(e)}function Y(e,t){let n={...e};for(let a of Object.keys(t)){let r=t[a],u=n[a];if(ye(u)&&ye(r)){n[a]=Y(u,r);continue}r!==void 0&&(n[a]=r)}return n}function ve(e){return e instanceof Error?e:typeof e=="string"?new Error(e):new Error("Unexpected widget error")}function G(e,t){return`${e.replace(/\/$/,"")}/${t.replace(/^\//,"")}`}function we(e,t){return{"Content-Type":"application/json",...e.customHeaders,...t?{Authorization:`Bearer ${t}`}:{}}}async function Ce(e,t){let n=e.getAccessToken?await e.getAccessToken():null,a=G(e.apiBaseUrl,e.endpoints.ask),r=await fetch(a,{method:"POST",headers:we(e,n),body:JSON.stringify({query:t.message,chat_id:t.chatId,knowledge_names:t.knowledgeNames,edit_last_qa:t.editLastQa??!1,enable_references:t.enableReferences??!0})});if(!r.ok)throw new Error(`Chat backend returned ${r.status}.`);let l=(await r.json())[0];if(!l?.answer||typeof l.answer!="string")throw new Error("Chat backend response is missing a valid answer.");let s=l.content,d=s?.source_documents??[],v=s?.scores??[],w=s?.page_numbers??[],g=s?.sheet_names??[],b=s?.row_numbers??[],T=s?.knowledge_names??[],E=d.map((M,m)=>({sourceDocument:M,score:v[m]??null,pageNumber:w[m]??null,sheetName:g[m]??null,rowNumber:b[m]??null,knowledgeName:T[m]??null}));return{chatId:t.chatId,answer:l.answer,suggestions:[],citations:E}}async function Le(e,t){if(!e.endpoints.history)return[];let n=e.getAccessToken?await e.getAccessToken():null,a=new URL(G(e.apiBaseUrl,e.endpoints.history));a.searchParams.set("chat_id",t);let r=await fetch(a.toString(),{method:"GET",headers:we(e,n)});if(!r.ok)throw new Error(`Chat history endpoint returned ${r.status}.`);let u=await r.json();return Array.isArray(u)?u.map(l=>{if(!l||typeof l!="object")return null;let s=l,d=s.role??s.type??s.sender??s.author,v=s.text??s.message??s.content??s.answer;if(typeof v!="string")return null;let w=typeof d=="string"?d.toLowerCase():"assistant";return{role:w==="user"||w==="human"?"user":"assistant",text:v}}).filter(l=>!!l):[]}function Ae(e,t){let n=ve(t);return e.onError?.(n),n}var J={accent:"#0f766e",accentSoft:"#ecfeff",panelBackground:"#ffffff",surfaceBackground:"#f8fafc",text:"#1f2937",mutedText:"#64748b",borderColor:"#dbe4ee",shadow:"0 24px 64px rgba(15, 23, 42, 0.20)",zIndex:2147483e3,fontFamily:'"Segoe UI", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif'},c={position:"bottom-right",title:"Knowledge Assistant",subtitle:"Answers are generated based on your access permissions",welcomeMessage:"How can I assist you today?",inputPlaceholder:"Ask your question...",launcherAriaLabel:"Open chat assistant",closeAriaLabel:"Close chat assistant",initialSuggestions:["Which indicators reflect the achievements of Vision KSA goals?","Case studies of real estate initiatives for economic growth","Study of UX for the ministry external portal"],sourceApp:"knowledge-platform",locale:"en",customHeaders:{},rag:{knowledgeNames:[],enableReferences:!0,loadHistoryOnOpen:!1},theme:J,getAccessToken:void 0,getUserContext:void 0,onOpen:void 0,onClose:void 0,onError:void 0};function Pe(e){if(!e.apiBaseUrl?.trim())throw new Error("Chat widget config requires a non-empty apiBaseUrl.");if(!e.endpoints?.ask?.trim())throw new Error("Chat widget config requires endpoints.ask to be provided.");let t=e.mount??document.body,n=Y(J,e.theme??{});return{apiBaseUrl:e.apiBaseUrl,endpoints:{...e.endpoints},mount:t,position:e.position??c.position,title:e.title??c.title,subtitle:e.subtitle??c.subtitle,welcomeMessage:e.welcomeMessage??c.welcomeMessage,inputPlaceholder:e.inputPlaceholder??c.inputPlaceholder,launcherAriaLabel:e.launcherAriaLabel??c.launcherAriaLabel,closeAriaLabel:e.closeAriaLabel??c.closeAriaLabel,initialSuggestions:e.initialSuggestions??c.initialSuggestions,sourceApp:e.sourceApp??c.sourceApp,locale:e.locale??c.locale,customHeaders:e.customHeaders??c.customHeaders,rag:{...c.rag,...e.rag??{}},theme:n,getAccessToken:e.getAccessToken,getUserContext:e.getUserContext,onOpen:e.onOpen,onClose:e.onClose,onError:e.onError}}function o(e,t,n){let a=document.createElement(e);return t&&(a.className=t),n!==void 0&&(a.textContent=n),a}var Te="kp-chat-widget-styles";function Ee(e,t){if(e.getElementById(Te))return;let n=document.createElement("style");n.id=Te,n.textContent=tt(t),e.appendChild(n)}function tt(e){return`
    :host {
      all: initial;
    }

    .kp-chat-widget {
      --kp-accent: ${e.accent};
      --kp-accent-soft: ${e.accentSoft};
      --kp-panel-background: ${e.panelBackground};
      --kp-surface-background: ${e.surfaceBackground};
      --kp-text: ${e.text};
      --kp-muted-text: ${e.mutedText};
      --kp-border-color: ${e.borderColor};
      --kp-shadow: ${e.shadow};
      --kp-z-index: ${e.zIndex};
      --kp-font-family: ${e.fontFamily};
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
      width: 50px;
      height: 50px;
      animation: kp-cluster-rotate 8.5s linear infinite;
    }

    .kp-star {
      position: absolute;
      color: #08384c;
      line-height: 1;
      transform-origin: center;
    }

    .kp-star.main {
      top: 50%;
      left: 50%;
      font-size: 30px;
      transform: translate(-50%, -50%) scale(0.96);
      animation: kp-main-pulse 3s ease-in-out infinite;
    }

    .kp-star.orbit-a {
      top: -3px;
      left: 50%;
      font-size: 18px;
      transform: translateX(-50%);
      animation: kp-orbit-a 3s ease-in-out infinite;
    }

    .kp-star.orbit-b {
      right: -3px;
      bottom: 5px;
      font-size: 18px;
      animation: kp-orbit-b 3s ease-in-out infinite;
    }

    .kp-star.orbit-c {
      left: -1px;
      bottom: 5px;
      font-size: 18px;
      animation: kp-orbit-c 3s ease-in-out infinite;
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
      bottom: 88px;
      right: 24px;
      width: 480px;
      max-width: calc(100vw - 24px);
      height: min(730px, calc(100vh - 118px));
      background: var(--kp-panel-background);
      border: 1px solid rgba(255, 255, 255, 0.35);
      border-radius: 20px;
      box-shadow: var(--kp-shadow);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      opacity: 0;
      transform: translateX(112px) scale(0.97);
      transform-origin: bottom right;
      pointer-events: none;
      transition: opacity 420ms cubic-bezier(0.16, 1, 0.3, 1),
        transform 620ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    .kp-chat-widget.bottom-left .kp-panel {
      left: 24px;
      right: auto;
      transform: translateX(-112px) scale(0.97);
      transform-origin: bottom left;
    }

    .kp-panel.open {
      opacity: 1;
      transform: translateX(0) scale(1);
      pointer-events: auto;
    }

    .kp-full-page {
      position: fixed;
      inset: 0;
      background:
        radial-gradient(circle at top, rgba(32, 185, 210, 0.12), transparent 24%),
        linear-gradient(180deg, #f9fbfd 0%, #eef3f8 100%);
      opacity: 0;
      pointer-events: none;
      transform: translateY(18px);
      transition: opacity 260ms ease, transform 320ms ease;
      z-index: calc(var(--kp-z-index) + 2);
      overflow: auto;
    }

    .kp-full-page.open {
      opacity: 1;
      pointer-events: auto;
      transform: translateY(0);
    }

    .kp-full-page-shell {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      padding: 22px 34px 26px;
      gap: 16px;
    }

    .kp-full-page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 12px 4px 0;
    }

    .kp-full-page-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #08384c;
    }

    .kp-full-page-brand-mark {
      width: 44px;
      height: 44px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, rgba(37, 181, 192, 0.14), rgba(15, 118, 110, 0.08));
      font-size: 26px;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
    }

    .kp-full-page-brand-text {
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #16394b;
    }

    .kp-full-page-header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .kp-full-page-badge {
      padding: 10px 14px;
      border-radius: 999px;
      font-size: 13px;
      line-height: 1;
      color: #0b556c;
      background: rgba(255, 255, 255, 0.82);
      border: 1px solid rgba(15, 118, 110, 0.12);
      box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
    }

    .kp-full-page-close {
      width: 44px;
      height: 44px;
      border: none;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.82);
      color: #61788a;
      font-size: 28px;
      line-height: 1;
      cursor: pointer;
      box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
    }

    .kp-full-page-breadcrumb {
      padding: 0 4px;
      color: #8192a0;
      font-size: 13px;
      line-height: 1.5;
    }

    .kp-full-page-content {
      display: grid;
      grid-template-columns: 290px minmax(0, 1fr);
      gap: 16px;
      flex: 1;
      min-height: 0;
    }

    .kp-full-page-sidebar,
    .kp-full-page-panel {
      border-radius: 22px;
      border: 1px solid rgba(219, 228, 238, 0.9);
      background: rgba(255, 255, 255, 0.88);
      box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
      backdrop-filter: blur(12px);
    }

    .kp-full-page-sidebar {
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-height: 0;
    }

    .kp-full-page-new-chat {
      width: 100%;
      height: 48px;
      border: none;
      border-radius: 12px;
      background: linear-gradient(135deg, #0a465d 0%, #0f6a75 100%);
      color: #ffffff;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 14px 30px rgba(10, 70, 93, 0.18);
    }

    .kp-full-page-search {
      display: flex;
      align-items: center;
      gap: 8px;
      height: 44px;
      border-radius: 12px;
      border: 1px solid rgba(203, 213, 225, 0.95);
      background: #ffffff;
      padding: 0 12px;
    }

    .kp-full-page-search-input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      color: #334155;
      font-size: 14px;
      min-width: 0;
    }

    .kp-full-page-search-icon {
      color: #607082;
      font-size: 20px;
      line-height: 1;
    }

    .kp-full-page-section-label {
      font-size: 12px;
      line-height: 1.4;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #8a98a6;
      margin-top: 4px;
    }

    .kp-full-page-recent-list,
    .kp-full-page-pinned-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .kp-full-page-item {
      padding: 12px 12px 13px;
      border-radius: 12px;
      color: #293845;
      font-size: 15px;
      line-height: 1.5;
      background: rgba(247, 250, 252, 0.9);
      border: 1px solid rgba(219, 228, 238, 0.88);
    }

    .kp-full-page-item-pinned {
      background: rgba(237, 248, 251, 0.92);
      border-color: rgba(127, 208, 217, 0.4);
    }

    .kp-full-page-main {
      min-width: 0;
      min-height: 0;
      display: flex;
    }

    .kp-full-page-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
      overflow: hidden;
    }

    .kp-full-page-body {
      flex: 1;
      overflow: auto;
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 42px 28px 18px;
      background:
        radial-gradient(circle at top, rgba(54, 196, 220, 0.14), transparent 22%),
        linear-gradient(180deg, #ffffff 0%, #f8fbfd 100%);
    }

    .kp-full-page-hero {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 22px;
      padding: 18px 18px 12px;
      max-width: 880px;
      width: 100%;
      margin: 0 auto;
    }

    .kp-full-page-hero-badge {
      width: 140px;
      height: 140px;
      border-radius: 999px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at 30% 30%, #f8fdff 0%, #edf8ff 50%, #e4eef8 100%);
      box-shadow:
        inset 0 2px 0 rgba(255, 255, 255, 0.9),
        0 22px 40px rgba(15, 23, 42, 0.08);
    }

    .kp-star-cluster-static {
      animation: none;
    }

    .kp-full-page-hero-text {
      max-width: 760px;
      font-size: 26px;
      line-height: 1.5;
      font-weight: 700;
      letter-spacing: -0.03em;
      color: #374151;
    }

    .kp-full-page-suggestions {
      width: min(520px, 100%);
      margin: auto auto 0;
    }

    .kp-full-page-footer {
      padding: 0 16px 18px;
      background: rgba(255, 255, 255, 0.72);
    }

    .kp-full-page-form {
      max-width: none;
      min-height: 56px;
      border-radius: 16px;
    }

    .kp-full-page-note {
      font-size: 13px;
      margin-top: 10px;
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
      width: 36px;
      height: 36px;
      border: none;
      border-radius: 12px;
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
      width: 22px;
      height: 22px;
      position: relative;
      display: inline-block;
    }

    .kp-pencil-icon::before {
      content: "";
      position: absolute;
      width: 14px;
      height: 2.5px;
      background: currentColor;
      border-radius: 999px;
      transform: rotate(-45deg);
      top: 3px;
      right: 1px;
    }

    .kp-pencil-icon::after {
      content: "";
      position: absolute;
      left: 2px;
      bottom: 2px;
      width: 11px;
      height: 11px;
      border: 2px solid currentColor;
      border-radius: 4px;
    }

    .kp-chevron {
      font-size: 13px;
      color: #66839a;
      transition: transform 160ms ease;
      margin-left: -2px;
    }

    .kp-menu-trigger.open .kp-chevron {
      transform: rotate(180deg);
    }

    .kp-dropdown {
      position: absolute;
      top: 44px;
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
      transition: opacity 180ms ease, transform 180ms ease;
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
      box-shadow: none;
      background: transparent;
      color: var(--kp-text);
      font-size: 14px;
      line-height: 1.5;
      min-width: 0;
      appearance: none;
    }

    .kp-input:focus,
    .kp-input:focus-visible,
    .kp-input:active {
      border: none;
      outline: none;
      box-shadow: none;
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
        transform: translateX(72px) scale(0.985);
        transform-origin: center right;
      }

      .kp-panel.open {
        transform: translateX(0) scale(1);
      }

      .kp-full-page-shell {
        padding: 14px;
      }

      .kp-full-page-header {
        padding: 0;
      }

      .kp-full-page-content {
        grid-template-columns: 1fr;
      }

      .kp-full-page-sidebar {
        order: 2;
      }

      .kp-full-page-body {
        padding: 24px 16px 16px;
      }

      .kp-full-page-hero-badge {
        width: 112px;
        height: 112px;
      }

      .kp-full-page-hero-text {
        font-size: 22px;
      }
    }

    @keyframes kp-cluster-rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes kp-main-pulse {
      0%, 100% { transform: translate(-50%, -50%) scale(0.82); opacity: 0.45; }
      38% { transform: translate(-50%, -50%) scale(1.04); opacity: 1; }
      60% { transform: translate(-50%, -50%) scale(0.94); opacity: 0.88; }
    }

    @keyframes kp-orbit-a {
      0%, 100% { transform: translate(-50%, 0) scale(1); opacity: 1; }
      40% { transform: translate(-50%, 17px) scale(0.92); opacity: 0.96; }
      62% { transform: translate(-50%, 2px) scale(1); opacity: 0.98; }
    }

    @keyframes kp-orbit-b {
      0%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
      40% { transform: translate(-16px, -13px) scale(0.92); opacity: 0.96; }
      62% { transform: translate(-2px, -2px) scale(1); opacity: 0.98; }
    }

    @keyframes kp-orbit-c {
      0%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
      40% { transform: translate(16px, -13px) scale(0.92); opacity: 0.96; }
      62% { transform: translate(2px, -2px) scale(1); opacity: 0.98; }
    }
  `}function He(e){if(typeof document>"u")throw new Error("Chat widget can only be initialized in a browser.");let t=Pe(e),n={chatId:B(t),open:!1,fullPageOpen:!1,accessTokenProvider:t.getAccessToken,historyLoaded:!1,menuOpen:!1,recentActivity:(t.initialSuggestions??[]).slice(0,4)},a=document.createElement("div");a.dataset.chatWidgetHost="true",t.mount.appendChild(a);let r=a.attachShadow({mode:"open"});Ee(r,t.theme);let u=o("div",`kp-chat-widget ${t.position}`),l=o("div","kp-overlay"),s=o("button","kp-launcher");s.type="button",s.setAttribute("aria-label",t.launcherAriaLabel),s.innerHTML=['<span class="kp-star-cluster" aria-hidden="true">','<span class="kp-star orbit-a">\u2726</span>','<span class="kp-star orbit-b">\u2726</span>','<span class="kp-star orbit-c">\u2726</span>','<span class="kp-star main">\u2726</span>',"</span>"].join("");let d=o("section","kp-panel");d.setAttribute("role","dialog"),d.setAttribute("aria-modal","true"),d.setAttribute("aria-label",t.title);let v=o("div","kp-header"),w=o("div","kp-toolbar"),g=o("button","kp-tool-button kp-menu-trigger");g.type="button",g.setAttribute("aria-label","Open chat actions"),g.innerHTML=['<span class="kp-pencil-icon" aria-hidden="true"></span>','<span class="kp-chevron" aria-hidden="true">\u2304</span>'].join("");let b=o("div","kp-dropdown"),T=o("button","kp-dropdown-item","New Chat");T.type="button";let E=o("button","kp-dropdown-item","My Chats");E.type="button";let M=o("button","kp-dropdown-item","Open Knowledge Assistant");M.type="button",b.append(T,E,M),w.append(g,b);let m=o("div","kp-title-wrap"),Se=o("h2","kp-title",t.title),Re=o("div","kp-subtitle",t.subtitle);m.appendChild(Se),m.appendChild(Re);let S=o("button","kp-close","\xD7");S.type="button",S.setAttribute("aria-label",t.closeAriaLabel),v.append(w,m,S);let R=o("div","kp-body"),$=o("div","kp-hero"),We=o("div","kp-hero-icon","\u2726"),Ie=o("div","kp-hero-text",t.welcomeMessage);$.append(We,Ie);let Z=o("div","kp-footer"),D=o("form","kp-form"),C=o("input","kp-input");C.type="text",C.autocomplete="off",C.placeholder=t.inputPlaceholder;let ee=o("button","kp-send","\u279C");ee.type="submit";let Oe=o("div","kp-note","Auth token is forwarded from the host app when configured.");D.append(C,ee),Z.append(D,Oe),d.append(v,R,Z),u.append(l,s,d),r.appendChild(u),R.appendChild($);let te=o("div","kp-suggestions");R.appendChild(te);let f={body:R,input:C,suggestions:te,hero:$},x=o("section","kp-full-page");x.setAttribute("role","dialog"),x.setAttribute("aria-modal","true"),x.setAttribute("aria-label",`${t.title} page`);let ne=o("div","kp-full-page-shell"),oe=o("div","kp-full-page-header"),ae=o("div","kp-full-page-brand"),Be=o("div","kp-full-page-brand-mark","\u2726"),Ne=o("div","kp-full-page-brand-text",t.title);ae.append(Be,Ne);let re=o("div","kp-full-page-header-actions"),$e=o("div","kp-full-page-badge","Knowledge Assistant"),W=o("button","kp-full-page-close","\xD7");W.type="button",W.setAttribute("aria-label","Close knowledge assistant page"),re.append($e,W),oe.append(ae,re);let De=o("div","kp-full-page-breadcrumb","Home  \u203A  Knowledge Assistant"),ie=o("div","kp-full-page-content"),se=o("aside","kp-full-page-sidebar"),U=o("button","kp-full-page-new-chat","+ New Chat");U.type="button";let pe=o("div","kp-full-page-search"),j=o("input","kp-full-page-search-input");j.type="search",j.placeholder="Search Chat";let Ue=o("span","kp-full-page-search-icon","\u2315");pe.append(j,Ue);let je=o("div","kp-full-page-section-label","Recent Activity"),V=o("div","kp-full-page-recent-list"),Ve=o("div","kp-full-page-section-label","Pinned Collections"),le=o("div","kp-full-page-pinned-list");se.append(U,pe,je,V,Ve,le);let de=o("main","kp-full-page-main"),ce=o("section","kp-full-page-panel"),_=o("div","kp-full-page-body"),K=o("div","kp-full-page-hero"),ue=o("div","kp-full-page-hero-badge");ue.innerHTML=['<span class="kp-star-cluster kp-star-cluster-static" aria-hidden="true">','<span class="kp-star orbit-a">\u2726</span>','<span class="kp-star orbit-b">\u2726</span>','<span class="kp-star orbit-c">\u2726</span>','<span class="kp-star main">\u2726</span>',"</span>"].join("");let _e=o("div","kp-full-page-hero-text",t.welcomeMessage);K.append(ue,_e);let ge=o("div","kp-suggestions kp-full-page-suggestions");_.append(K,ge);let fe=o("div","kp-full-page-footer"),q=o("form","kp-form kp-full-page-form"),k=o("input","kp-input kp-full-page-input");k.type="text",k.autocomplete="off",k.placeholder=t.inputPlaceholder;let he=o("button","kp-send kp-full-page-send","\u279C");he.type="submit";let Ke=o("div","kp-note kp-full-page-note","Answers are generated based on your access permissions");q.append(k,he),fe.append(q,Ke),ce.append(_,fe),de.appendChild(ce),ie.append(se,de),ne.append(oe,De,ie),x.appendChild(ne),u.appendChild(x);let h={body:_,input:k,suggestions:ge,hero:K};P(f,t.initialSuggestions,async i=>{await y(i,f)}),P(h,t.initialSuggestions,async i=>{await y(i,h)}),Me(V,n.recentActivity),it(le,t.initialSuggestions);function me(){n.open||(n.open=!0,n.fullPageOpen=!1,x.classList.remove("open"),s.classList.add("hidden"),l.classList.add("visible"),d.classList.add("open"),t.onOpen?.(),t.rag.loadHistoryOnOpen&&!n.historyLoaded&&I.loadHistory(),queueMicrotask(()=>C.focus()))}function H(){n.open&&(L(),n.open=!1,s.classList.remove("hidden"),l.classList.remove("visible"),d.classList.remove("open"),t.onClose?.())}async function y(i,p){let O=i.trim();if(!O)return;N(p.body,"user",O),p.input.value="",p.body.scrollTop=p.body.scrollHeight;let z=o("div","kp-loading","Thinking...");p.body.appendChild(z),p.body.scrollTop=p.body.scrollHeight;try{let A=await Ce({...t,getAccessToken:n.accessTokenProvider},{message:O,chatId:n.chatId,knowledgeNames:await nt(t),...t.rag.enableReferences!==void 0?{enableReferences:t.rag.enableReferences}:{}});z.isConnected&&z.remove(),N(p.body,"bot",A.answer,A.citations?.length),rt(n,O),Me(V,n.recentActivity),A.suggestions?.length&&P(p,A.suggestions,async F=>{await y(F,p)})}catch(A){let F=Ae(t,A);z.isConnected&&z.remove(),N(p.body,"bot",`Request failed: ${F.message}`)}}async function be(i){let p=n.fullPageOpen?h:f;await y(i,p)}function qe(){n.chatId=B(t),n.historyLoaded=!1,n.fullPageOpen=!0,n.open=!1,L(),d.classList.remove("open"),l.classList.remove("visible"),s.classList.add("hidden"),Q(h),P(h,t.initialSuggestions,async i=>{await y(i,h)}),x.classList.add("open"),queueMicrotask(()=>k.focus())}function xe(){n.fullPageOpen&&(n.fullPageOpen=!1,x.classList.remove("open"),s.classList.remove("hidden"))}function Fe(){n.menuOpen=!0,g.classList.add("open"),b.classList.add("open")}function L(){n.menuOpen=!1,g.classList.remove("open"),b.classList.remove("open")}function Xe(){n.chatId=B(t),n.historyLoaded=!1,Q(f),P(f,t.initialSuggestions,async i=>{await y(i,f)}),L()}let I={open:me,close:H,toggle(){if(n.open){H();return}me()},destroy(){document.removeEventListener("keydown",ke),a.remove()},sendMessage:be,setAccessTokenProvider(i){n.accessTokenProvider=i},getChatId(){return n.chatId},async loadHistory(){let i=await Le({...t,getAccessToken:n.accessTokenProvider},n.chatId);return i.length>0&&(ze(f.body,f.hero,f.suggestions),at(f.body,i)),n.historyLoaded=!0,i}};s.addEventListener("click",()=>I.toggle()),S.addEventListener("click",H),l.addEventListener("click",H),g.addEventListener("click",i=>{i.stopPropagation(),n.menuOpen||Fe()}),T.addEventListener("click",Xe),E.addEventListener("click",async()=>{L(),await I.loadHistory()}),M.addEventListener("click",()=>{qe()}),W.addEventListener("click",xe),U.addEventListener("click",()=>{n.chatId=B(t),Q(h),P(h,t.initialSuggestions,async i=>{await y(i,h)}),queueMicrotask(()=>k.focus())}),d.addEventListener("click",i=>{n.menuOpen&&!b.contains(i.target)&&!g.contains(i.target)&&L(),i.stopPropagation()}),r.addEventListener("click",i=>{let p=i.target;n.menuOpen&&p instanceof Node&&!b.contains(p)&&!g.contains(p)&&L()}),D.addEventListener("submit",async i=>{i.preventDefault(),await be(C.value)}),q.addEventListener("submit",async i=>{i.preventDefault(),await y(k.value,h)});function ke(i){if(i.key==="Escape"){if(n.fullPageOpen){xe();return}n.open&&H()}}return document.addEventListener("keydown",ke),I}async function nt(e){if(e.rag.getKnowledgeNames){let t=await e.rag.getKnowledgeNames();return Array.isArray(t)?t.filter(Boolean):[]}return(e.rag.knowledgeNames??[]).filter(Boolean)}function B(e){return e.rag.chatId?.trim()?e.rag.chatId:e.rag.chatIdFactory?e.rag.chatIdFactory():typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():`kp-chat-${Date.now()}-${Math.random().toString(36).slice(2,10)}`}function N(e,t,n,a){let r=o("div",`kp-bubble ${t}`,n);if(a){let u=o("div","kp-meta",`${a} citation${a>1?"s":""} attached`);r.appendChild(u)}return e.appendChild(r),e.scrollTop=e.scrollHeight,r}function ot(e,t,n){e.textContent="";for(let a of t){let r=o("button","kp-suggestion",a);r.type="button",r.addEventListener("click",async()=>{await n(a)}),e.appendChild(r)}}function P(e,t,n){ot(e.suggestions,t,async a=>{e.input.value=a,await n(a)})}function ze(e,t,n){let a=new Set([t,n]);for(let r of Array.from(e.children))a.has(r)||r.remove()}function Q(e){ze(e.body,e.hero,e.suggestions),e.input.value=""}function at(e,t){for(let n of t)N(e,n.role==="assistant"?"bot":"user",n.text)}function rt(e,t){e.recentActivity=[t,...e.recentActivity.filter(n=>n!==t)].slice(0,4)}function Me(e,t){e.textContent="";for(let n of t){let a=o("div","kp-full-page-item",n);e.appendChild(a)}}function it(e,t){e.textContent="";for(let n of t.slice(0,3)){let a=o("div","kp-full-page-item kp-full-page-item-pinned",n);e.appendChild(a)}}return et(st);})();
//# sourceMappingURL=index.iife.js.map