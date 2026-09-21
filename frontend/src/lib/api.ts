import { getToken, removeToken } from "../utils/auth";

const API_BASE_URL = "http://localhost:5000/api/v1";

export interface Task {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  createdAt?: string;
}

export interface CreateTaskData {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
}

export interface AuthResponseData {
  token: string;
  user: {
    _id?: string;
    id?: string;
    email: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

export interface UserProfile {
  _id?: string;
  id?: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Centralized response handler with 401 redirection and error unwrapping.
 * For auth endpoints (like /auth/login), 401 indicates invalid credentials rather than an expired session.
 */
async function handleResponse<T>(
  response: Response,
  options?: { isAuthEndpoint?: boolean }
): Promise<T> {
  const result = await response.json().catch(() => ({}));

  if (response.status === 401) {
    if (options?.isAuthEndpoint) {
      throw new Error(result.message || "Invalid email or password");
    }
    removeToken();
    if (typeof window !== "undefined" && window.location.pathname !== "/login") {
      window.location.href = "/login?expired=true";
    }
    throw new Error(result.message || "Session expired. Please login again.");
  }

  if (!response.ok || result.success === false) {
    throw new Error(result.message || "An error occurred");
  }

  return result.data;
}

/**
 * Returns standard headers including Authorization Bearer token if available
 */
function getHeaders(contentType: boolean = true): Record<string, string> {
  const headers: Record<string, string> = {};
  if (contentType) {
    headers["Content-Type"] = "application/json";
  }
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

// ==================== AUTHENTICATION APIS ====================

export async function registerApi(credentials: {
  email: string;
  password: string;
}): Promise<UserProfile> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  return handleResponse<UserProfile>(response, { isAuthEndpoint: true });
}

export async function loginApi(credentials: {
  email: string;
  password: string;
}): Promise<AuthResponseData> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  return handleResponse<AuthResponseData>(response, { isAuthEndpoint: true });
}

export async function getMe(): Promise<UserProfile> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    headers: getHeaders(false),
  });

  return handleResponse<UserProfile>(response);
}

// ==================== PROTECTED TASK APIS ====================

export async function getTasks(): Promise<Task[]> {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    headers: getHeaders(false),
  });

  return handleResponse<Task[]>(response);
}

export async function createTask(
  task: CreateTaskData
): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify(task),
  });

  return handleResponse<Task>(response);
}

export async function updateTask(
  id: string,
  task: Partial<CreateTaskData> & { completed?: boolean }
): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: getHeaders(true),
    body: JSON.stringify(task),
  });

  return handleResponse<Task>(response);
}

export async function deleteTask(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: getHeaders(false),
  });

  await handleResponse<void>(response);
}
