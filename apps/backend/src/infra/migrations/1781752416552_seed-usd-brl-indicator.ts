import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    INSERT INTO indicators (code, name, source, frequency, description)
    VALUES ('USD_BRL', 'US Dollar / Brazilian Real', 'BCB', 'daily', 'Commercial exchange rate')
    ON CONFLICT (code) DO NOTHING;
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    DELETE FROM indicators WHERE code = 'USD_BRL';
  `);
}
