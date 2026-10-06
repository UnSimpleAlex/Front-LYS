import { useState } from 'react';
import { authService, type AuthService, type Credentials } from '../../services/authService';

export function useSignIn(service: AuthService = authService) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');

  async function submit(credentials?: Credentials) {
    if (pending) return;
    setPending(true);
    setMessage('');
    try {
      const result = credentials ? await service.signIn(credentials) : await service.signInWithGoogle();
      if (!result.ok) setMessage(result.message);
    } catch {
      setMessage('No pudimos iniciar sesión. Inténtalo nuevamente.');
    } finally {
      setPending(false);
    }
  }

  return { pending, message, submit };
}
