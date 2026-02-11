
// Cliente API seguro para comunicarse con el backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Credenciales para iniciar sesión
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Datos requeridos para registrar un nuevo usuario
 */
export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'ODONTOLOGO' | 'SECRETARIA';
}

/**
 * Respuesta del servidor tras autenticación exitosa
 */
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

/**
 * Información de un paciente registrado
 */
// export interface Paciente {
//   id: number;
//   nombre: string;
//   dni: string;
//   telefono: string;
//   createdAt: string;
// }

/**
 * Respuesta genérica de la API
 * @template T - Tipo de datos en la respuesta
 */
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Cliente API para comunicarse con el backend del consultorio odontológico
 * Maneja autenticación, tokens JWT y reintentos automáticos
 */
class ApiClient {
  private accessToken: string | null = null;

  /**
   * Construye los headers HTTP necesarios para las solicitudes
   * @returns Headers con autenticación Bearer si el token existe
   */
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const token = this.getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Obtiene el token de acceso almacenado en memoria
   * @returns Token JWT o null si no existe
   */
  private getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Procesa errores de respuesta HTTP y lanza excepciones
   * @param response - Respuesta HTTP del servidor
   * @throws Error con mensaje descriptivo del error
   */
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

  /**
   * Realiza una solicitud POST con reintentos en caso de token expirado
   * @template T - Tipo de datos que retorna la API
   * @param endpoint - Ruta del endpoint (ej: '/auth/login')
   * @param body - Cuerpo de la solicitud
   * @returns Datos retornados por la API
   * @throws Error si la solicitud falla o la sesión expira
   */
  async post<T>(endpoint: string, body: any): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          return this.post(endpoint, body);
        }
        this.clearTokens();
        window.location.href = '/login';
        throw new Error('Sesión expirada');
      }

      return this.handleError(response);
    }

    if (response.status === 204) {
      return null as unknown as T; // Retorna un objeto vacío si no hay contenido
    }

    return response.json();
  }

  /**
   * Realiza una solicitud GET con reintentos en caso de token expirado
   * @template T - Tipo de datos que retorna la API
   * @param endpoint - Ruta del endpoint (ej: '/pacientes')
   * @returns Datos retornados por la API
   * @throws Error si la solicitud falla o la sesión expira
   */
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

    if (response.status === 204) {
      return null as unknown as T; // Retorna null si no hay contenido
    }

    return response.json();
  }

  /**
   * Realiza una solicitud PUT con reintentos en caso de token expirado
   * @template T - Tipo de datos que retorna la API
   * @param endpoint 
   * @param body 
   * @returns 
   */
  async put<T>(endpoint: string, body: any): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          return this.put(endpoint, body);
        }
        this.clearTokens();
        window.location.href = '/login';
        throw new Error('Sesión expirada');
      }

      return this.handleError(response);
    }

    if (response.status === 204) {
      return null as unknown as T; // Retorna null si no hay contenido
    }

    return response.json();
  }


    /**
   * Realiza una solicitud PATCH con reintentos en caso de token expirado
   */
  async patch<T>(endpoint: string, body: any): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          return this.patch(endpoint, body);
        }
        this.clearTokens();
        window.location.href = '/login';
        throw new Error('Sesión expirada');
      }

      return this.handleError(response);
    }

    return response.json();
  }


  /**  Realiza una solicitud DELETE con reintentos en caso de token expirado
     * @template T - Tipo de datos que retorna la API
     * @param endpoint 
     * @returns 
     */
  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          return this.delete(endpoint);
        }
        this.clearTokens();
        window.location.href = '/login';
        throw new Error('Sesión expirada');
      }

      return this.handleError(response);
    }

    if (response.status === 204) {
      return null as unknown as T; // Retorna null si no hay contenido
    }

    return response.json();
  }

  /**
   * Renueva el token de acceso usando el refresh token en cookies
   * @returns true si la renovación fue exitosa, false en caso contrario
   */
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
      this.accessToken = data.access_token;
      return true;
    } catch (error) {
      this.clearTokens();
      return false;
    }
  }

  /**
   * Limpia todos los tokens y datos de usuario del almacenamiento
   * @private
   */
  private clearTokens(): void {
    if (typeof window !== 'undefined') {
      this.accessToken = null;
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  }

  /**
   * Inicia sesión con email y contraseña
   * @param credentials - Email y contraseña del usuario
   * @returns Datos del usuario y tokens de autenticación
   * @throws Error si las credenciales son inválidas
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>('/auth/login', credentials);
    this.saveAuth(response);
    return response;
  }

  /**
   * Registra un nuevo usuario en el sistema
   * @param data - Datos del nuevo usuario (nombre, email, contraseña, rol opcional)
   * @returns Datos del usuario creado y tokens de autenticación
   * @throws Error si el registro falla
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>('/auth/register', data);
    this.saveAuth(response);
    return response;
  }

  /**
   * Cierra la sesión del usuario actual
   */
  async logout(): Promise<void> {
    try {
      await this.post('/auth/logout', {});
    } finally {
      this.clearTokens();
    }
  }

  /**
   * Guarda la autenticación (token y datos de usuario) después del login/register
   * @param response - Respuesta de autenticación del servidor
   * @private
   */
  private saveAuth(response: AuthResponse): void {
    if (typeof window !== 'undefined') {
      this.accessToken = response.access_token;
      console.log(response);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
  }

  /**
   * Obtiene los datos del usuario actualmente autenticado
   * @returns Datos del usuario o null si no está autenticado
   */
  getUser() {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    console.log(user ? JSON.parse(user) : null);
    return user ? JSON.parse(user) : null;
  }

  /**
   * Verifica si existe una sesión autenticada válida
   * @returns true si el usuario está autenticado, false en caso contrario
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!this.getAccessToken();
  }

  // getPacientes(): Promise<Paciente[]> {
  //   return this.get<Paciente[]>('/pacientes');
  // }

  // createPaciente(data: Omit<Paciente, 'id' | 'createdAt'>): Promise<Paciente> {
  //   return this.post<Paciente>('/pacientes', data);
  // }

  // updatePaciente(id: number, data: Partial<Paciente>): Promise<Paciente> {
  //   return this.put<Paciente>(`/pacientes/${id}`, data);
  // }

  // deletePaciente(id: number): Promise<void> {
  //   return this.delete<void>(`/pacientes/${id}`);
  // }
}

/**
 * Instancia singleton del cliente API
 * Usar en toda la aplicación para comunicarse con el backend
 */
export const apiClient = new ApiClient();
