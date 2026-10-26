import { Outlet } from 'react-router'
import CardTrail from '../CardTrail/CardTrail.jsx'
import Footer from '../Footer/Footer.jsx'
import Navbar from '../Navbar/Navbar.jsx'
import ScrollManager from '../ScrollManager.jsx'
import VisitUs from '../VisitUs/VisitUs.jsx'
import styles from './Layout.module.css'

export default function Layout() {
  return (
    <div className={`dot-grid ${styles.app}`}>
      <ScrollManager />
      <a className={styles.skipLink} href="#main">
        Skip to content
      </a>
      <Navbar />
      <main id="main" tabIndex={-1} className={`dotted ${styles.main}`}>
        <Outlet />
      </main>
      <VisitUs />
      <Footer />
      <CardTrail />
    </div>
  )
}
