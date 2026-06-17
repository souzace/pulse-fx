import { BcbSgsProvider } from './bcb-sgs.provider';

describe('BcbSgsProvider', () => {
  let provider: BcbSgsProvider;

  beforeEach(() => {
    provider = new BcbSgsProvider();
    
    // Mock the global fetch API to prevent actual network calls during tests
    global.fetch = jest.fn();
  });

  afterEach(() => {
    // Clean up mocks after each test to avoid interference
    jest.resetAllMocks();
  });

  it('should fetch and map data from BCB SGS correctly', async () => {
    // Arrange: Mock a successful response from the external API
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue([
        { data: '15/06/2026', valor: '10.50' }
      ]),
    });

    // Act: Use the 'SELIC_META' test key defined in PROVIDER_CONFIG
    const result = await provider.fetchValues('SELIC_META', 1);

    // Assert: Verify the provider mapped the date format and parsed the value correctly
    expect(result).toEqual([
      { date: '2026-06-15', value: 10.5 }
    ]);

    // Assert: Verify the fetch call was made with the correct URL constructed from the config ID
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('bcdata.sgs.432/dados/ultimos/1?formato=json')
    );
  });

  it('should throw an error if the indicator code is not mapped in the configuration', async () => {
    // Act & Assert: Attempt to fetch a code that does not exist in PROVIDER_CONFIG.BCB
    await expect(provider.fetchValues('UNMAPPED_CODE')).rejects.toThrow(
      'Indicator code UNMAPPED_CODE not mapped to BCB series.'
    );

    // Ensure no network call was made since the validation should fail first
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should throw an error if the network request fails', async () => {
    // Arrange: Mock a failed network response (e.g., 404 or 500)
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    // Act & Assert: The provider should throw a generic fetch error
    await expect(provider.fetchValues('SELIC_META')).rejects.toThrow(
      'Failed to fetch data from BCB SGS for code SELIC_META'
    );
  });
});