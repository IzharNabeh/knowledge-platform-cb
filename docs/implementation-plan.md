# AI Chat Widget Library Implementation Plan

## 1. Recommended approach

Build this as a **TypeScript browser library**.

Why:
- Angular already works very well with TypeScript.
- TypeScript makes the widget API clearer and safer.
- You can later publish it as an npm package or ship it as a standalone browser bundle.
- The same library can support Angular now and other frontend frameworks later.

Recommended output formats:
- `esm` for modern app builds
- `umd` or `iife` for direct script injection on already deployed websites

## 2. What the library should do

Core responsibilities:
- Inject a floating action button at the bottom-right
- Open a right-side chat sidebar or modal
- Send chat messages to your AI backend APIs
- Show responses, loading state, and errors
- Read logged-in user authentication context from the host app
- Pass auth token / session data to backend APIs
- Respect RBAC through backend-enforced authorization

The library should **not** own business authorization rules.
RBAC must stay on the backend. The widget should only forward the current user's auth/session context.

## 3. High-level architecture

### Library layers

1. `core`
- widget bootstrap
- config validation
- lifecycle management

2. `ui`
- floating button
- chat panel
- message list
- input box
- loading/error states

3. `api`
- HTTP client wrapper
- request/response mapping
- conversation/session handling

4. `auth`
- access token provider
- token refresh hook
- SSO integration adapter

5. `host integration`
- Angular wrapper service/component later
- plain JavaScript bootstrap for immediate testing

## 4. Best auth / SSO design

Since the website is already live and has **SSO + RBAC**, the safest design is:

### Preferred model

The host Angular app passes an access token to the widget through a callback.

Example shape:

```ts
createChatWidget({
  apiBaseUrl: 'https://api.example.com',
  getAccessToken: async () => authService.getAccessToken(),
  getUserContext: async () => ({
    userId: currentUser.id,
    displayName: currentUser.name
  })
});
```

Why this is best:
- The widget stays decoupled from your specific SSO provider
- No duplicate login flow inside the widget
- No token storage duplication
- Easier to test across environments

### Avoid this if possible
- Embedding direct SSO login logic inside the widget
- Storing long-lived tokens in localStorage inside the widget
- Re-implementing RBAC logic in frontend

## 5. RBAC handling

Correct flow:

1. User logs into existing Angular app
2. Angular app obtains SSO token
3. Widget asks host app for the current token
4. Widget calls AI backend with `Authorization: Bearer <token>`
5. AI backend validates token and applies RBAC
6. AI backend returns only allowed content

Important:
- Frontend can hide unavailable UI, but access control must be enforced server-side
- If the token expires, widget should ask `getAccessToken()` again or trigger host refresh flow

## 6. Suggested widget API

```ts
type ChatWidgetConfig = {
  apiBaseUrl: string;
  endpoints: {
    sendMessage: string;
    conversationHistory?: string;
    suggestions?: string;
  };
  getAccessToken?: () => Promise<string | null> | string | null;
  getUserContext?: () => Promise<{ userId?: string; displayName?: string } | null>;
  mount?: HTMLElement;
  position?: 'bottom-right' | 'bottom-left';
  theme?: Partial<ChatWidgetTheme>;
  launcherIconUrl?: string;
  title?: string;
  welcomeMessage?: string;
};
```

Public methods:

```ts
widget.open();
widget.close();
widget.toggle();
widget.destroy();
```

## 7. API contract recommendation

Even if your backend is still evolving, try to align on a stable request shape:

```json
{
  "message": "What documents can I access?",
  "conversationId": "abc123",
  "context": {
    "sourceApp": "knowledge-platform",
    "locale": "en"
  }
}
```

Response:

```json
{
  "conversationId": "abc123",
  "answer": "Here are the documents you can access...",
  "citations": [],
  "suggestions": []
}
```

## 8. Phased implementation plan

### Phase 1: local proof of concept
- Standalone script injection
- Floating button
- Right sidebar
- Basic chat UI
- Mock API or sample endpoint

### Phase 2: reusable TypeScript library
- Split into modules
- typed config and API contracts
- build with `tsup` or `vite`
- emit ESM + browser bundle

### Phase 3: Angular integration
- Angular service wrapper
- optional Angular component wrapper
- env-based configuration
- token callback wired to existing auth service

### Phase 4: production hardening
- accessibility
- retry and timeout handling
- analytics hooks
- conversation persistence
- attachment support if needed
- telemetry and audit logging

## 9. Local testing strategy

Use two local pieces:

1. a standalone widget script
- can be injected into any Angular page

2. a mock AI backend
- simple local Node server
- returns demo answers

This lets you test UI, auth header forwarding, and host-page integration before the real backend is fully ready.

## 10. Angular dummy app integration idea

In Angular, load the widget after login and pass the token callback:

```ts
declare global {
  interface Window {
    ChatWidget?: {
      init: (config: any) => any;
    };
  }
}

window.ChatWidget?.init({
  apiBaseUrl: 'http://localhost:8787',
  endpoints: {
    sendMessage: '/chat'
  },
  getAccessToken: async () => this.authService.getAccessToken(),
  getUserContext: async () => ({
    userId: this.user?.id,
    displayName: this.user?.name
  }),
  welcomeMessage: 'How can I assist you today?'
});
```

## 11. Best tooling choice

Recommended stack for the actual library:
- TypeScript
- `tsup` for bundling
- Fetch API for backend calls
- CSS injected by the widget, or Shadow DOM later if style isolation becomes necessary

Start simple:
- plain DOM APIs
- no framework inside the widget

This keeps bundle size low and makes Angular integration easier.

## 12. Risks to plan for

- token refresh timing
- CORS configuration for local testing
- CSS collisions with host page
- z-index conflicts with existing Angular UI
- backend response streaming format changes
- multi-language / RTL support if needed

## 13. Recommendation summary

Best path:
- build the library in **TypeScript**
- keep auth integration host-driven through a `getAccessToken()` callback
- keep RBAC enforcement in backend
- start with a standalone browser-injected prototype
- then convert it into a packaged library for Angular production use
