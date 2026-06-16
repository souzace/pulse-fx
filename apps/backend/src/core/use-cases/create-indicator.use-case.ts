export interface IndicatorRepository {
  createIndicator(
    code: string,
    name: string,
    source: string,
    frequency: string,
    description: string
  ): Promise<string>;
}

export interface CreateIndicatorInput {
  code: string;
  name: string;
  source: string;
  frequency: string;
  description: string;
}

export class CreateIndicatorUseCase {
  constructor(private readonly indicatorRepository: IndicatorRepository) {}

  async execute(input: CreateIndicatorInput): Promise<string> {
    const indicatorId = await this.indicatorRepository.createIndicator(
      input.code,
      input.name,
      input.source,
      input.frequency,
      input.description
    );

    return indicatorId;
  }
}