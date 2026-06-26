const BASE_URL = import.meta.env.VITE_API_URL || "/api";

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || `Request failed: ${res.status}`);
  }

  return res.json();
}

export const api = {
  getProjects: (featured?: boolean, category?: string) => {
    const params = new URLSearchParams();
    if (featured !== undefined) params.set("featured", String(featured));
    if (category) params.set("category", category);
    const qs = params.toString();
    return request<import("../types").Project[]>(
      `/projects${qs ? `?${qs}` : ""}`
    );
  },

  getSkills: (category?: string) => {
    const qs = category ? `?category=${encodeURIComponent(category)}` : "";
    return request<import("../types").SkillCategory[]>(`/skills${qs}`);
  },

  getProfile: () =>
    request<import("../types").Profile>("/profile"),

  submitContact: (data: import("../types").ContactPayload) =>
    request<import("../types").ContactResponse>("/contact", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  sendChat: (data: import("../types").ChatRequest) =>
    request<import("../types").ChatResponse>("/ai/chat", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  healthCheck: () =>
    request<import("../types").HealthResponse>("/health"),
};
