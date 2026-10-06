import { SignInCard } from '../features/auth/SignInCard';

export function SignInPage({ onHelp }: { onHelp: (action: 'register' | 'recover') => void }) {
  return <main className="sign-in-page" id="contenido">
    <picture className="hero-background" aria-hidden="true">
      <source media="(max-width: 900px), (max-width: 1150px) and (max-aspect-ratio: 3/4)" srcSet="https://res.cloudinary.com/y08rn1qr/image/upload/v1791327513/dae531a5-70f8-4f49-aff5-1ea88aaac133.png" />
      <img src="https://res.cloudinary.com/y08rn1qr/image/upload/v1791327573/b4146a7f-588e-484e-bdea-040ffa4a6796.png" alt="" width="1672" height="941" fetchPriority="high" />
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
