(function () {
  function merge(target, source) {
    var out = Object.assign({}, target);
    Object.keys(source || {}).forEach(function (key) {
      var value = source[key];
      if (
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        typeof out[key] === "object"
      ) {
        out[key] = merge(out[key], value);
      } else {
        out[key] = value;
      }
    });
    return out;
  }

  var defaultConfig = {
    apiBaseUrl: "http://localhost:8787",
    endpoints: {
      sendMessage: "/chat"
    },
    position: "bottom-right",
    title: "Knowledge Assistant",
    welcomeMessage: "How can I assist you today?",
    inputPlaceholder: "Ask your question...",
    getAccessToken: null,
    getUserContext: null,
    theme: {
      accent: "#0f766e",
      accentSoft: "#e6fffb",
      panelBackground: "#ffffff",
      text: "#1f2937",
      mutedText: "#6b7280"
    }
  };

  function injectStyles() {
    if (document.getElementById("chat-widget-styles")) return;

    var style = document.createElement("style");
    style.id = "chat-widget-styles";
    style.textContent = [
      ".cw-root{position:fixed;z-index:2147483000;font-family:Arial,sans-serif;color:#1f2937}",
      ".cw-root.bottom-right{right:24px;bottom:24px}",
      ".cw-root.bottom-left{left:24px;bottom:24px}",
      ".cw-launcher{width:72px;height:72px;border:none;border-radius:999px;background:radial-gradient(circle at 30% 30%, #f4fffd 0%, #e8faf7 55%, #d8f0eb 100%);box-shadow:0 16px 32px rgba(15,118,110,0.18);cursor:pointer;display:flex;align-items:center;justify-content:center}",
      ".cw-launcher:hover{transform:translateY(-1px)}",
      ".cw-spark{font-size:30px;line-height:1}",
      ".cw-panel{position:fixed;top:24px;right:24px;width:420px;max-width:calc(100vw - 24px);height:min(760px,calc(100vh - 48px));background:#fff;border-radius:20px;box-shadow:0 24px 64px rgba(15,23,42,0.2);display:flex;flex-direction:column;overflow:hidden}",
      ".cw-panel.hidden{display:none}",
      ".cw-header{display:flex;justify-content:space-between;align-items:flex-start;padding:18px 18px 12px;border-bottom:1px solid #eef2f7}",
      ".cw-title{font-size:20px;font-weight:700;line-height:1.3;margin:0}",
      ".cw-subtitle{font-size:13px;color:#6b7280;margin-top:4px}",
      ".cw-close{border:none;background:transparent;font-size:26px;cursor:pointer;color:#64748b}",
      ".cw-body{padding:16px;overflow:auto;display:flex;flex-direction:column;gap:12px;flex:1;background:#fbfdff}",
      ".cw-bubble{max-width:85%;padding:12px 14px;border-radius:18px;font-size:14px;line-height:1.5;white-space:pre-wrap}",
      ".cw-bubble.bot{align-self:flex-start;background:#fff;border:1px solid #e2e8f0}",
      ".cw-bubble.user{align-self:flex-end;background:#ecfeff;border:1px solid #bae6fd}",
      ".cw-suggestions{display:flex;flex-direction:column;gap:10px}",
      ".cw-suggestion{border:1px solid #bfdbfe;background:#fff;border-radius:999px;padding:11px 14px;cursor:pointer;text-align:left;font-size:14px;color:#334155}",
      ".cw-footer{padding:14px 16px;border-top:1px solid #eef2f7;background:#fff}",
      ".cw-form{display:flex;gap:10px;align-items:center;border:1px solid #dbe4ee;border-radius:16px;padding:8px 10px}",
      ".cw-input{flex:1;border:none;outline:none;font-size:14px;background:transparent;color:#1f2937}",
      ".cw-send{width:40px;height:40px;border:none;border-radius:999px;background:#e6f4f1;color:#0f766e;font-size:20px;cursor:pointer}",
      ".cw-note{text-align:center;font-size:11px;color:#94a3b8;margin-top:8px}",
      ".cw-loading{font-size:13px;color:#64748b}",
      "@media (max-width: 640px){.cw-root.bottom-right,.cw-root.bottom-left{right:16px;left:auto;bottom:16px}.cw-panel{top:0;right:0;left:0;width:100vw;max-width:none;height:100vh;border-radius:0}}"
    ].join("");
    document.head.appendChild(style);
  }

  function createElement(tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (typeof text === "string") el.textContent = text;
    return el;
  }

  function normalizeError(error) {
    if (!error) return "Unknown error";
    if (typeof error === "string") return error;
    if (error.message) return error.message;
    return "Request failed";
  }

  function init(userConfig) {
    injectStyles();

    var config = merge(defaultConfig, userConfig || {});
    var root = createElement("div", "cw-root " + config.position);
    var launcher = createElement("button", "cw-launcher");
    launcher.type = "button";
    launcher.setAttribute("aria-label", "Open chat assistant");
    launcher.innerHTML = '<span class="cw-spark">✦</span>';

    var panel = createElement("section", "cw-panel hidden");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", config.title);

    var header = createElement("div", "cw-header");
    var titleWrap = createElement("div");
    var title = createElement("h2", "cw-title", config.title);
    var subtitle = createElement(
      "div",
      "cw-subtitle",
      "Answers are generated based on your access permissions"
    );
    titleWrap.appendChild(title);
    titleWrap.appendChild(subtitle);

    var close = createElement("button", "cw-close", "×");
    close.type = "button";
    close.setAttribute("aria-label", "Close chat assistant");
    header.appendChild(titleWrap);
    header.appendChild(close);

    var body = createElement("div", "cw-body");
    var welcome = createElement("div", "cw-bubble bot", config.welcomeMessage);
    body.appendChild(welcome);

    var suggestions = createElement("div", "cw-suggestions");
    [
      "Which indicators reflect the achievements of Vision KSA goals?",
      "Case studies of real estate initiatives for economic growth",
      "Study of UX for the ministry external portal"
    ].forEach(function (text) {
      var button = createElement("button", "cw-suggestion", text);
      button.type = "button";
      button.addEventListener("click", function () {
        input.value = text;
        sendMessage(text);
      });
      suggestions.appendChild(button);
    });
    body.appendChild(suggestions);

    var footer = createElement("div", "cw-footer");
    var form = createElement("form", "cw-form");
    var input = createElement("input", "cw-input");
    input.type = "text";
    input.placeholder = config.inputPlaceholder;
    input.autocomplete = "off";
    var send = createElement("button", "cw-send", "➜");
    send.type = "submit";
    form.appendChild(input);
    form.appendChild(send);
    var note = createElement(
      "div",
      "cw-note",
      "Auth token is forwarded from the host app when configured."
    );
    footer.appendChild(form);
    footer.appendChild(note);

    panel.appendChild(header);
    panel.appendChild(body);
    panel.appendChild(footer);
    root.appendChild(launcher);
    document.body.appendChild(root);
    document.body.appendChild(panel);

    function appendMessage(kind, text) {
      var bubble = createElement("div", "cw-bubble " + kind, text);
      body.appendChild(bubble);
      body.scrollTop = body.scrollHeight;
      return bubble;
    }

    function open() {
      panel.classList.remove("hidden");
    }

    function closePanel() {
      panel.classList.add("hidden");
    }

    async function sendMessage(message) {
      var text = (message || input.value || "").trim();
      if (!text) return;

      appendMessage("user", text);
      input.value = "";
      body.scrollTop = body.scrollHeight;

      var loading = createElement("div", "cw-loading", "Thinking...");
      body.appendChild(loading);
      body.scrollTop = body.scrollHeight;

      try {
        var token = config.getAccessToken
          ? await config.getAccessToken()
          : null;
        var userContext = config.getUserContext
          ? await config.getUserContext()
          : null;

        var response = await fetch(
          config.apiBaseUrl.replace(/\/$/, "") + config.endpoints.sendMessage,
          {
            method: "POST",
            headers: Object.assign(
              {
                "Content-Type": "application/json"
              },
              token ? { Authorization: "Bearer " + token } : {}
            ),
            body: JSON.stringify({
              message: text,
              conversationId: window.__CHAT_WIDGET_CONVERSATION_ID__ || null,
              context: {
                sourceApp: "local-angular-test",
                user: userContext
              }
            })
          }
        );

        if (!response.ok) {
          throw new Error("Backend error: " + response.status);
        }

        var data = await response.json();
        window.__CHAT_WIDGET_CONVERSATION_ID__ = data.conversationId || null;

        if (loading.parentNode) loading.parentNode.removeChild(loading);
        appendMessage("bot", data.answer || "No answer returned.");
      } catch (error) {
        if (loading.parentNode) loading.parentNode.removeChild(loading);
        appendMessage("bot", "Request failed: " + normalizeError(error));
      }
    }

    launcher.addEventListener("click", open);
    close.addEventListener("click", closePanel);
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      sendMessage();
    });

    return {
      open: open,
      close: closePanel,
      toggle: function () {
        if (panel.classList.contains("hidden")) open();
        else closePanel();
      },
      destroy: function () {
        root.remove();
        panel.remove();
      }
    };
  }

  window.ChatWidget = {
    init: init
  };
})();
