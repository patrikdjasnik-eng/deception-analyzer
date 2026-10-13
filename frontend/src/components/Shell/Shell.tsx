import { ReactNode, useMemo, useState } from 'react';

import { WorkspaceView } from '../Workspace/Workspace';

type NavigationItem = {
  label: WorkspaceView;
  icon: string;
  count?: string;
  countClass?: string;
};

type ShellProps = {
  children: ReactNode;
  onNavigate?: (view: WorkspaceView) => void;
  onLogout?: () => void;
};

const primaryNavigation: NavigationItem[] = [
  { label: 'Overview', icon: '⌂' },
  { label: 'Threats', icon: '△', count: '4', countClass: 'nc-da' },
  { label: 'Deception', icon: '◈', count: '2', countClass: 'nc-am' },
  { label: 'Network', icon: '⌁' },
  { label: 'Telemetry', icon: '◌' },
];

const secondaryNavigation: NavigationItem[] = [
  { label: 'AI Analyst', icon: '✦', count: 'AI', countClass: 'nc-p' },
  { label: 'Reports', icon: '▤' },
  { label: 'Settings', icon: '⚙' },
];

export function Shell({ children, onNavigate, onLogout }: ShellProps) {
  const [activeItem, setActiveItem] = useState<WorkspaceView>('Overview');
  const [notifications, setNotifications] = useState(4);

  const breadcrumb = useMemo(() => activeItem.toUpperCase(), [activeItem]);

  const navigate = (view: WorkspaceView) => {
    setActiveItem(view);
    onNavigate?.(view);
  };

  return (
    <div className="shell">
      <aside className="rail" aria-label="Primary navigation">
        <button className="rail-logo" type="button" aria-label="RabbitHollow home" onClick={() => navigate('Overview')}>🐇</button>
        {primaryNavigation.map((item) => (
          <button className={`rail-btn${activeItem === item.label ? ' active' : ''}`} data-tip={item.label} key={item.label} type="button" onClick={() => navigate(item.label)}>
            <span aria-hidden="true">{item.icon}</span>
            {item.count && <span className="dot" aria-hidden="true" />}
          </button>
        ))}
        <div className="rail-sep" />
        {secondaryNavigation.map((item) => (
          <button className={`rail-btn${activeItem === item.label ? ' active' : ''}`} data-tip={item.label} key={item.label} type="button" onClick={() => navigate(item.label)}>
            <span aria-hidden="true">{item.icon}</span>
          </button>
        ))}
        <button className="rail-avatar" type="button" aria-label="User profile">P</button>
      </aside>

      <aside className="sidebar">
        <div className="sidebar-head">
          <div className="sidebar-head-label">Workspace</div>
          <div className="sidebar-head-title">RabbitHollow // Secure</div>
        </div>
        <nav aria-label="Workspace navigation">
          <div className="nav-group">
            <div className="nav-group-label">Monitor</div>
            {primaryNavigation.map((item) => (
              <button className={`nav-item${activeItem === item.label ? ' active' : ''}`} key={item.label} type="button" onClick={() => navigate(item.label)}>
                <span aria-hidden="true">{item.icon}</span><span>{item.label}</span>
                {item.count && <span className={`nav-count ${item.countClass ?? ''}`}>{item.count}</span>}
              </button>
            ))}
          </div>
          <div className="nav-group">
            <div className="nav-group-label">Operate</div>
            {secondaryNavigation.map((item) => (
              <button className={`nav-item${activeItem === item.label ? ' active' : ''}`} key={item.label} type="button" onClick={() => navigate(item.label)}>
                <span aria-hidden="true">{item.icon}</span><span>{item.label}</span>
                {item.count && <span className={`nav-count ${item.countClass ?? ''}`}>{item.count}</span>}
              </button>
            ))}
          </div>
        </nav>
        <div className="sidebar-footer">
          <div className="sys-row"><span className="sys-label">LLM</span><span className="sys-val"><i className="sys-dot on" /> Qwen 2.5</span></div>
          <div className="sys-row"><span className="sys-label">Sandbox</span><span className="sys-val"><i className="sys-dot on" /> Ready</span></div>
          <div className="sys-row"><span className="sys-label">Alerts</span><span className="sys-val">{notifications}</span></div>
        </div>
      </aside>

      <header className="topbar">
        <div className="topbar-breadcrumb"><span>RABBITHOLLOW</span><span className="bc-sep">/</span><span>{breadcrumb}</span></div>
        <div className="alert-ticker" aria-label="Security alerts"><div className="ticker-inner">
          <span className="ticker-item"><i className="ticker-dot" /> Deception sensor online</span>
          <span className="ticker-item"><i className="ticker-dot" /> Network telemetry nominal</span>
          <span className="ticker-item"><i className="ticker-dot" /> AI analyst ready</span>
        </div></div>
        <div className="topbar-right">
          <div className="status-capsule sc-ok"><i className="sc-dot" /> SYSTEM ONLINE</div>
          <div className="status-capsule sc-warn"><i className="sc-dot pulse" /> {notifications} ALERTS</div>
          <button className="topbar-icon" type="button" aria-label="Notifications" onClick={() => setNotifications(0)}>♢</button>
          <button className="topbar-icon" type="button" aria-label="Odhlásit" title="Odhlásit" onClick={onLogout}>↪</button>
          <div className="topbar-clock">LOCAL</div>
        </div>
      </header>

      <main className="main">{children}</main>
    </div>
  );
}
