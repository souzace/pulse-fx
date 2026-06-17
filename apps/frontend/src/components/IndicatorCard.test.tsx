import '@testing-library/jest-dom/vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { IndicatorCard } from './IndicatorCard';

const mockIndicator = {
  id: '1',
  name: 'Selic',
  code: 'SELIC',
  lastValue: 10.5,
  referenceDate: '2026-06-15',
  source: 'BCB',
  frequency: 'Diária',
  description: 'Taxa de juros'
};

describe('IndicatorCard Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders indicator name and code', () => {
    render(
      <MemoryRouter>
        <IndicatorCard indicator={mockIndicator} />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Selic')).toBeInTheDocument();
    expect(screen.getByText(/SELIC/)).toBeInTheDocument();
  });

  it('renders value and date', () => {
    render(
      <MemoryRouter>
        <IndicatorCard indicator={mockIndicator} />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/10\.5/)).toBeInTheDocument();
    expect(screen.getByText(/2026-06-15/)).toBeInTheDocument();
  });
});