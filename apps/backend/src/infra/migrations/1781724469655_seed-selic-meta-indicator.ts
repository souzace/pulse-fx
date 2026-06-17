import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    INSERT INTO indicators (code, name, source, frequency, description)
    VALUES ('SELIC_META', 'Selic Meta', 'BCB', 'daily', 'Taxa de juros Selic Meta')
    ON CONFLICT (code) DO NOTHING;
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    DELETE FROM indicators 
    WHERE code = 'SELIC_META';
  `);
}
