import type { SVGProps } from 'react';

type IconName = 'mail' | 'lock' | 'eye' | 'eye-off' | 'user' | 'arrow' | 'menu' | 'close' | 'check';
const paths: Record<IconName, string[]> = {
  mail: ['M4 5h16v14H4z', 'm4 6 8 7 8-7'],
  lock: ['M5 10h14v11H5z', 'M8 10V6a4 4 0 0 1 8 0v4', 'M12 14v3'],
  eye: ['M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z', 'M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'],
  'eye-off': ['m3 21 18-18', 'M9.6 5.3A11 11 0 0 1 12 5c6.5 0 10 7 10 7a18 18 0 0 1-3.2 4.2', 'M6.4 6.4A19 19 0 0 0 2 12s3.5 7 10 7c1.8 0 3.4-.5 4.8-1.3', 'M10 14a3 3 0 0 1 4-4'],
  user: ['M18 7a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z', 'M2 23v-2a10 10 0 0 1 20 0v2Z'],
  arrow: ['M2 12h19', 'm14 4 8 8-8 8'],
  menu: ['M3 5h18', 'M3 12h18', 'M3 19h18'],
  close: ['m5 5 14 14', 'm5 19 14-14'],
  check: ['m4 12 5 5L20 6'],
};

export function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: IconName }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    {paths[name].map((d) => <path key={d} d={d} />)}
  </svg>;
}

export function GoogleIcon() {
  return <svg className="google-icon" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.7-.4-4H24v7.7h11a9.4 9.4 0 0 1-4.1 6.2v5h6.6c3.9-3.5 6.1-8.7 6.1-14.9Z" />
    <path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5A12.3 12.3 0 0 1 12.6 28H5.8v5.2A20.3 20.3 0 0 0 24 44Z" />
    <path fill="#FBBC05" d="M12.6 28a12 12 0 0 1 0-8v-5.2H5.8a20 20 0 0 0 0 18.4l6.8-5.2Z" />
    <path fill="#EA4335" d="M24 12c3 0 5.7 1 7.9 3.1l5.9-5.9A20 20 0 0 0 5.8 14.8l6.8 5.2A12 12 0 0 1 24 12Z" />
  </svg>;
}
