const threats = [
  { severity: 'CRITICAL', title: 'Suspicious authentication burst', source: '10.0.4.21', status: 'Investigating', time: '09:42:18' },
  { severity: 'CRITICAL', title: 'Credential probing activity', source: '10.0.5.44', status: 'Contained', time: '09:17:03' },
  { severity: 'HIGH', title: 'Outbound connection anomaly', source: '10.0.2.88', status: 'Investigating', time: '08:56:41' },
  { severity: 'MEDIUM', title: 'Repeated failed login attempts', source: '10.0.3.17', status: 'Monitoring', time: '08:31:26' },
];

export function Threats() {
  return (
    <section className="dashboard workspace-dashboard" aria-label="Threat monitoring">
      <div className="page-heading">
        <div><div className="eyebrow">THREAT INTELLIGENCE</div><h1>Threats</h1><p>Active detections and investigation state.</p></div>
        <div className="page-heading-status"><i className="sys-dot on" /> LIVE</div>
      </div>
      <div className="metric-grid">
        <article className="metric-card metric-danger"><div className="metric-label">ACTIVE</div><div className="metric-value">04</div><div className="metric-detail">2 critical</div></article>
        <article className="metric-card metric-primary"><div className="metric-label">INVESTIGATING</div><div className="metric-value">02</div><div className="metric-detail">analyst assigned</div></article>
        <article className="metric-card metric-success"><div className="metric-label">CONTAINED</div><div className="metric-value">18</div><div className="metric-detail">last 24h</div></article>
        <article className="metric-card metric-sky"><div className="metric-label">DETECTIONS</div><div className="metric-value">97.2%</div><div className="metric-detail">AI confidence</div></article>
      </div>
      <section className="panel">
        <div className="panel-head"><div><div className="eyebrow">DETECTION FEED</div><h2>Active threats</h2></div><span className="panel-live"><i className="sys-dot on" /> STREAMING</span></div>
        <div className="event-list">
          {threats.map((threat) => <article className="event-row threat-row" key={threat.title}><time>{threat.time}</time><span className={`threat-severity severity-${threat.severity.toLowerCase()}`}>{threat.severity}</span><div className="event-body"><strong>{threat.title}</strong><span>{threat.source} · {threat.status}</span></div></article>)}
        </div>
      </section>
    </section>
  );
}
