const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
    constructor() {
        this.token = null;
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('token');
        }
    }

    setToken(token) {
        this.token = token;
        if (typeof window !== 'undefined') {
            if (token) {
                localStorage.setItem('token', token);
            } else {
                localStorage.removeItem('token');
            }
        }
    }

    async request(endpoint, options = {}) {
        const url = `${API_URL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(url, {
            ...options,
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Something went wrong');
        }

        return data;
    }

    // Auth
    async signup(email, password, displayName) {
        const data = await this.request('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ email, password, displayName }),
        });
        this.setToken(data.token);
        return data;
    }

    async login(email, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        this.setToken(data.token);
        return data;
    }

    logout() {
        this.setToken(null);
    }

    async getMe() {
        return this.request('/auth/me');
    }

    // Projects
    async getProjects(tagId = null) {
        const url = tagId ? `/projects?tag=${tagId}` : '/projects';
        return this.request(url);
    }

    async getProject(id) {
        return this.request(`/projects/${id}`);
    }

    async createProject(data) {
        return this.request('/projects', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateProject(id, data) {
        return this.request(`/projects/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteProject(id) {
        return this.request(`/projects/${id}`, {
            method: 'DELETE',
        });
    }

    // Snippets
    async getSnippets(projectId) {
        return this.request(`/snippets/${projectId}`);
    }

    async createSnippet(projectId, data) {
        return this.request(`/snippets/${projectId}`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateSnippet(projectId, snippetId, data) {
        return this.request(`/snippets/${projectId}/${snippetId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteSnippet(projectId, snippetId) {
        return this.request(`/snippets/${projectId}/${snippetId}`, {
            method: 'DELETE',
        });
    }

    // Questions
    async getQuestions(projectId) {
        return this.request(`/questions/${projectId}`);
    }

    async createQuestion(projectId, data) {
        return this.request(`/questions/${projectId}`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateQuestion(projectId, questionId, data) {
        return this.request(`/questions/${projectId}/${questionId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteQuestion(projectId, questionId) {
        return this.request(`/questions/${projectId}/${questionId}`, {
            method: 'DELETE',
        });
    }

    // Search
    async search(query) {
        return this.request(`/search?q=${encodeURIComponent(query)}`);
    }

    // AI Interview
    async startInterviewSession(projectId) {
        return this.request(`/ai/start-session/${projectId}`, {
            method: 'POST',
        });
    }

    async generateQuestions(projectId, count = 5) {
        return this.request(`/ai/generate-questions/${projectId}`, {
            method: 'POST',
            body: JSON.stringify({ count }),
        });
    }

    async submitAnswer(sessionId, question, answer, questionId) {
        return this.request(`/ai/submit-answer/${sessionId}`, {
            method: 'POST',
            body: JSON.stringify({ question, answer, questionId }),
        });
    }

    async endSession(sessionId) {
        return this.request(`/ai/end-session/${sessionId}`, {
            method: 'POST',
        });
    }

    async evaluateAnswer(projectId, question, answer) {
        return this.request(`/ai/evaluate/${projectId}`, {
            method: 'POST',
            body: JSON.stringify({ question, answer }),
        });
    }

    // Tags
    async getTags() {
        return this.request('/tags');
    }

    async createTag(data) {
        return this.request('/tags', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateTag(id, data) {
        return this.request(`/tags/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteTag(id) {
        return this.request(`/tags/${id}`, {
            method: 'DELETE',
        });
    }
}

export const api = new ApiClient();
export default api;
