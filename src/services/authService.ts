export type Credentials = { email: string; password: string; remember: boolean };
export type AuthResult = { ok: false; message: string; reason?: 'unavailable' } | { ok: true };
export interface AuthService {
  signIn(credentials: Credentials): Promise<AuthResult>;
  signInWithGoogle(): Promise<AuthResult>;
}

// Este adaptador no envía ni almacena credenciales. Se sustituirá al integrar el backend.
export const authService: AuthService = {
  async signIn() {
    return { ok: false, reason: 'unavailable', message: 'El inicio de sesión estará disponible pronto. Gracias por tu paciencia.' };
  },
  async signInWithGoogle() {
    return { ok: false, reason: 'unavailable', message: 'El acceso con Google estará disponible pronto.' };
  },
};
