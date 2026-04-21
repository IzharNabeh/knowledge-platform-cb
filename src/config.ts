import { defaultConfigValues, defaultTheme } from "./defaults";
import { mergeDeep } from "./utils";
import type { ChatWidgetConfig, ResolvedChatWidgetConfig } from "./types";

export function resolveConfig(config: ChatWidgetConfig): ResolvedChatWidgetConfig {
  if (!config.apiBaseUrl?.trim()) {
    throw new Error("Chat widget config requires a non-empty apiBaseUrl.");
  }

  if (!config.endpoints?.ask?.trim()) {
    throw new Error("Chat widget config requires endpoints.ask to be provided.");
  }

  const mount = config.mount ?? document.body;
  const theme = mergeDeep(defaultTheme, config.theme ?? {});

  return {
    apiBaseUrl: config.apiBaseUrl,
    endpoints: {
      ...config.endpoints
    },
    mount,
    position: config.position ?? defaultConfigValues.position,
    title: config.title ?? defaultConfigValues.title,
    subtitle: config.subtitle ?? defaultConfigValues.subtitle,
    welcomeMessage: config.welcomeMessage ?? defaultConfigValues.welcomeMessage,
    inputPlaceholder:
      config.inputPlaceholder ?? defaultConfigValues.inputPlaceholder,
    launcherAriaLabel:
      config.launcherAriaLabel ?? defaultConfigValues.launcherAriaLabel,
    closeAriaLabel: config.closeAriaLabel ?? defaultConfigValues.closeAriaLabel,
    initialSuggestions:
      config.initialSuggestions ?? defaultConfigValues.initialSuggestions,
    sourceApp: config.sourceApp ?? defaultConfigValues.sourceApp,
    locale: config.locale ?? defaultConfigValues.locale,
    customHeaders: config.customHeaders ?? defaultConfigValues.customHeaders,
    rag: {
      ...defaultConfigValues.rag,
      ...(config.rag ?? {})
    },
    theme,
    getAccessToken: config.getAccessToken,
    getUserContext: config.getUserContext,
    onOpen: config.onOpen,
    onClose: config.onClose,
    onError: config.onError
  };
}
