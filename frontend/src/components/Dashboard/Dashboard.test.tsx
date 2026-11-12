import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Dashboard } from './Dashboard';
import { Workspace } from '../Workspace/Workspace';
import { Shell } from '../Shell/Shell';

describe('Důvěryhodnost zobrazovaných dat', () => {
  it('Overview nepředstírá připojené senzory', () => {
    render(<Dashboard />);

    expect(screen.getByText(/Žádná skutečná telemetrie/)).toBeTruthy();
    expect(screen.getByText('NO TELEMETRY')).toBeTruthy();
    expect(screen.queryByText('97.2%')).toBeNull();
    expect(screen.queryByText('12 / 12')).toBeNull();
  });

  it('Deception hlásí nepřipojený zdroj', () => {
    render(<Workspace view="Deception" />);
    expect(screen.getByText(/Nejsou připojená žádná ověřená data/)).toBeTruthy();
  });

  it('Shell nepředstírá živý provoz', () => {
    render(<Shell><div>Obsah</div></Shell>);
    expect(screen.getByText('DEMO MODE')).toBeTruthy();
    expect(screen.getByText(/No deception sensors connected/)).toBeTruthy();
  });
});
