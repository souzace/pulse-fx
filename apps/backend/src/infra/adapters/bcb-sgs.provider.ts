import { ExternalIndicatorProvider, IndicatorObservation } from '../../core/ports/external-indicator.provider';
import { PROVIDER_CONFIG } from '../../config/providers.config';

interface BcbSgsResponse {
  data: string;
  valor: string;
}

export class BcbSgsProvider implements ExternalIndicatorProvider {
  async fetchValues(code: string, limit: number = 10): Promise<IndicatorObservation[]> {
    // Access the BCB namespace from the provider configuration
    const mapping = PROVIDER_CONFIG.BCB[code as keyof typeof PROVIDER_CONFIG.BCB];

    if (!mapping) {
      throw new Error(`Indicator code ${code} not mapped to BCB series.`);
    }

    // Use the mapped ID for the API request
    const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${mapping.id}/dados/ultimos/${limit}?formato=json`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from BCB SGS for code ${code}`);
    }

    const data = await response.json() as BcbSgsResponse[];

    return data.map(item => {
      const [day, month, year] = item.data.split('/');
      return {
        date: `${year}-${month}-${day}`,
        value: parseFloat(item.valor),
      };
    });
  }
}