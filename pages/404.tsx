import Head from 'next/head'
import Link from 'next/link'

export default function NotFoundPage() {
  const pageTitle = 'Page non trouvée | metiers.numerique.gouv.fr'

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <main>
        <div className="fr-container fr-my-4w">
          <div className="fr-grid-row Header">
            <div className="fr-col-12 fr-col-md-5">
              <h1>Page introuvable…</h1>
              <p className="text-grey">
                Cette page n’existe pas ou plus,
                <br />
                voulez-vous <Link href="/">revenir à la page d’accueil ?</Link>
              </p>
            </div>
            <div className="fr-col-12 fr-col-offset-md-2 fr-col-md-5">
              <img alt="Page introuvable" src="/images/header-404.svg" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
