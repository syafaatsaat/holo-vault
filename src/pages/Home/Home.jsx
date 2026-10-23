import PageBand from '../../components/PageBand/PageBand.jsx'

// Placeholder; the welcome screen, pack tear and top cards arrive in Phase 8.
export default function Home() {
  return (
    <>
      <title>Holo Vault · Pokémon TCG singles at market price</title>
      <PageBand title="Welcome to Holo Vault" />
      <div className="dotted page-content">
        <section id="about" aria-labelledby="about-title" style={{ scrollMarginTop: 'var(--nav-offset)' }}>
          <h2 id="about-title">A card shop built for collectors</h2>
        </section>
      </div>
    </>
  )
}
