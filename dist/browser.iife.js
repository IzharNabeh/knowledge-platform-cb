"use strict";var ChatWidget=(()=>{var Y=Object.defineProperty;var Qe=Object.getOwnPropertyDescriptor;var Ze=Object.getOwnPropertyNames;var et=Object.prototype.hasOwnProperty;var tt=(e,t)=>{for(var n in t)Y(e,n,{get:t[n],enumerable:!0})},nt=(e,t,n,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of Ze(t))!et.call(e,r)&&r!==n&&Y(e,r,{get:()=>t[r],enumerable:!(a=Qe(t,r))||a.enumerable});return e};var ot=e=>nt(Y({},"__esModule",{value:!0}),e);var dt={};tt(dt,{browserGlobal:()=>We,createChatWidget:()=>$,init:()=>Re,version:()=>Se});function ve(e){return!!e&&typeof e=="object"&&!Array.isArray(e)}function G(e,t){let n={...e};for(let a of Object.keys(t)){let r=t[a],u=n[a];if(ve(u)&&ve(r)){n[a]=G(u,r);continue}r!==void 0&&(n[a]=r)}return n}function we(e){return e instanceof Error?e:typeof e=="string"?new Error(e):new Error("Unexpected widget error")}function J(e,t){return`${e.replace(/\/$/,"")}/${t.replace(/^\//,"")}`}function Ce(e,t){return{"Content-Type":"application/json",...e.customHeaders,...t?{Authorization:`Bearer ${t}`}:{}}}async function Le(e,t){let n=e.getAccessToken?await e.getAccessToken():null,a=J(e.apiBaseUrl,e.endpoints.ask),r=await fetch(a,{method:"POST",headers:Ce(e,n),body:JSON.stringify({query:t.message,chat_id:t.chatId,knowledge_names:t.knowledgeNames,edit_last_qa:t.editLastQa??!1,enable_references:t.enableReferences??!0})});if(!r.ok)throw new Error(`Chat backend returned ${r.status}.`);let l=(await r.json())[0];if(!l?.answer||typeof l.answer!="string")throw new Error("Chat backend response is missing a valid answer.");let s=l.content,d=s?.source_documents??[],v=s?.scores??[],w=s?.page_numbers??[],g=s?.sheet_names??[],b=s?.row_numbers??[],T=s?.knowledge_names??[],E=d.map((M,m)=>({sourceDocument:M,score:v[m]??null,pageNumber:w[m]??null,sheetName:g[m]??null,rowNumber:b[m]??null,knowledgeName:T[m]??null}));return{chatId:t.chatId,answer:l.answer,suggestions:[],citations:E}}async function Ae(e,t){if(!e.endpoints.history)return[];let n=e.getAccessToken?await e.getAccessToken():null,a=new URL(J(e.apiBaseUrl,e.endpoints.history));a.searchParams.set("chat_id",t);let r=await fetch(a.toString(),{method:"GET",headers:Ce(e,n)});if(!r.ok)throw new Error(`Chat history endpoint returned ${r.status}.`);let u=await r.json();return Array.isArray(u)?u.map(l=>{if(!l||typeof l!="object")return null;let s=l,d=s.role??s.type??s.sender??s.author,v=s.text??s.message??s.content??s.answer;if(typeof v!="string")return null;let w=typeof d=="string"?d.toLowerCase():"assistant";return{role:w==="user"||w==="human"?"user":"assistant",text:v}}).filter(l=>!!l):[]}function Pe(e,t){let n=we(t);return e.onError?.(n),n}var Q={accent:"#0f766e",accentSoft:"#ecfeff",panelBackground:"#ffffff",surfaceBackground:"#f8fafc",text:"#1f2937",mutedText:"#64748b",borderColor:"#dbe4ee",shadow:"0 24px 64px rgba(15, 23, 42, 0.20)",zIndex:2147483e3,fontFamily:'"Segoe UI", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif'},c={position:"bottom-right",title:"Knowledge Assistant",subtitle:"Answers are generated based on your access permissions",welcomeMessage:"How can I assist you today?",inputPlaceholder:"Ask your question...",launcherAriaLabel:"Open chat assistant",closeAriaLabel:"Close chat assistant",initialSuggestions:["Which indicators reflect the achievements of Vision KSA goals?","Case studies of real estate initiatives for economic growth","Study of UX for the ministry external portal"],sourceApp:"knowledge-platform",locale:"en",customHeaders:{},rag:{knowledgeNames:[],enableReferences:!0,loadHistoryOnOpen:!1},theme:Q,getAccessToken:void 0,getUserContext:void 0,onOpen:void 0,onClose:void 0,onError:void 0};function Te(e){if(!e.apiBaseUrl?.trim())throw new Error("Chat widget config requires a non-empty apiBaseUrl.");if(!e.endpoints?.ask?.trim())throw new Error("Chat widget config requires endpoints.ask to be provided.");let t=e.mount??document.body,n=G(Q,e.theme??{});return{apiBaseUrl:e.apiBaseUrl,endpoints:{...e.endpoints},mount:t,position:e.position??c.position,title:e.title??c.title,subtitle:e.subtitle??c.subtitle,welcomeMessage:e.welcomeMessage??c.welcomeMessage,inputPlaceholder:e.inputPlaceholder??c.inputPlaceholder,launcherAriaLabel:e.launcherAriaLabel??c.launcherAriaLabel,closeAriaLabel:e.closeAriaLabel??c.closeAriaLabel,initialSuggestions:e.initialSuggestions??c.initialSuggestions,sourceApp:e.sourceApp??c.sourceApp,locale:e.locale??c.locale,customHeaders:e.customHeaders??c.customHeaders,rag:{...c.rag,...e.rag??{}},theme:n,getAccessToken:e.getAccessToken,getUserContext:e.getUserContext,onOpen:e.onOpen,onClose:e.onClose,onError:e.onError}}function o(e,t,n){let a=document.createElement(e);return t&&(a.className=t),n!==void 0&&(a.textContent=n),a}var Ee="kp-chat-widget-styles";function Me(e,t){if(e.getElementById(Ee))return;let n=document.createElement("style");n.id=Ee,n.textContent=at(t),e.appendChild(n)}function at(e){return`
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
  `}function $(e){if(typeof document>"u")throw new Error("Chat widget can only be initialized in a browser.");let t=Te(e),n={chatId:O(t),open:!1,fullPageOpen:!1,accessTokenProvider:t.getAccessToken,historyLoaded:!1,menuOpen:!1,recentActivity:(t.initialSuggestions??[]).slice(0,4)},a=document.createElement("div");a.dataset.chatWidgetHost="true",t.mount.appendChild(a);let r=a.attachShadow({mode:"open"});Me(r,t.theme);let u=o("div",`kp-chat-widget ${t.position}`),l=o("div","kp-overlay"),s=o("button","kp-launcher");s.type="button",s.setAttribute("aria-label",t.launcherAriaLabel),s.innerHTML=['<span class="kp-star-cluster" aria-hidden="true">','<span class="kp-star orbit-a">\u2726</span>','<span class="kp-star orbit-b">\u2726</span>','<span class="kp-star orbit-c">\u2726</span>','<span class="kp-star main">\u2726</span>',"</span>"].join("");let d=o("section","kp-panel");d.setAttribute("role","dialog"),d.setAttribute("aria-modal","true"),d.setAttribute("aria-label",t.title);let v=o("div","kp-header"),w=o("div","kp-toolbar"),g=o("button","kp-tool-button kp-menu-trigger");g.type="button",g.setAttribute("aria-label","Open chat actions"),g.innerHTML=['<span class="kp-pencil-icon" aria-hidden="true"></span>','<span class="kp-chevron" aria-hidden="true">\u2304</span>'].join("");let b=o("div","kp-dropdown"),T=o("button","kp-dropdown-item","New Chat");T.type="button";let E=o("button","kp-dropdown-item","My Chats");E.type="button";let M=o("button","kp-dropdown-item","Open Knowledge Assistant");M.type="button",b.append(T,E,M),w.append(g,b);let m=o("div","kp-title-wrap"),Ie=o("h2","kp-title",t.title),Be=o("div","kp-subtitle",t.subtitle);m.appendChild(Ie),m.appendChild(Be);let S=o("button","kp-close","\xD7");S.type="button",S.setAttribute("aria-label",t.closeAriaLabel),v.append(w,m,S);let R=o("div","kp-body"),D=o("div","kp-hero"),Oe=o("div","kp-hero-icon","\u2726"),Ne=o("div","kp-hero-text",t.welcomeMessage);D.append(Oe,Ne);let ee=o("div","kp-footer"),U=o("form","kp-form"),C=o("input","kp-input");C.type="text",C.autocomplete="off",C.placeholder=t.inputPlaceholder;let te=o("button","kp-send","\u279C");te.type="submit";let $e=o("div","kp-note","Auth token is forwarded from the host app when configured.");U.append(C,te),ee.append(U,$e),d.append(v,R,ee),u.append(l,s,d),r.appendChild(u),R.appendChild(D);let ne=o("div","kp-suggestions");R.appendChild(ne);let f={body:R,input:C,suggestions:ne,hero:D},x=o("section","kp-full-page");x.setAttribute("role","dialog"),x.setAttribute("aria-modal","true"),x.setAttribute("aria-label",`${t.title} page`);let oe=o("div","kp-full-page-shell"),ae=o("div","kp-full-page-header"),re=o("div","kp-full-page-brand"),De=o("div","kp-full-page-brand-mark","\u2726"),Ue=o("div","kp-full-page-brand-text",t.title);re.append(De,Ue);let ie=o("div","kp-full-page-header-actions"),je=o("div","kp-full-page-badge","Knowledge Assistant"),W=o("button","kp-full-page-close","\xD7");W.type="button",W.setAttribute("aria-label","Close knowledge assistant page"),ie.append(je,W),ae.append(re,ie);let Ve=o("div","kp-full-page-breadcrumb","Home  \u203A  Knowledge Assistant"),se=o("div","kp-full-page-content"),pe=o("aside","kp-full-page-sidebar"),j=o("button","kp-full-page-new-chat","+ New Chat");j.type="button";let le=o("div","kp-full-page-search"),V=o("input","kp-full-page-search-input");V.type="search",V.placeholder="Search Chat";let _e=o("span","kp-full-page-search-icon","\u2315");le.append(V,_e);let Ke=o("div","kp-full-page-section-label","Recent Activity"),_=o("div","kp-full-page-recent-list"),qe=o("div","kp-full-page-section-label","Pinned Collections"),de=o("div","kp-full-page-pinned-list");pe.append(j,le,Ke,_,qe,de);let ce=o("main","kp-full-page-main"),ue=o("section","kp-full-page-panel"),K=o("div","kp-full-page-body"),q=o("div","kp-full-page-hero"),ge=o("div","kp-full-page-hero-badge");ge.innerHTML=['<span class="kp-star-cluster kp-star-cluster-static" aria-hidden="true">','<span class="kp-star orbit-a">\u2726</span>','<span class="kp-star orbit-b">\u2726</span>','<span class="kp-star orbit-c">\u2726</span>','<span class="kp-star main">\u2726</span>',"</span>"].join("");let Fe=o("div","kp-full-page-hero-text",t.welcomeMessage);q.append(ge,Fe);let fe=o("div","kp-suggestions kp-full-page-suggestions");K.append(q,fe);let he=o("div","kp-full-page-footer"),F=o("form","kp-form kp-full-page-form"),k=o("input","kp-input kp-full-page-input");k.type="text",k.autocomplete="off",k.placeholder=t.inputPlaceholder;let me=o("button","kp-send kp-full-page-send","\u279C");me.type="submit";let Xe=o("div","kp-note kp-full-page-note","Answers are generated based on your access permissions");F.append(k,me),he.append(F,Xe),ue.append(K,he),ce.appendChild(ue),se.append(pe,ce),oe.append(ae,Ve,se),x.appendChild(oe),u.appendChild(x);let h={body:K,input:k,suggestions:fe,hero:q};P(f,t.initialSuggestions,async i=>{await y(i,f)}),P(h,t.initialSuggestions,async i=>{await y(i,h)}),He(_,n.recentActivity),lt(de,t.initialSuggestions);function be(){n.open||(n.open=!0,n.fullPageOpen=!1,x.classList.remove("open"),s.classList.add("hidden"),l.classList.add("visible"),d.classList.add("open"),t.onOpen?.(),t.rag.loadHistoryOnOpen&&!n.historyLoaded&&I.loadHistory(),queueMicrotask(()=>C.focus()))}function H(){n.open&&(L(),n.open=!1,s.classList.remove("hidden"),l.classList.remove("visible"),d.classList.remove("open"),t.onClose?.())}async function y(i,p){let B=i.trim();if(!B)return;N(p.body,"user",B),p.input.value="",p.body.scrollTop=p.body.scrollHeight;let z=o("div","kp-loading","Thinking...");p.body.appendChild(z),p.body.scrollTop=p.body.scrollHeight;try{let A=await Le({...t,getAccessToken:n.accessTokenProvider},{message:B,chatId:n.chatId,knowledgeNames:await rt(t),...t.rag.enableReferences!==void 0?{enableReferences:t.rag.enableReferences}:{}});z.isConnected&&z.remove(),N(p.body,"bot",A.answer,A.citations?.length),pt(n,B),He(_,n.recentActivity),A.suggestions?.length&&P(p,A.suggestions,async X=>{await y(X,p)})}catch(A){let X=Pe(t,A);z.isConnected&&z.remove(),N(p.body,"bot",`Request failed: ${X.message}`)}}async function xe(i){let p=n.fullPageOpen?h:f;await y(i,p)}function Ye(){n.chatId=O(t),n.historyLoaded=!1,n.fullPageOpen=!0,n.open=!1,L(),d.classList.remove("open"),l.classList.remove("visible"),s.classList.add("hidden"),Z(h),P(h,t.initialSuggestions,async i=>{await y(i,h)}),x.classList.add("open"),queueMicrotask(()=>k.focus())}function ke(){n.fullPageOpen&&(n.fullPageOpen=!1,x.classList.remove("open"),s.classList.remove("hidden"))}function Ge(){n.menuOpen=!0,g.classList.add("open"),b.classList.add("open")}function L(){n.menuOpen=!1,g.classList.remove("open"),b.classList.remove("open")}function Je(){n.chatId=O(t),n.historyLoaded=!1,Z(f),P(f,t.initialSuggestions,async i=>{await y(i,f)}),L()}let I={open:be,close:H,toggle(){if(n.open){H();return}be()},destroy(){document.removeEventListener("keydown",ye),a.remove()},sendMessage:xe,setAccessTokenProvider(i){n.accessTokenProvider=i},getChatId(){return n.chatId},async loadHistory(){let i=await Ae({...t,getAccessToken:n.accessTokenProvider},n.chatId);return i.length>0&&(ze(f.body,f.hero,f.suggestions),st(f.body,i)),n.historyLoaded=!0,i}};s.addEventListener("click",()=>I.toggle()),S.addEventListener("click",H),l.addEventListener("click",H),g.addEventListener("click",i=>{i.stopPropagation(),n.menuOpen||Ge()}),T.addEventListener("click",Je),E.addEventListener("click",async()=>{L(),await I.loadHistory()}),M.addEventListener("click",()=>{Ye()}),W.addEventListener("click",ke),j.addEventListener("click",()=>{n.chatId=O(t),Z(h),P(h,t.initialSuggestions,async i=>{await y(i,h)}),queueMicrotask(()=>k.focus())}),d.addEventListener("click",i=>{n.menuOpen&&!b.contains(i.target)&&!g.contains(i.target)&&L(),i.stopPropagation()}),r.addEventListener("click",i=>{let p=i.target;n.menuOpen&&p instanceof Node&&!b.contains(p)&&!g.contains(p)&&L()}),U.addEventListener("submit",async i=>{i.preventDefault(),await xe(C.value)}),F.addEventListener("submit",async i=>{i.preventDefault(),await y(k.value,h)});function ye(i){if(i.key==="Escape"){if(n.fullPageOpen){ke();return}n.open&&H()}}return document.addEventListener("keydown",ye),I}async function rt(e){if(e.rag.getKnowledgeNames){let t=await e.rag.getKnowledgeNames();return Array.isArray(t)?t.filter(Boolean):[]}return(e.rag.knowledgeNames??[]).filter(Boolean)}function O(e){return e.rag.chatId?.trim()?e.rag.chatId:e.rag.chatIdFactory?e.rag.chatIdFactory():typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():`kp-chat-${Date.now()}-${Math.random().toString(36).slice(2,10)}`}function N(e,t,n,a){let r=o("div",`kp-bubble ${t}`,n);if(a){let u=o("div","kp-meta",`${a} citation${a>1?"s":""} attached`);r.appendChild(u)}return e.appendChild(r),e.scrollTop=e.scrollHeight,r}function it(e,t,n){e.textContent="";for(let a of t){let r=o("button","kp-suggestion",a);r.type="button",r.addEventListener("click",async()=>{await n(a)}),e.appendChild(r)}}function P(e,t,n){it(e.suggestions,t,async a=>{e.input.value=a,await n(a)})}function ze(e,t,n){let a=new Set([t,n]);for(let r of Array.from(e.children))a.has(r)||r.remove()}function Z(e){ze(e.body,e.hero,e.suggestions),e.input.value=""}function st(e,t){for(let n of t)N(e,n.role==="assistant"?"bot":"user",n.text)}function pt(e,t){e.recentActivity=[t,...e.recentActivity.filter(n=>n!==t)].slice(0,4)}function He(e,t){e.textContent="";for(let n of t){let a=o("div","kp-full-page-item",n);e.appendChild(a)}}function lt(e,t){e.textContent="";for(let n of t.slice(0,3)){let a=o("div","kp-full-page-item kp-full-page-item-pinned",n);e.appendChild(a)}}var Se="0.1.0",Re=$,We={init:Re,createChatWidget:$,version:Se};typeof window<"u"&&(window.ChatWidget=We);return ot(dt);})();
//# sourceMappingURL=browser.iife.js.map