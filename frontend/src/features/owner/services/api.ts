const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

type ApiErrorPayload = {
  message?: unknown;
  errors?: Record<string, unknown>;
};

export function buildOwnerApiUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}

export function getAuthToken(): string {
  const token =
    localStorage.getItem("access_token") ?? localStorage.getItem("token");

  if (!token) {
    throw new Error("Your session expired. Please login again.");
  }

  return token;
}

export function buildAuthHeaders(extra?: HeadersInit): HeadersInit {
  return {
    Accept: "application/json",
    Authorization: `Bearer ${getAuthToken()}`,
    ...extra,
  };
}

export async function parseJsonResponse<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export function readApiError(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object") {
    return fallback;
  }

  const body = payload as ApiErrorPayload;

  if (typeof body.message === "string" && body.message.trim()) {
    return body.message;
  }

  if (body.errors && typeof body.errors === "object") {
    const firstErrorGroup = Object.values(body.errors)[0];

    if (Array.isArray(firstErrorGroup) && typeof firstErrorGroup[0] === "string") {
      return firstErrorGroup[0];
    }
  }

  return fallback;
}

export function buildQueryString(
  params: Record<string, string | number | undefined | null>
): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    searchParams.set(key, String(value));
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}
