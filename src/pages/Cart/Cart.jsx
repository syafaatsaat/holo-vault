import PageBand from '../../components/PageBand/PageBand.jsx'

// Cart rows and the summary arrive in Phase 7.
export default function Cart() {
  return (
    <>
      <title>Cart · Holo Vault</title>
      <PageBand title="Your" highlight="cart.">
        Change quantities or remove cards before you visit the shop.
      </PageBand>
      <div className="dotted page-content" />
    </>
  )
}
