import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || "http://127.0.0.1:8000";

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000,
});

export async function fetchHealth() {
  const { data } = await client.get("/health");
  return data;
}

export async function requestInsight(payload) {
  const response = await client.post("/copilot/insight", payload);
  return {
    data: response.data,
    timings: {
      deltaSeconds: response.headers["x-delta-seconds"] ?? null,
      llmSeconds: response.headers["x-llm-seconds"] ?? null,
    },
  };
}

export function normalizeApiError(error) {
  if (error.code === "ECONNABORTED") {
    return {
      status: "Timeout",
      message:
        "The insight request took too long to complete. Ollama may still be generating the response.",
    };
  }

  if (error.response) {
    const detail = error.response.data?.detail;
    const body =
      typeof error.response.data === "string"
        ? error.response.data
        : JSON.stringify(error.response.data);
    return {
      status: error.response.status,
      message:
        typeof detail === "string"
          ? detail
          : Array.isArray(detail)
            ? detail.map((entry) => entry.msg).join(", ")
            : "The server rejected the request.",
      body,
    };
  }

  if (error.request) {
    return {
      status: "Network",
      message: `The API did not respond at ${API_BASE_URL}. Check that FastAPI is running and CORS is configured correctly.`,
    };
  }

  return {
    status: "Client",
    message: error.message || "Unexpected client error.",
  };
}
