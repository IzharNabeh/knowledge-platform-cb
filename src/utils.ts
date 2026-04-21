export function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function mergeDeep<T extends Record<string, unknown>>(
  target: T,
  source: Partial<T>
): T {
  const output = { ...target };

  for (const key of Object.keys(source) as Array<keyof T>) {
    const sourceValue = source[key];
    const targetValue = output[key];

    if (isRecord(targetValue) && isRecord(sourceValue)) {
      output[key] = mergeDeep(
        targetValue as Record<string, unknown>,
        sourceValue as Partial<Record<string, unknown>>
      ) as T[keyof T];
      continue;
    }

    if (sourceValue !== undefined) {
      output[key] = sourceValue as T[keyof T];
    }
  }

  return output;
}

export function normalizeError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === "string") {
    return new Error(error);
  }

  return new Error("Unexpected widget error");
}

export function joinUrl(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}
