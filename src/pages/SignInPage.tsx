import { SignInCard } from '../features/auth/SignInCard';

export function SignInPage({ onHelp }: { onHelp: (action: 'register' | 'recover') => void }) {
  return <main className="sign-in-page" id="contenido">
    <picture className="hero-background" aria-hidden="true">
      <source media="(max-width: 900px), (max-width: 1150px) and (max-aspect-ratio: 3/4)" srcSet="/images/hero-mobile.webp" />
      <img src="/images/hero-desktop.webp" alt="" width="1672" height="941" fetchPriority="high" />
    </picture>
    <div className="hero-layout">
      <section className="welcome" aria-labelledby="welcome-title">
        <div className="welcome-copy">
          <h1 id="welcome-title"><span className="sr-only">Bienvenido al sabor de casa</span><img className="welcome-lettering" src="/images/welcome-lettering.webp" alt="" aria-hidden="true" width="2172" height="724" /></h1>
          <p><span>Más que un pollo a la brasa,</span><span>es una tradición que nos une.</span></p>
        </div>
      </section>
      <SignInCard onHelp={onHelp} />
    </div>
  </main>;
}
