import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    UPDATE indicators 
    SET name = 'Taxa Selic (Efetiva)' 
    WHERE code = 'SELIC';
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    UPDATE indicators 
    SET name = 'Taxa Selic' 
    WHERE code = 'SELIC';
  `);
}
