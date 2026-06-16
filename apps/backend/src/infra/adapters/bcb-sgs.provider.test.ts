import { BcbSgsProvider } from './bcb-sgs.provider';

global.fetch = jest.fn();

describe('BcbSgsProvider', () => {
  let provider: BcbSgsProvider;

  beforeEach(() => {
    provider = new BcbSgsProvider();
    jest.clearAllMocks();
  });

  it('should fetch and map data from BCB SGS correctly', async () => {
    const mockResponse = [
      { data: '15/06/2026', valor: '10.5' },
      { data: '16/06/2026', valor: '10.6' }
    ];

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await provider.fetchValues('432', 2);

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/2?formato=json'
    );
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ date: '2026-06-15', value: 10.5 });
    expect(result[1]).toEqual({ date: '2026-06-16', value: 10.6 });
  });

  it('should throw an error if the request fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    await expect(provider.fetchValues('432')).rejects.toThrow(
      'Failed to fetch data from BCB SGS for code 432'
    );
  });
});