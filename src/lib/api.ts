

// Cliente API seguro para comunicarse con el backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'ODONTOLOGO' | 'SECRETARIA';
}

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  user: {
    id: number;
    nombre: string;
    email: string;
    role: string;
    createdAt: string;
  };
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

class ApiClient {
  private accessToken: string | null = null;
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Agregar token si existe
    const token = this.getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private getAccessToken(): string | null {
    // Usar token en memoria (más seguro que localStorage)
    return this.accessToken;
  }


  private async handleError(response: Response): Promise<never> {
    let errorMessage = 'Error en la solicitud';

    try {
      const data = await response.json();
      errorMessage = data.message || data.error || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }

    throw new Error(errorMessage);
  }

  async post<T>(endpoint: string, body: any): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
      credentials: 'include',
    });

    if (!response.ok) {
      // Si es 401, intentar refrescar token
      if (response.status === 401) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          // Reintentar con nuevo token
          return this.post(endpoint, body);
        }
        // Si no se puede refrescar, limpiar y redirigir
        this.clearTokens();
        window.location.href = '/login';
        throw new Error('Sesión expirada');
      }

      return this.handleError(response);
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          return this.get(endpoint);
        }
        this.clearTokens();
        window.location.href = '/login';
        throw new Error('Sesión expirada');
      }

      return this.handleError(response);
    }

    return response.json();
  }

  async refreshAccessToken(): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        this.clearTokens();
        return false;
      }

      const data: any = await response.json();
      // Guardar token en memoria (no en localStorage)
      this.accessToken = data.access_token;
      return true;
    } catch (error) {
      this.clearTokens();
      return false;
    }
  }

  private clearTokens(): void {
    if (typeof window !== 'undefined') {
      // Limpiar token en memoria y datos de usuario
      this.accessToken = null;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>('/auth/login', credentials);
    this.saveAuth(response);
    return response;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {     
    const response = await this.post<AuthResponse>('/auth/register', data);
    this.saveAuth(response);
    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.post('/auth/logout', {});
    } finally {
      this.clearTokens();
    }
  }

  private saveAuth(response: AuthResponse): void {
    if (typeof window !== 'undefined') {
      // Guardar access_token en memoria; refresh_token se guarda como HttpOnly cookie por backend
      this.accessToken = response.access_token;
      localStorage.setItem('user', JSON.stringify(response.user));
    }
  }

  getUser() {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!this.getAccessToken();
  }
}

export const apiClient = new ApiClient();
