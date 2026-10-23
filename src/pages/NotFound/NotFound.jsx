import { Link } from 'react-router'

export default function NotFound() {
  return (
    <>
      <title>Page not found · Holo Vault</title>
      <h1>This page got away</h1>
      <p>We couldn't find the page you were looking for.</p>
      <p>
        <Link to="/shop">Browse the shop</Link> or <Link to="/">go back home</Link>.
      </p>
    </>
  )
}
