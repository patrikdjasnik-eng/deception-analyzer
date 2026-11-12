import { useMemo } from 'react';

export type WorkspaceView = 'Overview' | 'Threats' | 'Deception' | 'Network' | 'Telemetry' | 'AI Analyst' | 'Reports' | 'Settings';

type WorkspaceProps = {
  view: WorkspaceView;
  onOpenChat?: () => void;
};

const viewContent: Record<WorkspaceView, { eyebrow: string; title: string; description: string }> = {
  Overview: { eyebrow: 'SECURITY OPERATIONS', title: 'Overview', description: 'Deception intelligence and network security status.' },
  Threats: { eyebrow: 'THREAT INTELLIGENCE', title: 'Threats', description: 'Active threats, severity and investigation status.' },
  Deception: { eyebrow: 'DECEPTION NETWORK', title: 'Deception', description: 'Honeypots, decoys and attacker interactions.' },
  Network: { eyebrow: 'NETWORK TELEMETRY', title: 'Network', description: 'Network activity, connections and anomalies.' },
  Telemetry: { eyebrow: 'ENDPOINT TELEMETRY', title: 'Telemetry', description: 'Endpoint signals and sensor health.' },
  'AI Analyst': { eyebrow: 'LOCAL INTELLIGENCE', title: 'AI Analyst', description: 'Local Qwen analysis and security investigation assistant.' },
  Reports: { eyebrow: 'SECURITY REPORTING', title: 'Reports', description: 'Security reports, findings and scheduled analysis.' },
  Settings: { eyebrow: 'SYSTEM CONFIGURATION', title: 'Settings', description: 'Application, LLM and security configuration.' },
};

const sampleRows: Record<Exclude<WorkspaceView, 'Overview' | 'AI Analyst'>, string[]> = {
  Threats: [],
  Deception: [],
  Network: [],
  Telemetry: [],
  Reports: [],
  Settings: [],
};

export function Workspace({ view, onOpenChat }: WorkspaceProps) {
  const content = useMemo(() => viewContent[view], [view]);

  if (view === 'Overview') return null;

  if (view === 'AI Analyst') {
    return (
      <section className="workspace" aria-label="AI Analyst workspace">
        <div className="page-heading">
          <div><div className="eyebrow">{content.eyebrow}</div><h1>{content.title}</h1><p>{content.description}</p></div>
          <div className="page-heading-status"><i className="sys-dot on" /> NOT VERIFIED</div>
        </div>
        <div className="workspace-card ai-workspace-card">
          <div><span className="workspace-icon">✦</span><h2>Local AI Analyst</h2><p>Verify the configured Ollama model before starting an investigation.</p></div>
          <button className="primary-action" type="button" onClick={onOpenChat}>Open AI Analyst</button>
        </div>
      </section>
    );
  }

  return (
    <section className="workspace" aria-label={`${content.title} workspace`}>
      <div className="page-heading">
        <div><div className="eyebrow">{content.eyebrow}</div><h1>{content.title}</h1><p>{content.description}</p></div>
        <div className="page-heading-status"><i className="sys-dot on" /> NO TELEMETRY</div>
      </div>
      <section className="panel workspace-table-panel">
        <div className="panel-head"><div><div className="eyebrow">LIVE DATA</div><h2>{content.title} activity</h2></div><span className="panel-live"><i className="sys-dot on" /> NO DATA</span></div>
        <div className="workspace-rows">
          {sampleRows[view].length === 0 && <p className="empty-telemetry">Nejsou připojená žádná ověřená data pro tento pohled.</p>}
          {sampleRows[view].map((row, index) => (
            <div className="workspace-row" key={row}>
              <span className={`event-level ${index === 0 && view === 'Threats' ? 'event-critical' : 'event-normal'}`} />
              <strong>{row}</strong>
              <span className="row-status">{view === 'Threats' && index === 0 ? 'INVESTIGATE' : 'NORMAL'}</span>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
