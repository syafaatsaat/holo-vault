import { Outlet } from 'react-router'
import Footer from '../Footer/Footer.jsx'
import Navbar from '../Navbar/Navbar.jsx'
import ScrollManager from '../ScrollManager.jsx'
import VisitUs from '../VisitUs/VisitUs.jsx'
import styles from './Layout.module.css'

export default function Layout() {
  return (
    <>
      <ScrollManager />
      <a className={styles.skipLink} href="#main">
        Skip to content
      </a>
      <Navbar />
      <main id="main" tabIndex={-1} className={styles.main}>
        <Outlet />
      </main>
      <VisitUs />
      <Footer />
    </>
  )
}
