import '@testing-library/jest-dom/vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { IndicatorCard } from './IndicatorCard';

const mockIndicator = {
  id: '1',
  name: 'Selic',
  code: 'SELIC',
  source: 'BCB',
  frequency: 'daily',
  description: 'Taxa Selic',
  currentValue: 10.5, 
  lastDate: '2026-06-15',
  variation: 0.5
};

describe('IndicatorCard Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render indicator name and code', () => {
    render(
      <MemoryRouter>
        <IndicatorCard indicator={mockIndicator} />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Selic')).toBeInTheDocument();
    expect(screen.getByText(/SELIC/)).toBeInTheDocument();
  });

  it('should render value and date', () => {
    render(
      <MemoryRouter>
        <IndicatorCard indicator={mockIndicator} />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/10\.5/)).toBeInTheDocument();
    expect(screen.getByText(/2026-06-15/)).toBeInTheDocument();
  });

  it('should render positive variation percentage', () => {
    render(
      <MemoryRouter>
        <IndicatorCard indicator={mockIndicator} />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/0\.5%/)).toBeInTheDocument();
  });

  it('should render negative variation percentage', () => {
    const negativeIndicator = { ...mockIndicator, variation: -0.2 };
    render(
      <MemoryRouter>
        <IndicatorCard indicator={negativeIndicator} />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/-0\.2%/)).toBeInTheDocument();
  });

  it('should contain a navigation link to the correct details route', () => {
    render(
      <MemoryRouter>
        <IndicatorCard indicator={mockIndicator} />
      </MemoryRouter>
    );
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/indicator/1');
  });
});