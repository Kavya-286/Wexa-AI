const API_BASE = '/api';

async function request(path) {
  const response = await fetch(`${API_BASE}${path}`);

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || 'Unable to connect to SkillGraph.');
  }

  return response.json();
}

export async function getHealth() {
  return request('/health');
}

export async function getUsers() {
  return request('/users');
}

export async function getUserById(userId) {
  return request(`/users/${userId}`);
}

export async function getSkills() {
  return request('/skills');
}

export async function getJobs() {
  return request('/jobs');
}

export async function getJobById(jobId) {
  return request(`/jobs/${jobId}`);
}

export async function getCompanies() {
  return request('/companies');
}

export async function getCourses() {
  return request('/courses');
}

export async function getProjects() {
  return request('/projects');
}

export async function getRecommendations(userId) {
  return request(`/recommendations/${userId}`);
}

export async function getCareerPath(userId, jobId) {
  return request(`/career-path/${userId}/${jobId}`);
}

export async function getGraph(id) {
  return request(`/graph/${id}`);
}

export async function searchSkills(query) {
  return request(`/search?q=${encodeURIComponent(query)}`);
}
