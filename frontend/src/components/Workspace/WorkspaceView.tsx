type WorkspaceViewProps = {
  title: string;
  eyebrow: string;
  description: string;
};

const rows = [
  { label: 'Detection pipeline', value: 'ACTIVE' },
  { label: 'Telemetry stream', value: 'STREAMING' },
  { label: 'Analysis queue', value: 'READY' },
  { label: 'Last evaluation', value: '2s ago' },
];

export function WorkspaceView({ title, eyebrow, description }: WorkspaceViewProps) {
  return (
    <section className="dashboard" aria-label={title}>
      <div className="page-heading">
        <div>
          <div className="eyebrow">{eyebrow}</div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <div className="page-heading-status"><i className="sys-dot on" /> LIVE</div>
      </div>

      <div className="metric-grid">
        <article className="metric-card metric-primary"><div className="metric-label">STATUS</div><div className="metric-value">READY</div><div className="metric-detail">Operational</div></article>
        <article className="metric-card metric-success"><div className="metric-label">SIGNALS</div><div className="metric-value">128</div><div className="metric-detail">Last 24 hours</div></article>
        <article className="metric-card metric-sky"><div className="metric-label">ANALYSIS</div><div className="metric-value">97.2%</div><div className="metric-detail">Current confidence</div></article>
        <article className="metric-card metric-primary"><div className="metric-label">NODES</div><div className="metric-value">12</div><div className="metric-detail">Healthy</div></article>
      </div>

      <section className="panel">
        <div className="panel-head">
          <div>
            <div className="eyebrow">CURRENT STATE</div>
            <h2>Operational status</h2>
          </div>
          <span className="panel-live"><i className="sys-dot on" /> LIVE</span>
        </div>
        <div className="health-list">
          {rows.map((row) => (
            <div className="health-row" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
              <i className="sys-dot on" />
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
