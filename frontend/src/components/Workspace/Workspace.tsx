import { useMemo } from 'react';

export type WorkspaceView = 'Overview' | 'Threats' | 'Deception' | 'Network' | 'Telemetry' | 'AI Analyst' | 'Reports' | 'Settings';

type WorkspaceProps = {
  view: WorkspaceView;
};

const viewContent: Record<WorkspaceView, { eyebrow: string; title: string; description: string }> = {
  Overview: {
    eyebrow: 'SECURITY OPERATIONS',
    title: 'Overview',
    description: 'Deception intelligence and network security status.',
  },
  Threats: {
    eyebrow: 'THREAT INTELLIGENCE',
    title: 'Threats',
    description: 'Active threats, severity and investigation status.',
  },
  Deception: {
    eyebrow: 'DECEPTION NETWORK',
    title: 'Deception',
    description: 'Honeypots, decoys and attacker interactions.',
  },
  Network: {
    eyebrow: 'NETWORK TELEMETRY',
    title: 'Network',
    description: 'Network activity, connections and anomalies.',
  },
  Telemetry: {
    eyebrow: 'ENDPOINT TELEMETRY',
    title: 'Telemetry',
    description: 'Endpoint signals and sensor health.',
  },
  'AI Analyst': {
    eyebrow: 'LOCAL INTELLIGENCE',
    title: 'AI Analyst',
    description: 'Local Qwen analysis and security investigation assistant.',
  },
  Reports: {
    eyebrow: 'SECURITY REPORTING',
    title: 'Reports',
    description: 'Security reports, findings and scheduled analysis.',
  },
  Settings: {
    eyebrow: 'SYSTEM CONFIGURATION',
    title: 'Settings',
    description: 'Application, LLM and security configuration.',
  },
};

export function Workspace({ view }: WorkspaceProps) {
  const content = useMemo(() => viewContent[view], [view]);

  return (
    <section className="workspace" aria-label={`${content.title} workspace`}>
      <div className="page-heading">
        <div>
          <div className="eyebrow">{content.eyebrow}</div>
          <h1>{content.title}</h1>
          <p>{content.description}</p>
        </div>
        <div className="page-heading-status"><i className="sys-dot on" /> LIVE</div>
      </div>

      {view === 'Overview' ? (
        <div className="workspace-placeholder">Overview dashboard</div>
      ) : (
        <div className="workspace-placeholder">
          <span>{content.title}</span>
          <small>Workspace připravený pro napojení na živá data.</small>
        </div>
      )}
    </section>
  );
}
