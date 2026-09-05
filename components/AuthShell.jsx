import Link from "next/link";

const performanceImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCKZU2IEHPs4vsAjiNglZYhioIjnzF5XEEvIBHiuuZ73kSlYrONE001yx_zCf9mwx8p1tqUX5uHZrsUCACHgtuq6Y-qio-8-8AmG0qZoHLx2Oe2rTusAekGKl77xu2JGXcdK9xH2sx1Sv7dmO951uIt7C0QvPiPEufYlpsGwxdWBB1oqy1cxEV7wA-2-1iePzCtvajQ7HstwUgebP0GHuuFM9QBdwbLSLcTxYA75il4wTACZjk_FZNE0l3283F2-biQ";

export default function AuthShell({ mode, children, error, submitting, onSubmit }) {
  const isLogin = mode === "login";

  return (
    <main className="auth-page">
      <section className="auth-hero" style={{ "--auth-image": `url(${performanceImage})` }}>
        <Link href="/" className="auth-mark auth-mark-hero">TUB</Link>
        <div className="auth-hero-copy">
          <p className="auth-kicker">TAMASHA HUB / 01</p>
          <h1>Join the atmosphere</h1>
          <p>Step into a world of exclusive events and vibrant nightlife. Your next unforgettable experience is just an account away.</p>
        </div>
      </section>

      <section className="auth-stage">
        <Link href="/" className="auth-mark auth-mark-mobile">TUB</Link>
        <div className="auth-card">
          <nav className="auth-tabs" aria-label="Account access">
            <Link className={isLogin ? "active" : ""} href="/login">Sign in</Link>
            <Link className={!isLogin ? "active" : ""} href="/register">Create account</Link>
          </nav>

          <div className="auth-intro">
            <p className="auth-kicker">{isLogin ? "WELCOME BACK" : "START YOUR JOURNEY"}</p>
            <h2>{isLogin ? "Return to the night." : "Find your people."}</h2>
          </div>

          <form className="auth-form" onSubmit={onSubmit}>
            {children}
            {error && <p className="auth-error" role="alert">{error}</p>}
            <button className="auth-submit" type="submit" disabled={submitting}>
              {submitting ? "Please wait..." : isLogin ? "Sign in" : "Create account"}
              <span aria-hidden="true">-&gt;</span>
            </button>
          </form>

          <div className="auth-divider"><span>or continue with</span></div>
          <div className="auth-socials">
            <button type="button" aria-label="Continue with Google"><strong>G</strong><span>Google</span></button>
            <button type="button" aria-label="Continue with Apple"><strong></strong><span>Apple</span></button>
          </div>
        </div>
        <p className="auth-footnote">By continuing, you agree to our <a href="#terms">terms of use</a> and <a href="#privacy">privacy policy</a>.</p>
      </section>
    </main>
  );
}