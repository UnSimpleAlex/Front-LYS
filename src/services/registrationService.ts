import type { AuthResult } from './authService';

export type Registration = { name: string; email: string; phone: string; password: string; termsAccepted: boolean };
export interface RegistrationService {
  register(values: Registration): Promise<AuthResult>;
  registerWithGoogle(): Promise<AuthResult>;
}
// Adaptador pendiente: no envía datos ni simula la creación de una cuenta.
export const registrationService: RegistrationService = {
  async register() { return { ok: false, reason: 'unavailable', message: 'La creación de cuentas estará disponible pronto. Tus datos no se han enviado.' }; },
  async registerWithGoogle() { return { ok: false, reason: 'unavailable', message: 'El registro con Google estará disponible pronto.' }; },
};
