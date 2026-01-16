import { ApiResponse } from "../types";

const API_BASE = "/api";

export const fetchAPI = async <T>(
  endpoint: string,
  params: Record<string, any> = {}
): Promise<ApiResponse<T>> => {
  const queryString = new URLSearchParams(params).toString();
  const url = `${API_BASE}${endpoint}${queryString ? "?" + queryString : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();

  if (Array.isArray(data)) {
    return { status: true, data: data as unknown as T };
  }

  if (data.status !== undefined) {
    return data;
  }

  if (data.url) {
    return { status: true, data: data as unknown as T };
  }

  return { status: true, data: data as unknown as T };
};
