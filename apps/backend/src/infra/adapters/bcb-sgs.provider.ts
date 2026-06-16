import { ExternalIndicatorProvider, IndicatorObservation } from '../../core/ports/external-indicator.provider';

interface BcbSgsResponse {
  data: string;
  valor: string;
}

export class BcbSgsProvider implements ExternalIndicatorProvider {
  async fetchValues(code: string, limit: number = 10): Promise<IndicatorObservation[]> {
    const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${code}/dados/ultimos/${limit}?formato=json`;
    
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