const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Project {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  description?: string;
  status: 'IDEA' | 'PLANNING' | 'DEVELOPMENT' | 'TESTING' | 'PUBLISHED' | 'PAUSED' | 'ARCHIVED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  project_type: 'MOBILE_APP' | 'WEB_APP' | 'SAAS' | 'API' | 'AGENT' | 'AUTOMATION';
  stack: string[];
  github_url?: string;
  production_url?: string;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectsResponse {
  items: Project[];
  total: number;
  page: number;
  pages: number;
}

export interface ProjectInput {
  name: string;
  slug: string;
  description?: string;
  status?: string;
  priority?: string;
  project_type: string;
  stack?: string[];
  github_url?: string;
  production_url?: string;
}

export const getProjects = async (params: {
  status?: string;
  priority?: string;
  project_type?: string;
  search?: string;
  page?: number;
  limit?: number;
  include_archived?: boolean;
}): Promise<ProjectsResponse> => {
  const query = new URLSearchParams();
  if (params.status) query.append("status", params.status);
  if (params.priority) query.append("priority", params.priority);
  if (params.project_type) query.append("project_type", params.project_type);
  if (params.search) query.append("search", params.search);
  if (params.page) query.append("page", params.page.toString());
  if (params.limit) query.append("limit", params.limit.toString());
  if (params.include_archived !== undefined) {
    query.append("include_archived", params.include_archived.toString());
  }

  const res = await fetch(`${API_URL}/api/projects?${query.toString()}`, {
    cache: "no-store",
    headers: {
      "Accept": "application/json",
    }
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to fetch projects");
  }
  return res.json();
};

export const getProject = async (idOrSlug: string | number): Promise<Project> => {
  const isSlug = typeof idOrSlug === "string" && isNaN(Number(idOrSlug));
  const url = isSlug 
    ? `${API_URL}/api/projects/slug/${idOrSlug}` 
    : `${API_URL}/api/projects/${idOrSlug}`;
    
  const res = await fetch(url, { 
    cache: "no-store",
    headers: {
      "Accept": "application/json",
    }
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Project not found");
  }
  return res.json();
};

export const createProject = async (data: ProjectInput): Promise<Project> => {
  const res = await fetch(`${API_URL}/api/projects`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to create project");
  }
  return res.json();
};

export const updateProject = async (id: number, data: Partial<ProjectInput> & { is_archived?: boolean }): Promise<Project> => {
  const res = await fetch(`${API_URL}/api/projects/${id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to update project");
  }
  return res.json();
};

export const archiveProject = async (id: number): Promise<Project> => {
  const res = await fetch(`${API_URL}/api/projects/${id}/archive`, {
    method: "PATCH",
    headers: {
      "Accept": "application/json",
    }
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to archive project");
  }
  return res.json();
};

export const deleteProject = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/api/projects/${id}`, {
    method: "DELETE",
    headers: {
      "Accept": "application/json",
    }
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to delete project");
  }
};
