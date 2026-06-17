import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { IndicatorDetails } from './IndicatorDetails';
import { api } from '../infra/http/api';

vi.mock('../infra/http/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('IndicatorDetails Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  const renderComponent = (id = '123') => {
    return render(
      <MemoryRouter initialEntries={[`/indicator/${id}`]}>
        <Routes>
          <Route path="/indicator/:id" element={<IndicatorDetails />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('should display the initial loading message', () => {
    (api.get as any).mockImplementation(() => new Promise(() => {}));
    
    renderComponent();
    
    expect(screen.getByText('A carregar dados...')).toBeDefined();
  });

  it('should display an empty data message when the API returns an empty array', async () => {
    (api.get as any).mockResolvedValue({ data: [] });
    
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Sem dados de histórico disponíveis.')).toBeDefined();
    });
  });

  it('should render the history table when the API returns data', async () => {
    const mockData = [
      { date: '2026-06-01', value: 5.10 },
      { date: '2026-06-02', value: 5.15 }
    ];
    
    (api.get as any).mockResolvedValue({ data: mockData });
    
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Histórico do Indicador')).toBeDefined();
    });

    expect(screen.getByText('2026-06-01')).toBeDefined();
    expect(screen.getByText('5.1')).toBeDefined();
  });

  it('should contain a back link to the dashboard with the correct route', async () => {
    // Fornece dados validos para evitar o retorno prematuro do componente
    (api.get as any).mockResolvedValue({ data: [{ date: '2026-06-01', value: 5.10 }] });
    
    renderComponent();
    
    await waitFor(() => {
      const link = screen.getByRole('link', { name: /Voltar para Dashboard/i });
      expect(link).toBeDefined();
      expect(link.getAttribute('href')).toBe('/');
    });
  });

  it('should render the limitations disclaimer text', async () => {
    (api.get as any).mockResolvedValue({ data: [{ date: '2026-06-01', value: 5.10 }] });
    
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText(/Aviso de Limitações:/)).toBeDefined();
    });
  });
});