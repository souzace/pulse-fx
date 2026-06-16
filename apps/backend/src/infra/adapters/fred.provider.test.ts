import { FredProvider } from './fred.provider';

global.fetch = jest.fn();

describe('FredProvider', () => {
  const apiKey = 'test_key';
  let provider: FredProvider;

  beforeEach(() => {
    provider = new FredProvider(apiKey);
    jest.clearAllMocks();
  });

  it('should fetch and map data from FRED correctly, ignoring "." values', async () => {
    const mockResponse = {
      observations: [
        { date: '2026-06-01', value: '5.25' },
        { date: '2026-06-02', value: '.' },
        { date: '2026-06-03', value: '5.50' }
      ]
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await provider.fetchValues('FEDFUNDS', 3);

    expect(global.fetch).toHaveBeenCalledWith(
      `https://api.stlouisfed.org/fred/series/observations?series_id=FEDFUNDS&api_key=${apiKey}&file_type=json&sort_order=desc&limit=3`
    );
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ date: '2026-06-01', value: 5.25 });
    expect(result[1]).toEqual({ date: '2026-06-03', value: 5.50 });
  });

  it('should throw an error if the request fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    await expect(provider.fetchValues('FEDFUNDS')).rejects.toThrow(
      'Failed to fetch data from FRED for code FEDFUNDS'
    );
  });
});