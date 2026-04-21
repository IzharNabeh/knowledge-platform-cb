"use strict";var B=Object.defineProperty;var ue=Object.getOwnPropertyDescriptor;var fe=Object.getOwnPropertyNames;var ge=Object.prototype.hasOwnProperty;var me=(e,t)=>{for(var n in t)B(e,n,{get:t[n],enumerable:!0})},he=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of fe(t))!ge.call(e,o)&&o!==n&&B(e,o,{get:()=>t[o],enumerable:!(r=ue(t,o))||r.enumerable});return e};var be=e=>he(B({},"__esModule",{value:!0}),e);var we={};me(we,{browserGlobal:()=>re,createChatWidget:()=>I,init:()=>oe,version:()=>ne});module.exports=be(we);function q(e){return!!e&&typeof e=="object"&&!Array.isArray(e)}function $(e,t){let n={...e};for(let r of Object.keys(t)){let o=t[r],u=n[r];if(q(u)&&q(o)){n[r]=$(u,o);continue}o!==void 0&&(n[r]=o)}return n}function V(e){return e instanceof Error?e:typeof e=="string"?new Error(e):new Error("Unexpected widget error")}function O(e,t){return`${e.replace(/\/$/,"")}/${t.replace(/^\//,"")}`}function Y(e,t){return{"Content-Type":"application/json",...e.customHeaders,...t?{Authorization:`Bearer ${t}`}:{}}}async function F(e,t){let n=e.getAccessToken?await e.getAccessToken():null,r=O(e.apiBaseUrl,e.endpoints.ask),o=await fetch(r,{method:"POST",headers:Y(e,n),body:JSON.stringify({query:t.message,chat_id:t.chatId,knowledge_names:t.knowledgeNames,edit_last_qa:t.editLastQa??!1,enable_references:t.enableReferences??!0})});if(!o.ok)throw new Error(`Chat backend returned ${o.status}.`);let p=(await o.json())[0];if(!p?.answer||typeof p.answer!="string")throw new Error("Chat backend response is missing a valid answer.");let i=p.content,d=i?.source_documents??[],b=i?.scores??[],k=i?.page_numbers??[],f=i?.sheet_names??[],h=i?.row_numbers??[],T=i?.knowledge_names??[],A=d.map((E,m)=>({sourceDocument:E,score:b[m]??null,pageNumber:k[m]??null,sheetName:f[m]??null,rowNumber:h[m]??null,knowledgeName:T[m]??null}));return{chatId:t.chatId,answer:p.answer,suggestions:[],citations:A}}async function G(e,t){if(!e.endpoints.history)return[];let n=e.getAccessToken?await e.getAccessToken():null,r=new URL(O(e.apiBaseUrl,e.endpoints.history));r.searchParams.set("chat_id",t);let o=await fetch(r.toString(),{method:"GET",headers:Y(e,n)});if(!o.ok)throw new Error(`Chat history endpoint returned ${o.status}.`);let u=await o.json();return Array.isArray(u)?u.map(p=>{if(!p||typeof p!="object")return null;let i=p,d=i.role??i.type??i.sender??i.author,b=i.text??i.message??i.content??i.answer;if(typeof b!="string")return null;let k=typeof d=="string"?d.toLowerCase():"assistant";return{role:k==="user"||k==="human"?"user":"assistant",text:b}}).filter(p=>!!p):[]}function X(e,t){let n=V(t);return e.onError?.(n),n}var P={accent:"#0f766e",accentSoft:"#ecfeff",panelBackground:"#ffffff",surfaceBackground:"#f8fafc",text:"#1f2937",mutedText:"#64748b",borderColor:"#dbe4ee",shadow:"0 24px 64px rgba(15, 23, 42, 0.20)",zIndex:2147483e3,fontFamily:'"Segoe UI", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif'},c={position:"bottom-right",title:"Knowledge Assistant",subtitle:"Answers are generated based on your access permissions",welcomeMessage:"How can I assist you today?",inputPlaceholder:"Ask your question...",launcherAriaLabel:"Open chat assistant",closeAriaLabel:"Close chat assistant",initialSuggestions:["Which indicators reflect the achievements of Vision KSA goals?","Case studies of real estate initiatives for economic growth","Study of UX for the ministry external portal"],sourceApp:"knowledge-platform",locale:"en",customHeaders:{},rag:{knowledgeNames:[],enableReferences:!0,loadHistoryOnOpen:!1},theme:P,getAccessToken:void 0,getUserContext:void 0,onOpen:void 0,onClose:void 0,onError:void 0};function J(e){if(!e.apiBaseUrl?.trim())throw new Error("Chat widget config requires a non-empty apiBaseUrl.");if(!e.endpoints?.ask?.trim())throw new Error("Chat widget config requires endpoints.ask to be provided.");let t=e.mount??document.body,n=$(P,e.theme??{});return{apiBaseUrl:e.apiBaseUrl,endpoints:{...e.endpoints},mount:t,position:e.position??c.position,title:e.title??c.title,subtitle:e.subtitle??c.subtitle,welcomeMessage:e.welcomeMessage??c.welcomeMessage,inputPlaceholder:e.inputPlaceholder??c.inputPlaceholder,launcherAriaLabel:e.launcherAriaLabel??c.launcherAriaLabel,closeAriaLabel:e.closeAriaLabel??c.closeAriaLabel,initialSuggestions:e.initialSuggestions??c.initialSuggestions,sourceApp:e.sourceApp??c.sourceApp,locale:e.locale??c.locale,customHeaders:e.customHeaders??c.customHeaders,rag:{...c.rag,...e.rag??{}},theme:n,getAccessToken:e.getAccessToken,getUserContext:e.getUserContext,onOpen:e.onOpen,onClose:e.onClose,onError:e.onError}}function a(e,t,n){let r=document.createElement(e);return t&&(r.className=t),n!==void 0&&(r.textContent=n),r}var Q="kp-chat-widget-styles";function Z(e,t){if(e.getElementById(Q))return;let n=document.createElement("style");n.id=Q,n.textContent=ke(t),e.appendChild(n)}function ke(e){return`
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
      transform: translateX(64px) scale(0.982);
      transform-origin: bottom right;
      pointer-events: none;
      transition: opacity 220ms cubic-bezier(0.22, 1, 0.36, 1),
        transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
    }

    .kp-chat-widget.bottom-left .kp-panel {
      left: 24px;
      right: auto;
      transform: translateX(-64px) scale(0.982);
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
  `}function I(e){if(typeof document>"u")throw new Error("Chat widget can only be initialized in a browser.");let t=J(e),n={chatId:ee(t),open:!1,accessTokenProvider:t.getAccessToken,historyLoaded:!1,menuOpen:!1},r=document.createElement("div");r.dataset.chatWidgetHost="true",t.mount.appendChild(r);let o=r.attachShadow({mode:"open"});Z(o,t.theme);let u=a("div",`kp-chat-widget ${t.position}`),p=a("div","kp-overlay"),i=a("button","kp-launcher");i.type="button",i.setAttribute("aria-label",t.launcherAriaLabel),i.innerHTML=['<span class="kp-star-cluster" aria-hidden="true">','<span class="kp-star orbit-a">\u2726</span>','<span class="kp-star orbit-b">\u2726</span>','<span class="kp-star orbit-c">\u2726</span>','<span class="kp-star main">\u2726</span>',"</span>"].join("");let d=a("section","kp-panel");d.setAttribute("role","dialog"),d.setAttribute("aria-modal","true"),d.setAttribute("aria-label",t.title);let b=a("div","kp-header"),k=a("div","kp-toolbar"),f=a("button","kp-tool-button kp-menu-trigger");f.type="button",f.setAttribute("aria-label","Open chat actions"),f.innerHTML=['<span class="kp-pencil-icon" aria-hidden="true"></span>','<span class="kp-chevron" aria-hidden="true">\u2304</span>'].join("");let h=a("div","kp-dropdown"),T=a("button","kp-dropdown-item","New Chat");T.type="button";let A=a("button","kp-dropdown-item","My Chats");A.type="button";let E=a("button","kp-dropdown-item","Open Knowledge Assistant");E.type="button",h.append(T,A,E),k.append(f,h);let m=a("div","kp-title-wrap"),ae=a("h2","kp-title",t.title),se=a("div","kp-subtitle",t.subtitle);m.appendChild(ae),m.appendChild(se);let H=a("button","kp-close","\xD7");H.type="button",H.setAttribute("aria-label",t.closeAriaLabel),b.append(k,m,H);let l=a("div","kp-body"),R=a("div","kp-hero"),ie=a("div","kp-hero-icon","\u2726"),pe=a("div","kp-hero-text",t.welcomeMessage);R.append(ie,pe);let _=a("div","kp-footer"),S=a("form","kp-form"),g=a("input","kp-input");g.type="text",g.autocomplete="off",g.placeholder=t.inputPlaceholder;let D=a("button","kp-send","\u279C");D.type="submit";let le=a("div","kp-note","Auth token is forwarded from the host app when configured.");S.append(g,D),_.append(S,le),d.append(b,l,_),u.append(p,i,d),o.appendChild(u),l.appendChild(R);let w=a("div","kp-suggestions");l.appendChild(w),U(w,t.initialSuggestions,async s=>{g.value=s,await x.sendMessage(s)});function N(){n.open||(n.open=!0,i.classList.add("hidden"),p.classList.add("visible"),d.classList.add("open"),t.onOpen?.(),t.rag.loadHistoryOnOpen&&!n.historyLoaded&&x.loadHistory(),queueMicrotask(()=>g.focus()))}function L(){n.open&&(v(),n.open=!1,i.classList.remove("hidden"),p.classList.remove("visible"),d.classList.remove("open"),t.onClose?.())}async function j(s){let y=s.trim();if(!y)return;z(l,"user",y),g.value="",l.scrollTop=l.scrollHeight;let M=a("div","kp-loading","Thinking...");l.appendChild(M),l.scrollTop=l.scrollHeight;try{let C=await F({...t,getAccessToken:n.accessTokenProvider},{message:y,chatId:n.chatId,knowledgeNames:await xe(t),...t.rag.enableReferences!==void 0?{enableReferences:t.rag.enableReferences}:{}});M.isConnected&&M.remove(),z(l,"bot",C.answer,C.citations?.length),C.suggestions?.length&&U(w,C.suggestions,async W=>{g.value=W,await x.sendMessage(W)})}catch(C){let W=X(t,C);M.isConnected&&M.remove(),z(l,"bot",`Request failed: ${W.message}`)}}function de(){n.menuOpen=!0,f.classList.add("open"),h.classList.add("open")}function v(){n.menuOpen=!1,f.classList.remove("open"),h.classList.remove("open")}function ce(){n.chatId=ee(t),n.historyLoaded=!1,te(l,R,w),U(w,t.initialSuggestions,async s=>{g.value=s,await x.sendMessage(s)}),v()}let x={open:N,close:L,toggle(){if(n.open){L();return}N()},destroy(){document.removeEventListener("keydown",K),r.remove()},sendMessage:j,setAccessTokenProvider(s){n.accessTokenProvider=s},getChatId(){return n.chatId},async loadHistory(){let s=await G({...t,getAccessToken:n.accessTokenProvider},n.chatId);return s.length>0&&(te(l,R,w),ye(l,s)),n.historyLoaded=!0,s}};i.addEventListener("click",()=>x.toggle()),H.addEventListener("click",L),p.addEventListener("click",L),f.addEventListener("click",s=>{s.stopPropagation(),n.menuOpen||de()}),T.addEventListener("click",ce),A.addEventListener("click",async()=>{v(),await x.loadHistory()}),E.addEventListener("click",()=>{v(),N()}),d.addEventListener("click",s=>{n.menuOpen&&!h.contains(s.target)&&!f.contains(s.target)&&v(),s.stopPropagation()}),o.addEventListener("click",s=>{let y=s.target;n.menuOpen&&y instanceof Node&&!h.contains(y)&&!f.contains(y)&&v()}),S.addEventListener("submit",async s=>{s.preventDefault(),await j(g.value)});function K(s){s.key==="Escape"&&n.open&&L()}return document.addEventListener("keydown",K),x}async function xe(e){if(e.rag.getKnowledgeNames){let t=await e.rag.getKnowledgeNames();return Array.isArray(t)?t.filter(Boolean):[]}return(e.rag.knowledgeNames??[]).filter(Boolean)}function ee(e){return e.rag.chatId?.trim()?e.rag.chatId:e.rag.chatIdFactory?e.rag.chatIdFactory():typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():`kp-chat-${Date.now()}-${Math.random().toString(36).slice(2,10)}`}function z(e,t,n,r){let o=a("div",`kp-bubble ${t}`,n);if(r){let u=a("div","kp-meta",`${r} citation${r>1?"s":""} attached`);o.appendChild(u)}return e.appendChild(o),e.scrollTop=e.scrollHeight,o}function U(e,t,n){e.textContent="";for(let r of t){let o=a("button","kp-suggestion",r);o.type="button",o.addEventListener("click",async()=>{await n(r)}),e.appendChild(o)}}function te(e,t,n){let r=new Set([t,n]);for(let o of Array.from(e.children))r.has(o)||o.remove()}function ye(e,t){for(let n of t)z(e,n.role==="assistant"?"bot":"user",n.text)}var ne="0.1.0",oe=I,re={init:oe,createChatWidget:I,version:ne};typeof window<"u"&&(window.ChatWidget=re);0&&(module.exports={browserGlobal,createChatWidget,init,version});
//# sourceMappingURL=browser.cjs.map