const threats: Array<{ severity: string; title: string; source: string; status: string; time: string }> = [];

export function Threats() {
  return (
    <section className="dashboard workspace-dashboard" aria-label="Threat monitoring">
      <div className="page-heading">
        <div><div className="eyebrow">THREAT INTELLIGENCE</div><h1>Threats</h1><p>Active detections and investigation state.</p></div>
        <div className="page-heading-status"><i className="sys-dot on" /> NO TELEMETRY</div>
      </div>
      <div className="metric-grid">
        <article className="metric-card metric-danger"><div className="metric-label">ACTIVE</div><div className="metric-value">—</div><div className="metric-detail">Not connected</div></article>
        <article className="metric-card metric-primary"><div className="metric-label">INVESTIGATING</div><div className="metric-value">—</div><div className="metric-detail">Not connected</div></article>
        <article className="metric-card metric-success"><div className="metric-label">CONTAINED</div><div className="metric-value">—</div><div className="metric-detail">Not connected</div></article>
        <article className="metric-card metric-sky"><div className="metric-label">DETECTIONS</div><div className="metric-value">—</div><div className="metric-detail">Not connected</div></article>
      </div>
      <section className="panel">
        <div className="panel-head"><div><div className="eyebrow">DETECTION FEED</div><h2>Active threats</h2></div><span className="panel-live"><i className="sys-dot on" /> NO DATA</span></div>
        <div className="event-list">
          {threats.length === 0 && <p className="empty-telemetry">Žádné připojené detekční zdroje.</p>}
          {threats.map((threat) => <article className="event-row threat-row" key={threat.title}><time>{threat.time}</time><span className={`threat-severity severity-${threat.severity.toLowerCase()}`}>{threat.severity}</span><div className="event-body"><strong>{threat.title}</strong><span>{threat.source} · {threat.status}</span></div></article>)}
        </div>
      </section>
    </section>
  );
}
