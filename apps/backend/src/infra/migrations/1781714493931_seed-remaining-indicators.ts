import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    INSERT INTO indicators (id, name, code, source, frequency, description)
    VALUES 
      ('1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'Taxa Selic', 'SELIC', 'BCB', 'daily', 'Taxa de juros Selic'),
      ('2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', 'Inflação IPCA', 'IPCA', 'BCB', 'monthly', 'Índice Nacional de Preços ao Consumidor Amplo'),
      ('3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', 'Federal Funds Rate', 'FEDFUNDS', 'FRED', 'monthly', 'Federal Funds Effective Rate')
    ON CONFLICT (code) DO NOTHING;
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    DELETE FROM indicators WHERE code IN ('SELIC', 'IPCA', 'FEDFUNDS');
  `);
}
