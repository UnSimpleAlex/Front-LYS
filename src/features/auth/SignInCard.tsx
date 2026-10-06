import { useState, type FormEvent } from 'react';
import { Icon, GoogleIcon } from '../../components/Icon';
import { useSignIn } from './useSignIn';

export function SignInCard({ onHelp }: { onHelp: (action: 'register' | 'recover') => void }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { pending, message, submit } = useSignIn();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    void submit({ email: String(values.get('email')).trim(), password: String(values.get('password')), remember: values.get('remember') === 'on' });
  }

  return <section className="sign-in-card" id="iniciar-sesion" aria-labelledby="sign-in-title">
    <h2 id="sign-in-title">Iniciar sesión</h2>
    <form onSubmit={onSubmit}>
      <div className="fields">
        <div className="input-field">
          <label className="sr-only" htmlFor="email">Correo electrónico</label>
          <Icon name="mail" />
          <input id="email" name="email" type="email" placeholder="Correo electrónico" autoComplete="email" required />
        </div>
        <div className="input-field">
          <label className="sr-only" htmlFor="password">Contraseña</label>
          <Icon name="lock" />
          <input id="password" name="password" type={passwordVisible ? 'text' : 'password'} placeholder="Contraseña" autoComplete="current-password" required />
          <button type="button" className="password-toggle" aria-label={passwordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'} aria-pressed={passwordVisible} onClick={() => setPasswordVisible(!passwordVisible)}><Icon name={passwordVisible ? 'eye' : 'eye-off'} /></button>
        </div>
      </div>
      <div className="form-options">
        <label className="remember-option"><input type="checkbox" name="remember" defaultChecked /><span className="checkbox-mark" aria-hidden="true"><Icon name="check" /></span><span>Recordarme en este dispositivo</span></label>
        <button className="text-link" type="button" onClick={() => onHelp('recover')}>¿Olvidaste tu contraseña?</button>
      </div>
      <button className="primary-button sign-in-button" type="submit" disabled={pending}><span>{pending ? 'Iniciando sesión…' : 'Iniciar sesión'}</span><Icon name="arrow" /></button>
    </form>
    <div className="or-divider"><span>o continúa con</span></div>
    <button className="google-button" type="button" disabled={pending} onClick={() => void submit()}><GoogleIcon /><span>Continuar con Google</span></button>
    <div className="register-divider"><span>¿No tienes cuenta?</span><button className="text-link" type="button" onClick={() => onHelp('register')}>Regístrate</button><span>aquí</span></div>
    {message && <p className="auth-message" role="status">{message}</p>}
  </section>;
}
