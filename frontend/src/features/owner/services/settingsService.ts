import {
  buildAuthHeaders,
  buildOwnerApiUrl,
  parseJsonResponse,
  readApiError,
} from "@/features/owner/services/api";
import type { User } from "@/features/auth/types/authTypes";

export async function getOwnerProfile(): Promise<User> {
  const response = await fetch(buildOwnerApiUrl("/auth/me"), {
    headers: buildAuthHeaders(),
  });

  const payload = await parseJsonResponse<User>(response);

  if (!response.ok || !payload) {
    throw new Error(readApiError(payload, "Could not load profile."));
  }

  return payload;
}
