import type { SVGProps } from 'react';

type IconName = 'mail' | 'lock' | 'eye' | 'eye-off' | 'user' | 'arrow' | 'menu' | 'close' | 'check' | 'cart';
const paths: Record<IconName, string[]> = {
  cart: ['M3 3h2l2.5 12h11l2-8H6', 'M9 20a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z', 'M19 20a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z'],
  mail: ['M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z', 'm3 6 9 7 9-7'],
  lock: ['M6 10h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z', 'M8 10V6a4 4 0 0 1 8 0v4', 'M12 14v3'],
  eye: ['M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z', 'M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'],
  'eye-off': ['m3 3 18 18', 'M10.6 5.1 12 5c6.5 0 10 7 10 7a19 19 0 0 1-3.1 4', 'M6.2 6.2A19 19 0 0 0 2 12s3.5 7 10 7c1.9 0 3.5-.5 4.9-1.3', 'M9.9 9.9a3 3 0 0 0 4.2 4.2'],
  user: ['M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z', 'M4 21v-2a8 8 0 0 1 16 0v2'],
  arrow: ['M4 12h16', 'm14 6 6 6-6 6'],
  menu: ['M3 5h18', 'M3 12h18', 'M3 19h18'],
  close: ['m5 5 14 14', 'm5 19 14-14'],
  check: ['m4 12 5 5L20 6'],
};

export function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: IconName }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
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
