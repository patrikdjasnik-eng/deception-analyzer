const metrics = [
  { label: 'ACTIVE THREATS', value: '—', detail: 'Žádné připojené senzory', className: 'metric-danger' },
  { label: 'DECEPTION NODES', value: '—', detail: 'Nepřipojeno', className: 'metric-primary' },
  { label: 'NETWORK EVENTS', value: '—', detail: 'Telemetrie není dostupná', className: 'metric-sky' },
  { label: 'AI STATUS', value: '—', detail: 'Lokální model neověřen', className: 'metric-success' },
];

const events: Array<{
  time: string;
  type: string;
  title: string;
  source: string;
  level: string;
}> = [];

export function Dashboard() {
  return (
    <section className="dashboard" aria-label="Security overview">
      <div className="page-heading">
        <div>
          <div className="eyebrow">SECURITY OPERATIONS</div>
          <h1>Overview</h1>
          <p>Deception intelligence and network security status.</p>
        </div>
        <div className="page-heading-status"><i className="sys-dot on" /> NO TELEMETRY</div>
      </div>

      <div className="metric-grid">
        {metrics.map((metric) => (
          <article className={`metric-card ${metric.className}`} key={metric.label}>
            <div className="metric-label">{metric.label}</div>
            <div className="metric-value">{metric.value}</div>
            <div className="metric-detail">{metric.detail}</div>
          </article>
        ))}
      </div>

      <div className="dashboard-grid">
        <section className="panel panel-events">
          <div className="panel-head">
            <div>
              <div className="eyebrow">LIVE FEED</div>
              <h2>Security events</h2>
            </div>
            <span className="panel-live"><i className="sys-dot on" /> NO DATA</span>
          </div>
          <div className="event-list">
            {events.length === 0 && <p className="empty-telemetry">Žádná skutečná telemetrie. Nejprve připoj izolovaný honeypot nebo ingest logů.</p>}
            {events.map((event) => (
              <article className="event-row" key={`${event.time}-${event.title}`}>
                <time>{event.time}</time>
                <span className={`event-level event-${event.level}`} />
                <div className="event-body">
                  <strong>{event.title}</strong>
                  <span>{event.type} · {event.source}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="panel panel-posture">
          <div className="panel-head">
            <div>
              <div className="eyebrow">SECURITY POSTURE</div>
              <h2>System health</h2>
            </div>
          </div>
          <div className="health-list">
            <div className="health-row"><span>Network sensors</span><strong>NOT CONNECTED</strong><i className="sys-dot on" /></div>
            <div className="health-row"><span>Deception nodes</span><strong>NOT CONNECTED</strong><i className="sys-dot on" /></div>
            <div className="health-row"><span>AI analyst</span><strong>NOT VERIFIED</strong><i className="sys-dot on" /></div>
            <div className="health-row"><span>Sandbox</span><strong>READY</strong><i className="sys-dot on" /></div>
          </div>
          <div className="posture-score">
            <span>POSTURE SCORE</span>
            <strong>—</strong>
            <small>/ 100</small>
          </div>
        </section>
      </div>
    </section>
  );
}
