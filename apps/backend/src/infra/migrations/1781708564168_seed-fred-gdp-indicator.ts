import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    INSERT INTO indicators (id, name, code, source, frequency, description)
    VALUES (
      '592b2a65-36d9-4768-9837-e668a75eb80b',
      'US Gross Domestic Product',
      'GDP',
      'FRED',
      'quarterly',
      'Gross Domestic Product of the United States'
    ) ON CONFLICT (code) DO NOTHING;
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    DELETE FROM indicators WHERE code = 'GDP';
  `);
}
