# Chat Widget Library

Production-oriented TypeScript library for embedding an AI chat assistant into an Angular website or any browser-based application.

## Project layout

- `src/` - production TypeScript source
- `docs/implementation-plan.md` - architecture and rollout notes
- `local-test/mock-ai-server.js` - local mock backend
- `local-test/chat-widget.js` - original quick prototype
- `local-test/angular-usage-example.ts` - Angular init example

## Library API

Package usage:

```ts
import { createChatWidget } from "@knowledge-platform/chat-widget";

const widget = createChatWidget({
  apiBaseUrl: "https://api.example.com",
  endpoints: {
    ask: "/knowledge_rag/ask",
    history: "/knowledge_rag/get_chat_history",
    deleteChat: "/knowledge_rag/delete_chat",
    deleteLastQa: "/knowledge_rag/delete_last_qa_pair"
  },
  rag: {
    chatId: "customer-portal-session-123",
    knowledgeNames: ["employee-handbook", "policies"],
    enableReferences: true
  },
  getAccessToken: async () => authService.getAccessToken(),
  getUserContext: async () => ({
    userId: currentUser.id,
    displayName: currentUser.name
  })
});
```

Browser-global usage after loading the browser bundle:

```html
<script src="https://your-cdn.example.com/browser.iife.js"></script>
<script>
  window.ChatWidget.init({
    apiBaseUrl: "https://api.example.com",
    endpoints: {
      ask: "/knowledge_rag/ask",
      history: "/knowledge_rag/get_chat_history"
    },
    rag: {
      chatId: "external-client-user-42",
      knowledgeNames: ["client-kb-public", "client-kb-private"]
    },
    getAccessToken: async function () {
      return window.appAccessToken;
    },
    getUserContext: async function () {
      return {
        userId: window.currentUser?.id,
        displayName: window.currentUser?.name
      };
    }
  });
</script>
```

## Knowledge RAG integration

The widget is now aligned to the `knowledge_rag` endpoints:

- `POST /knowledge_rag/ask`
- `GET /knowledge_rag/get_chat_history`

Production guidance:

- pass the bearer token with `getAccessToken()`
- do not hardcode tokens into the shipped widget
- use a stable `rag.chatId` per user/session if you want conversation continuity
- provide `rag.knowledgeNames` from the host application, not from the widget bundle
- version your hosted script URL, for example:
  - `/chat-widget/v1.0.0/browser.iife.js`
  - `/chat-widget/latest/browser.iife.js`

## Build outputs

The library is configured to build:

- `esm` for app imports
- `cjs` for Node/CommonJS consumers
- `iife` for script injection into an already deployed website

Build tooling:

```bash
npm install
npm run build
```

Output will be generated in `dist/`.

## Local test flow

### 1. Start the mock backend

```bash
node local-test/mock-ai-server.js
```

### 2. Build the browser bundle

```bash
npm install
npm run build
```

### 3. Inject the built script into an Angular dummy app

Copy the built browser file from `dist/` into Angular `src/assets/`, then add:

```html
<script src="/assets/browser.iife.js"></script>
```

### 4. Initialize after authentication

```ts
window.ChatWidget?.init({
  apiBaseUrl: "http://localhost:8787",
  endpoints: {
    ask: "/knowledge_rag/ask",
    history: "/knowledge_rag/get_chat_history"
  },
  rag: {
    chatId: "angular-local-test-user-123",
    knowledgeNames: ["sample-kb"]
  },
  getAccessToken: async () => "dummy-sso-token",
  getUserContext: async () => ({
    userId: "u-1001",
    displayName: "Angular Test User"
  })
});
```

## Production integration guidance

For the live Angular site:

- host the built `iife` bundle on your CDN or app server
- load it only after the user is authenticated
- pass access token and user context from the host Angular app
- keep RBAC validation in the AI backend

Do not embed a separate login flow inside the widget.
