const metrics = [
  { label: 'ACTIVE THREATS', value: '04', detail: '2 critical', className: 'metric-danger' },
  { label: 'DECEPTION NODES', value: '12', detail: 'all healthy', className: 'metric-primary' },
  { label: 'NETWORK EVENTS', value: '1,284', detail: '+8.4% / 24h', className: 'metric-sky' },
  { label: 'AI CONFIDENCE', value: '97.2%', detail: 'Qwen 2.5 Coder', className: 'metric-success' },
];

const events = [
  { time: '09:42:18', type: 'THREAT', title: 'Suspicious authentication burst', source: '10.0.4.21', level: 'critical' },
  { time: '09:39:07', type: 'DECEPTION', title: 'Honeypot interaction detected', source: '10.0.7.13', level: 'warning' },
  { time: '09:34:52', type: 'NETWORK', title: 'Outbound connection anomaly', source: '10.0.2.88', level: 'warning' },
  { time: '09:28:31', type: 'TELEMETRY', title: 'Endpoint heartbeat received', source: 'sensor-07', level: 'normal' },
];

export function Dashboard() {
  return (
    <section className="dashboard" aria-label="Security overview">
      <div className="page-heading">
        <div>
          <div className="eyebrow">SECURITY OPERATIONS</div>
          <h1>Overview</h1>
          <p>Deception intelligence and network security status.</p>
        </div>
        <div className="page-heading-status"><i className="sys-dot on" /> LIVE</div>
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
            <span className="panel-live"><i className="sys-dot on" /> STREAMING</span>
          </div>
          <div className="event-list">
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
            <div className="health-row"><span>Network sensors</span><strong>12 / 12</strong><i className="sys-dot on" /></div>
            <div className="health-row"><span>Deception nodes</span><strong>12 / 12</strong><i className="sys-dot on" /></div>
            <div className="health-row"><span>AI analyst</span><strong>READY</strong><i className="sys-dot on" /></div>
            <div className="health-row"><span>Sandbox</span><strong>READY</strong><i className="sys-dot on" /></div>
          </div>
          <div className="posture-score">
            <span>POSTURE SCORE</span>
            <strong>94</strong>
            <small>/ 100</small>
          </div>
        </section>
      </div>
    </section>
  );
}
