export default function KitchenHeader({ search, onSearchChange, soundEnabled, onToggleSound }) {
  return <header className="kitchen-navbar">
    <a href="/kitchen" className="kitchen-brand" aria-label="Urban Table kitchen home">
      <span className="kitchen-brand-mark">UT</span>
      <span className="kitchen-brand-copy"><strong>Urban Table</strong><small>KITCHEN OPERATIONS</small></span>
    </a>
    <div className="kitchen-nav-right">
      <label className="kitchen-search"><span aria-hidden="true">⌕</span><input type="search" placeholder="Search order, table, dish..." value={search} onChange={e => onSearchChange(e.target.value)} aria-label="Search orders" /></label>
      <button className={`sound-toggle ${soundEnabled ? "is-enabled" : ""}`} type="button" onClick={onToggleSound} title="Visual prototype only; sound notifications are not connected">{soundEnabled ? "♫ Sound on" : "♪ Sound off"}</button>
      <div className="chef-avatar" title="Kitchen staff">K</div>
    </div>
  </header>;
}
