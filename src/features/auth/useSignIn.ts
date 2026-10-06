import { useRef, useState } from 'react';
import { authService, type AuthService, type Credentials } from '../../services/authService';

type Status = 'idle' | 'pending' | 'unavailable' | 'error' | 'success';
export function useSignIn(service: AuthService = authService) {
  const inFlight = useRef(false);
  const [status, setStatus] = useState<Status>('idle');
  const [provider, setProvider] = useState<'password' | 'google'>('password');
  const [message, setMessage] = useState('');

  async function submit(credentials?: Credentials) {
    if (inFlight.current) return;
    inFlight.current = true;
    setStatus('pending');
    setProvider(credentials ? 'password' : 'google');
    setMessage('');
    try {
      const result = credentials ? await service.signIn(credentials) : await service.signInWithGoogle();
      setStatus(result.ok ? 'success' : result.reason === 'unavailable' ? 'unavailable' : 'error');
      setMessage(result.ok ? 'Sesión iniciada correctamente.' : result.message);
    } catch {
      setStatus('error');
      setMessage('No pudimos iniciar sesión. Inténtalo nuevamente.');
    } finally {
      inFlight.current = false;
    }
  }

  return { pending: status === 'pending', provider, status, message, submit };
}
