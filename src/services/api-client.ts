export class ApiClientError extends Error {
  public readonly statusCode: number;
  public readonly errors: unknown;

  constructor(
    message: string,
    statusCode: number,
    errors: unknown = null,
  ) {
    super(message);
    this.name = "ApiClientError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: unknown;
}

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1"
).replace(/\/+$/, "");

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      cache: "no-store",
      headers,
      credentials: "include",
    });
  } catch {
    throw new ApiClientError(
      "Unable to connect to the server. Check your connection and try again.",
      0,
    );
  }

  let body: unknown;

  try {
    body = await response.json();
  } catch {
    throw new ApiClientError(
      response.ok
        ? "The server returned an invalid response."
        : `Request failed with status ${response.status}.`,
      response.status,
    );
  }

  if (typeof body !== "object" || body === null) {
    throw new ApiClientError(
      "The server returned an invalid response.",
      response.status,
    );
  }

  const payload = body as ApiEnvelope<T>;

  if (typeof payload.success !== "boolean") {
    throw new ApiClientError(
      "The server returned an invalid response.",
      response.status,
    );
  }

  if (!response.ok || !payload.success) {
    throw new ApiClientError(
      payload.message || `Request failed with status ${response.status}.`,
      response.status,
      payload.errors,
    );
  }

  return payload.data;
}
