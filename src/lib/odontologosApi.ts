import { apiClient } from '@/lib/api';

export type RolUsuario = 'ADMIN' | 'ODONTOLOGO' | 'SECRETARIA';

export interface Odontologo {
  id: number;
  nombre: string;
  email: string;
  role: RolUsuario;
  createdAt: string;
}

export const odontologosApi = {
  list(): Promise<Odontologo[]> {
    // /users ya devuelve solo campos públicos
    return apiClient.get<Odontologo[]>('/users');
  },

  listOdontologos(): Promise<Odontologo[]> {
    return odontologosApi.list().then(users =>
      users.filter((u) => u.role === 'ODONTOLOGO')
    );
  },
};
